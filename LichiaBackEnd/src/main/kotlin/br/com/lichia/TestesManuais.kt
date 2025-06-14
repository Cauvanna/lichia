package br.com.lichia
import br.com.lichia.models.Game
import br.com.lichia.models.Usuario
import java.time.LocalDate


fun main() {
    // Cria um usuário
    val usuario = Usuario(
        nome = "Gi",
        senha = "senha123",
        dataNascimento = LocalDate.of(2005, 1, 8)
    )
    println(usuario.toString())
}

