package br.com.lichia.models

open class Registro(
    val usuario: Usuario,
    val acao: String,
    val timestamp: Long = System.currentTimeMillis()
) {
    override fun toString(): String {
        return "Log(usuario=${usuario.nome}, acao='$acao', timestamp=$timestamp)"
    }
}

class Resenha(
    usuario: Usuario,
    val game: Game,
    val comentario: String,
    timestamp: Long = System.currentTimeMillis()
) : Log(usuario, "Resenha", timestamp) {
    override fun toString(): String {
        return "Resenha(usuario=${usuario.nome}, game=${game.titulo}, comentario='$comentario', timestamp=$timestamp)"
    }
}
