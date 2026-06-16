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
router.get('/documentos', autenticarToken, async (req, res) => {
    try {
        const comando = `SELECT * FROM documentos`;
        const documentos = await BD.query(comando);
        return res.status(200).json(documentos.rows);
    } catch (error) {
        console.error('Erro ao listar documentos', error.message);
        return res.status(500).json({ error: 'Erro ao listar documentos' });
    }
});

// POST
router.post('/documentos', autenticarToken, async (req, res) => {
    const camposObrigatorios = ['caminho', 'tipo', 'id_inscricao'];
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ error: 'Erro ao cadastrar: todos os dados necessários devem ser preenchidos.' });
    }

    const { caminho, tipo, id_inscricao } = req.body;

    try {
        const comando = `INSERT INTO documentos (caminho, tipo, id_inscricao) 
        VALUES ($1, $2, $3)`;

        const valores = [caminho, tipo, id_inscricao];
        await BD.query(comando, valores);
        return res.status(201).json({ message: 'Documento cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar documento', error.message);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'O ID da inscrição informada não existe.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar documento. Verifica se todos os campos estão preenchidos corretamente.' + error.message });
    }
});

// PUT
router.put('/documentos/:id_documento', autenticarToken, async (req, res) => {
    const camposObrigatorios = ['caminho', 'tipo', 'id_inscricao'];
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ error: 'Erro ao atualizar: todos os dados necessários devem ser preenchidos.' });
    }

    const { id_documento } = req.params;
    const { caminho, tipo, id_inscricao } = req.body;

    try {
        // Verificar se a categoria existe
        const verificarDocumento = await BD.query(
            `SELECT * FROM documentos WHERE id_documento = $1`,
            [id_documento]
        );
        if (verificarDocumento.rows.length === 0) {
            return res.status(404).json({ message: 'Documento não encontrado. Verifique se o id existe.' });
        }

        const comando = `UPDATE documentos SET caminho = $1, tipo = $2, id_inscricao = $3
                         WHERE id_documento = $4`;
        const valores = [ caminho, tipo, id_inscricao, id_documento ];
        await BD.query(comando, valores);

        return res.status(200).json({ message: 'Documento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar documento', error.message);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'O ID da inscrição informada não existe.' });
        }
        return res.status(500).json({ error: 'Erro ao atualizar documento. Verifique se todos os campos estão preenchidos corretamente.' + error.message });
    }
});

// DELETE
router.delete('/documentos/:id_documento', autenticarToken, async (req, res) => {
    const { id_documento } = req.params;
    try {
        const comando = `DELETE FROM documentos WHERE id_documento = $1`
        const resultado = await BD.query(comando, [id_documento]);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Documento não encontrado.' });
        }

        return res.status(200).json({ message: 'Documento removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover documento', error.message);
        return res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
});

export default router