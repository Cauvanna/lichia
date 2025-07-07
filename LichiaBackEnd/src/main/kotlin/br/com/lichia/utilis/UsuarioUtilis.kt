/*
    Objeto utilitário para manipulação de usuários
 */

package br.com.lichia.utilis

import br.com.lichia.dao.DesejoDAO
import br.com.lichia.dao.GameDAO
import br.com.lichia.models.Usuario
import br.com.lichia.dao.UsuarioDAO

// Obtem usuário e lista de jogos que ele deseja
object UsuarioUtilis {
    fun getUsuarioComDesejos(usuarioId: Int): Usuario? {
        val usuario = UsuarioDAO.getUsuarioById(usuarioId) ?: return null
        val gameIds = DesejoDAO.obterDesejosDoUsuario(usuario)
        val desejos = gameIds.mapNotNull { GameDAO.getGameById(it) }
        usuario.listaDesejos.addAll(desejos)
        return usuario
    }
}
