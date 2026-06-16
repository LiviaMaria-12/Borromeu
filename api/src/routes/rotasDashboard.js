import { Router } from "express";
import { BD } from "../../db.js";
import { autenticarToken } from "../middlewares/autenticacao.js";

const router = Router();

// Deixei o formato padrão do Express que é mais seguro e limpo
router.get('/dashboard', autenticarToken, async (req, res) => {
    try {
        // 1. Buscar total de inscrições
        const queryTotal = `
            SELECT COUNT(*) as total_inscritos FROM inscricoes;
        `;

        // 2. Calendário de Eventos e Cursos (CORRIGIDO: adicionado aspas duplas no nome da tabela)
        const queryEventos = `
            SELECT 
                id_evento_curso,
                nome,
                tipo,
                EXTRACT(DAY FROM data_hora_inicio) as dia_evento,
                TO_CHAR(data_hora_inicio, 'DD/MM/YYYY') as data_formatada
            FROM eventos_cursos
            WHERE EXTRACT(MONTH FROM data_hora_inicio) = EXTRACT(MONTH FROM CURRENT_DATE)
              AND EXTRACT(YEAR FROM data_hora_inicio) = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY dia_evento ASC;
        `;

        // Executa as consultas no banco de dados
        const resTotal = await BD.query(queryTotal);
        const resEventos = await BD.query(queryEventos);

        // 3. Organiza os eventos em formato de calendário (agrupados por dia)
        const calendarioEventos = resEventos.rows.reduce((acc, evento) => {
            const dia = evento.dia_evento;
            if (!acc[dia]) {
                acc[dia] = [];
            }
            acc[dia].push({
                id: evento.id_evento_curso,
                nome: evento.nome,
                tipo: evento.tipo,
                data: evento.data_formatada
            });
            return acc;
        }, {});

        // 4. Monta o objeto final que o Front-end vai receber
        const dadosDashboard = {
            totalInscricoes: parseInt(resTotal.rows[0].total_inscritos),
            calendario: calendarioEventos
        };

        return res.status(200).json(dadosDashboard);
    }
    catch (error) {
        console.error("Erro interno na rota do dashboard:", error.message);
        return res.status(500).json({ error: "Erro no servidor ao carregar o dashboard. " + error.message });
    }
});

export default router;
