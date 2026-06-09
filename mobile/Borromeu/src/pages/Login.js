import { Text, View, Button, TextInput, TouchableOpacity, Image, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { enderecoServidor } from '../utils.js';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { LinearGradient } from 'expo-linear-gradient'
import { EstilosLogin, coresLogin } from '../styles/EstilosLogin.js';
import { MaterialIcons } from '@expo/vector-icons'
import { corFundo2, corPrincipal } from '../styles/Estilos.js'

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState('');

    const [lembrar, setLembrar] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)

    async function botaoLogin() {

        try {
            if (email == '' || senha == '') {
                setMensagem('Preencha todos os campos');
                return //Sai da função e não executa o resto do código
            }

            const dadosLogin = {
                "email": email,
                "senha": senha
            }

            const resposta = await fetch(`${enderecoServidor}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLogin)
            })
            if (resposta.status == 404) {
                setMensagem(`Rota não encontrada: ${resposta.url}`);
                return
            }
            const dados = await resposta.json()
            if (resposta.status == 500) {
                setMensagem(`Erro no servidor: ${dados.message}`);
                return
            }
            if (resposta.ok) {
                AsyncStorage.setItem('UsuarioLogado', JSON.stringify({ ...dados, lembrar }));
                // localStorage.setItem('token', JSON.stringify(...dados, token))
                navigation.navigate('MenuDrawer');
            } else {
                setMensagem(`❌ Email ou senha incorretos!`);
            }

        } catch (erro) {
            setMensagem(`Erro ao realizar login: ${erro.message}`)
        }
    }

    useEffect(() => {
        async function buscarUsuario() {
            const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado')
            if (usuarioLogado != null) {
                const usuario = JSON.parse(usuarioLogado)
                if (usuario.lembrar == true) {
                    navigation.navigate('MenuDrawer')
                }
            }
        }

        buscarUsuario()
    }, [])


    return (
        <View style={EstilosLogin.container}>

            <LinearGradient
                colors={['#004AAD', '#2769C0']}
                style={EstilosLogin.topo}
            >


                <Text style={EstilosLogin.nomeParoquia}>
                    BORROMEO
                </Text>

                <Text style={EstilosLogin.subtituloParoquia}>
                    Paróquia Nossa Senhora das Graças
                </Text>

            </LinearGradient>

            <View style={EstilosLogin.cardLogin}>

                <Text style={EstilosLogin.titulo}>
                    Acesso Administrativo
                </Text>

                <Text style={EstilosLogin.subtitulo}>
                    Entre para gerenciar eventos,
                    catequese e inscrições.
                </Text>

                <View style={EstilosLogin.grupoInput}>
                    <MaterialIcons
                        name="email"
                        size={22}
                        color="#004AAD"
                    />

                    <TextInput
                        style={EstilosLogin.input}
                        placeholder="Digite seu email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={EstilosLogin.grupoInput}>

                    <MaterialIcons
                        name="lock"
                        size={22}
                        color="#004AAD"
                    />

                    <TextInput
                        style={EstilosLogin.input}
                        placeholder="Digite sua senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={!mostrarSenha}
                    />

                    <TouchableOpacity
                        onPress={() =>
                            setMostrarSenha(!mostrarSenha)
                        }
                    >
                        <MaterialIcons
                            name={
                                mostrarSenha
                                    ? 'visibility'
                                    : 'visibility-off'
                            }
                            size={22}
                            color="#666"
                        />
                    </TouchableOpacity>

                </View>

                <View style={EstilosLogin.entreOpcoes}>

                    <View style={EstilosLogin.containerCheckbox}>
                        <Switch
                            value={lembrar}
                            onValueChange={setLembrar}
                        />

                        <Text>
                            Lembrar-me
                        </Text>
                    </View>

                    <Text style={EstilosLogin.esqueceuSenha}>
                        Esqueci a senha
                    </Text>

                </View>

                <TouchableOpacity
                    style={EstilosLogin.botaoEntrar}
                    onPress={botaoLogin}
                >
                    <Text style={EstilosLogin.textoBotaoEntrar}>
                        Entrar
                    </Text>
                </TouchableOpacity>

                {mensagem !== '' && (
                    <Text style={EstilosLogin.mensagemFeedback}>
                        {mensagem}
                    </Text>
                )}

            </View>

        </View>
    )
}