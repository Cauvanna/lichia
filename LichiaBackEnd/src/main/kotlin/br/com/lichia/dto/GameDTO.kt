/*
 * DTO = Data Transfer Object
 * Essa arquivo define uma classe dedicada a transferir dados de jogos entre o servidor e o cliente.
 */

package br.com.lichia.dto
import kotlinx.serialization.Serializable

@Serializable
data class GameDTO(
    val id: Int,
    val titulo: String,
    val genero: String?,
    val anoLancamento: Int,
    val consoleLancamento: String?,
    val ehHandheld: Boolean,
    val maxJogadores: Int,
    val temOnline: Boolean,
    val publisher: String,
    val temSequencia: Boolean,
    val precoUsual: Double,
    val duracaoMainStoryAverage: Double,
    val duracaoMainStoryExtras: Double,
    val duracaoCompletionistAverage: Double
)
