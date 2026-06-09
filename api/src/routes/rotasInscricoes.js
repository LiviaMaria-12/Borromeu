import { Router } from "express";
import { BD } from "../../db.js";
import { autenticarToken } from "../middlewares/autenticacao.js";

const SECRET_KEY = 'sua_chave_secreta'
const router = Router();

// GET
router.get('/inscricoes', autenticarToken, async (req, res) => {
    try {
        const comando = `SELECT * FROM INSCRICOES`;
        const inscricoes = await BD.query(comando);
        return res.status(200).json(inscricoes.rows);
    } catch (error) {
        console.error('Erro ao listar inscrições', error.message);
        return res.status(500).json({ error: 'Erro ao listar inscrições' + error.message});
    }
});

// POST
router.post('/inscricoes', autenticarToken, async (req, res) => {
    const { nome, endereco, data_nascimento, estado_civil, CPF, RG, id_evento_curso } = req.body;
    try {
        const comando = `INSERT INTO inscricoes (nome, endereco, data_nascimento, estado_civil, CPF, RG, id_evento_curso) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        const valores = [nome, endereco, data_nascimento, estado_civil, CPF, RG, id_evento_curso];
        await BD.query(comando, valores);
        return res.status(201).json({ message: 'Inscrição cadastrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar inscrição', error.message);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'O ID do evento ou curso informado não existe.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar inscrição. Verifique se todos os campos estão preenchidos corretamente.' + error.message });
    }
});

// PUT
router.put('/inscricoes/:id_inscricao', autenticarToken, async (req, res) => {
    const { id_inscricao } = req.params;
    const { nome, endereco, data_nascimento, estado_civil, CPF, RG, id_evento_curso } = req.body;
    try {
        const verificarInscricao = await BD.query(
            `SELECT * FROM inscricoes WHERE id_inscricao = $1`,
            [id_inscricao]
        );
        if (verificarInscricao.rows.length === 0) {
            return res.status(404).json({ message: 'Inscrição não encontrada. Verifique se o id existe.' });
        }

        const comando = `UPDATE inscricoes SET nome = $1, endereco = $2, data_nascimento = $3, estado_civil = $4, CPF = $5, RG = $6, id_evento_curso = $7
                         WHERE id_inscricao = $8`;
        
        const valores = [nome, endereco, data_nascimento, estado_civil, CPF, RG, id_evento_curso, id_inscricao];
        
        await BD.query(comando, valores);

        return res.status(200).json({ message: 'Inscrição atualizada com sucesso!' });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'O ID do evento ou curso informado não existe.' });
        }
        console.error('Erro ao atualizar inscrição:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar inscrição. Verifique se todos os campos estão preenchidos corretamente.' + error.message});
    }
});


// DELETE
router.delete('/inscricoes/:id_inscricao', autenticarToken, async (req, res) => {
    const { id_inscricao } = req.params;
    try {
        const comando2 = `DELETE FROM documentos WHERE id_inscricao = $1`
        await BD.query(comando2, [id_inscricao]);

        const comando = `DELETE FROM inscricoes WHERE id_inscricao = $1`
        const resultado = await BD.query(comando, [id_inscricao]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Inscrição não encontrada.' });
        }

        return res.status(200).json({ message: 'Inscrição removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover inscrição', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
});


export default router