import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import 'moment-timezone';

import ReactModal from 'react-modal';

import { Container, Text, Bold } from './styles';

export default function PackageModal({ closeFunc, isOpen, packData }) {
    console.tron.log(packData);

    return (
        <ReactModal
            shouldCloseOnOverlayClick
            shouldCloseOnEsc
            isOpen={isOpen}
            data={packData}
            onRequestClose={closeFunc}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                content: {
                    maxWidth: '600px',
                    maxHeight: '500px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    margin: 'auto',
                },
            }}
        >
            <Container>
                <Bold>Informações da encomenda</Bold>
                <Text>
                    {packData.address}, {packData.address_number}
                </Text>
                <Text>
                    {packData.city} - {packData.state}
                </Text>
                <Text>{packData.cep}</Text>
            </Container>

            <Container>
                <Bold>Datas</Bold>

                {/* TODO: Tem um problema com as datasd aqui, não era pra mostra
                    nada quando as datas estivessem vindo nulas, mas etá mostrando a data do dia */}
                <Text>
                    <Bold>Retirada: </Bold>
                    {packData.start_date ? (
                        <Moment
                            format="DD/MM/YYYY"
                            date={packData.start_date}
                        />
                    ) : (
                        <span>pacote ainda não foi retirado </span>
                    )}
                </Text>
                <Text>
                    <Bold>Entrega: </Bold>
                    {packData.end_date ? (
                        <Moment format="DD/MM/YYYY" date={packData.end_date} />
                    ) : (
                        <span>pacote ainda não foi entregue </span>
                    )}
                </Text>
            </Container>

            <Container>
                <Bold>Assinatura do destinatário</Bold>
                <img src={packData.signatureUrl} alt="" />
            </Container>
        </ReactModal>
    );
}

PackageModal.propTypes = {
    closeFunc: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    packData: PropTypes.shape({
        address: PropTypes.string,
        address_number: PropTypes.number,
        city: PropTypes.string,
        state: PropTypes.string,
        cep: PropTypes.number,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        signatureUrl: PropTypes.string,
    }).isRequired,
};
