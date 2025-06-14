
/*
* Este arquivo define os objetos Table para o banco de dados usando Exposed. Os objetos descrevem
* como as tabelas do PostgreSQL serão estruturadas e como devem se comportar.
* Estamos explicando ao Exposed como "conversar" com nosso banco de dados.
 */
package br.com.lichia.database

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date


object Games : Table("games") {
    val id = integer("id").autoIncrement()
    val titulo = text("titulo")
    val genero = text("genero").nullable()
    val anoLancamento = integer("ano_lancamento")
    val consoleLancamento = text("console_lancamento").nullable() // store as comma-separated string for now
    val ehHandheld = bool("eh_handheld")
    val maxJogadores = integer("max_jogadores")
    val temOnline = bool("tem_online")
    val publisher = text("publisher")
    val temSequencia = bool("tem_sequencia")
    val precoUsual = double("preco_usual")
    val duracaoMainStoryAverage = double("duracao_main_story_avg")
    val duracaoMainStoryExtras = double("duracao_main_story_extras_avg")
    val duracaoCompletionistAverage = double("duracao_completionist_avg")

    override val primaryKey = PrimaryKey(id)
}

object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val nome = text("nome")
    val senha = text("senha")
    val visibilidade = bool("visibilidade").default(true)
    val dataNascimento = date("data_nascimento")
    val dataCadastro = long("data_cadastro")

    override val primaryKey = PrimaryKey(id)
}
