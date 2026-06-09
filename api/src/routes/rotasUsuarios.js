import { Router } from "express";
import { BD } from "../../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { autenticarToken } from "../middlewares/autenticacao.js";

const SECRET_KEY = 'sua_chave_secreta';
const router = Router();

// GET
router.get('/usuarios', autenticarToken, async(req, res) =>{
    try{
        //cria uma variavel para enviar o comando sql
        const query = `SELECT id_usuario, nome, email, ativo FROM usuarios WHERE ativo = true`

        //cria uma variavel para receber o retorno do sql
        const usuarios = await BD.query(query);

       return res.status(200).json(usuarios.rows);
    }catch(error){
        console.error('Erro ao listar usuários', error.message);
        return res.status(500).json({error: 'Erro ao listar usuários' + error.message})
    }
});

// POST
router.post('/usuarios', autenticarToken, async(req, res) => {
    const {nome, email, senha } = req.body;
    try{
        //definir a força da criptografia
        const saltRounds = 10;
        // gerando a hash da senha
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const comando = `INSERT INTO USUARIOS(nome, email, senha) VALUES($1, $2, $3)`
        const valores = [nome, email, senhaCriptografada];

        await BD.query(comando, valores)
        console.log(comando,valores);

       return res.status(201).json("Usuário cadastrado com sucesso!");
    }catch(error){
        
        console.error('Erro ao cadastrar usuários', error.message);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        return  res.status(500).json({error: 'Erro ao cadastrar usuarios. Verifique se todos os campos estão preenchidos corretamente.' 
            + error.message})
    }
})

// PUT
router.put('/usuarios/:id_usuario', autenticarToken, async(req, res) =>{
    // Id recebido via parametro
    const {id_usuario} = req.params;

    // Dados do usuario recebido via Corpo da página
    const {nome, email, senha} = req.body;
    try{
        //Verificar se o usuario existe
        const verificarUsuario = await BD.query(`SELECT * FROM USUARIOS
            WHERE id_usuario = $1`, [id_usuario])
        if(verificarUsuario.rows.length === 0){
            return res.status(404).json({message: 'Usuario não encontrado. Verifique se o id existe.'})
        }
        //definir a força da criptografia
        const saltRounds = 10;
        // gerando a hash da senha
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        // Atualiza todos os campos da tabela(PUT Substituição completa)
        const comando = `UPDATE USUARIOS SET nome = $1, email = $2, senha =$3 WHERE
        id_usuario = $4`;
        const valores = [nome, email, senhaCriptografada, id_usuario];
        await BD.query(comando, valores);

        return res.status(200).json('Usuário atualizado com sucesso!');
    }catch(error){
        console.error('Erro ao atualizar usuários', error.message);
        return  res.status(500).json({error: 'Erro ao atualizar usuários. Verifique se todos os campos estão preenchidos corretamente' + error.message})
    }
});

// DELETE
router.delete('/usuarios/:id_usuario', autenticarToken, async(req, res) =>{
    const {id_usuario} = req.params;
    try{
        const comando = `DELETE FROM USUARIOS WHERE id_usuario = $1`
        // Guardamos o resultado da query
        const resultado = await BD.query(comando, [id_usuario])
        
        // Verifica se alguma linha foi de fato afetada/deletada
        if (resultado.rowCount === 0) {
            return res.status(404).json({message: "Usuário não encontrado. Verifique se o id está correto."})
        }

        return res.status(200).json({message: "Usuário removido com sucesso!"})
    }catch(error){
        console.error('Erro ao deletar usuário', error.message)
        return res.status(500).json({message: "Erro interno no servidor: " + error.message})
    }
});


// LOGIN
router.post('/login', async(req, res) =>{
    const {email, senha} = req.body;

    //Validação de entrada
    if(!email || !senha){
        return res.status(400).json({message: 'Email e senha são obrigatórios'})
    }
    try{
        //Buscar usuario pelo email
        const comando = 'SELECT id_usuario, nome, email, senha FROM USUARIOS WHERE email = $1 and ativo = true'
        const resultado = await BD.query(comando, [email]);

        if(resultado.rows.length === 0) {
            return res.status(401).json({message: 'Email não encontrado. Verifique se o email está escrito corretamente.'})
        }

        const usuario = resultado.rows[0]
        const senhaCorreta = await bcrypt.compare(senha,usuario.senha)

        //Verifica senha se são iguais
        if(!senhaCorreta){
            return res.status(401).json({message: 'Senha inválida. Verifique se a senha está correta.'})
        }

        // Gerando e retornando o token
        // Gerar o token com os dados do usuário logado
        const token = jwt.sign(
            {id_usuario: usuario.id_usuario, email: usuario.email},
            SECRET_KEY,
        )
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }
        })
    }catch(error){
        console.error('Erro ao atualizar usuário', error.message)
        return res.status(500).json({message: "Erro interno do servidor" + error.message})
    }
})


export default router