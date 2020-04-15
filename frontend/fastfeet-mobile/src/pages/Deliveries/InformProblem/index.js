import React, { useLayoutEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Container, ProblemInput, Button, BText, Background } from './styles';

import api from '~/services/api';

export default function InformProblem({ navigation, route }) {
    const { data } = route.params;
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    console.tron.log(data);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Icon name="chevron-left" size={30} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    async function handleSubmit() {
        setLoading(true);
        try {
            await api.post('problems', {
                package_id: data.id,
                description,
            });
            Alert.alert('Sucesso', 'Problema registrado com sucesso');
        } catch (err) {
            Alert.alert('Falhou', 'Houve algum erro ao registrar o problema');
        }
        setLoading(false);
    }

    return (
        <Background>
            <Container>
                <ProblemInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    placeholder="informe o problema aqui"
                />
            </Container>
            <Button onPress={() => handleSubmit()}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <BText>Enviar</BText>
                )}
            </Button>
        </Background>
    );
}
