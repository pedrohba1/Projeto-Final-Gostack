import React from 'react';
import * as Yup from 'yup';
import { Form, Input } from '@rocketseat/unform';

import logo from '~/assets/fastfeet-logo@2x.png';

const schema = Yup.object().shape({
    email: Yup.string()
        .email('insira um email válido')
        .required('o email é obrigatório'),
    password: Yup.string().required('a senha é obrigatória'),
});

export default function SignIn() {
    function handleSubmit({ email, password }) {}

    return (
        <>
            <img src={logo} alt="fastFeet" />

            <Form schema={schema} onSubmit={handleSubmit}>
                <h4>SEU EMAIL</h4>
                <Input name="email" type="email" placeholder="seu email" />
                <h4>SUA SENHA</h4>

                <Input
                    name="password"
                    type="password"
                    placeholder="sua senha"
                />

                <button type="submit">
                    {/*                     {loading ? 'Carregando...' : 'Acessar'}
                     */}
                    Entrar no sistema
                </button>
            </Form>
        </>
    );
}
