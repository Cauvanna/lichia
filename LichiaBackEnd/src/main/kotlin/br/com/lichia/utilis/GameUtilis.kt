/*
    Objeto utilitário para manipulação de jogos
 */

package br.com.lichia.utilis

import br.com.lichia.dao.DesejoDAO
import br.com.lichia.dao.GameDAO
import br.com.lichia.dao.UsuarioDAO
import br.com.lichia.models.Game

// Obtem jogo e lista de usuários que desejam esse jogo
object GameUtilis {
    fun getGameComDesejantes(gameId: Int): Game? {
        val game = GameDAO.getGameById(gameId) ?: return null
        val userIds = DesejoDAO.obterUsuariosQueDesejam(game)
        val desejantes = userIds.mapNotNull { UsuarioDAO.getUsuarioById(it) }
        game.listaDesejantes.addAll(desejantes)
        return game
    }
}
