package br.com.lichia.dto

import kotlinx.serialization.Serializable

@Serializable
data class UserDTO(
    val id: Int,
    val nome: String,
    val idade: Int,
    val visibilidade: Boolean,
    val dataCadastro: Long
)