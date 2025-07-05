package br.com.lichia.routes

import br.com.lichia.database.Desejos
import br.com.lichia.database.Usuarios
import br.com.lichia.dto.GameDTO
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
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
    val data_cadastro: Long,
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
data class ListaDesejosParaUsuarioRequest(
    val comunicacao: String,
    val username: String, // usuário solicitante
    val id_user: Int, // usuário alvo (de quem se deseja ver a lista de desejos)
    val token: String,
    val usr_solicitante: String, // nome do usuário alvo
    val id_user_solicitante: Int // id do usuário solicitante
)

@Serializable
data class UsuarioCriarAvaliacaoGameRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String,
    val id_usuario: Int,
    val token: String,
    val nota: Double?,
    val resenha: String = ""
)

@Serializable
data class UsuarioCriarAvaliacaoGameResponse(
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
                    it[dataCadastro] = System.currentTimeMillis()
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

    route("/usuarios-lista") {
        get {
            val usuarios = transaction {
                Usuarios.selectAll().map {
                    UsuarioListaResponseItem(
                        id = it[Usuarios.id],
                        nome = it[Usuarios.nome],
                        senha = it[Usuarios.senha],
                        visibilidade = it[Usuarios.visibilidade],
                        data_cadastro = it[Usuarios.dataCadastro],
                        data_nascimento = it[Usuarios.dataNascimento].toString(),
                        logado = it[Usuarios.logado]
                    )
                }
            }
            call.respond(usuarios)
        }
    }

    route("/adicionar-desejo") {
        post {
            val req = call.receive<AdicionarDesejoRequest>()
            var resposta: AdicionarDesejoResponse? = null
            transaction {
                // 1. Verifica se o usuário existe
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "adicionar-desejo",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 2. Verifica se o jogo existe
                val jogoExiste = br.com.lichia.database.Games.selectAll().any { it[br.com.lichia.database.Games.id] == req.id_jogo }
                if (!jogoExiste) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "adicionar-desejo",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                // 3. Verifica se o usuário está logado
                if (!usuario[Usuarios.logado]) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "adicionar-desejo",
                        mensagem = "usuario nao esta logado"
                    )
                    return@transaction
                }
                // 4. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "adicionar-desejo",
                        mensagem = "token de login invalido"
                    )
                    return@transaction
                }
                // 5. Verifica se o desejo já existe
                val desejoExiste = Desejos.selectAll().any {
                    it[Desejos.usuarioId] == req.id_usuario && it[Desejos.gameId] == req.id_jogo
                }
                if (desejoExiste) {
                    resposta = AdicionarDesejoResponse(
                        comunicacao = "adicionar-desejo",
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
                    comunicacao = "adicionar-desejo",
                    mensagem = "jogo adicionado a lista de desejos com sucesso"
                )
            }
            call.respond(resposta!!)
        }
    }
    route("/remover-desejo") {
        post {
            val req = call.receive<RemoverDesejoRequest>()
            var resposta: RemoverDesejoResponse? = null
            transaction {
                // 1. Verifica se o usuário existe
                val usuario = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usuario }
                if (usuario == null) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "remover-desejo",
                        mensagem = "id de usuário inválido"
                    )
                    return@transaction
                }
                // 2. Verifica se o jogo existe
                val jogoExiste = br.com.lichia.database.Games.selectAll().any { it[br.com.lichia.database.Games.id] == req.id_jogo }
                if (!jogoExiste) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "remover-desejo",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                // 3. Verifica se o usuário está logado
                if (!usuario[Usuarios.logado]) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "remover-desejo",
                        mensagem = "usuario nao esta logado"
                    )
                    return@transaction
                }
                // 4. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "remover-desejo",
                        mensagem = "token de login inválido"
                    )
                    return@transaction
                }
                // 5. Verifica se o desejo existe
                val desejoExiste = Desejos.selectAll().any {
                    it[Desejos.usuarioId] == req.id_usuario && it[Desejos.gameId] == req.id_jogo
                }
                if (!desejoExiste) {
                    resposta = RemoverDesejoResponse(
                        comunicacao = "remover-desejo",
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
                    comunicacao = "remover-desejo",
                    mensagem = "jogo removido da lista de desejos com sucesso"
                )
            }
            call.respond(resposta!!)
        }
    }
    route("/lista-desejos-para-usuario") {
        post {
            val req = call.receive<ListaDesejosParaUsuarioRequest>()
            var resposta: Any? = null
            transaction {
                // 1. Verifica se o usuário solicitante existe
                val usuarioSolicitante = Usuarios.selectAll().find { it[Usuarios.id] == req.id_user_solicitante }
                if (usuarioSolicitante == null) {
                    resposta = mapOf("comunicacao" to "lista-desejos-para-usuario", "mensagem" to "id de usuário solicitante inválido")
                    return@transaction
                }
                // 2. Verifica se o usuário solicitante está logado
                if (!usuarioSolicitante[Usuarios.logado]) {
                    resposta = mapOf("comunicacao" to "lista-desejos-para-usuario", "mensagem" to "usuario solicitante nao esta logado")
                    return@transaction
                }
                // 3. Verifica se o token é válido
                val tokenEsperado = "user-${req.username}-logado"
                if (req.token != tokenEsperado) {
                    resposta = mapOf("comunicacao" to "lista-desejos-para-usuario", "mensagem" to "token de login do solicitante invalido")
                    return@transaction
                }
                // 4. Verifica se o usuário alvo existe
                val usuarioAlvoExiste = Usuarios.selectAll().any { it[Usuarios.id] == req.id_user }
                if (!usuarioAlvoExiste) {
                    resposta = mapOf("comunicacao" to "lista-desejos-para-usuario", "mensagem" to "id de usuário alvo inválido")
                    return@transaction
                }
                // 5. Busca os ids dos jogos desejados pelo usuário alvo
                val idsJogosDesejados = Desejos.selectAll().filter { it[Desejos.usuarioId] == req.id_user }.map { it[Desejos.gameId] }
                // 6. Busca os dados dos jogos desejados e monta a lista de GameDTO
                val jogosDesejados = br.com.lichia.database.Games.selectAll().filter { it[br.com.lichia.database.Games.id] in idsJogosDesejados }
                    .map {
                        GameDTO(
                            id = it[br.com.lichia.database.Games.id],
                            titulo = it[br.com.lichia.database.Games.titulo],
                            genero = it[br.com.lichia.database.Games.genero],
                            anoLancamento = it[br.com.lichia.database.Games.anoLancamento],
                            consoleLancamento = it[br.com.lichia.database.Games.consoleLancamento],
                            ehHandheld = it[br.com.lichia.database.Games.ehHandheld],
                            maxJogadores = it[br.com.lichia.database.Games.maxJogadores],
                            temOnline = it[br.com.lichia.database.Games.temOnline],
                            publisher = it[br.com.lichia.database.Games.publisher],
                            temSequencia = it[br.com.lichia.database.Games.temSequencia],
                            precoUsual = it[br.com.lichia.database.Games.precoUsual],
                            duracaoMainStoryAverage = it[br.com.lichia.database.Games.duracaoMainStoryAverage],
                            duracaoMainStoryExtras = it[br.com.lichia.database.Games.duracaoMainStoryExtras],
                            duracaoCompletionistAverage = it[br.com.lichia.database.Games.duracaoCompletionistAverage]
                        )
                    }
                resposta = jogosDesejados
            }
            call.respond(resposta!!)
        }
    }
    route("/usuario-criar-avaliacao-game") {
        post {
            val req = call.receive<UsuarioCriarAvaliacaoGameRequest>()
            transaction {
                br.com.lichia.database.Avaliacoes.insert {
                    it[usuarioId] = req.id_usuario
                    it[gameId] = req.id_jogo
                    it[nota] = req.nota
                    it[resenha] = req.resenha
                    it[visibilidade] = true // valor padrão
                    it[data] = java.time.LocalDate.now() // Salva a data atual da avaliação
                }
            }
            call.respond(
                UsuarioCriarAvaliacaoGameResponse(
                    comunicacao = "usuario-criar-avaliacao-game",
                    mensagem = "avaliação registrada com sucesso!"
                )
            )
        }
    }

}
