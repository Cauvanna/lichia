package br.com.lichia.models

import kotlinx.serialization.Serializable

@Serializable
data class RegistroUsuarioRequest(
    val username: String,
    val senha: String,
    val dataNascimento: String, // Vamos parsear como LocalDate no backend
    val visibilidade: Boolean
)

@Serializable
data class RegistroUsuarioResponse(
    val registrado: Boolean,
    val mensagem: String
)
