package br.com.lichia

import io.ktor.server.application.*
import br.com.lichia.plugins.*
import io.ktor.server.plugins.cors.routing.* // <-- IMPORTAR O PLUGIN CORS
import io.ktor.http.* // <-- IMPORTAR HttpMethod e HttpHeaders

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {

    // Instalando o plugin CORS aqui
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowHeader(HttpHeaders.ContentType)

        // definindo os endereços do back e do front
        allowHost("localhost:3000", schemes = listOf("http", "https"))
        allowHost("localhost:5173", schemes = listOf("http", "https"))
    }


    configureSerialization()
    configureDatabases()

    // Importa os jogos do arquivo CSV para o banco de dados
    // (*) ATENÇÃO: Como já importamos os jogos uma vez, não é necessário rodar essa linha novamente
    // se precisar recriar o banco de dados do zero a partir do videoGames.csv, descomente a linha abaixo
//    importGamesFromCSV("/home/caue/Área_de_Trabalho/BCC/5øSEMESTRE/ES/Projeto/Lichia/" +
//            "LichiaBackEnd/DataSets/ArquivoOriginalCorgis/videoGames.csv")
    configureRouting()


}
