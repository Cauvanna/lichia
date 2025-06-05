/*
 * Este é o arquivo que importa jogos de do videoGames.csv para o nosso banco de dados
 */

package br.com.lichia.importer

import br.com.lichia.database.Games
import com.github.doyaaaaaken.kotlincsv.dsl.csvReader
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

fun importGamesFromCSV(filePath: String) {
    val rows = csvReader().readAllWithHeader(File(filePath))

    for (row in rows) {
        try {
            val titulo = row["Title"] ?: continue
            val genero = row["Metadata.Genres"] ?: "Desconhecido"
            val anoLancamento = row["Release.Year"]?.toIntOrNull() ?: 0
            val consoleLancamento = row["Release.Console"] ?: ""
            val ehHandheld = row["Features.Handheld?"]?.lowercase()?.toBooleanStrictOrNull() ?: false
            val maxJogadores = row["Features.Max Players"]?.toIntOrNull() ?: 1
            val temOnline = row["Features.Online?"]?.lowercase()?.toBooleanStrictOrNull() ?: false
            val publisher = row["Metadata.Publishers"] ?: ""
            val temSequencia = row["Metadata.Sequel?"]?.lowercase()?.toBooleanStrictOrNull() ?: false
            val precoUsual = row["Metrics.Used Price"]?.toDoubleOrNull() ?: 0.0
            val duracaoMain = row["Length.Main Story.Average"]?.toDoubleOrNull() ?: 0.0
            val duracaoMainExtras = row["Length.Main + Extras.Average"]?.toDoubleOrNull() ?: 0.0
            val duracaoCompleto = row["Length.Completionists.Average"]?.toDoubleOrNull() ?: 0.0

            transaction {
                Games.insert {
                    it[Games.titulo] = titulo
                    it[Games.genero] = genero
                    it[Games.anoLancamento] = anoLancamento
                    it[Games.consoleLancamento] = consoleLancamento // comma-separated string
                    it[Games.ehHandheld] = ehHandheld
                    it[Games.maxJogadores] = maxJogadores
                    it[Games.temOnline] = temOnline
                    it[Games.publisher] = publisher
                    it[Games.temSequencia] = temSequencia
                    it[Games.precoUsual] = precoUsual
                    it[Games.duracaoMainStoryAverage] = duracaoMain
                    it[Games.duracaoMainStoryExtras] = duracaoMainExtras
                    it[Games.duracaoCompletionistAverage] = duracaoCompleto
                }
            }
        } catch (e: Exception) {
            println("Erro ao importar jogo: ${row["Title"]}. Erro: ${e.message}")
        }
    }

    println("Importação concluída.")
}
