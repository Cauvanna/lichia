package br.com.lichia.plugins
import br.com.lichia.importer.importGamesFromCSV
//import br.com.lichia.models.PostgresTaskRepository
import io.ktor.server.application.*
//import br.com.lichia.repositories.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {

    configureSerialization()
    configureDatabases()

    // Importa os jogos do arquivo CSV para o banco de dados
    // (*) ATENÇÃO: Como já importamos os jogos uma vez, não é necessário rodar essa linha novamente
    // se precisar recriar o banco de dados do zero a partir do videoGames.csv, descomente a linha abaixo
//    importGamesFromCSV("/home/caue/Área_de_Trabalho/BCC/5øSEMESTRE/ES/Projeto/Lichia/" +
//            "LichiaBackEnd/DataSets/ArquivoOriginalCorgis/videoGames.csv")
    configureRouting()


}
