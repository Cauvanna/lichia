/*
* Este arquivo define os objetos Table para o banco de dados usando Exposed. Os objetos descrevem
* como as tabelas do PostgreSQL serão estruturadas e como devem se comportar.
* Estamos explicando ao Exposed como "conversar" com nosso banco de dados.
 */
package br.com.lichia.database

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.date

// As tabelas a seguir usam o Exposed para definir a estrutura do banco de dados em SQL.

object Games : IntIdTable("games") {
    // id já é criado automaticamente pelo IntIdTable
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
    // Não precisa mais definir o primaryKey manualmente
}

object Usuarios : Table("users") {
    val id = integer("id").autoIncrement()
    val nome = text("nome")
    val senha = text("senha")
    val visibilidade = bool("visibilidade").default(true)
    val dataNascimento = date("data_nascimento")
    val dataCadastro = date("data_cadastro") // Alterado para date
    val logado = bool("logado").default(false)

    override val primaryKey = PrimaryKey(id)
}

/*****************************************************************************************************
 * TABELAS RELACIONAIS
 *
 * As tabelas a seguir são usadas para relacionar os jogos com os usuários, permitindo que os usuários
 * registrem jogos, escrevam resenhas e adicionem jogos à sua lista de desejos.
 *
 *****************************************************************************************************/

// Tabela many-to-many entre Usuários e Jogos para registrar quais jogos cada usuário deseja
object Desejos : Table("desejos") {
    val usuarioId = integer("usuario_id").references(Usuarios.id)
    val gameId = integer("game_id").references(Games.id)
    override val primaryKey = PrimaryKey(usuarioId, gameId)
}

// Tabela de avaliações de jogos feitas por usuários
object Avaliacoes : IntIdTable("avaliacoes") {
    // O campo id já é criado automaticamente!
    val usuarioId = integer("usuario_id").references(Usuarios.id)
    val gameId = integer("game_id").references(Games.id)
    val nota = double("nota").nullable()
    val resenha = text("resenha").default("")
    val visibilidade = bool("visibilidade").default(true)
    val data = date("data") // Substitui o campo timestamp por data
}
