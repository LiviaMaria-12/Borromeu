import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Principal() {
    const navigate = useNavigate();
    const [dadosLogin, setDadosLogin] = useState(null);

    useEffect(() => {
        async function buscarUsuario() {
            const usuarioLogado = await localStorage.getItem('UsuarioLogado');
            if (usuarioLogado != null) {
                setDadosLogin(JSON.parse(usuarioLogado));
            }
        }
        buscarUsuario();
    }, []);

    function botaoLogout() {
        localStorage.removeItem('UsuarioLogado');
        navigate('/');
    }

    return (
        <div style={styles.container}>
            {/* Cabeçalho Organizado e Clean */}
            <header style={styles.header}>
                <div style={styles.userInfo}>
                    <span style={styles.label}>Olá, bem-vindo!</span>
                    <h2 style={styles.userName}>
                        {dadosLogin?.usuario?.nome || 'Usuário'} 
                        <span style={styles.userEmail}>({dadosLogin?.usuario?.email || 'email@exemplo.com'})</span>
                    </h2>
                </div>
                
                <button onClick={botaoLogout} style={styles.logoutButton}>
                    Sair
                </button>
            </header>

            {/* Corpo da página pronto para receber seu conteúdo */}
            <main style={styles.content}>
                <p style={styles.welcomeText}>Sua tela principal web está pronta.</p>
            </main>
        </div>
    );
}

// Objeto de estilos CSS organizado
const styles = {
    container: {
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 40px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    label: {
        fontSize: '12px',
        color: '#6c757d',
        fontWeight: '500',
    },
    userName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#212529',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    userEmail: {
        fontSize: '14px',
        fontWeight: '400',
        color: '#6c757d',
    },
    logoutButton: {
        backgroundColor: '#fff0f3',
        color: '#ff4d6d',
        border: '1px solid #ffccd5',
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        minHeight: 'calc(100vh - 150px)',
    },
    welcomeText: {
        fontSize: '16px',
        color: '#adb5bd',
        textAlign: 'center',
    },
};