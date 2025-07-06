package br.com.lichia.dao

import br.com.lichia.database.Usuarios
import br.com.lichia.models.Usuario
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

object UsuarioDAO {
    fun getUsuarioById(id: Int): Usuario? {
        return transaction {
            Usuarios.selectAll().where { Usuarios.id eq id }
                .mapNotNull {
                    Usuario(
                        nome = it[Usuarios.nome],
                        senha = it[Usuarios.senha],
                        visibilidade = it[Usuarios.visibilidade],
                        dataNascimento = it[Usuarios.dataNascimento],
                        dataCadastro = it[Usuarios.dataCadastro], // Agora é LocalDate
                        id = it[Usuarios.id]
                    )
                }
                .singleOrNull()
        }
    }
}
