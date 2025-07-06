package br.com.lichia.routes

/*
 * UsuarioRoutes.kt define as rotas relacionadas aos usuários no servidor Ktor.
 * Implementa os endpoints para funcionalidades de usuário como registro, login,
 * gerenciamento de lista de desejos, avaliações, etc.
 */

import br.com.lichia.database.*
import br.com.lichia.dto.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

fun Route.usuarioRoutes() {
    route("/") {
        
        // Endpoint para registro de usuário
        post("/registro") {
            try {
                val request = call.receive<UsuarioRegistroRequest>()
                
                val response = transaction {
                    // Verificar se usuário já existe
                    val existingUser = Users.selectAll().where { Users.nome eq request.nome }.singleOrNull()
                    
                    if (existingUser != null) {
                        UsuarioRegistroResponse(
                            registrado = false,
                            mensagem = "Usuario com mesmo nome ja registrado",
                            usuario = null
                        )
                    } else {
                        // Criar novo usuário
                        val userId = Users.insert {
                            it[nome] = request.nome
                            it[idade] = request.idade
                            it[senha] = request.senha
                            it[visibilidade] = request.visibilidade
                            it[dataCadastro] = System.currentTimeMillis()
                        } get Users.id
                        
                        val usuario = UsuarioDTO(
                            id = userId,
                            nome = request.nome,
                            idade = request.idade,
                            visibilidade = request.visibilidade,
                            dataCadastro = System.currentTimeMillis()
                        )
                        
                        UsuarioRegistroResponse(
                            registrado = true,
                            mensagem = "Usuario registrado com sucesso!",
                            usuario = usuario
                        )
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao processar registro: ${e.message}")
                )
            }
        }
        
        // Endpoint para login de usuário
        post("/login") {
            try {
                val request = call.receive<UsuarioLoginRequest>()
                
                val response = transaction {
                    val user = Users.selectAll().where { Users.nome eq request.nome }.singleOrNull()
                    
                    if (user != null && user[Users.senha] == request.senha) {
                        val usuario = UsuarioDTO(
                            id = user[Users.id],
                            nome = user[Users.nome],
                            idade = user[Users.idade],
                            visibilidade = user[Users.visibilidade],
                            dataCadastro = user[Users.dataCadastro]
                        )
                        
                        UsuarioLoginResponse(
                            sucesso = true,
                            mensagem = "Login realizado com sucesso",
                            usuario = usuario
                        )
                    } else {
                        UsuarioLoginResponse(
                            sucesso = false,
                            mensagem = "Nome de usuário ou senha incorretos",
                            usuario = null
                        )
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao processar login: ${e.message}")
                )
            }
        }
        
        // Endpoint para logout (simples confirmação)
        post("/logout") {
            call.respond(ResponseMessage(true, "Logout realizado com sucesso"))
        }
        
        // Endpoint para adicionar jogo à lista de desejos
        post("/request-adicionar-desejo") {
            try {
                val request = call.receive<DesejoRequest>()
                
                val response = transaction {
                    // Verificar se o desejo já existe
                    val existingDesejo = ListaDesejos.selectAll().where {
                        (ListaDesejos.usuarioId eq request.usuarioId) and 
                        (ListaDesejos.gameId eq request.gameId)
                    }.singleOrNull()
                    
                    if (existingDesejo != null) {
                        ResponseMessage(false, "Jogo já está na lista de desejos")
                    } else {
                        // Verificar se o usuário e o jogo existem
                        val user = Users.selectAll().where { Users.id eq request.usuarioId }.singleOrNull()
                        val game = Games.selectAll().where { Games.id eq request.gameId }.singleOrNull()
                        
                        if (user == null) {
                            ResponseMessage(false, "Usuário não encontrado")
                        } else if (game == null) {
                            ResponseMessage(false, "Jogo não encontrado")
                        } else {
                            ListaDesejos.insert {
                                it[usuarioId] = request.usuarioId
                                it[gameId] = request.gameId
                                it[dataAdicao] = System.currentTimeMillis()
                            }
                            ResponseMessage(true, "Jogo adicionado à lista de desejos com sucesso")
                        }
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao adicionar desejo: ${e.message}")
                )
            }
        }
        
        // Endpoint para remover jogo da lista de desejos
        post("/request-remover-desejo") {
            try {
                val request = call.receive<DesejoRequest>()
                
                val response = transaction {
                    val deletedCount = ListaDesejos.deleteWhere {
                        (ListaDesejos.usuarioId eq request.usuarioId) and 
                        (ListaDesejos.gameId eq request.gameId)
                    }
                    
                    if (deletedCount > 0) {
                        ResponseMessage(true, "Jogo removido da lista de desejos com sucesso")
                    } else {
                        ResponseMessage(false, "Jogo não encontrado na lista de desejos")
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao remover desejo: ${e.message}")
                )
            }
        }
        
        // Endpoint para criar avaliação
        post("/request-criar-avaliacao") {
            try {
                val request = call.receive<AvaliacaoRequest>()
                
                val response = transaction {
                    // Verificar se já existe uma resenha do usuário para este jogo
                    val existingResenha = Resenhas.selectAll().where {
                        (Resenhas.usuarioId eq request.usuarioId) and 
                        (Resenhas.gameId eq request.gameId)
                    }.singleOrNull()
                    
                    if (existingResenha != null) {
                        ResponseMessage(false, "Usuário já possui uma avaliação para este jogo")
                    } else {
                        // Verificar se o usuário e o jogo existem
                        val user = Users.selectAll().where { Users.id eq request.usuarioId }.singleOrNull()
                        val game = Games.selectAll().where { Games.id eq request.gameId }.singleOrNull()
                        
                        if (user == null) {
                            ResponseMessage(false, "Usuário não encontrado")
                        } else if (game == null) {
                            ResponseMessage(false, "Jogo não encontrado")
                        } else if (request.nota < 1 || request.nota > 10) {
                            ResponseMessage(false, "Nota deve estar entre 1 e 10")
                        } else {
                            Resenhas.insert {
                                it[usuarioId] = request.usuarioId
                                it[gameId] = request.gameId
                                it[comentario] = request.comentario ?: ""
                                it[nota] = request.nota
                                it[timestamp] = System.currentTimeMillis()
                            }
                            ResponseMessage(true, "Avaliação criada com sucesso")
                        }
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao criar avaliação: ${e.message}")
                )
            }
        }
        
        // Endpoint para remover avaliação
        post("/request-remover-avaliacao") {
            try {
                val request = call.receive<DesejoRequest>() // Reutilizando a mesma estrutura
                
                val response = transaction {
                    val deletedCount = Resenhas.deleteWhere {
                        (Resenhas.usuarioId eq request.usuarioId) and 
                        (Resenhas.gameId eq request.gameId)
                    }
                    
                    if (deletedCount > 0) {
                        ResponseMessage(true, "Avaliação removida com sucesso")
                    } else {
                        ResponseMessage(false, "Avaliação não encontrada")
                    }
                }
                
                call.respond(response)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ResponseMessage(false, "Erro ao remover avaliação: ${e.message}")
                )
            }
        }
        
        // Endpoint para obter lista de desejos do usuário
        get("/request-lista-de-desejos/{usuarioId}") {
            try {
                val usuarioId = call.parameters["usuarioId"]?.toIntOrNull()
                
                if (usuarioId == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ResponseMessage(false, "ID de usuário inválido")
                    )
                    return@get
                }
                
                val listaDesejos = transaction {
                    (ListaDesejos innerJoin Games).selectAll().where {
                        ListaDesejos.usuarioId eq usuarioId
                    }.map { row ->
                        GameDTO(
                            id = row[Games.id],
                            titulo = row[Games.titulo],
                            genero = row[Games.genero],
                            anoLancamento = row[Games.anoLancamento],
                            consoleLancamento = row[Games.consoleLancamento],
                            ehHandheld = row[Games.ehHandheld],
                            maxJogadores = row[Games.maxJogadores],
                            temOnline = row[Games.temOnline],
                            publisher = row[Games.publisher],
                            temSequencia = row[Games.temSequencia],
                            precoUsual = row[Games.precoUsual],
                            duracaoMainStoryAverage = row[Games.duracaoMainStoryAverage],
                            duracaoMainStoryExtras = row[Games.duracaoMainStoryExtras],
                            duracaoCompletionistAverage = row[Games.duracaoCompletionistAverage]
                        )
                    }
                }
                
                call.respond(listaDesejos)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ResponseMessage(false, "Erro ao buscar lista de desejos: ${e.message}")
                )
            }
        }
        
        // Endpoint para obter dados do painel do usuário
        get("/request-painel-usuario/{usuarioId}") {
            try {
                val usuarioId = call.parameters["usuarioId"]?.toIntOrNull()
                
                if (usuarioId == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ResponseMessage(false, "ID de usuário inválido")
                    )
                    return@get
                }
                
                val painelData = transaction {
                    val user = Users.selectAll().where { Users.id eq usuarioId }.singleOrNull()
                    
                    if (user == null) {
                        null
                    } else {
                        val totalDesejos = ListaDesejos.selectAll().where { ListaDesejos.usuarioId eq usuarioId }.count()
                        val totalAvaliacoes = Resenhas.selectAll().where { Resenhas.usuarioId eq usuarioId }.count()
                        val totalRegistros = Registros.selectAll().where { Registros.usuarioId eq usuarioId }.count()
                        
                        mapOf(
                            "usuario" to UsuarioDTO(
                                id = user[Users.id],
                                nome = user[Users.nome],
                                idade = user[Users.idade],
                                visibilidade = user[Users.visibilidade],
                                dataCadastro = user[Users.dataCadastro]
                            ),
                            "estatisticas" to mapOf(
                                "totalDesejos" to totalDesejos,
                                "totalAvaliacoes" to totalAvaliacoes,
                                "totalRegistros" to totalRegistros
                            )
                        )
                    }
                }
                
                if (painelData != null) {
                    call.respond(painelData)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ResponseMessage(false, "Usuário não encontrado")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ResponseMessage(false, "Erro ao buscar dados do painel: ${e.message}")
                )
            }
        }
        
        // Endpoint para obter dados da página do usuário (perfil público)
        get("/request-pagina-usuario/{usuarioId}") {
            try {
                val usuarioId = call.parameters["usuarioId"]?.toIntOrNull()
                
                if (usuarioId == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ResponseMessage(false, "ID de usuário inválido")
                    )
                    return@get
                }
                
                val perfilData = transaction {
                    val user = Users.selectAll().where { Users.id eq usuarioId }.singleOrNull()
                    
                    if (user == null || !user[Users.visibilidade]) {
                        null
                    } else {
                        // Buscar avaliações públicas do usuário
                        val avaliacoesPublicas = (Resenhas innerJoin Games).selectAll().where {
                            (Resenhas.usuarioId eq usuarioId) and (Resenhas.visibilidade eq true)
                        }.map { row ->
                            mapOf(
                                "jogo" to row[Games.titulo],
                                "nota" to row[Resenhas.nota],
                                "comentario" to row[Resenhas.comentario],
                                "dataAvaliacao" to row[Resenhas.timestamp]
                            )
                        }
                        
                        mapOf(
                            "usuario" to UsuarioDTO(
                                id = user[Users.id],
                                nome = user[Users.nome],
                                idade = user[Users.idade],
                                visibilidade = user[Users.visibilidade],
                                dataCadastro = user[Users.dataCadastro]
                            ),
                            "avaliacoesPublicas" to avaliacoesPublicas
                        )
                    }
                }
                
                if (perfilData != null) {
                    call.respond(perfilData)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ResponseMessage(false, "Usuário não encontrado ou perfil privado")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ResponseMessage(false, "Erro ao buscar perfil do usuário: ${e.message}")
                )
            }
        }
        
        // Endpoint para obter histórico de avaliações do usuário
        get("/request-historico-avaliacoes/{usuarioId}") {
            try {
                val usuarioId = call.parameters["usuarioId"]?.toIntOrNull()
                
                if (usuarioId == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ResponseMessage(false, "ID de usuário inválido")
                    )
                    return@get
                }
                
                val historico = transaction {
                    (Resenhas innerJoin Games).selectAll().where {
                        Resenhas.usuarioId eq usuarioId
                    }.orderBy(Resenhas.timestamp, SortOrder.DESC).map { row ->
                        AvaliacaoDTO(
                            id = row[Resenhas.id],
                            gameId = row[Games.id],
                            usuarioId = row[Resenhas.usuarioId],
                            nota = row[Resenhas.nota],
                            comentario = row[Resenhas.comentario],
                            dataAvaliacao = row[Resenhas.timestamp]
                        )
                    }
                }
                
                call.respond(historico)
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ResponseMessage(false, "Erro ao buscar histórico de avaliações: ${e.message}")
                )
            }
        }
    }
}