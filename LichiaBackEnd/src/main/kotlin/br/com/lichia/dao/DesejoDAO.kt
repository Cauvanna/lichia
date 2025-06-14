/*
 * DAO = Data Access Object
 * Para manipular tabela relacional many-to-many (Usuario-Game) de Desejos
 */

package br.com.lichia.dao

import br.com.lichia.database.Desejos
import br.com.lichia.models.Game
import br.com.lichia.models.Usuario
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

object DesejoDAO {

    fun adicionarDesejo(usuario: Usuario, game: Game): Boolean {
        return transaction {
            // Verifica se já existe
            val existe = Desejos.selectAll().where {
                (Desejos.usuarioId eq usuario.id) and
                        (Desejos.gameId eq game.id)
            }.count() > 0

            if (!existe) {
                Desejos.insert {
                    it[usuarioId] = usuario.id
                    it[gameId] = game.id
                }
                true
            } else {
                false
            }
        }
    }

    fun removerDesejo(usuario: Usuario, game: Game): Boolean {
        return transaction {
            Desejos.deleteWhere {
                (Desejos.usuarioId eq usuario.id) and
                        (Desejos.gameId eq game.id)
            } > 0
        }
    }

    fun obterDesejosDoUsuario(usuario: Usuario): List<Int> {
        return transaction {
            Desejos.selectAll().where { Desejos.usuarioId eq usuario.id }
                .map { it[Desejos.gameId] }
        }
    }

    fun obterUsuariosQueDesejam(game: Game): List<Int> {
        return transaction {
            Desejos.selectAll().where { Desejos.gameId eq game.id }
                .map { it[Desejos.usuarioId] }
        }
    }
}
