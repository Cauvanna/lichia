package br.com.lichia.models

open class Amizade(
    val usuario1: Usuario,
    val usuario2: Usuario,
    val dataInicio: Long = System.currentTimeMillis()
) {
    override fun toString(): String {
        return "Amizade(usuario1=${usuario1.nome}, usuario2=${usuario2.nome}, dataInicio=$dataInicio)"
    }

//    fun getDataInicio(): Long {
//        return dataInicio
//    }
}
