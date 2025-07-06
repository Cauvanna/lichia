
/*
* Este arquivo define os objetos Table para o banco de dados usando Exposed. Os objetos descrevem
* como as tabelas do PostgreSQL serão estruturadas e como devem se comportar.
* Estamos explicando ao Exposed como "conversar" com nosso banco de dados.
 */
package br.com.lichia.database

import org.jetbrains.exposed.sql.Table

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
    val idade = integer("idade")
    val senha = text("senha")
    val visibilidade = bool("visibilidade").default(true)
    val dataCadastro = long("data_cadastro")

    override val primaryKey = PrimaryKey(id)
}

object Registros : Table("registros") {
    val id = integer("id").autoIncrement()
    val usuarioId = integer("usuario_id").references(Users.id)
    val gameId = integer("game_id").references(Games.id)
    val nota = integer("nota").nullable()
    val jogou = bool("jogou").default(true)
    val timestamp = long("timestamp")
    val visibilidade = bool("visibilidade").default(true)

    override val primaryKey = PrimaryKey(id)
}

object Resenhas : Table("resenhas") {
    val id = integer("id").autoIncrement()
    val usuarioId = integer("usuario_id").references(Users.id)
    val gameId = integer("game_id").references(Games.id)
    val comentario = text("comentario")
    val nota = integer("nota")
    val timestamp = long("timestamp")
    val visibilidade = bool("visibilidade").default(true)

    override val primaryKey = PrimaryKey(id)
}

object ListaDesejos : Table("lista_desejos") {
    val id = integer("id").autoIncrement()
    val usuarioId = integer("usuario_id").references(Users.id)
    val gameId = integer("game_id").references(Games.id)
    val dataAdicao = long("data_adicao")

    override val primaryKey = PrimaryKey(id)
}
