package br.com.lichia.models

import br.com.lichia.plugins.module
import io.ktor.server.testing.testApplication
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpStatusCode
import org.junit.jupiter.api.Assertions.assertEquals
import kotlin.test.assertContains
import io.ktor.http.*
import org.junit.jupiter.api.Test


class ApplicationTest {

    @Test
    fun testRoot() = testApplication {
        application {
            module()
        }
        val response = client.get("/")

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Hello World!", response.bodyAsText())
    }

    // Esse teste vem do exemplo que criamos em Routing.kt com a rota /test1, que abre o HTML sample.html
    @Test
    fun testNewEndpoint() = testApplication {
        application {
            module()
        }

        val response = client.get("/test1")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("html", response.contentType()?.contentSubtype)
        assertContains(response.bodyAsText(), "Hello From Ktor")
    }
}

//
// /*
// *IMPORTANTE: para funcionar, é preciso comentar o trecho


//
// tasks.test {
//      useJUnitPlatform()
//      }
//
//Pois este teste usa o próprio ktor, e não o JUNit. E ter ambos gera conflito. Acho que é isso
//*/
//package br.com.lichia.models
//
//import br.com.lichia.models.*
//import br.com.lichia.repositories.*
//import br.com.lichia.plugins.*
//import io.ktor.client.call.*
//import io.ktor.client.plugins.contentnegotiation.*
//import io.ktor.client.request.*
//import io.ktor.http.*
//import io.ktor.serialization.kotlinx.json.*
//import io.ktor.server.testing.*
//import kotlin.test.*
//
//class ApplicationTest {
//    @Test
//    fun tasksCanBeFoundByPriority() = testApplication {
//        application {
//            val repository = FakeTaskRepository()
//            configureSerialization(repository)
//            configureRouting()
//        }
//
//        val client = createClient {
//            install(ContentNegotiation) {
//                json()
//            }
//        }
//
//        val response = client.get("/tasks/byPriority/Medium")
//        val results = response.body<List<Task>>()
//
//        assertEquals(HttpStatusCode.OK, response.status)
//
//        val expectedTaskNames = listOf("gardening", "painting")
//        val actualTaskNames = results.map(Task::name)
//        assertContentEquals(expectedTaskNames, actualTaskNames)
//    }
//
//    @Test
//    fun invalidPriorityProduces400() = testApplication {
//        application {
//            val repository = FakeTaskRepository()
//            configureSerialization(repository)
//            configureRouting()
//        }
//        val response = client.get("/tasks/byPriority/Invalid")
//        assertEquals(HttpStatusCode.BadRequest, response.status)
//    }
//
//    @Test
//    fun unusedPriorityProduces404() = testApplication {
//        application {
//            val repository = FakeTaskRepository()
//            configureSerialization(repository)
//            configureRouting()
//        }
//
//        val response = client.get("/tasks/byPriority/Vital")
//        assertEquals(HttpStatusCode.NotFound, response.status)
//    }
//
//    @Test
//    fun newTasksCanBeAdded() = testApplication {
//        application {
//            val repository = FakeTaskRepository()
//            configureSerialization(repository)
//            configureRouting()
//        }
//
//        val client = createClient {
//            install(ContentNegotiation) {
//                json()
//            }
//        }
//
//        val task = Task("swimming", "Go to the beach", Priority.Low)
//        val response1 = client.post("/tasks") {
//            header(
//                HttpHeaders.ContentType,
//                ContentType.Application.Json
//            )
//
//            setBody(task)
//        }
//        assertEquals(HttpStatusCode.NoContent, response1.status)
//
//        val response2 = client.get("/tasks")
//        assertEquals(HttpStatusCode.OK, response2.status)
//
//        val taskNames = response2
//            .body<List<Task>>()
//            .map { it.name }
//
//        assertContains(taskNames, "swimming")
//    }
//}
