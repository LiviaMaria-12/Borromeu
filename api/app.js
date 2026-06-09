import express from 'express';
import {BD, testarConexao} from './db.js';
import rotasUsuarios from './src/routes/rotasUsuarios.js';
import rotasEventosCursos from './src/routes/rotasEventosCursos.js';
import rotasDocumentos from './src/routes/rotasDocumentos.js';
import rotasInscricoes from './src/routes/rotasInscricoes.js';

//usando swagger
import swaggerUi from 'swagger-ui-express';
import documentacao from './config/swagger.js';
import cors from 'cors'

const app = express();
app.use(express.json());
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(documentacao))
app.use(cors())

app.get('/swagger', (req, res) => {
    res.send(`<!DOCTYPE html>
<html><head>
    <title>API FinanControl</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head><body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
    SwaggerUIBundle({
    spec: ${JSON.stringify(documentacao)},
        dom_id: '#swagger-ui'})
    </script>
</body></html>`);
});

app.get('/', async (req, res) => {
    try {
        await testarConexao();
        // res.status(200).json("Api Funcionando");
        res.redirect('/swagger')
    } catch (error) {
        res.status(500).send("Erro ao conectar ao banco de dados. Verifique o console.")
    }

})

//Utilizando rotas
app.use(rotasUsuarios);
app.use(rotasEventosCursos);
app.use(rotasInscricoes);
app.use(rotasDocumentos);

const porta = 3000;
app.listen(porta, () =>{
    console.log(`http://localhost:${porta}`);
})