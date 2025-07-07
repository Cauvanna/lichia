/*
 * DAO = Data Access Object
 * Para obter Games do banco de dados
 */

package br.com.lichia.dao

import br.com.lichia.database.Games
import br.com.lichia.models.Game
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

object GameDAO {
    fun getGameById(id: Int): Game? {
        return transaction {
            Games.selectAll().where { Games.id eq id }
                .mapNotNull {
                    Game(
                        id = it[Games.id].value,
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
                .singleOrNull()
        }
    }
}

