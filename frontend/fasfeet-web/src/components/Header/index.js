import React, { useState } from 'react';

import { Container, Content, Option, Right, Left, Logout } from './styles';
import logo from '~/assets/fastfeet-logo.png';

export default function Header() {
    const [tab, setTab] = useState('couriers');

    function handleTabChange(newTab) {
        switch (newTab) {
            case 'couriers':
                setTab('couriers');
                break;
            case 'packages':
                setTab('packages');
                break;
            case 'recipients':
                setTab('recipients');
                break;
            case 'problems':
                setTab('problems');
                break;
            default:
                break;
        }
    }

    return (
        <Container>
            <Content>
                <Left>
                    <img src={logo} alt="fastFeet" />
                    <Option
                        onClick={() => handleTabChange('packages')}
                        to="/packages"
                        isSelected={tab === 'packages'}
                    >
                        <strong>ENCOMENDAS</strong>
                    </Option>
                    <Option
                        onClick={() => handleTabChange('couriers')}
                        to="/couriers"
                        isSelected={tab === 'couriers'}
                    >
                        <strong>ENTREGADORES</strong>
                    </Option>
                    <Option
                        onClick={() => handleTabChange('recipients')}
                        to="/recipients"
                        isSelected={tab === 'recipients'}
                    >
                        <strong>DESTINATÁRIOS</strong>
                    </Option>
                    <Option
                        onClick={() => handleTabChange('problems')}
                        to="/problems"
                        isSelected={tab === 'problems'}
                    >
                        <strong>PROBLEMAS</strong>
                    </Option>
                </Left>
                <Right>
                    <strong>Admin fastFeet</strong>
                    <Logout>Sair do sistema</Logout>
                </Right>
            </Content>
        </Container>
    );
}
