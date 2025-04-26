package br.com.lichia.models
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class GameTest {

    @Test
    fun testQuantidadeDesejantes() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario("Alice", 25, "senha123")
        val usuario2 = Usuario("Bob", 30, "senha456")

        game.listaDesejantes.add(usuario1)
        game.listaDesejantes.add(usuario2)

        assertEquals(2, game.quantidadeDesejantes())
    }

    @Test
    fun testMediaNotas() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario("Alice", 25, "senha123")
        val usuario2 = Usuario("Bob", 30, "senha456")

        game.listaRegistros.add(Registro(usuario1, game, nota = 9))
        game.listaRegistros.add(Registro(usuario2, game, nota = 8))

        assertEquals(8.5, game.mediaNotas())
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

        assertEquals(8.5, game.mediaNotas())
    }

}
