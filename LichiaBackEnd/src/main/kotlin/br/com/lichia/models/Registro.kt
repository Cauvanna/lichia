package br.com.lichia.models

open class Registro(
    val usuario: Usuario,
    val game: Game,
    val nota: Int? = null, // Nota opcional de 1 a 10 (são cindo estrelas, incluindo metades)
    val jogou: Boolean = true, // Indica se o usuário jogou o jogo (true por padrão)
    val timestamp: Long = System.currentTimeMillis(), // Grava momento da criação
    var visibilidade: Boolean = true // Indica se o registro é visível para outros usuários
) {
    override fun toString(): String {
        return "Registro(usuario=${usuario.nome}, game=${game.titulo}, nota=$nota, jogou=$jogou, timestamp=$timestamp)"
    }
}

class Resenha(
    usuario: Usuario,
    game: Game,
    val comentario: String,
    nota: Int, // obrigatória para uma resenha
    timestamp: Long = System.currentTimeMillis()
) : Registro(usuario, game, nota, true, timestamp) { // Assumes the user has played the game
    override fun toString(): String {
        return "Resenha(usuario=${usuario.nome}, game=${game.titulo}, comentario='$comentario', nota=$nota, timestamp=$timestamp)"
    }
}
