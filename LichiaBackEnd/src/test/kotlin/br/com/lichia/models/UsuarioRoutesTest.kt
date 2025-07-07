package br.com.lichia.models


import br.com.lichia.database.Desejos
import br.com.lichia.database.Games
import com.typesafe.config.ConfigFactory
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.*
import io.ktor.server.config.HoconApplicationConfig
import io.ktor.server.testing.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.jetbrains.exposed.sql.transactions.transaction
import br.com.lichia.database.Usuarios
import io.ktor.client.request.get
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.*

// FUNÇÕES UTILITÁRIAS


// TESTES
class UsuarioRoutesTest {
    private val testConfig = HoconApplicationConfig(ConfigFactory.load("test.conf"))

    @Test
    fun `registro bem sucedido de um usuario novo`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTeste1"
        try {
            val response = client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "senha12345",
                      "dataNascimento": "2000-01-01",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Resposta recebida: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("\"registrado\": true"))
            assertTrue(body.contains("Usuario registrado com sucesso!"))

        }
        // finally é rodado sempre, mesmo que o teste em try falhe
        finally {
            // Remove o usuário criado após o teste
            transaction {
                Usuarios.deleteWhere { Usuarios.nome eq username }
            }
        }
    }

    @Test
    fun `registro falha por username duplicado`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioDuplicado"
        try {
            // Primeiro registro
            val response1 = client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "senha12345",
                      "dataNascimento": "1995-05-05",
                      "visibilidade": false
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, response1.status)
            // Tentativa duplicada
            val response2 = client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "diferente123",
                      "dataNascimento": "1998-08-08",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            val body2 = response2.bodyAsText()
            println("Resposta duplicada: $body2")
            assertEquals(HttpStatusCode.OK, response2.status)
            assertTrue(body2.contains("\"registrado\": false"))
            assertTrue(body2.contains("Usuario com mesmo nome ja registrado"))
        } finally {
            // Remove o usuário criado após o teste
            transaction {
                Usuarios.deleteWhere { Usuarios.nome eq username }
            }
        }
    }

    @Test
    fun `registro falha por username menor que 5 caracteres`() = testApplication {
        environment { config = testConfig }
        val username = "abc"
        val response = client.post("/registro") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "registro-usuario",
                  "username": "$username",
                  "senha": "senha12345",
                  "dataNascimento": "2000-01-01",
                  "visibilidade": true
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Resposta username curto: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"registrado\": false"))
        assertTrue(body.contains("O nome de usuário deve ter pelo menos 5 caracteres."))
    }

    @Test
    fun `registro falha por senha menor que 5 caracteres`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioValido"
        val response = client.post("/registro") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "registro-usuario",
                  "username": "$username",
                  "senha": "123",
                  "dataNascimento": "2000-01-01",
                  "visibilidade": true
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Resposta senha curta: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"registrado\": false"))
        assertTrue(body.contains("A senha deve ter pelo menos 5 caracteres."))
    }

    @Test
    fun `login bem sucedido retorna autenticado true`() = testApplication {
        environment { config = testConfig }
        val username = "loginuser1"
        val senha = "senha12345"
        // Cria usuário para o teste
        client.post("/registro") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "registro-usuario",
                  "username": "$username",
                  "senha": "$senha",
                  "dataNascimento": "2000-01-01",
                  "visibilidade": true
                }
                """.trimIndent()
            )
        }
        // Testa login
        val response = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "login",
                  "username": "$username",
                  "senha": "$senha"
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Login sucesso: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"autenticado\": true"))
        // Remove usuário criado
        transaction {
            Usuarios.deleteWhere { Usuarios.nome eq username }
        }
    }

    @Test
    fun `login falha usuario inexistente`() = testApplication {
        environment { config = testConfig }
        val response = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "login",
                  "username": "usuarioInexistente",
                  "senha": "qualquerSenha"
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Login usuario inexistente: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"autenticado\": false"))
        assertTrue(body.contains("Usuário ou senha incorretos."))
    }

    @Test
    fun `login falha senha incorreta`() = testApplication {
        environment { config = testConfig }
        val username = "loginuser2"
        val senha = "senhaCorreta"
        // Cria usuário para o teste
        client.post("/registro") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "registro-usuario",
                  "username": "$username",
                  "senha": "$senha",
                  "dataNascimento": "2000-01-01",
                  "visibilidade": true
                }
                """.trimIndent()
            )
        }
        // Testa login com senha errada
        val response = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "login",
                  "username": "$username",
                  "senha": "senhaErrada"
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Login senha incorreta: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"autenticado\": false"))
        assertTrue(body.contains("Usuário ou senha incorretos."))
        // Remove usuário criado
        transaction {
            Usuarios.deleteWhere { Usuarios.nome eq username }
        }
    }

    @Test
    fun `login falha campos vazios`() = testApplication {
        environment { config = testConfig }
        val response = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                  "comunicacao": "login",
                  "username": "",
                  "senha": ""
                }
                """.trimIndent()
            )
        }
        val body = response.bodyAsText()
        println("Login campos vazios: $body")
        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(body.contains("\"autenticado\": false"))
        assertTrue(body.contains("Usuário ou senha incorretos."))
    }

    @Test
    fun `logout bem sucedido`() = testApplication {
        environment { config = testConfig }
        val username = "logoutuser1"
        val senha = "senhaLogout1"
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "2000-01-01",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            // Faz login
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            // Faz logout
            val response = client.post("/logout") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "logout",
                      "username": "$username",
                      "token": "user-$username-logado"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Logout sucesso: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("\"autenticado\": true"))
            assertTrue(body.contains("logout realizado"))
        } finally {
            // Remove usuário criado
            transaction {
                Usuarios.deleteWhere { Usuarios.nome eq username }
            }
        }
    }

    @Test
    fun `logout falha por token incorreto`() = testApplication {
        environment { config = testConfig }
        val username = "logoutuser2"
        val senha = "senhaLogout2"
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "2000-01-01",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            // Faz login
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            // Faz logout com token incorreto
            val response = client.post("/logout") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "logout",
                      "username": "$username",
                      "token": "token-incorreto"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Logout token incorreto: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("logout falhou. Token de login incorreto"))
        } finally {
            // Remove usuário criado
            transaction {
                Usuarios.deleteWhere { Usuarios.nome eq username }
            }
        }
    }

    @Test
    fun `lista de usuarios contem os usuarios registrados recentemente`() = testApplication {
        environment { config = testConfig }
        val usuarios = listOf(
            Triple("usuarioTesteA", "senhaA123", "2001-01-01"),
            Triple("usuarioTesteB", "senhaB123", "2002-02-02"),
            Triple("usuarioTesteC", "senhaC123", "2003-03-03")
        )
        try {
            // 1. Registra os 3 usuários
            usuarios.forEach { (username, senha, dataNascimento) ->
                client.post("/registro") {
                    contentType(ContentType.Application.Json)
                    setBody(
                        """
                        {
                          "comunicacao": "registro-usuario",
                          "username": "$username",
                          "senha": "$senha",
                          "dataNascimento": "$dataNascimento",
                          "visibilidade": true
                        }
                        """.trimIndent()
                    )
                }
            }
            // 2. Obtém a lista de usuários
            val response = client.get("/request-publico-lista-usuarios")
            val body = response.bodyAsText()
            println("Lista de usuários: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            // 3. Confere se os 3 usuários estão na lista
            usuarios.forEach { (username, _, _) ->
                assertTrue(body.contains(username), "Usuário $username não encontrado na lista.")
            }
        } finally {
            // 4. Deleta os 3 usuários criados
            transaction {
                usuarios.forEach { (username, _, _) ->
                    Usuarios.deleteWhere { Usuarios.nome eq username }
                }
            }
        }
    }

    @Test
    fun `adiciona desejo com sucesso`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTesteDesejo"
        val senha = "senhaTesteDesejo"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoTesteDesejo"
        var idUsuario: Int? = null
        var idJogo: Int? = null

        try {
            // 1. Registra um usuário novo para o teste
            val registroResponse = client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, registroResponse.status)
            assertTrue(registroResponse.bodyAsText().contains("\"registrado\": true"))

            // Busca o id do usuário criado
            idUsuario = transaction {
                Usuarios.selectAll()
                    .firstOrNull { it[Usuarios.nome] == username }
                    ?.get(Usuarios.id)
            }
            assertNotNull(idUsuario, "Usuário não foi criado corretamente")

            // 2. Faz login com este usuário
            val loginResponse = client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, loginResponse.status)
            val token = "user-$username-logado"

            // 3. Garante que existe um game para adicionar à lista de desejos
            idJogo = transaction {
                // Tenta encontrar um jogo de teste, senão cria um novo
                val jogoExistente = Games.selectAll()
                    .firstOrNull { it[Games.titulo] == tituloJogo }
                if (jogoExistente != null) {
                    jogoExistente[Games.id].value
                } else {
                    Games.insertAndGetId {
                        it[titulo] = tituloJogo
                        it[genero] = "Aventura"
                        it[anoLancamento] = 2020
                        it[consoleLancamento] = "PC"
                        it[ehHandheld] = false
                        it[maxJogadores] = 1
                        it[temOnline] = false
                        it[publisher] = "EditoraTeste"
                        it[temSequencia] = false
                        it[precoUsual] = 99.99
                        it[duracaoMainStoryAverage] = 10.0
                        it[duracaoMainStoryExtras] = 15.0
                        it[duracaoCompletionistAverage] = 20.0
                    }.value
                }
            }
            assertNotNull(idJogo, "Jogo de teste não foi criado/encontrado")

            // 4. Adiciona o game à lista de desejos do usuário
            val adicionarDesejoResponse = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "$token",
                      "id_jogo": $idJogo
                    }
                    """.trimIndent()
                )
            }
            val body = adicionarDesejoResponse.bodyAsText()
            println("Resposta adicionar desejo: $body")
            assertEquals(HttpStatusCode.OK, adicionarDesejoResponse.status)
            assertTrue(body.contains("jogo adicionado à lista de desejos com sucesso"))

        } finally {
            // 5. Limpa o banco: remove desejo, usuário e jogo de teste
            transaction {
                if (idUsuario != null && idJogo != null) {
                    Desejos.deleteWhere {
                        (Desejos.usuarioId eq idUsuario!!) and
                        (Desejos.gameId eq idJogo!!)
                    }
                }
                if (idUsuario != null) {
                    Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                }
                if (idJogo != null) {
                    Games.deleteWhere { Games.id eq idJogo!! }
                }
            }
        }
    }

    @Test
    fun `adiciona desejo falha por token invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTesteTokenInvalido"
        val senha = "senhaTokenInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoTesteTokenInvalido"
        var idUsuario: Int? = null
        var idJogo: Int? = null

        try {
            // 1. Registra um usuário novo para o teste
            val registroResponse = client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, registroResponse.status)
            assertTrue(registroResponse.bodyAsText().contains("\"registrado\": true"))

            // Busca o id do usuário criado
            idUsuario = transaction {
                Usuarios.selectAll()
                    .firstOrNull { it[Usuarios.nome] == username }
                    ?.get(Usuarios.id)
            }
            assertNotNull(idUsuario, "Usuário não foi criado corretamente")

            // 2. Faz login com este usuário (mas não usaremos o token correto)
            val loginResponse = client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, loginResponse.status)
            // Token inválido propositalmente
            val tokenInvalido = "token-invalido"

            // 3. Garante que existe um game para adicionar à lista de desejos
            idJogo = transaction {
                val jogoExistente = Games.selectAll()
                    .firstOrNull { it[Games.titulo] == tituloJogo }
                if (jogoExistente != null) {
                    jogoExistente[Games.id].value
                } else {
                    Games.insertAndGetId {
                        it[titulo] = tituloJogo
                        it[genero] = "Aventura"
                        it[anoLancamento] = 2020
                        it[consoleLancamento] = "PC"
                        it[ehHandheld] = false
                        it[maxJogadores] = 1
                        it[temOnline] = false
                        it[publisher] = "EditoraTeste"
                        it[temSequencia] = false
                        it[precoUsual] = 99.99
                        it[duracaoMainStoryAverage] = 10.0
                        it[duracaoMainStoryExtras] = 15.0
                        it[duracaoCompletionistAverage] = 20.0
                    }.value
                }
            }
            assertNotNull(idJogo, "Jogo de teste não foi criado/encontrado")

            // 4. Tenta adicionar o game à lista de desejos do usuário com token inválido
            val adicionarDesejoResponse = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "$tokenInvalido",
                      "id_jogo": $idJogo
                    }
                    """.trimIndent()
                )
            }
            val body = adicionarDesejoResponse.bodyAsText()
            println("Resposta adicionar desejo (token inválido): $body")
            assertEquals(HttpStatusCode.OK, adicionarDesejoResponse.status)
            assertTrue(body.contains("token de login invalido"))

        } finally {
            // 5. Limpa o banco: remove desejo (se criado), usuário e jogo de teste
            transaction {
                if (idUsuario != null && idJogo != null) {
                    Desejos.deleteWhere {
                        (Desejos.usuarioId eq idUsuario!!) and
                        (Desejos.gameId eq idJogo!!)
                    }
                }
                if (idUsuario != null) {
                    Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                }
                if (idJogo != null) {
                    Games.deleteWhere { Games.id eq idJogo!! }
                }
            }
        }
    }

    @Test
    fun `adiciona desejo falha por id_usuario invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTesteIdInvalido"
        val senha = "senhaIdInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoTesteIdInvalido"
        var idJogo: Int? = null
        try {
            // Cria um game para o teste
            idJogo = transaction {
                val jogoExistente = Games.selectAll().firstOrNull { it[Games.titulo] == tituloJogo }
                if (jogoExistente != null) {
                    jogoExistente[Games.id].value
                } else {
                    Games.insertAndGetId {
                        it[titulo] = tituloJogo
                        it[genero] = "Aventura"
                        it[anoLancamento] = 2020
                        it[consoleLancamento] = "PC"
                        it[ehHandheld] = false
                        it[maxJogadores] = 1
                        it[temOnline] = false
                        it[publisher] = "EditoraTeste"
                        it[temSequencia] = false
                        it[precoUsual] = 99.99
                        it[duracaoMainStoryAverage] = 10.0
                        it[duracaoMainStoryExtras] = 15.0
                        it[duracaoCompletionistAverage] = 20.0
                    }.value
                }
            }
            assertNotNull(idJogo, "Jogo de teste não foi criado/encontrado")
            // Usa um id de usuário que não existe (por exemplo, 999999)
            val response = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": 999999,
                      "token": "user-$username-logado",
                      "id_jogo": $idJogo
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Resposta adicionar desejo (id_usuario inválido): $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de usuário inválido"))
        } finally {
            transaction {
                if (idJogo != null) {
                    Games.deleteWhere { Games.id eq idJogo!! }
                }
            }
        }
    }

    @Test
    fun `adiciona desejo falha por id_jogo invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTesteJogoInvalido"
        val senha = "senhaJogoInvalido"
        val dataNascimento = "2000-01-01"
        var idUsuario: Int? = null
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            idUsuario = transaction {
                Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id)
            }
            assertNotNull(idUsuario, "Usuário não foi criado corretamente")
            // Faz login
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            // Usa um id de jogo que não existe (por exemplo, 999999)
            val response = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado",
                      "id_jogo": 999999
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Resposta adicionar desejo (id_jogo inválido): $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de jogo inválido"))
        } finally {
            transaction {
                if (idUsuario != null) {
                    Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                }
            }
        }
    }

    @Test
    fun `adiciona desejo falha por jogo ja na lista`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioTesteDesejoDuplicado"
        val senha = "senhaDesejoDuplicado"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoTesteDesejoDuplicado"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            idUsuario = transaction {
                Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id)
            }
            assertNotNull(idUsuario, "Usuário não foi criado corretamente")
            // Faz login
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            // Cria ou encontra um game
            idJogo = transaction {
                val jogoExistente = Games.selectAll().firstOrNull { it[Games.titulo] == tituloJogo }
                if (jogoExistente != null) {
                    jogoExistente[Games.id].value
                } else {
                    Games.insertAndGetId {
                        it[titulo] = tituloJogo
                        it[genero] = "Aventura"
                        it[anoLancamento] = 2020
                        it[consoleLancamento] = "PC"
                        it[ehHandheld] = false
                        it[maxJogadores] = 1
                        it[temOnline] = false
                        it[publisher] = "EditoraTeste"
                        it[temSequencia] = false
                        it[precoUsual] = 99.99
                        it[duracaoMainStoryAverage] = 10.0
                        it[duracaoMainStoryExtras] = 15.0
                        it[duracaoCompletionistAverage] = 20.0
                    }.value
                }
            }
            assertNotNull(idJogo, "Jogo de teste não foi criado/encontrado")
            // Adiciona o desejo pela primeira vez
            val response1 = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado",
                      "id_jogo": $idJogo
                    }
                    """.trimIndent()
                )
            }
            assertEquals(HttpStatusCode.OK, response1.status)
            assertTrue(response1.bodyAsText().contains("jogo adicionado à lista de desejos com sucesso"))
            // Tenta adicionar o mesmo desejo novamente
            val response2 = client.post("/request-adicionar-desejo") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-adicionar-desejo",
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado",
                      "id_jogo": $idJogo
                    }
                    """.trimIndent()
                )
            }
            val body2 = response2.bodyAsText()
            println("Resposta adicionar desejo (duplicado): $body2")
            assertEquals(HttpStatusCode.OK, response2.status)
            assertTrue(body2.contains("jogo já está na lista de desejos do usuário"))
        } finally {
            transaction {
                if (idUsuario != null && idJogo != null) {
                    Desejos.deleteWhere {
                        (Desejos.usuarioId eq idUsuario!!) and
                        (Desejos.gameId eq idJogo!!)
                    }
                }
                if (idUsuario != null) {
                    Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                }
                if (idJogo != null) {
                    Games.deleteWhere { Games.id eq idJogo!! }
                }
            }
        }
    }

    @Test
    fun `remove desejo com sucesso`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioRemoverDesejo"
        val senha = "senhaRemoverDesejo"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoRemoverDesejo"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                """.trimIndent())
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                """.trimIndent())
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            // Adiciona desejo
            transaction {
                Desejos.insert {
                    it[usuarioId] = idUsuario!!
                    it[gameId] = idJogo!!
                }
            }
            // Remove desejo
            val response = client.post("/request-remover-desejo") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "request-remover-desejo",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado"
                    }
                """.trimIndent())
            }
            val body = response.bodyAsText()
            println("Remover desejo sucesso: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("jogo removido da lista de desejos com sucesso"))
        } finally {
            transaction {
                if (idUsuario != null && idJogo != null) {
                    Desejos.deleteWhere { (Desejos.usuarioId eq idUsuario!!) and (Desejos.gameId eq idJogo!!) }
                }
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

    @Test
    fun `remove desejo falha por token invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioRemoverTokenInvalido"
        val senha = "senhaRemoverTokenInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoRemoverTokenInvalido"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        try {
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                """.trimIndent())
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                """.trimIndent())
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            transaction {
                Desejos.insert {
                    it[usuarioId] = idUsuario!!
                    it[gameId] = idJogo!!
                }
            }
            val response = client.post("/request-remover-desejo") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "request-remover-desejo",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "token-invalido"
                    }
                """.trimIndent())
            }
            val body = response.bodyAsText()
            println("Remover desejo token inválido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("token de login inválido"))
        } finally {
            transaction {
                if (idUsuario != null && idJogo != null) {
                    Desejos.deleteWhere { (Desejos.usuarioId eq idUsuario!!) and (Desejos.gameId eq idJogo!!) }
                }
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

    @Test
    fun `remove desejo falha por id_usuario invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioRemoverIdInvalido"
        val senha = "senhaRemoverIdInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoRemoverIdInvalido"
        var idJogo: Int? = null
        try {
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                """.trimIndent())
            }
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                """.trimIndent())
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            val response = client.post("/request-remover-desejo") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "request-remover-desejo",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": 999999,
                      "token": "user-$username-logado"
                    }
                """.trimIndent())
            }
            val body = response.bodyAsText()
            println("Remover desejo id_usuario inválido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de usuário inválido"))
        } finally {
            transaction {
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
                Usuarios.deleteWhere { Usuarios.nome eq username }
            }
        }
    }

    @Test
    fun `remove desejo falha por id_jogo invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioRemoverJogoInvalido"
        val senha = "senhaRemoverJogoInvalido"
        val dataNascimento = "2000-01-01"
        var idUsuario: Int? = null
        try {
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                """.trimIndent())
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                """.trimIndent())
            }
            val response = client.post("/request-remover-desejo") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "request-remover-desejo",
                      "id_jogo": 999999,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado"
                    }
                """.trimIndent())
            }
            val body = response.bodyAsText()
            println("Remover desejo id_jogo inválido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de jogo inválido"))
        } finally {
            transaction {
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
            }
        }
    }

    @Test
    fun `remove desejo falha por desejo inexistente`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioRemoverDesejoInexistente"
        val senha = "senhaRemoverDesejoInexistente"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoRemoverDesejoInexistente"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        try {
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                """.trimIndent())
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                """.trimIndent())
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            // Não adiciona desejo
            val response = client.post("/request-remover-desejo") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                      "comunicacao": "request-remover-desejo",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado"
                    }
                """.trimIndent())
            }
            val body = response.bodyAsText()
            println("Remover desejo inexistente: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("jogo não está na lista de desejos do usuário"))
        } finally {
            transaction {
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

    @Test
    fun `cria avaliacao com sucesso`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioAvaliacaoSucesso"
        val senha = "senhaAvaliacaoSucesso"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoAvaliacaoSucesso"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        var idAvaliacao: Int? = null
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            // Cria avaliação
            val response = client.post("/request-criar-avaliacao") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-criar-avaliacao",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado",
                      "nota": 8.5,
                      "resenha": "Muito bom!"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Criar avaliação sucesso: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("avaliação registrada com sucesso!"))
            // Extrai id_avaliacao
            // Expressão regular para encontrar o id_avaliacao no JSON de resposta
            val idRegex = """"id_avaliacao"\s*:\s*(\d+)""".toRegex()
            // Procura o padrão no corpo da resposta
            val matchResult = idRegex.find(body)
            // Se encontrou, pega o grupo 1 (o número) e converte para Int
            idAvaliacao = matchResult?.groupValues?.get(1)?.toInt()
            assertNotNull(idAvaliacao)
        } finally {
            transaction {
                if (idAvaliacao != null) br.com.lichia.database.Avaliacoes.deleteWhere { br.com.lichia.database.Avaliacoes.id eq idAvaliacao!! }
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

    @Test
    fun `cria avaliacao falha por id_usuario invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioAvaliacaoIdInvalido"
        val senha = "senhaAvaliacaoIdInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoAvaliacaoIdInvalido"
        var idJogo: Int? = null
        try {
            // Cria jogo
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            // Tenta criar avaliação com id_usuario inválido
            val response = client.post("/request-criar-avaliacao") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-criar-avaliacao",
                      "id_jogo": $idJogo,
                      "username": "$username",
                      "id_usuario": 999999,
                      "token": "user-$username-logado",
                      "nota": 7.0,
                      "resenha": "Teste"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Criar avaliação id_usuario inválido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de usuário inválido"))
        } finally {
            transaction {
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

    @Test
    fun `cria avaliacao falha por id_jogo invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioAvaliacaoJogoInvalido"
        val senha = "senhaAvaliacaoJogoInvalido"
        val dataNascimento = "2000-01-01"
        var idUsuario: Int? = null
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            // Tenta criar avaliação com id_jogo inválido
            val response = client.post("/request-criar-avaliacao") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-criar-avaliacao",
                      "id_jogo": 999999,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "user-$username-logado",
                      "nota": 7.0,
                      "resenha": "Teste"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Criar avaliação id_jogo inválido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("id de jogo inválido"))
        } finally {
            transaction {
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
            }
        }
    }

    @Test
    fun `cria avaliacao falha por token invalido`() = testApplication {
        environment { config = testConfig }
        val username = "usuarioAvaliacaoTokenInvalido"
        val senha = "senhaAvaliacaoTokenInvalido"
        val dataNascimento = "2000-01-01"
        val tituloJogo = "JogoAvaliacaoTokenInvalido"
        var idUsuario: Int? = null
        var idJogo: Int? = null
        var idAvaliacao: Int? = null // Corrigido: inicializa idAvaliacao
        try {
            // Cria usuário
            client.post("/registro") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "registro-usuario",
                      "username": "$username",
                      "senha": "$senha",
                      "dataNascimento": "$dataNascimento",
                      "visibilidade": true
                    }
                    """.trimIndent()
                )
            }
            idUsuario = transaction { Usuarios.selectAll().firstOrNull { it[Usuarios.nome] == username }?.get(Usuarios.id) }
            assertNotNull(idUsuario)
            client.post("/login") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "login",
                      "username": "$username",
                      "senha": "$senha"
                    }
                    """.trimIndent()
                )
            }
            idJogo = transaction {
                Games.insertAndGetId {
                    it[titulo] = tituloJogo
                    it[genero] = "Aventura"
                    it[anoLancamento] = 2020
                    it[consoleLancamento] = "PC"
                    it[ehHandheld] = false
                    it[maxJogadores] = 1
                    it[temOnline] = false
                    it[publisher] = "EditoraTeste"
                    it[temSequencia] = false
                    it[precoUsual] = 99.99
                    it[duracaoMainStoryAverage] = 10.0
                    it[duracaoMainStoryExtras] = 15.0
                    it[duracaoCompletionistAverage] = 20.0
                }.value
            }
            // Cria avaliação
            idAvaliacao = transaction {
                br.com.lichia.database.Avaliacoes.insertAndGetId {
                    it[usuarioId] = idUsuario!!
                    it[gameId] = idJogo!!
                    it[nota] = 7.5
                    it[resenha] = "Teste de remoção"
                    it[visibilidade] = true
                    it[data] = java.time.LocalDate.now()
                }.value
            }
            // Tenta remover avaliação com token inválido
            val response = client.post("/request-remover-avaliacao") {
                contentType(ContentType.Application.Json)
                setBody(
                    """
                    {
                      "comunicacao": "request-remover-avaliacao",
                      "id_avaliacao": $idAvaliacao,
                      "username": "$username",
                      "id_usuario": $idUsuario,
                      "token": "token-invalido"
                    }
                    """.trimIndent()
                )
            }
            val body = response.bodyAsText()
            println("Remover avaliacao token invalido: $body")
            assertEquals(HttpStatusCode.OK, response.status)
            assertTrue(body.contains("Token de login inválido"))
        } finally {
            transaction {
                if (idAvaliacao != null) br.com.lichia.database.Avaliacoes.deleteWhere { br.com.lichia.database.Avaliacoes.id eq idAvaliacao!! }
                if (idUsuario != null) Usuarios.deleteWhere { Usuarios.id eq idUsuario!! }
                if (idJogo != null) Games.deleteWhere { Games.id eq idJogo!! }
            }
        }
    }

}
