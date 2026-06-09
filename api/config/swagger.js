const documentacao = {
    openapi: '3.0.3',
    info: {
        title: 'API Borromeu',
        description: 'Documentação da API do sistema Borromeo que gerencia usuários, atividades, inscrições e documentos.',
        version: '1.0.0'
    },
    servers: [
        // { url: 'http://localhost:3000', description: 'localhost' },
        { url: 'https://borromeu.vercel.app', description: 'Vercel' }
    ],
    tags: [
        { name: 'Usuários', description: 'Operações relacionadas aos usuários' },
        { name: 'Atividades', description: 'Operações relacionadas as atividades' },
        { name: 'Inscrições', description: 'Operações relacionadas as inscrições' },
        { name: 'Documentos', description: 'Operações relacionadas aos documentos' }
    ],
    paths: {
        "/usuarios": {
            get: {
                tags: ["Usuários"],
                summary: "Listar todos os usuários",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Listar_Usuarios' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Usuários'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                summary: 'Cadastrar novo usuário',
                description: "Recebe nome, email, senha para cadastrar novo usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário cadastrado com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/usuarios/{id_usuario}": {
            put: {
                tags: ['Usuários'],
                summary: 'Atualizar todos os dados do usuário',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Atualiza todos os dados de um usuário existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser atualizado",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Atualizar_Usuario" },
                            example: {
                                nome: "Carol",
                                email: "carol@email.com",
                                senha: "C4r0l",
                                ativo: true
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário atualizado com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }

            },
            delete: {
                tags: ['Usuários'],
                summary: 'Remover Usuário',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Remove usuário existente pelo ID',
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser removido",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Usuário removido com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }
            },
        },

        "/login": {
            post: {
                tags: ['Autenticação'],
                summary: 'Realizar Login',
                description: "Autentica um usuario e retorna id e nome",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Login_Usuario"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Login realizado com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Resposta_Login"
                                }
                            }
                        }
                    },
                    400: { description: "Email e senha são obrigatorios" },
                    401: { description: "Credenciais inválidas" },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },


        "/eventosCursos": {
            get: {
                tags: ["Atividades"],
                summary: "Listar todas as atividades",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Listar_Atividades' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Atividades'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                summary: 'Cadastrar nova Atividades',
                description: "Recebe nome, descricao, data início, data fim, necessidade de inscrição, link de banner, local, tipo e ativo para cadastrar nova atividade",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Atividade"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Atividade cadastrada com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/eventosCursos/{id_evento_curso}": {
            put: {
                tags: ['Atividades'],
                summary: 'Atualizar todos os dados do atividade',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Atualiza todos os dados de uma atividade existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_evento_curso",
                        in: "path",
                        required: true,
                        description: "ID da atividade a ser atualizada",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Atualizar_Atividade" },
                            example: {
                                nome: "Batismo",
                                descricao: "Inscrição para o batismo",
                                data_hora_inicio: "2026-10-10T10:00:00",
                                data_hora_fim: "2026-10-15T10:00:00",
                                necessita_inscricao: false,
                                banner: "link_imagem_banner",
                                local: "Paróquia Nossa Senhora Das Graças",
                                tipo: "curso",
                                ativo: true
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário atualizado com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }

            },
            delete: {
                tags: ['Atividades'],
                summary: 'Remover Atividade',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Remove atividade existente pelo ID',
                parameters: [
                    {
                        name: "id_evento_curso",
                        in: "path",
                        required: true,
                        description: "ID da atividade a ser removida",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Atividade removida com sucesso!"
                    },
                    404: {
                        description: "Atividade não encontrada",
                        content: {
                            "application/json": {
                                example: { message: "Atividade não encontrada" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }
            },
        },


        "/inscricoes": {
            get: {
                tags: ["Inscrições"],
                summary: "Listar todas as inscrições",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Listar_Inscricoes' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Inscrições'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                summary: 'Cadastrar nova Inscrição',
                description: "Recebe nome, descricao, data início, data fim, necessidade de inscrição, link de banner, local, tipo e ativo para cadastrar nova atividade",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Inscricao"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Inscrição cadastrada com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/inscricoes/{id_inscricao}": {
            put: {
                tags: ['Inscrições'],
                summary: 'Atualizar todos os dados da inscricao',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Atualiza todos os dados de uma inscricao existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_inscricao",
                        in: "path",
                        required: true,
                        description: "ID da inscricao a ser atualizada",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Atualizar_Inscricao" },
                            example: {
                                nome: "Carol" ,
                                endereco: "Bairro São Sebastião,Rua da Salvação, 2333" ,
                                data_nascimento: "2000-10-02",
                                estado_civil:"Solteira" ,
                                CPF: "111.111.111-00" ,
                                RG: "11.999.999-00" ,
                                id_evento_curso: 1 
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Usuário atualizado com sucesso!"
                    },
                    404: {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Usuário não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }

            },
            delete: {
                tags: ['Inscrições'],
                summary: 'Remover Inscricao',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Remove inscrição existente pelo ID',
                parameters: [
                    {
                        name: "id_inscricao",
                        in: "path",
                        required: true,
                        description: "ID da inscrição a ser removida",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Inscricão removida com sucesso!"
                    },
                    404: {
                        description: "Inscrição não encontrada",
                        content: {
                            "application/json": {
                                example: { message: "Inscrição não encontrada" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }
            },
        },

        "/documentos": {
            get: {
                tags: ["Documentos"],
                summary: "Listar todos os documentos",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    200: {
                        description: "Dados obtidos com sucesso!",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Listar_Documentos' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Documentos'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                summary: 'Cadastrar novo Documento',
                description: "Recebe caminho, tipo e id_inscricao para cadastrar novo documento",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Cadastrar_Documento"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Documento cadastrado com sucesso!"
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }
                }
            }
        },
        "/documentos/{id_documento}": {
            put: {
                tags: ['Documentos'],
                summary: 'Atualizar todos os dados de documentos',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Atualiza todos os dados de um documento existente, é necessário enviar todos os campos',
                parameters: [
                    {
                        name: "id_documento",
                        in: "path",
                        required: true,
                        description: "ID do documento a ser atualizada",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Atualizar_Documento" },
                            example: {
                                caminho: "link_documento",
                                tipo: "CPF",
                                id_inscricao: 1
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Documento atualizado com sucesso!"
                    },
                    404: {
                        description: "Documento não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Documento não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }

            },
            delete: {
                tags: ['Documentos'],
                summary: 'Remover Documento',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                description: 'Remove documento existente pelo ID',
                parameters: [
                    {
                        name: "id_documento",
                        in: "path",
                        required: true,
                        description: "ID do documento a ser removido",
                        schema: {
                            type: 'integer',
                            example: 1
                        }
                    }
                ],
                responses: {
                    200: {
                        description: "Documento removido com sucesso!"
                    },
                    404: {
                        description: "Documento não encontrado",
                        content: {
                            "application/json": {
                                example: { message: "Documento não encontrado" }
                            }
                        }
                    },
                    500: {
                        description: "Erro interno no servidor"
                    }

                }
            },
        },


    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: "Insira o token JWT obtido no login"
            }
        },
        schemas: {
            Listar_Usuarios: {
                type: 'object',
                properties: {
                    id_usuario: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Carol" },
                    email: { type: "string", example: "carol@email.com" },
                    // senha: { type: "string", example: "C4r0l" },
                    ativo: { type: "boolean", example: true }
                }
            },
            Cadastrar_Usuario: {
                type: 'object',
                properties: {
                    nome: { type: "string", example: "Carol" },
                    email: { type: "string", example: "carol@email.com" },
                    senha: { type: "string", example: "C4r0l" },
                    ativo: { type: "boolean", example: true }
                }
            },
            Atualizar_Usuario: {
                type: 'object',
                required: ["nome", "email", "senha", "tipo"],
                properties: {
                    nome: { type: "string", example: "Carol" },
                    email: { type: "string", example: "carol@email.com" },
                    senha: { type: "string", example: "C4r0l" },
                    ativo: { type: "boolean", example: true }
                }
            },
            Login_Usuario: {
                type: 'object',
                required: true,
                properties: {
                    email: { type: "string", example: "admin@email.com" },
                    senha: { type: "string", example: "123" }
                }
            },
            Resposta_Login: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Login realizado com sucesso' },
                    token: {
                        type: 'string',
                        description: 'Token JWT gerado',
                        example: 'djfhwejfeuiwgfruejfwue'
                    },
                    usuario: {
                        type: 'object',
                        properties: {
                            id_usuario: { type: "string", example: 1 },
                            // nome: {type: "string", example: "Ricardo"},
                        }
                    }
                }
            },

            Listar_Atividades: {
                type: 'object',
                properties: {
                    id_evento_curso: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Batismo" },
                    descricao: { type: "string", example: "Inscrição para o batismo" },
                    data_hora_inicio: { type: "string", example: "2026-10-10T10:00:00" },
                    data_hora_fim: { type: "string", example: "2026-10-15T10:00:00" },
                    necessita_inscricao: { type: "boolean", example: false },
                    banner: { type: "string", example: "link_imagem_banner" },
                    local: { type: "string", example: "Paróquia Nossa Senhora Das Graças" },
                    tipo: { type: "string", example: "curso" },
                    ativo: { type: "boolean", example: true }
                }
            },
            Cadastrar_Atividade: {
                type: 'object',
                properties: {
                    nome: { type: "string", example: "Batismo" },
                    descricao: { type: "string", example: "Inscrição para o batismo" },
                    data_hora_inicio: { type: "string", example: "2026-10-10T10:00:00" },
                    data_hora_fim: { type: "string", example: "2026-10-15T10:00:00" },
                    necessita_inscricao: { type: "boolean", example: false },
                    banner: { type: "string", example: "link_imagem_banner" },
                    local: { type: "string", example: "Paróquia Nossa Senhora Das Graças" },
                    tipo: { type: "string", example: "curso" },
                    ativo: { type: "boolean", example: true }
                }
            },
            Atualizar_Atividade: {
                type: 'object',
                required: ["nome", "descricao", "data_hora_inicio", "data_hora_fim", "necessita_inscricao", "banner", "local", "tipo", "ativo"],
                properties: {
                    nome: { type: "string", example: "Batismo" },
                    descricao: { type: "string", example: "Inscrição para o batismo" },
                    data_hora_inicio: { type: "string", example: "2026-10-10T10:00:00" },
                    data_hora_fim: { type: "string", example: "2026-10-15T10:00:00" },
                    necessita_inscricao: { type: "boolean", example: false },
                    banner: { type: "string", example: "link_imagem_banner" },
                    local: { type: "string", example: "Paróquia Nossa Senhora Das Graças" },
                    tipo: { type: "string", example: "curso" },
                    ativo: { type: "boolean", example: true }
                }
            },

            Listar_Inscricoes: {
                type: 'object',
                properties: {
                    id_inscricao: { type: "integer", example: 1 },
                    nome: { type: "string", example: "Carol" },
                    endereco: { type: "string", example: "Bairro São Sebastião,Rua da Salvação, 2333" },
                    data_nascimento: { type: "string", example: "20/10/2000" },
                    estado_civil: { type: "string", example: "Solteira" },
                    CPF: { type: "string", example: "111.111.111-00" },
                    RG: { type: "string", example: "11.999.999-00" },
                    id_evento_curso: { type: "integer", example: 1 }
                }
            },
            Cadastrar_Inscricao: {
                type: 'object',
                properties: {
                    nome: { type: "string", example: "Carol" },
                    endereco: { type: "string", example: "Bairro São Sebastião,Rua da Salvação, 2333" },
                    data_nascimento: { type: "string", example: "2000/10/20" },
                    estado_civil: { type: "string", example: "Solteira" },
                    CPF: { type: "string", example: "111.111.111-00" },
                    RG: { type: "string", example: "11.999.999-00" },
                    id_evento_curso: { type: "integer", example: 1 }
                }
            },
            Atualizar_Inscricao: {
                type: 'object',
                required: ["nome", "endereco", "data de nascimento", "estado civil", "CPF", "RG", "id evento curso"],
                properties: {
                    nome: { type: "string", example: "Carol" },
                    endereco: { type: "string", example: "Bairro São Sebastião,Rua da Salvação, 2333" },
                    data_nascimento: { type: "string", example: "2000-10-02" },
                    estado_civil: { type: "string", example: "Solteira" },
                    CPF: { type: "string", example: "111.111.111-00" },
                    RG: { type: "string", example: "11.999.999-00" },
                    id_evento_curso: { type: "integer", example: 1 }
                }
            },

            Listar_Documentos: {
                type: 'object',
                properties: {
                    id_documento: { type: "integer", example: 1 },
                    caminho: { type: "string", example: "link_documento" },
                    tipo: { type: "string", example: "CPF" },
                    id_inscricao: { type: "integer", example: 1 }
                }
            },
            Cadastrar_Documento: {
                type: 'object',
                properties: {
                    caminho: { type: "string", example: "link_documento" },
                    tipo: { type: "string", example: "CPF" },
                    id_inscricao: { type: "integer", example: 1 }
                }
            },
            Atualizar_Documento: {
                type: 'object',
                required: ["nome", "endereco", "data de nascimento", "estado civil", "CPF", "RG", "id evento curso"],
                properties: {
                    caminho: { type: "string", example: "link_documento" },
                    tipo: { type: "string", example: "CPF" },
                    id_inscricao: { type: "integer", example: 1 }
                }
            },
        }
    }
}
export default documentacao
