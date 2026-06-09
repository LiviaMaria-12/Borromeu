export const EstilosLogin = {

    container: {
        minHeight: '100vh',
        backgroundColor: '#F8F6F2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px'
    },

    cardLogin: {
        width: '1200px',
        maxWidth: '100%',
        minHeight: '750px',
        backgroundColor: '#FFF',
        borderRadius: '25px',
        overflow: 'hidden',
        display: 'flex',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
    },

    ladoImagem: {
        flex: 1,
        backgroundImage:
            "linear-gradient(rgba(0,74,173,.85), rgba(0,74,173,.85)), url('https://images.unsplash.com/photo-1518991791750-7493ab1f8f1e')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
    },

    overlay: {
        height: '100%',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    logoGrande: {
        width: '100px',
        alignSelf: 'center'
    },

    tituloIgreja: {
        textAlign: 'center',
        fontSize: '48px',
        fontFamily: 'Libre Baskerville'
    },

    subtituloIgreja: {
        textAlign: 'center',
        letterSpacing: '2px'
    },

    textoInspiracao: {
        fontSize: '20px',
        lineHeight: '1.6',
        marginBottom: '100px'

    },

    ladoFormulario: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px'
    },

    formularioLogin: {
        width: '100%',
        maxWidth: '450px'
    },

    titulo: {
        fontSize: '42px',
        color: '#004AAD',
        textAlign: 'center',
        marginBottom: '10px',
        fontFamily: 'Libre Baskerville'
    },

    subtitulo: {
        textAlign: 'center',
        color: '#777',
        marginBottom: '40px'
    },

    grupoInput: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #DDD',
        borderRadius: '12px',
        padding: '0 15px',
        marginBottom: '20px',
        height: '60px'
    },

    iconeInput: {
        color: '#004AAD',
        fontSize: '22px'
    },

    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '10px',
        fontSize: '16px'
    },

    alternarVisibilidade: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '22px',
        color: '#555'
    },

    entreOpcoes: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px'
    },

    containerCheckbox: {
        display: 'flex',
        gap: '8px'
    },

    esqueceuSenha: {
        color: '#004AAD',
        textDecoration: 'none'
    },

    botaoEntrar: {
        width: '100%',
        height: '60px',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#004AAD',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },

    mensagemFeedback: {
        marginTop: '15px',
        textAlign: 'center',
        color: 'red'
    }
}