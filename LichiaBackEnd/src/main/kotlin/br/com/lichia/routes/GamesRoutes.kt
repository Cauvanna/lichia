package br.com.lichia.routes

/*
    * GamesRoutes.kt é um arquivo que define as rotas relacionadas aos jogos no servidor Ktor.
    * Vamos começar listando os jogos para que o frontend possa obtê-los do banco de dados.
 */

import br.com.lichia.database.Games
import br.com.lichia.database.Usuarios
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import br.com.lichia.dto.GameDTO
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.selectAll

@Serializable
data class ListaGamesParaUsuarioRequest(
    val comunicacao: String,
    val username: String,
    val token: String
)

@Serializable
data class ListaGamesParaUsuarioErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class PaginaDeJogoRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String,
    val token: String
)

@Serializable
data class PaginaDeJogoErroResponse(
    val comunicacao: String,
    val mensagem: String
)

fun Route.gameRoutes() {
    route("/games") {
        get {
            val gameList = transaction {
                Games.selectAll().map {
                    GameDTO(
                        id = it[Games.id],
                        titulo = it[Games.titulo],
                        genero = it[Games.genero],
                        anoLancamento = it[Games.anoLancamento],
                        consoleLancamento = it[Games.consoleLancamento],
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
            call.respond(gameList)
        }
    }
    route("/lista-games-para-usuario") {
        post {
            val req = call.receive<ListaGamesParaUsuarioRequest>()
            // Checa se o token está no formato esperado
            val tokenEsperado = "user-${req.username}-logado"
            if (req.token != tokenEsperado) {
                call.respond(ListaGamesParaUsuarioErroResponse(
                    comunicacao = "lista de jogos",
                    mensagem = "token de login de usuario invalido"
                ))
                return@post
            }
            // Checa se o usuário está logado no banco
            val usuarioLogado = transaction {
                Usuarios.selectAll().where { (Usuarios.nome eq req.username) and (Usuarios.logado eq true) }.count() > 0
            }
            if (!usuarioLogado) {
                call.respond(ListaGamesParaUsuarioErroResponse(
                    comunicacao = "lista de jogos",
                    mensagem = "usuario nao esta logado"
                ))
                return@post
            }
            // Se passou pelas validações, retorna a lista de jogos igual ao /games
            val gameList = transaction {
                Games.selectAll().map {
                    GameDTO(
                        id = it[Games.id],
                        titulo = it[Games.titulo],
                        genero = it[Games.genero],
                        anoLancamento = it[Games.anoLancamento],
                        consoleLancamento = it[Games.consoleLancamento],
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
            call.respond(gameList)
        }
    }
    route("/pagina-de-jogo") {
        post {
            val req = call.receive<PaginaDeJogoRequest>()
            val tokenEsperado = "user-${req.username}-logado"
            if (req.token != tokenEsperado) {
                call.respond(PaginaDeJogoErroResponse(
                    comunicacao = "pagina-de-jogo",
                    mensagem = "token de usuario invalido"
                ))
                return@post
            }
            val usuarioLogado = transaction {
                Usuarios.selectAll().where { (Usuarios.nome eq req.username) and (Usuarios.logado eq true) }.count() > 0
            }
            if (!usuarioLogado) {
                call.respond(PaginaDeJogoErroResponse(
                    comunicacao = "pagina-de-jogo",
                    mensagem = "usuario nao esta logado"
                ))
                return@post
            }
            val gameDTO = transaction {
                Games.selectAll().where { Games.id eq req.id_jogo }.singleOrNull()?.let {
                    GameDTO(
                        id = it[Games.id],
                        titulo = it[Games.titulo],
                        genero = it[Games.genero],
                        anoLancamento = it[Games.anoLancamento],
                        consoleLancamento = it[Games.consoleLancamento],
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
            if (gameDTO == null) {
                call.respond(PaginaDeJogoErroResponse(
                    comunicacao = "pagina-de-jogo",
                    mensagem = "id_jogo nao encontrado"
                ))
                return@post
            }
            call.respond(gameDTO)
        }
    }
}
