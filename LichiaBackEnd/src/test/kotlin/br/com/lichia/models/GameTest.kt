package br.com.lichia.models

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class GameTest {

    @Test
    fun testQuantidadeDesejantes() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario("Alice", 25, "senha123")
        val usuario2 = Usuario("Bob", 30, "senha456")

        game.listaDesejantes.add(usuario1)
        game.listaDesejantes.add(usuario2)

        Assertions.assertEquals(2, game.quantidadeDesejantes())
    }

    @Test
    fun testMediaNotas() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario("Alice", 25, "senha123")
        val usuario2 = Usuario("Bob", 30, "senha456")

        game.listaRegistros.add(Registro(usuario1, game, nota = 9))
        game.listaRegistros.add(Registro(usuario2, game, nota = 8))

        Assertions.assertEquals(8.5, game.mediaNotas())
    }

    @Test
    fun testMediaNotasSemNotasValidas() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario("Caue", 25, "senha123")
        val usuario2 = Usuario("Gi", 30, "senha456")
        val usuario3 = Usuario("Naimi", 28, "senha789")


        game.listaRegistros.add(Registro(usuario1, game, nota = 9))
        game.listaRegistros.add(Registro(usuario2, game, nota = 8))
        game.listaRegistros.add(Registro(usuario3, game)) // Nota nula

        Assertions.assertEquals(8.5, game.mediaNotas())
    }

    @Test
    fun testMediaNotasComListaVazia() {
        val game = Game("Jogo Sem Registros", "Aventura", 2023)
        
        Assertions.assertEquals(0.0, game.mediaNotas())
    }

    @Test
    fun testMediaNotasComApenasNotasNulas() {
        val game = Game("Jogo Só com Nulos", "Puzzle", 2020)
        val usuario1 = Usuario("Alice", 25, "senha123")
        val usuario2 = Usuario("Bob", 30, "senha456")
        
        game.listaRegistros.add(Registro(usuario1, game)) // Sem nota
        game.listaRegistros.add(Registro(usuario2, game)) // Sem nota
        
        Assertions.assertEquals(0.0, game.mediaNotas())
    }

    @Test
    fun testQuantidadeDesejantesComListaVazia() {
        val game = Game("Jogo Não Desejado", "Horror", 2019)
        
        Assertions.assertEquals(0, game.quantidadeDesejantes())
    }

    @Test
    fun testToStringContemInformacoesCorretas() {
        val game = Game("Super Mario Bros", "Plataforma", 1985, "NES")
        val usuario = Usuario("Mario", 35, "senha123")
        
        game.listaDesejantes.add(usuario)
        game.listaRegistros.add(Registro(usuario, game, nota = 10))
        
        val resultado = game.toString()
        
        Assertions.assertTrue(resultado.contains("Super Mario Bros"))
        Assertions.assertTrue(resultado.contains("Plataforma"))
        Assertions.assertTrue(resultado.contains("1985"))
        Assertions.assertTrue(resultado.contains("NES"))
        Assertions.assertTrue(resultado.contains("quantidadeDesejos=1"))
        Assertions.assertTrue(resultado.contains("mediaNotas=10.0"))
    }

}
