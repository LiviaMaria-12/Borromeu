import { Router } from "express";
import { BD } from "../../db.js";
import { autenticarToken } from "../middlewares/autenticacao.js";

const SECRET_KEY = 'sua_chave_secreta'
const router = Router();

// Função para garantir que nenhum campo obrigatório foi omitido ou enviado vazio - POST PUT
function validarCamposObrigatorios(corpoRequisicao, camposEsperados) {
    for (const campo of camposEsperados) {
        const valor = corpoRequisicao[campo];

        // 1. Verifica se o campo foi omitido (undefined) ou é nulo (null)
        if (valor === undefined || valor === null) {
            return false;
        }

        // 2. Se for uma string, remove os espaços e checa se ficou vazia
        if (typeof valor === 'string' && valor.trim() === '') {
            return false;
        }
    }
    return true; // Todos os campos estão presentes e preenchidos
}

// GET
router.get('/eventosCursos', autenticarToken, async (req, res) => {
    try {
        const comando = `SELECT * FROM EVENTOS_CURSOS WHERE ativo = true`;
        const eventosCursos = await BD.query(comando);
        return res.status(200).json(eventosCursos.rows);
    } catch (error) {
        console.error('Erro ao listar eventos e cursos', error.message);
        return res.status(500).json({ error: 'Erro ao listar eventos e cursos' });
    }
});

// POST
router.post('/eventosCursos', autenticarToken, async (req, res) => {
    const camposObrigatorios = ['nome', 'descricao', 'data_hora_inicio', 'data_hora_fim', 'necessita_inscricao', 'banner', 'local', 'tipo', 'ativo'];
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ error: 'Erro ao cadastrar: todos os dados necessários devem ser preenchidos.' });
    }

    const { nome, descricao, data_hora_inicio, data_hora_fim, necessita_inscricao, banner, local, tipo, ativo } = req.body;

    if (typeof ativo !== "boolean") {
        return res.status(400).json({ erro: "O campo 'ativo' deve ser true ou false." });
    }

    const milissegundosInicio = Date.parse(data_hora_inicio);
    const milissegundosFim = Date.parse(data_hora_fim);

    if (isNaN(milissegundosInicio) || !data_hora_inicio.toString().includes(':')) {
        return res.status(400).json({ 
            error: 'Erro no campo data_hora_inicio! Você precisa fornecer uma data válida acompanhada do horário (Ex: YYYY-MM-DD HH:MM:SS ou YYYY-MM-DD`T`HH:MM:SS).' 
        });
    }

    if (isNaN(milissegundosFim) || !data_hora_fim.toString().includes(':')) {
        return res.status(400).json({ 
            error: 'Erro no campo data_hora_fim! Você precisa fornecer uma data válida acompanhada do horário (Ex: YYYY-MM-DD HH:MM).' 
        });
    }

    if (!isNaN(Date.parse(data_hora_inicio)) && !isNaN(Date.parse(data_hora_fim))) {
        if (new Date(data_hora_fim) < new Date(data_hora_inicio)) {
            erros.push("A 'data_hora_fim' não pode ser anterior à 'data_hora_inicio'.");
        }
    }
    try {
        const comando = `INSERT INTO eventos_cursos (nome, descricao, data_hora_inicio, data_hora_fim, necessita_inscricao, banner, local, tipo, ativo) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const valores = [nome, descricao, data_hora_inicio, data_hora_fim, necessita_inscricao, banner, local, tipo, ativo];
        await BD.query(comando, valores);
        return res.status(201).json({ message: 'Evento ou curso cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar evento ou curso. ', error.message);
        return res.status(500).json({ error: 'Erro ao cadastrar evento ou curso. Verifique se todos os campos estão preenchidos corretamente.' + error.message });
    }
});

// PUT
router.put('/eventosCursos/:id_evento_curso', autenticarToken, async (req, res) => {
    const camposObrigatorios = ['nome', 'descricao', 'data_hora_inicio', 'data_hora_fim', 'necessita_inscricao', 'banner', 'local', 'tipo', 'ativo'];
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ error: 'Erro ao atualizar: todos os dados necessários devem ser preenchidos.' });
    }

    const { id_evento_curso } = req.params;
    const { nome, descricao, data_hora_inicio, data_hora_fim, necessita_inscricao, banner, local, tipo, ativo } = req.body;

    if (typeof ativo !== "boolean") {
        return res.status(400).json({ erro: "O campo 'ativo' deve ser true ou false." });
    }
 

    const milissegundosInicio = Date.parse(data_hora_inicio);
    const milissegundosFim = Date.parse(data_hora_fim);

    if (isNaN(milissegundosInicio) || !data_hora_inicio.toString().includes(':')) {
        return res.status(400).json({ 
            error: 'Erro no campo data_hora_inicio! Você precisa fornecer uma data válida acompanhada do horário (Ex: YYYY-MM-DD HH:MM).' 
        });
    }

    if (isNaN(milissegundosFim) || !data_hora_fim.toString().includes(':')) {
        return res.status(400).json({ 
            error: 'Erro no campo data_hora_fim! Você precisa fornecer uma data válida acompanhada do horário (Ex: YYYY-MM-DD HH:MM).' 
        });
    }

    if (!isNaN(Date.parse(data_hora_inicio)) && !isNaN(Date.parse(data_hora_fim))) {
        if (new Date(data_hora_fim) < new Date(data_hora_inicio)) {
            erros.push("A 'data_hora_fim' não pode ser anterior à 'data_hora_inicio'.");
        }
    }
    try {
        // Verificar se a categoria existe
        const verificarEventoCurso = await BD.query(
            `SELECT * FROM eventos_cursos WHERE id_evento_curso = $1 AND ativo = true`,
            [id_evento_curso]
        );
        if (verificarEventoCurso.rows.length === 0) {
            return res.status(404).json({ message: 'Curso ou evento não encontrado. Verifique se o id existe.' });
        }

        const comando = `UPDATE eventos_cursos SET nome = $1, descricao = $2, data_hora_inicio = $3, data_hora_fim = $4, necessita_inscricao = $5, banner = $6, local = $7, tipo = $8, ativo = $9 WHERE id_evento_curso = $10`;
        const valores = [nome, descricao, data_hora_inicio, data_hora_fim, necessita_inscricao, banner, local, tipo, ativo, id_evento_curso];
        await BD.query(comando, valores);

        return res.status(200).json({ message: 'Curso ou evento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar curso ou evento', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar evento ou curso. Verifique se todos os campos estão preenchidos corretamente.' + error.message});
    }
});

// DELETE
router.delete('/eventosCursos/:id_evento_curso', autenticarToken, async (req, res) => {
    const { id_evento_curso } = req.params;
    try {
        const comando = `DELETE FROM eventos_cursos WHERE id_evento_curso = $1`
        const resultado = await BD.query(comando, [id_evento_curso]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Evento ou curso não encontrado.' });
        }

        return res.status(200).json({ message: 'Evento ou curso removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover evento ou curso', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
});


export default router