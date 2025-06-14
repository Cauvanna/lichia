//package br.com.lichia.models
//
//import br.com.lichia.plugins.configureDatabases
//import br.com.lichia.plugins.configureRouting
//import br.com.lichia.plugins.configureSerialization
//import com.typesafe.config.ConfigFactory
//import io.ktor.client.request.post
//import io.ktor.client.request.setBody
//import io.ktor.client.statement.bodyAsText
//import io.ktor.http.*
//import io.ktor.server.config.HoconApplicationConfig
//import io.ktor.server.testing.*
//import org.junit.jupiter.api.Assertions.*
//import org.junit.jupiter.api.Test
//
//class RegistroUsuarioTest {
//
//    private val testConfig = HoconApplicationConfig(ConfigFactory.load("test.conf"))
//
//    @Test
//    fun `registro bem sucedido de um usuario testuser1`() = testApplication {
//        environment {
//            config = testConfig
//        }
//
//        application {
//            configureDatabases()
//            configureSerialization()
//            configureRouting()
//        }
//
//        val response = client.post("/registro") {
//            contentType(ContentType.Application.Json)
//            setBody(
//                """
//                {
//                  "username": "testuser1",
//                  "senha": "password123",
//                  "dataNascimento": "2000-01-01",
//                  "visibilidade": true
//                }
//                """.trimIndent()
//            )
//        }
//
//        assertEquals(HttpStatusCode.OK, response.status)
//        val body = response.bodyAsText()
//        println("Registro sucesso: $body")
//        assertTrue(body.contains("\"registrado\":true"))
//    }
//
//    @Test
//    fun `registro falha por username duplicado`() = testApplication {
//        environment {
//            config = testConfig
//        }
//
//        application {
//            configureDatabases()
//            configureSerialization()
//            configureRouting()
//        }
//
//        // Primeiro registro
//        client.post("/registro") {
//            contentType(ContentType.Application.Json)
//            setBody(
//                """
//                {
//                  "username": "testuser2",
//                  "senha": "password456",
//                  "dataNascimento": "1995-05-05",
//                  "visibilidade": false
//                }
//                """.trimIndent()
//            )
//        }
//
//        // Tentativa duplicada
//        val duplicateResponse = client.post("/registro") {
//            contentType(ContentType.Application.Json)
//            setBody(
//                """
//                {
//                  "username": "testuser2",
//                  "senha": "differentpassword",
//                  "dataNascimento": "1998-08-08",
//                  "visibilidade": true
//                }
//                """.trimIndent()
//            )
//        }
//
//        assertEquals(HttpStatusCode.OK, duplicateResponse.status)
//        val body = duplicateResponse.bodyAsText()
//        println("Registro duplicado: $body")
//        assertTrue(body.contains("\"registrado\":false"))
//        assertTrue(body.contains("Usuário já existe"))
//    }
//}
