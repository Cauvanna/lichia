package br.com.lichia.routes

import br.com.lichia.database.Desejos
import br.com.lichia.database.Games
import br.com.lichia.database.Usuarios
import br.com.lichia.dto.GameDTO
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import java.time.LocalDate

/******************************************************************************************************************/
// DATA CLASSES //
/******************************************************************************************************************/
// Data classes para requisições e respostas de operações sobre usuários. Todos envolvem um REQUEST a
// ser enviado pelo frontend e uma RESPONSE a ser enviada de volta pelo backend.

@Serializable
data class RegistroUsuarioRequest(
    val comunicacao: String, // novo campo para identificar a operação
    val username: String,
    val senha: String,
    val dataNascimento: String, // Vamos parsear como LocalDate no backend
    val visibilidade: Boolean
)

@Serializable
data class RegistroUsuarioResponse(
    val comunicacao: String, // novo campo para identificar a operação
    val registrado: Boolean,
    val mensagem: String
)

@Serializable
data class LoginRequest(
    val comunicacao: String,
    val username: String,
    val senha: String
)

@Serializable
data class LoginResponse(
    val comunicacao: String,
    val autenticado: Boolean?,
    val token: String = "", // se der errado, envia um token vazio
    val mensagem: String? = null
)


@Serializable
data class LogoutRequest(
    val comunicacao: String,
    val username: String,
    val token: String
)

@Serializable
data class LogoutResponse(
    val comunicacao: String,
    val autenticado: Boolean? = null,
    val mensagem: String
)


@Serializable
data class UsuarioListaResponseItem(
    val id: Int,
    val nome: String,
    val senha: String,
    val visibilidade: Boolean,
    val data_cadastro: String, // agora é String
    val data_nascimento: String,
    val logado: Boolean
)

@Serializable
data class AdicionarDesejoRequest(
    val comunicacao: String,
    val username: String,
    val id_usuario: Int,
    val token: String,
    val id_jogo: Int
)

@Serializable
data class AdicionarDesejoResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RemoverDesejoRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String,
    val id_usuario: Int,
    val token: String
)

@Serializable
data class RemoverDesejoResponse(
    val comunicacao: String,
    val mensagem: String
)


@Serializable
data class RequestCriarAvaliacaoRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String,
    val id_usuario: Int,
    val token: String,
    val nota: Double?,
    val resenha: String = ""
)

@Serializable
data class RequestCriarAvaliacaoResponse(
    val comunicacao: String,
    val mensagem: String,
    val id_avaliacao: Int? = null
)

@Serializable
data class RequestRemoverAvaliacaoRequest(
    val comunicacao: String,
    val id_avaliacao: Int,
    val username: String,
    val id_usuario: Int,
    val token: String
)

@Serializable
data class RequestRemoverAvaliacaoResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RequestListaDeDesejosRequest(
    val comunicacao: String,
    val usr_alvo: String, // nome do usuário alvo
    val id_usr_alvo: Int, // id do usuário alvo
    val id_usr_solicitante: Int = 0, // id do usuário solicitante (0 se visitante)
    val usr_solicitante: String = "", // nome do usuário solicitante (vazio se visitante)
    val token: String = "" // token do solicitante (vazio se visitante)
)

@Serializable
data class RequestListaDeDesejosResponse(
    val comunicacao: String,
    val mensagem: String? = null,
    val desejos: List<DesejoResponseItem> = emptyList()
)

@Serializable
data class DesejoResponseItem(
    val id: Int,
    val titulo: String,
    val genero: String,
    val anoLancamento: Int,
    val consoleLancamento: String,
    val ehHandheld: Boolean,
    val maxJogadores: Int,
    val temOnline: Boolean,
    val publisher: String,
    val temSequencia: Boolean,
    val precoUsual: Double,
    val duracaoMainStoryAverage: Double,
    val duracaoMainStoryExtras: Double,
    val duracaoCompletionistAverage: Double
)

@Serializable
data class RequestPainelUsuarioRequest(
    val comunicacao: String,
    val username: String,
    val id_usr: Int,
    val token: String
)

