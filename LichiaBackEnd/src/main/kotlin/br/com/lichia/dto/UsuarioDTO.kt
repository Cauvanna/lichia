package br.com.lichia.dto

/*
 * DTO = Data Transfer Object
 * Essa arquivo define classes dedicadas a transferir dados de usuários entre o servidor e o cliente.
 */
import kotlinx.serialization.Serializable

@Serializable
data class UsuarioDTO(
    val id: Int,
    val nome: String,
    val idade: Int,
    val visibilidade: Boolean,
    val dataCadastro: Long
)

@Serializable
data class UsuarioRegistroRequest(
    val nome: String,
    val idade: Int,
    val senha: String,
    val visibilidade: Boolean = true
)

@Serializable
data class UsuarioLoginRequest(
    val nome: String,
    val senha: String
)

@Serializable
data class UsuarioLoginResponse(
    val sucesso: Boolean,
    val mensagem: String,
    val usuario: UsuarioDTO?
)

@Serializable
data class UsuarioRegistroResponse(
    val registrado: Boolean,
    val mensagem: String,
    val usuario: UsuarioDTO?
)

@Serializable
data class DesejoRequest(
    val gameId: Int,
    val usuarioId: Int
)

@Serializable
data class AvaliacaoRequest(
    val gameId: Int,
    val usuarioId: Int,
    val nota: Int,
    val comentario: String?
)

@Serializable
data class AvaliacaoDTO(
    val id: Int,
    val gameId: Int,
    val usuarioId: Int,
    val nota: Int,
    val comentario: String?,
    val dataAvaliacao: Long
)

@Serializable
data class ResponseMessage(
    val sucesso: Boolean,
    val mensagem: String
)