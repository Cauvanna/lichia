package br.com.lichia.routes

/*
    * GamesRoutes.kt é um arquivo que define as rotas relacionadas aos jogos no servidor Ktor.
    * Vamos começar listando os jogos para que o frontend possa obtê-los do banco de dados.
 */

import br.com.lichia.database.Games
import br.com.lichia.database.Users
import br.com.lichia.database.Reviews
import br.com.lichia.database.Wishlists
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.http.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import br.com.lichia.dto.GameDTO
import br.com.lichia.dto.UserDTO
import br.com.lichia.dto.ReviewDTO

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
    
    // Endpoint 1: /request-lista-games
    get("/request-lista-games") {
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
    
    // Endpoint 2: /request-pagina-de-game
    get("/request-pagina-de-game/{id}") {
        val gameId = call.parameters["id"]?.toIntOrNull()
        if (gameId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid game ID")
            return@get
        }
        
        val game = transaction {
            Games.selectAll().where { Games.id eq gameId }
                .singleOrNull()
                ?.let {
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
        
        if (game != null) {
            call.respond(game)
        } else {
            call.respond(HttpStatusCode.NotFound, "Game not found")
        }
    }
    
    // Endpoint 3: /request-lista-de-desejantes
    get("/request-lista-de-desejantes/{gameId}") {
        val gameId = call.parameters["gameId"]?.toIntOrNull()
        if (gameId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid game ID")
            return@get
        }
        
        val desejantes = transaction {
            (Wishlists innerJoin Users)
                .selectAll().where { Wishlists.gameId eq gameId }
                .map {
                    UserDTO(
                        id = it[Users.id],
                        nome = it[Users.nome],
                        idade = it[Users.idade],
                        visibilidade = it[Users.visibilidade],
                        dataCadastro = it[Users.dataCadastro]
                    )
                }
        }
        
        call.respond(desejantes)
    }
    
    // Endpoint 4: /request-lista-de-avaliacoes
    get("/request-lista-de-avaliacoes/{gameId}") {
        val gameId = call.parameters["gameId"]?.toIntOrNull()
        if (gameId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid game ID")
            return@get
        }
        
        val avaliacoes = transaction {
            (Reviews innerJoin Users)
                .selectAll().where { (Reviews.gameId eq gameId) and (Reviews.visibility eq true) }
                .map {
                    ReviewDTO(
                        id = it[Reviews.id],
                        gameId = it[Reviews.gameId],
                        userId = it[Reviews.userId],
                        userName = it[Users.nome],
                        rating = it[Reviews.rating],
                        comment = it[Reviews.comment],
                        timestamp = it[Reviews.timestamp],
                        visibility = it[Reviews.visibility]
                    )
                }
        }
        
        call.respond(avaliacoes)
    }
}
