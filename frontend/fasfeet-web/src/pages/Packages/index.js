import React, { useState, useEffect } from 'react';

import api from '~/services/api';

import Modal from '~/components/Modal';
import {
    Title,
    Buttons,
    RegisterButton,
    SearchIcon,
    Search,
    ListHeader,
    ListMain,
    ListActions,
} from '~/styles/default';
import { List, Status, HorizontalContainer } from './styles';

import Picture from '~/components/Picture';
import DropdownMenu from '~/components/DropdownMenu';

export default function Packages() {
    const [packages, setPackages] = useState([]);
    const [input, setInput] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [loading, setLoading] = useState(false);

    async function searchPackages() {
        setLoading(true);

        const response = await api.get('packages', {
            params: {
                page,
                product: input,
            },
        });

        response.data.map(pack => {
            pack.id = pack.id < 10 ? `0${pack.id}` : pack.id;

            if (!pack.start_date) {
                pack.status = 'PENDENTE';
            }
            if (pack.start_date && !pack.end_date) {
                pack.status = 'RETIRADA';
            }
            if (pack.end_date) {
                pack.status = 'ENTREGUE';
            }

            return pack;
        });

        setPackages(response.data);
        setLoading(false);
    }
    useEffect(() => {
        searchPackages();
    }, [page]);

    function handleEnterPress(e) {
        if (e.which === 13 || e.keyCode === 13) {
            searchPackages();
        }
    }

    function handleRequestClose() {
        setModalOpen(false);
    }

    function handleRequestOpen(pack) {
        setModalOpen(true);

        console.tron.log(pack);
        const { recipient, end_date, start_date, signature } = pack;

        const packData = {
            state: recipient.state,
            city: recipient.city,
            address: recipient.address,
            address_number: recipient.address_number,
            address_complement: recipient.address_complement,
            cep: recipient.cep,
            start_date,
            end_date,
            signatureUrl: signature === null ? null : signature.url,
        };

        console.tron.log(packData);
        setModalContent({ ...packData });
    }

    return (
        <>
            <Modal
                closeFunc={handleRequestClose}
                isOpen={isModalOpen}
                packData={modalContent}
            />
            <Title>Gerenciando encomendas</Title>

            <Buttons>
                <Search
                    loading={loading}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyUp={handleEnterPress}
                    placeholder="buscar por entregadores"
                    iconPosition="left"
                />
                <RegisterButton>
                    <SearchIcon />
                    <span>CADASTRAR</span>
                </RegisterButton>
            </Buttons>

            <List>
                <ListHeader>
                    <span>ID</span>
                </ListHeader>
                <ListHeader>
                    <span>Destinatário</span>
                </ListHeader>
                <ListHeader>
                    <span>Entregador</span>
                </ListHeader>
                <ListHeader>
                    <span>Cidade</span>
                </ListHeader>
                <ListHeader>
                    <span>Estado</span>
                </ListHeader>
                <ListHeader>
                    <span>Status</span>
                </ListHeader>
                <ListHeader>
                    <span>Ações</span>
                </ListHeader>

                {packages.map(pack => (
                    <>
                        <ListMain>
                            <span>#{pack.id}</span>
                        </ListMain>
                        <ListMain>
                            <span>{pack.recipient.name}</span>
                        </ListMain>
                        <ListMain>
                            <HorizontalContainer>
                                <Picture
                                    name={pack.courier.name}
                                    src={
                                        pack.courier.avatar &&
                                        pack.courier.avatar.url
                                    }
                                />
                                <span>{pack.courier.name}</span>
                            </HorizontalContainer>
                        </ListMain>
                        <ListMain>
                            <span>{pack.recipient.city}</span>
                        </ListMain>
                        <ListMain>
                            <span>{pack.recipient.state}</span>
                        </ListMain>
                        <ListMain>
                            <Status status={pack.status}>
                                <figure />
                                {pack.status}
                            </Status>
                        </ListMain>

                        <ListActions>
                            <DropdownMenu
                                pack={pack}
                                inPackages
                                openModalFunction={handleRequestOpen}
                            />
                        </ListActions>
                    </>
                ))}
            </List>
        </>
    );
}
