package br.com.lichia.models

open class Game(
    val titulo: String,
    val genero: String,
    val anoLancamento: Int,
    var consoles: List<String> = listOf(), // Lista de consoles disponíveis
    var listaRegistros: MutableList<Registro> = mutableListOf(), // Lista de registros
    var listaResenhas: MutableList<Resenha> = mutableListOf(), // Lista de resenhas
    var listaDesejantes: MutableList<Usuario> = mutableListOf() // Lista de usuários que desejam o jogo

) {
    fun quantidadeDesejantes(): Int {
        return listaDesejantes.size // Retorna o tamanho da lista de desejantes
    }

    fun mediaNotas(): Double {
        val notasValidas = listaRegistros.mapNotNull { it.nota } // Filtra apenas notas não nulas
        return if (notasValidas.isNotEmpty()) {
            notasValidas.average() // Calcula a média apenas das notas válidas
        } else {
            0.0 // Retorna 0.0 se não houver notas válidas
        }
    }

    override fun toString(): String {
        return "Game(titulo='$titulo', genero='$genero', anoLancamento=$anoLancamento), consoles=$consoles, " +
                "quantidadeDesejos=${quantidadeDesejantes()}, mediaNotas=${mediaNotas()})"
    }
}
