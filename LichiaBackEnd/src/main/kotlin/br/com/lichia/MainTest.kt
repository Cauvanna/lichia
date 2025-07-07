package br.com.lichia
import br.com.lichia.models.Usuario
import java.time.LocalDate


fun main() {
    // Cria um usuário
    val usuario = Usuario(
        nome = "Gi",
        senha = "senha123",
        dataNascimento = LocalDate.of(2005, 1, 8)
    )

    // Imprime em String os dados básico de usuario
    println(usuario.toString())

    // stdout: Usuario(nome='Gi', visibilidade='true, dataNascimento=2005-01-08)
}

//(***) Continuar daqui: Fazer testes manuais para alterações envolvendo a adiação da tabela Desejos

