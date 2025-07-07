package br.com.lichia.models

import java.time.LocalDate

open class Avaliacao(
    val usuario: Usuario,
    val game: Game,
    val nota: Int? = null, // Nota opcional de 1 a 10
    val data: LocalDate = LocalDate.now(), // Data da criação da avaliação
    var visibilidade: Boolean = true, // Indica se a avaliação é visível para outros usuários
    val resenha: String = "" // Texto da resenha, vazio por padrão
) {
    override fun toString(): String {
        return "Avaliacao(usuario=${usuario.nome}, game=${game.titulo}, nota=$nota, resenha='$resenha', data=$data)"
    }
}
