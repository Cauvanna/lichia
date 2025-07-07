package br.com.lichia.plugins

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SchemaUtils
import br.com.lichia.database.Games
import br.com.lichia.database.Usuarios
import br.com.lichia.database.Desejos

fun Application.configureDatabases() {
    val config = environment.config.config("ktor.database")
    val url = config.property("url").getString()
    val driver = config.property("driver").getString()
    val user = config.property("user").getString()
    val password = config.property("password").getString()

    // Configura o Exposed para se conectar ao banco de dados PostgreSQL
    Database.connect(url, driver, user, password)

    transaction {
        // Inicializa/cria tabelas no banco de dados do PostgreSQL. Note que usa as classes
        // do banco de dados (db) e não as que definimos no modelo (models). Usamos nomes
        // em inglês para diferenciar as tabelas do banco de dados das classes do modelo.
        // As tabelas são criadas apenas se não existirem, evitando erros de duplicação.
        SchemaUtils.create(Games, Usuarios, Desejos)
    }
}



