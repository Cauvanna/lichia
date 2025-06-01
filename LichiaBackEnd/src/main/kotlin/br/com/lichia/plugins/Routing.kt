package br.com.lichia.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
        }
    }
    routing {
        // Rota raiz do servidor
        get("/") {
            call.respondText("Hello World!")
        }

        // Só mais um exemplo de endereço do servidor
        get("/test1") {
            val text = "<h1>Hello From Ktor</h1>"
            val type = ContentType.parse("text/html")
            call.respondText(text, type)
        }

        // Static plugin. Tente acessar `/static/index.html` para ver o Task Manager
        staticResources("/static", "static")

        /*
        * Exemplo do tutorial do Ktor "https://ktor.io/docs/server-create-a-new-project.html#configure-static-content"
        * Note que criamos uma pasta em resources chamada `mycontent` e dentro dela criamos o arquivo sample.html
        * Acesse o endereço `/content/sample.html` para ver o conteúdo do arquivo.
        */
        staticResources("/content", "mycontent")
    }
}
