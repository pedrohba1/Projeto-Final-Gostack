import {
    parseISO,
    isEqual,
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import PackageLimit from '../schemas/PackageLimit';
import Package from '../models/Package';

class DeliveryController {
    async store(req, res) {
        const { package_id, courier_id, signature_id } = req.body;
        const { type } = req.params;
        const delivery = await Package.findByPk(package_id);
        let { req_date } = req.body;

        // Se o carteiro não colocar uma data no dispositivo, ele usa a data
        // do dia
        req_date = req_date ? parseISO(req_date) : new Date();
        req_date = setMilliseconds(
            setSeconds(setMinutes(setHours(req_date, 0), 0), 0),
            0.0
        );
        const { timezone } = Intl.DateTimeFormat().resolvedOptions();
        req_date = utcToZonedTime(req_date, timezone);

        if (!delivery) {
            return res.status(400).json({
                error: 'Esse pacote não existe',
            });
        }

        if (delivery.canceled_at !== null) {
            return res.status(400).json({
                error: 'Esse pacote foi cancelado',
            });
        }

        if (type === 'end') {
            if (delivery.start_date === null) {
                return res.status(400).json({
                    error:
                        'Não é possível entregar uma encomenda que não tenha sido retirada',
                });
            }

            if (!signature_id) {
                return res.status(400).json({
                    error: 'signature_id não provida',
                });
            }
        }

        if (delivery.courier_id !== courier_id) {
            return res.status(400).json({
                error: `Esse pacote não pertence à este entregador`,
            });
        }
        if (delivery.start_date !== null && type === 'start') {
            return res.status(400).json({
                error: 'esse pacote já tem uma data de início',
            });
        }
        if (delivery.end_date !== null) {
            return res.status(400).json({
                error: 'Esse pacote já foi entregue',
            });
        }

        let limiter = await PackageLimit.findOne({
            courierId: courier_id,
            takenDate: req_date,
        });

        if (!limiter) {
            limiter = await PackageLimit.create({
                courierId: courier_id,
                packagesTaken: [],
                takenDate: req_date,
            });
        }

        if (isEqual(limiter.takenDate, req_date)) {
            if (limiter.packagesTaken.length === 5) {
                return res.json({
                    error: 'Este entragador está tentando exceder o limite',
                });
            }
            const takenList = limiter.packagesTaken;
            takenList.push(package_id);
            await limiter.update({
                packagesTaken: takenList,
            });
        }

        if (type === 'start') {
            await delivery.update({ start_date: req_date });
        }
        if (type === 'end') {
            await delivery.update({ end_date: req_date, signature_id });
        }

        return res.json(delivery);
    }
}

export default new DeliveryController();
