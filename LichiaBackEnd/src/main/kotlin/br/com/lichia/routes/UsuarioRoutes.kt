package br.com.lichia.routes

import br.com.lichia.database.Usuarios
import br.com.lichia.models.LoginRequest
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
                Usuarios.selectAll().any { it[Usuarios.nome] == request.username }
            }
            if (userExists) {
                call.respond(RegistroUsuarioResponse(
                    registrado = false,
                    mensagem = "Usuário já existe. Por favor, escolha outro nome de usuário.")
                )
                return@post
            }

            transaction {
                Usuarios.insert {
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

    // Rota para endpoint de login de usuários
    route("/login") {
        post {
            val loginData = call.receive<LoginRequest>()

            val userExists = transaction {
                Usuarios.selectAll().where { (Usuarios.nome eq loginData.username) and (Usuarios.senha eq loginData.senha) }.count() > 0
            }

            if (userExists) {
                val token = "usuario-${loginData.username}-logado"
                call.respond(LoginResponse(successo = true, token = token))
            } else {
                call.respond(LoginResponse(successo = false, mensagem = "Usuário ou senha incorretos."))
            }
        }
    }
}
