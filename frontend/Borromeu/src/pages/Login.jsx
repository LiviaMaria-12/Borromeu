import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { enderecoServidor } from '../utils.jsx';

import { EstilosLogin } from '../styles/EstilosLogin.jsx';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const [lembrar, setLembrar] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const navigate = useNavigate();

    async function botaoEntrar(e) {
        e.preventDefault();

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
                localStorage.setItem('UsuarioLogado', JSON.stringify({ ...dados, lembrar }));
                // localStorage.setItem('token', JSON.stringify(...dados, token))
                navigate('/principal');
            } else {
                setMensagem(`❌ Email ou senha incorretos!`);
            }

        } catch (erro) {
            setMensagem(`Erro ao realizar login: ${erro.message}`)
        }
    }

    useEffect(() => {
        async function buscarUsuario() {
            const usuarioLogado = localStorage.getItem('UsuarioLogado')
            if (usuarioLogado != null) {
                const usuario = JSON.parse(usuarioLogado)
                if (usuario.lembrar == true) {
                    navigate('/principal')
                }
            }
        }

        buscarUsuario()
    }, [])

    return (
        <div style={EstilosLogin.container}>

            <div style={EstilosLogin.cardLogin}>

                {/* Lado esquerdo */}
                <div style={EstilosLogin.ladoImagem}>
                    <div style={EstilosLogin.overlay}>

                        
                        <h1 style={EstilosLogin.tituloIgreja}>
                            BORROMEO
                        </h1>

                        <p style={EstilosLogin.subtituloIgreja}>
                            Paróquia Nossa Senhora das Graças
                        </p>

                        <div style={EstilosLogin.textoInspiracao}>
                            <h2>
                                Fé, Serviço
                                <br />
                                e <span style={{ color: "#D69D5D" }}>Comunidade</span>
                            </h2>

                            <p style={{fontSize: "14px"}}>
                                Gerencie eventos, catequese,
                                cursos e inscrições da comunidade.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Lado direito */}
                <div style={EstilosLogin.ladoFormulario}>

                    <form style={EstilosLogin.formularioLogin}>

                        <h2 style={EstilosLogin.titulo}>
                            Acesso Administrativo
                        </h2>

                        <p style={EstilosLogin.subtitulo}>
                            Faça login para acessar o sistema da paróquia
                        </p>

                        <div style={EstilosLogin.grupoInput}>
                            <MdEmail style={EstilosLogin.iconeInput} />

                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={EstilosLogin.input}
                            />
                        </div>

                        <div style={EstilosLogin.grupoInput}>
                            <MdLock style={EstilosLogin.iconeInput} />

                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                style={EstilosLogin.input}
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                style={EstilosLogin.alternarVisibilidade}
                            >
                                {mostrarSenha
                                    ? <MdVisibility />
                                    : <MdVisibilityOff />}
                            </button>
                        </div>

                        <div style={EstilosLogin.entreOpcoes}>

                            <div style={EstilosLogin.containerCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={lembrar}
                                    onChange={() => setLembrar(!lembrar)}
                                />
                                <label>Lembrar-me</label>
                            </div>

                            <a href="#" style={EstilosLogin.esqueceuSenha}>
                                Esqueci minha senha
                            </a>

                        </div>

                        <button
                            type="submit"
                            onClick={botaoEntrar}
                            style={EstilosLogin.botaoEntrar}
                        >
                            Entrar
                        </button>

                        {mensagem && (
                            <p style={EstilosLogin.mensagemFeedback}>
                                {mensagem}
                            </p>
                        )}

                    </form>

                </div>

            </div>

        </div>
    )
}
