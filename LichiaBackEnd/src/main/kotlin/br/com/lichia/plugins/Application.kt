package br.com.lichia.plugins
import br.com.lichia.models.PostgresTaskRepository
import io.ktor.server.application.*
import br.com.lichia.repositories.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    val repository = PostgresTaskRepository()

    configureSerialization(repository)
    configureDatabases()
    configureRouting()
}
