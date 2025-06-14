package br.com.lichia.models

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(val username: String, val senha: String)

@Serializable
data class LoginResponse(val successo: Boolean, val token: String? = null, val mensagem: String? = null)
