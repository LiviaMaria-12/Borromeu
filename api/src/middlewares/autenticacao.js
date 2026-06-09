import jwt from 'jsonwebtoken'

const SECRET_KEY = "sua_chave_secreta"

export function autenticarToken(req, res, next){
    const cabecalho = req.headers['authorization']

    // Extrair o token do padrão Bearer TOKEN 
    const token = cabecalho && cabecalho.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: 'Token não fornecido' })
    }

    jwt.verify(token,SECRET_KEY, (error, usuario) => {
        if(error){
            return res.status(403).json({message: 'Token invalido ou expirado'})
        }

        // Se tudo estiver correto anexa os dados do usuário na requisição
        req.usuario = usuario

        // Chamar o next para que passe para a próxima função ou rota
        next();
    })
}