@Serializable
data class RequestPainelUsuarioErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RequestPaginaUsuarioRequest(
    val comunicacao: String,
    val usr_alvo: String,
    val id_usr_alvo: Int,
    val id_usr_solicitante: Int = 0,
    val usr_solicitante: String = "",
    val token: String = ""
)

@Serializable
data class RequestPaginaUsuarioErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RequestHistoricoAvaliacoesRequest(
    val comunicacao: String,
    val usr_alvo: String,
    val id_usr_alvo: Int,
    val id_usr_solicitante: Int = 0,
    val usr_solicitante: String = "",
    val token: String = ""
)

@Serializable
data class HistoricoAvaliacaoResponseItem(
    val autor: String,
    val id_autor: Int,
    val nota: Double?,
    val data_criacao: String,
    val resenha: String
)

@Serializable
data class RequestHistoricoAvaliacoesErroResponse(
    val comunicacao: String,
    val mensagem: String
)

/******************************************************************************************************************/
// ROTAS DOS ENDPOINTS //
/******************************************************************************************************************/

fun Route.userRoutes() {
    route("/registro") {
        post {
            val request = call.receive<RegistroUsuarioRequest>()

            // Checa tamanho mínimo do username e senha
            if (request.username.length < 5) {
                call.respond(RegistroUsuarioResponse(
                    comunicacao = "registro-usuario",
                    registrado = false,
                    mensagem = "O nome de usuário deve ter pelo menos 5 caracteres."
                ))
                return@post
            }
            if (request.senha.length < 5) {
                call.respond(RegistroUsuarioResponse(
                    comunicacao = "registro-usuario",
                    registrado = false,
                    mensagem = "A senha deve ter pelo menos 5 caracteres."
                ))
                return@post
            }

            // Checamos se usuário com mesmo nome já existe
            val userExists = transaction {
                Usuarios.selectAll().any { it[Usuarios.nome] == request.username }
            }
            if (userExists) {
                call.respond(RegistroUsuarioResponse(
                    comunicacao = "registro-usuario",
                    registrado = false,
                    mensagem = "Usuario com mesmo nome ja registrado")
                )
                return@post
            }

            transaction {
                Usuarios.insert {
                    it[nome] = request.username
                    it[senha] = request.senha
                    it[dataNascimento] = LocalDate.parse(request.dataNascimento)
                    it[visibilidade] = request.visibilidade
                    it[dataCadastro] = LocalDate.now() // Agora salva a data atual corretamente
                }
            }

            // Se tudo deu certo, enviamos mensagem de sucesso
            call.respond(RegistroUsuarioResponse(
                comunicacao = "registro-usuario",
                registrado = true,
                mensagem = "Usuario registrado com sucesso!"
            ))
        }
    }

    // Rota para endpoint de login de usuários
    route("/login") {
        post {
            val loginData = call.receive<LoginRequest>()

            val userExists = transaction {
                Usuarios.selectAll().where { (Usuarios.nome eq loginData.username) and (Usuarios.senha eq loginData.senha) }.count() > 0
            }

            if (userExists) {
                // Atualiza o campo 'logado' para true ao fazer login
                transaction {
                    Usuarios.update({ (Usuarios.nome eq loginData.username) and (Usuarios.senha eq loginData.senha) }) {
                        it[logado] = true
                    }
                }
                val token = "usuario-${loginData.username}-logado"
                call.respond(LoginResponse(comunicacao = "login", autenticado = true, mensagem = "login realizado com sucesso", token = token))
            } else {
                call.respond(LoginResponse(comunicacao = "login", autenticado = false, mensagem = "Usuário ou senha incorretos."))
            }
        }
    }

    // Rota para endpoint de logout de usuários
    route("/logout") {
        post {
            val logoutData = call.receive<LogoutRequest>()
            val tokenEsperado = "user-${logoutData.username}-logado"
            // Verifica se o token é válido
            if (logoutData.token != tokenEsperado) {
                call.respond(
                    LogoutResponse(
                        comunicacao = "logout",
                        mensagem = "logout falhou. Token de login incorreto"
                    )
                )
                return@post
            }
            // Aqui você pode futuramente validar o token, mas por enquanto só verifica o usuário
            val userExists = transaction {
                Usuarios.selectAll().where { Usuarios.nome eq logoutData.username }.count() > 0
            }
            if (userExists) {
                transaction {
                    Usuarios.update({ Usuarios.nome eq logoutData.username }) {
                        it[logado] = false
                    }
                }
                call.respond(
                    LogoutResponse(
                        comunicacao = "logout",
                        autenticado = true,
                        mensagem = "logout realizado"
                    )
                )
            } else {
                call.respond(
                    LogoutResponse(
                        comunicacao = "logout",
                        mensagem = "erro no logout"
                    )
                )
            }
        }
    }

    route("/request-publico-lista-usuarios") {
        get {
            val usuarios = transaction {
                Usuarios.selectAll().map {
                    UsuarioListaResponseItem(
                        id = it[Usuarios.id],
                        nome = it[Usuarios.nome],
                        senha = it[Usuarios.senha],
                        visibilidade = it[Usuarios.visibilidade],
                        data_cadastro = it[Usuarios.dataCadastro].toString(),
                        data_nascimento = it[Usuarios.dataNascimento].toString(),
                        logado = it[Usuarios.logado]
                    )
                }
            }
            call.respond(usuarios)
        }
    }

    route("/request-adicionar-desejo") {
        post {
            val req = call.receive<AdicionarDesejoRequest>()
            var resposta: AdicionarDesejoResponse? = null
            transaction {
                // 1. Verifica se o usuário existe
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "request-adicionar-desejo",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 2. Verifica se o jogo existe
                val jogoExiste = br.com.lichia.database.Games.selectAll().any { it[br.com.lichia.database.Games.id] == req.id_jogo }
                if (!jogoExiste) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "request-adicionar-desejo",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                // 3. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "request-adicionar-desejo",
                        mensagem = "token de login invalido"
                    )
                    return@transaction
                }
                // 4. Verifica se o desejo já existe
                val desejoExiste = Desejos.selectAll().any {
                    it[Desejos.usuarioId] == req.id_usuario && it[Desejos.gameId] == req.id_jogo
                }
                if (desejoExiste) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "request-adicionar-desejo",
                        mensagem = "jogo já está na lista de desejos do usuário"
                    )
                    return@transaction
                }
                // Se passou por todas as verificações, adiciona o desejo
                Desejos.insert {
                    it[usuarioId] = req.id_usuario
                    it[gameId] = req.id_jogo
                }
                resposta = AdicionarDesejoResponse(
                    comunicacao = "request-adicionar-desejo",
                    mensagem = "jogo adicionado a lista de desejos com sucesso"
                )
            }
            call.respond(resposta!!)
        }
    }
    route("/request-remover-desejo") {
        post {
            val req = call.receive<RemoverDesejoRequest>()
            var resposta: RemoverDesejoResponse? = null
            transaction {
                // 1. Verifica se o usuário existe
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "request-remover-desejo",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 2. Verifica se o jogo existe
                val jogoExiste = br.com.lichia.database.Games.selectAll().any { it[br.com.lichia.database.Games.id] == req.id_jogo }
                if (!jogoExiste) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "request-remover-desejo",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                // 3. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "request-remover-desejo",
                        mensagem = "token de login inválido"
                    )
                    return@transaction
                }
                // 4. Verifica se o desejo existe
                val desejoExiste = Desejos.selectAll().any {
                    it[Desejos.usuarioId] == req.id_usuario && it[Desejos.gameId] == req.id_jogo
                }
                if (!desejoExiste) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "request-remover-desejo",
                        mensagem = "jogo não está na lista de desejos do usuário"
                    )
                    return@transaction
                }
                // Se passou por todas as verificações, remove o desejo
                Desejos.deleteWhere {
                    (Desejos.usuarioId eq req.id_usuario) and
                    (Desejos.gameId eq req.id_jogo)
                }
                resposta = RemoverDesejoResponse(
                    comunicacao = "request-remover-desejo",
                    mensagem = "jogo removido da lista de desejos com sucesso"
                )
            }
            call.respond(resposta!!)
        }
    }


    route("/request-criar-avaliacao") {
        post {
            val req = call.receive<RequestCriarAvaliacaoRequest>()
            var resposta: RequestCriarAvaliacaoResponse? = null
            transaction {
                // 1. Verifica se o usuário existe
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = RequestCriarAvaliacaoResponse(
                        comunicacao = "request-criar-avaliacao",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 2. Verifica se o jogo existe
                val jogoExiste = br.com.lichia.database.Games.selectAll().any { it[br.com.lichia.database.Games.id] == req.id_jogo }
                if (!jogoExiste) {
                    resposta = RequestCriarAvaliacaoResponse(
                        comunicacao = "request-criar-avaliacao",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                // 3. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = RequestCriarAvaliacaoResponse(
                        comunicacao = "request-criar-avaliacao",
                        mensagem = "token de login invalido"
                    )
                    return@transaction
                }
                // Se passou por todas as verificações, cria a avaliação
                br.com.lichia.database.Avaliacoes.insert {
                    it[usuarioId] = req.id_usuario
                    it[gameId] = req.id_jogo
                    it[nota] = req.nota
                    it[resenha] = req.resenha
                    it[visibilidade] = true // valor padrão
                    it[data] = java.time.LocalDate.now() // Salva a data atual da avaliação
                }
                // Busca o id da avaliação recém-criada
                val idAvaliacao = br.com.lichia.database.Avaliacoes
                    .selectAll()
                    .where {
                        (br.com.lichia.database.Avaliacoes.usuarioId eq req.id_usuario) and
                        (br.com.lichia.database.Avaliacoes.gameId eq req.id_jogo) and
                        (br.com.lichia.database.Avaliacoes.data eq java.time.LocalDate.now()) and
                        (br.com.lichia.database.Avaliacoes.nota eq req.nota) and
                        (br.com.lichia.database.Avaliacoes.resenha eq req.resenha)
                    }
                    .orderBy(br.com.lichia.database.Avaliacoes.id, org.jetbrains.exposed.sql.SortOrder.DESC)
                    .limit(1)
                    .firstOrNull()?.let { it[br.com.lichia.database.Avaliacoes.id].value }
                resposta = RequestCriarAvaliacaoResponse(
                    comunicacao = "request-criar-avaliacao",
                    mensagem = "avaliação registrada com sucesso!",
                    id_avaliacao = idAvaliacao
                )
            }
            call.respond(resposta!!)
        }
    }
    route("/request-remover-avaliacao") {
        post {
            val req = call.receive<RequestRemoverAvaliacaoRequest>()
            var resposta: RequestRemoverAvaliacaoResponse? = null
            transaction {
                // 1. Checa se a avaliação existe
                val avaliacao = br.com.lichia.database.Avaliacoes.selectAll().find { it[br.com.lichia.database.Avaliacoes.id].value == req.id_avaliacao }
                if (avaliacao == null) {
                    resposta = RequestRemoverAvaliacaoResponse(
                        comunicacao = "request-remover-avaliacao",
                        mensagem = "id de avaliação inválido"
                    )
                    return@transaction
                }
                // 2. Checa se o usuário existe
                val usuario = br.com.lichia.database.Usuarios.selectAll().find { it[br.com.lichia.database.Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = RequestRemoverAvaliacaoResponse(
                        comunicacao = "request-remover-avaliacao",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 3. Checa se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = RequestRemoverAvaliacaoResponse(
                        comunicacao = "request-remover-avaliacao",
                        mensagem = "Token de login inválido"
                    )
                    return@transaction
                }
                // 4. Checa se o usuário é o autor da avaliação
                val autorAvaliacaoId = avaliacao[br.com.lichia.database.Avaliacoes.usuarioId]
                if (autorAvaliacaoId != req.id_usuario) {
                    resposta = RequestRemoverAvaliacaoResponse(
                        comunicacao = "request-remover-avaliacao",
                        mensagem = " Usuário solicitante não é autor da avaliação"
                    )
                    return@transaction
                }
                // 5. Remove a avaliação
                br.com.lichia.database.Avaliacoes.deleteWhere { br.com.lichia.database.Avaliacoes.id eq req.id_avaliacao }
                resposta = RequestRemoverAvaliacaoResponse(
                    comunicacao = "request-remover-avaliacao",
                    mensagem = "Avaliação removida com sucesso!"
                )
            }
            call.respond(resposta!!)
        }
    }

    route("/request-lista-de-desejos") {
        post {
            val req = call.receive<RequestListaDeDesejosRequest>()
            val visitante = req.id_usr_solicitante == 0 || req.usr_solicitante.isBlank() || req.token.isBlank()
            var resposta: Any? = null
            transaction {
                val usuarioAlvo = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_alvo }
                if (usuarioAlvo == null) {
                    resposta = RequestListaDeDesejosResponse(
                        comunicacao = "request-lista-de-desejos",
                        mensagem = "id de usuário alvo inválido",
                        desejos = emptyList()
                    )
                    return@transaction
                }
                if (!visitante) {
                    val usuarioSolicitante = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_solicitante }
                    if (usuarioSolicitante == null) {
                        resposta = RequestListaDeDesejosResponse(
                            comunicacao = "request-lista-de-desejos",
                            mensagem = "id de usuário solicitante inválido",
                            desejos = emptyList()
                        )
                        return@transaction
                    }
                    val tokenEsperado = "user-${req.usr_solicitante}-logado"
                    if (req.token != tokenEsperado) {
                        resposta = RequestListaDeDesejosResponse(
                            comunicacao = "request-lista-de-desejos",
                            mensagem = "token de login do solicitante invalido",
                            desejos = emptyList()
                        )
                        return@transaction
                    }
                }
                val desejos = Desejos.selectAll().filter { it[Desejos.usuarioId] == req.id_usr_alvo }
                val listaGames = desejos.mapNotNull { desejo ->
                    val game = Games.selectAll().find { it[Games.id] == desejo[Desejos.gameId] }
                    game?.let {
                        DesejoResponseItem(
                            id = it[Games.id],
                            titulo = it[Games.titulo],
                            genero = it[Games.genero] ?: "",
                            anoLancamento = it[Games.anoLancamento],
                            consoleLancamento = it[Games.consoleLancamento] ?: "",
                            ehHandheld = it[Games.ehHandheld],
                            maxJogadores = it[Games.maxJogadores],
                            temOnline = it[Games.temOnline],
                            publisher = it[Games.publisher],
                            temSequencia = it[Games.temSequencia],
                            precoUsual = it[Games.precoUsual],
                            duracaoMainStoryAverage = it[Games.duracaoMainStoryAverage],
                            duracaoMainStoryExtras = it[Games.duracaoMainStoryExtras],
                            duracaoCompletionistAverage = it[Games.duracaoCompletionistAverage]
                        )
                    }
                }
                resposta = listaGames
            }
            call.respond(resposta!!)
        }
    }



    route("/request-painel-usuario") {
        post {
            val req = call.receive<RequestPainelUsuarioRequest>()
            var resposta: Any? = null
            transaction {
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr }
                if (usuario == null) {
                    resposta = RequestPainelUsuarioErroResponse(
                        comunicacao = "request-painel-usuario",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = RequestPainelUsuarioErroResponse(
                        comunicacao = "request-painel-usuario",
                        mensagem = "token de login inválido"
                    )
                    return@transaction
                }
                resposta = UsuarioListaResponseItem(
                    id = usuario[Usuarios.id],
                    nome = usuario[Usuarios.nome],
                    senha = usuario[Usuarios.senha],
                    visibilidade = usuario[Usuarios.visibilidade],
                    data_cadastro = usuario[Usuarios.dataCadastro].toString(),
                    data_nascimento = usuario[Usuarios.dataNascimento].toString(),
                    logado = usuario[Usuarios.logado]
                )
            }
            call.respond(resposta!!)
        }
    }

    route("/request-pagina-usuario") {
        post {
            val req = call.receive<RequestPaginaUsuarioRequest>()
            val visitante = req.id_usr_solicitante == 0 || req.usr_solicitante.isBlank() || req.token.isBlank()
            var resposta: Any? = null
            transaction {
                val usuarioAlvo = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_alvo }
                if (usuarioAlvo == null) {
                    resposta = RequestPaginaUsuarioErroResponse(
                        comunicacao = "request-pagina-usuario",
                        mensagem = "id de usuário alvo inválido"
                    )
                    return@transaction
                }
                if (!visitante) {
                    val usuarioSolicitante = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_solicitante }
                    if (usuarioSolicitante == null) {
                        resposta = RequestPaginaUsuarioErroResponse(
                            comunicacao = "request-pagina-usuario",
                            mensagem = "id de usuário solicitante inválido"
                        )
                        return@transaction
                    }
                    val tokenEsperado = "user-${req.usr_solicitante}-logado"
                    if (req.token != tokenEsperado) {
                        resposta = RequestPaginaUsuarioErroResponse(
                            comunicacao = "request-pagina-usuario",
                            mensagem = "token de login do solicitante invalido"
                        )
                        return@transaction
                    }
                }
                resposta = UsuarioListaResponseItem(
                    id = usuarioAlvo[Usuarios.id],
                    nome = usuarioAlvo[Usuarios.nome],
                    senha = usuarioAlvo[Usuarios.senha],
                    visibilidade = usuarioAlvo[Usuarios.visibilidade],
                    data_cadastro = usuarioAlvo[Usuarios.dataCadastro].toString(),
                    data_nascimento = usuarioAlvo[Usuarios.dataNascimento].toString(),
                    logado = usuarioAlvo[Usuarios.logado]
                )
            }
            call.respond(resposta!!)
        }
    }

    route("/request-historico-avaliacoes") {
        post {
            val req = call.receive<RequestHistoricoAvaliacoesRequest>()
            val visitante = req.id_usr_solicitante == 0 || req.usr_solicitante.isBlank() || req.token.isBlank()
            var resposta: Any? = null
            transaction {
                // Checa se o usuário alvo existe
                val usuarioAlvo = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_alvo }
                if (usuarioAlvo == null) {
                    resposta = RequestHistoricoAvaliacoesErroResponse(
                        comunicacao = "request-historico-avaliacoes",
                        mensagem = "id de usuário alvo inválido"
                    )
                    return@transaction
                }
                if (!visitante) {
                    // Checa se o usuário solicitante existe
                    val usuarioSolicitante = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_solicitante }
                    if (usuarioSolicitante == null) {
                        resposta = RequestHistoricoAvaliacoesErroResponse(
                            comunicacao = "request-historico-avaliacoes",
                            mensagem = "id de usuário solicitante inválido"
                        )
                        return@transaction
                    }
                    // Checa se o token é válido
                    val tokenEsperado = "user-${req.usr_solicitante}-logado"
                    if (req.token != tokenEsperado) {
                        resposta = RequestHistoricoAvaliacoesErroResponse(
                            comunicacao = "request-historico-avaliacoes",
                            mensagem = "token de login do solicitante invalido"
                        )
                        return@transaction
                    }
                }
                // Busca avaliações do usuário alvo
                val avaliacoes = br.com.lichia.database.Avaliacoes.selectAll().filter { it[br.com.lichia.database.Avaliacoes.usuarioId] == req.id_usr_alvo }
                val listaAvaliacoes = avaliacoes.map { avaliacao ->
                    HistoricoAvaliacaoResponseItem(
                        autor = usuarioAlvo[Usuarios.nome],
                        id_autor = usuarioAlvo[Usuarios.id],
                        nota = avaliacao[br.com.lichia.database.Avaliacoes.nota],
                        data_criacao = avaliacao[br.com.lichia.database.Avaliacoes.data].format(
                            java.time.format.DateTimeFormatter.ofPattern("EEE-dd-MMM-yyyy").withLocale(java.util.Locale("pt", "BR"))
                        ),
                        resenha = avaliacao[br.com.lichia.database.Avaliacoes.resenha]
                    )
                }
                resposta = listaAvaliacoes
            }
            call.respond(resposta!!)
        }
    }

}
