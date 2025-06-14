package br.com.lichia.routes

import br.com.lichia.database.Usuarios
import br.com.lichia.models.LoginRequest
import br.com.lichia.models.LoginResponse
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

fun Route.loginRoute() {
    post("/login") {
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
