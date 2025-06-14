package br.com.lichia.routes

import br.com.lichia.database.Users
import br.com.lichia.models.LoginResponse
import br.com.lichia.models.RegistroUsuarioRequest
import br.com.lichia.models.RegistroUsuarioResponse
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

fun Route.userRoutes() {
    route("/registro") {
        post {
            val request = call.receive<RegistroUsuarioRequest>()

            // Checamos se usuário com mesmo nome já existe
            val userExists = transaction {
                Users.selectAll().any { it[Users.nome] == request.username }
            }
            if (userExists) {
                call.respond(RegistroUsuarioResponse(
                    registrado = false,
                    mensagem = "Usuário já existe. Por favor, escolha outro nome de usuário.")
                )
                return@post
            }

            transaction {
                Users.insert {
                    it[nome] = request.username
                    it[senha] = request.senha
                    it[dataNascimento] = LocalDate.parse(request.dataNascimento)
                    it[visibilidade] = request.visibilidade
                    it[dataCadastro] = System.currentTimeMillis()
                }
            }

            // Se tudo deu certo, enviamos mensagem de sucesso
            call.respond(RegistroUsuarioResponse(
                registrado = true,
                mensagem = "Usuario registrado com sucesso!")
            )
        }
    }
}


