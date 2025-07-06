package br.com.lichia.models

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class RegistroTest {

    @Test
    fun `criar registro com nota define propriedades corretamente`() {
        val usuario = Usuario(nome = "Alice", idade = 25, senha = "senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        
        val registro = Registro(usuario = usuario, game = game, nota = 8)
        
        assertEquals(usuario, registro.usuario)
        assertEquals(game, registro.game)
        assertEquals(8, registro.nota)
        assertTrue(registro.jogou) // Default value
        assertTrue(registro.visibilidade) // Default value
        assertTrue(registro.timestamp > 0)
    }

    @Test
    fun `criar registro sem nota funciona corretamente`() {
        val usuario = Usuario(nome = "Bob", idade = 30, senha = "senha456")
        val game = Game(titulo = "Mario", genero = "Plataforma", anoLancamento = 2021)
        
        val registro = Registro(usuario = usuario, game = game)
        
        assertEquals(usuario, registro.usuario)
        assertEquals(game, registro.game)
        assertNull(registro.nota)
        assertTrue(registro.jogou) // Default value
        assertTrue(registro.visibilidade) // Default value
    }

    @Test
    fun `toString retorna formato correto`() {
        val usuario = Usuario(nome = "Charlie", idade = 28, senha = "senha789")
        val game = Game(titulo = "Tetris", genero = "Puzzle", anoLancamento = 1984)
        
        val registro = Registro(usuario = usuario, game = game, nota = 10, jogou = false)
        val toStringResult = registro.toString()
        
        assertTrue(toStringResult.contains("Charlie"))
        assertTrue(toStringResult.contains("Tetris"))
        assertTrue(toStringResult.contains("nota=10"))
        assertTrue(toStringResult.contains("jogou=false"))
        assertTrue(toStringResult.contains("Registro"))
    }

    @Test
    fun `resenha herda de registro corretamente`() {
        val usuario = Usuario(nome = "Diana", idade = 22, senha = "senha101")
        val game = Game(titulo = "Portal", genero = "Puzzle", anoLancamento = 2007)
        
        val resenha = Resenha(usuario = usuario, game = game, comentario = "Jogo incrível!", nota = 9)
        
        // Verifica propriedades herdadas de Registro
        assertEquals(usuario, resenha.usuario)
        assertEquals(game, resenha.game)
        assertEquals(9, resenha.nota)
        assertTrue(resenha.jogou) // Assume que jogou para fazer resenha
        
        // Verifica propriedades específicas de Resenha
        assertEquals("Jogo incrível!", resenha.comentario)
    }

    @Test
    fun `resenha toString inclui comentario`() {
        val usuario = Usuario(nome = "Eve", idade = 35, senha = "senha202")
        val game = Game(titulo = "Chess", genero = "Estratégia", anoLancamento = 1475)
        
        val resenha = Resenha(usuario = usuario, game = game, comentario = "Clássico atemporal", nota = 8)
        val toStringResult = resenha.toString()
        
        assertTrue(toStringResult.contains("Eve"))
        assertTrue(toStringResult.contains("Chess"))
        assertTrue(toStringResult.contains("Clássico atemporal"))
        assertTrue(toStringResult.contains("nota=8"))
        assertTrue(toStringResult.contains("Resenha"))
    }
}