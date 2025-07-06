package br.com.lichia.dto

import kotlinx.serialization.Serializable

@Serializable
data class ReviewDTO(
    val id: Int,
    val gameId: Int,
    val userId: Int,
    val userName: String,
    val rating: Int,
    val comment: String,
    val timestamp: Long,
    val visibility: Boolean
)