package br.com.lichia.models

import br.com.lichia.dao.DesejoDAO
import br.com.lichia.dao.UsuarioDAO

open class Game(
    val titulo: String,
    val genero: String?,
    val anoLancamento: Int,
    // Mudamos de lista de consoles para apenas console de lançamento, pois infelizmente não temos dados suficientes
    val consoleLancamento: String? = "",
    var listaAvaliacoes: MutableList<Avaliacao> = mutableListOf(), // Lista unificada de avaliações
    @Transient // Evita serialização desse campo, para não ser persistido no banco de dados
    var listaDesejantes: MutableList<Usuario> = mutableListOf(), // Lista de usuários que desejam o jogo
    // Mais alguns atributos adicionados para obter os dados desejados do .csv base do CORGIS
    val ehHandheld: Boolean = false,
    val maxJogadores: Int = 1,
    val temOnline: Boolean = false,
    val publisher: String = "",
    // podemos usar o fato de o jogo ter uma sequência para recomendar melhor para alguém que jogou o primeiro
    // (*) Pensar melhor nisso depois
    val temSequencia: Boolean = false,
    val precoUsual: Double = 0.0,
    val duracaoMainStoryAverage: Double = 0.0,
    val duracaoMainStoryExtras: Double = 0.0,
    val duracaoCompletionistAverage: Double = 0.0,
    val id: Int = -1, // ID único do jogo

) {
    // Atualizada para estar em sincronia com a DB
    fun quantidadeDesejantes(): Int {
        return DesejoDAO.obterUsuariosQueDesejam(this).size
    }

    // Recebe uma lista com os IDs dos usuários que desejam o jogo
    fun carregarDesejantesDoBanco() {
        val userIds = DesejoDAO.obterUsuariosQueDesejam(this)
        this.listaDesejantes = userIds.mapNotNull { id -> UsuarioDAO.getUsuarioById(id) }.toMutableList()
    }

    fun mediaNotas(): Double {
        val notasValidas = listaAvaliacoes.mapNotNull { it.nota } // Filtra apenas notas não nulas
        return if (notasValidas.isNotEmpty()) {
            notasValidas.average() // Calcula a média apenas das notas válidas
        } else {
            0.0 // Retorna 0.0 se não houver notas válidas
        }
    }

    override fun toString(): String {
        return "Game(titulo='$titulo', genero='$genero', anoLancamento=$anoLancamento), consoles=$consoleLancamento, " +
                "quantidadeDesejos=${quantidadeDesejantes()}, mediaNotas=${mediaNotas()})"
    }
}
