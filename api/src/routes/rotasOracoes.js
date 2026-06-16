import { Router } from "express";
import { BD } from "../../db.js";
import { autenticarToken } from "../middlewares/autenticacao.js";

const SECRET_KEY = 'sua_chave_secreta'
const router = Router();

// Função robusta de validação para POST e PUT
function validarCamposObrigatorios(corpoRequisicao, camposEsperados) {
    // Se o corpo não existir, for nulo ou não for um objeto com chaves, barra imediatamente
    if (!corpoRequisicao || typeof corpoRequisicao !== 'object' || Object.keys(corpoRequisicao).length === 0) {
        return false;
    }

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
    return true; 
}

// GET
router.get('/oracoes', autenticarToken, async (req, res) => {
    try {
        const comando = `SELECT * FROM ORACOES`;
        const oracoes = await BD.query(comando);
        return res.status(200).json(oracoes.rows);
    } catch (error) {
        console.error('Erro ao listar orações', error.message);
        return res.status(500).json({ error: 'Erro ao listar orações' + error.message });
    }
});

// POST
router.post('/oracoes', async (req, res) => {
    const camposObrigatorios = ['remetente', 'assunto'];
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ error: 'Erro ao cadastrar: todos os dados necessários devem ser preenchidos.' });
    }

    const { remetente, assunto } = req.body;

    try {
        const comando = `INSERT INTO oracoes (remetente, assunto) 
        VALUES ($1, $2)`;

        const valores = [remetente, assunto];
        await BD.query(comando, valores);
        return res.status(201).json({ message: 'Oração cadastrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar oração', error.message);
        return res.status(500).json({ error: 'Erro ao cadastrar inscrição. Verifique se todos os campos estão preenchidos corretamente.' + error.message });
    }
});

router.delete('/oracoes/:id_oracao', autenticarToken, async (req, res) => {
    const { id_oracao } = req.params;
    try {
        const comando = `DELETE FROM oracoes WHERE id_oracao = $1`
        const resultado = await BD.query(comando, [id_oracao]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Oração não encontrada. Verifique se o ID existe.' });
        }

        return res.status(200).json({ message: 'Oração removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover Oração', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
});



export default router