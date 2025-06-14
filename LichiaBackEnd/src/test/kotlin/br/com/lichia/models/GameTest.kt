package br.com.lichia.models

import org.junit.jupiter.api.Assertions
import java.time.LocalDate
import org.junit.jupiter.api.Test

class GameTest {

    @Test
    fun testQuantidadeDesejantes() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario(
            nome = "Gi",
            senha = "senha123",
            dataNascimento = LocalDate.of(2005, 1, 8)
        )
        val usuario2 = Usuario(
            nome = "Caue",
            senha = "senha456",
            dataNascimento = LocalDate.of(1997, 11, 28)
        )

        game.listaDesejantes.add(usuario1)
        game.listaDesejantes.add(usuario2)

        Assertions.assertEquals(2, game.quantidadeDesejantes())
    }

    @Test
    fun testMediaNotas() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario(
            nome = "Gi",
            senha = "senha123",
            dataNascimento = LocalDate.of(2005, 1, 8)
        )
        val usuario2 = Usuario(
            nome = "Caue",
            senha = "senha456",
            dataNascimento = LocalDate.of(1997, 11, 28)
        )

        game.listaRegistros.add(Registro(usuario1, game, nota = 9))
        game.listaRegistros.add(Registro(usuario2, game, nota = 8))

        Assertions.assertEquals(8.5, game.mediaNotas())
    }

    @Test
    fun testMediaNotasSemNotasValidas() {
        val game = Game("The Legend of Zelda: Breath of the Wild", "Aventura", 2017)
        val usuario1 = Usuario(
            nome = "Gi",
            senha = "senha123",
            dataNascimento = LocalDate.of(2005, 1, 8)
        )
        val usuario2 = Usuario(
            nome = "Caue",
            senha = "senha456",
            dataNascimento = LocalDate.of(1997, 11, 28)
        )
        val usuario3 = Usuario(
            nome = "Naimi",
            senha = "senha789",
            dataNascimento = LocalDate.of(2003, 7, 12)
        )

        game.listaRegistros.add(Registro(usuario1, game, nota = 9))
        game.listaRegistros.add(Registro(usuario2, game, nota = 8))
        game.listaRegistros.add(Registro(usuario3, game)) // Nota nula

        Assertions.assertEquals(8.5, game.mediaNotas())
    }

}
