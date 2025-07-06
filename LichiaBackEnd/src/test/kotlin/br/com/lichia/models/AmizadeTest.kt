package br.com.lichia.models

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class AmizadeTest {

    @Test
    fun `criarAmizade cria objeto amizade com usuarios corretos`() {
        val usuario1 = Usuario(nome = "Alice", idade = 25, senha = "senha123")
        val usuario2 = Usuario(nome = "Bob", idade = 30, senha = "senha456")
        
        val amizade = Amizade(usuario1, usuario2)
        
        assertEquals(usuario1, amizade.usuario1)
        assertEquals(usuario2, amizade.usuario2)
        assertTrue(amizade.dataInicio > 0) // Verifica se data foi configurada
    }

    @Test
    fun `toString retorna formato correto`() {
        val usuario1 = Usuario(nome = "Alice", idade = 25, senha = "senha123")
        val usuario2 = Usuario(nome = "Bob", idade = 30, senha = "senha456")
        
        val amizade = Amizade(usuario1, usuario2)
        val toStringResult = amizade.toString()
        
        assertTrue(toStringResult.contains("Alice"))
        assertTrue(toStringResult.contains("Bob"))
        assertTrue(toStringResult.contains("Amizade"))
        assertTrue(toStringResult.contains("dataInicio"))
    }

    @Test
    fun `amizade preserva timestamp de criacao`() {
        val timeBefore = System.currentTimeMillis()
        val usuario1 = Usuario(nome = "Alice", idade = 25, senha = "senha123")
        val usuario2 = Usuario(nome = "Bob", idade = 30, senha = "senha456")
        
        val amizade = Amizade(usuario1, usuario2)
        val timeAfter = System.currentTimeMillis()
        
        assertTrue(amizade.dataInicio >= timeBefore)
        assertTrue(amizade.dataInicio <= timeAfter)
    }
}