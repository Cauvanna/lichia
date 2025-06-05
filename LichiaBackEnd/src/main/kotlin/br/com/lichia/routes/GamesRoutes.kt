package br.com.lichia.routes

/*
    * GamesRoutes.kt é um arquivo que define as rotas relacionadas aos jogos no servidor Ktor.
    * Vamos começar listando os jogos para que o frontend possa obtê-los do banco de dados.
 */

import br.com.lichia.database.Games
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import br.com.lichia.dto.GameDTO

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
}
