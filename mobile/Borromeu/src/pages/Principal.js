import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Principal({ navigate }){
    const navigation = useNavigation();
    const [dadosLogin, setDadosLogin] = useState(null);

    useEffect(() => {
        async function buscarUsuario(){
            const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado')
            if(usuarioLogado != null){
                setDadosLogin(JSON.parse(usuarioLogado))
            }
        }
        buscarUsuario();
    }, [])

    function botaoLogout(){
        AsyncStorage.removeItem('UsuarioLogado');
        navigation.navigate('Login')
    }
    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
           
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.label}>Olá, bem-vindo!</Text>
                    <Text style={styles.userName}>{dadosLogin?.usuario?.nome || 'Usuário'}</Text>
                </View>
               
                <TouchableOpacity style={styles.logoutButton} onPress={botaoLogout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* Corpo da tela para você adicionar o conteúdo do seu projeto depois */}
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Sua tela principal está pronta.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Fundo claro moderno
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        // Sombra leve para o cabeçalho (iOS e Android)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'column',
    },
    label: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        marginTop: 2,
    },
    logoutButton: {
        backgroundColor: '#fff0f3', // Fundo levemente avermelhado para o botão sair
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20, // Cantos bem arredondados
        borderWidth: 1,
        borderColor: '#ffccd5',
    },
    logoutText: {
        color: '#ff4d6d', // Texto vermelho moderno
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 16,
        color: '#adb5bd',
        textAlign: 'center',
    }
});