package br.com.lichia.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            // faz o output JSON ser formatado de forma legível
            prettyPrint = true
            // Faz o parsing JSON ser mais tolerante a erros
            isLenient = true
            // Evita erros de exceção ao encontrar objetos com campos extras
            ignoreUnknownKeys = true
        })
    }
}
