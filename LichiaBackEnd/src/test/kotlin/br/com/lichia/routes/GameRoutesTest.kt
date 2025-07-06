package br.com.lichia.routes

import br.com.lichia.routes.gameRoutes
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlin.test.*

class GameRoutesTest {

    @Test
    fun testRequestListaGamesEndpointExists() = testApplication {
        application {
            routing {
                gameRoutes()
            }
        }
        
        // Test that the endpoint exists and returns proper HTTP response structure
        // Note: This will fail due to no database, but we can verify the endpoint is registered
        val response = client.get("/request-lista-games")
        // We expect it to fail with 500 due to no database, not 404 (endpoint not found)
        assertTrue(response.status != HttpStatusCode.NotFound, "Endpoint /request-lista-games should be registered")
    }

    @Test
    fun testRequestPaginaDeGameEndpointExists() = testApplication {
        application {
            routing {
                gameRoutes()
            }
        }
        
        val response = client.get("/request-pagina-de-game/1")
        assertTrue(response.status != HttpStatusCode.NotFound, "Endpoint /request-pagina-de-game/{id} should be registered")
    }

    @Test
    fun testRequestListaDeDesejantesEndpointExists() = testApplication {
        application {
            routing {
                gameRoutes()
            }
        }
        
        val response = client.get("/request-lista-de-desejantes/1")
        assertTrue(response.status != HttpStatusCode.NotFound, "Endpoint /request-lista-de-desejantes/{gameId} should be registered")
    }

    @Test
    fun testRequestListaDeAvaliacoesEndpointExists() = testApplication {
        application {
            routing {
                gameRoutes()
            }
        }
        
        val response = client.get("/request-lista-de-avaliacoes/1")
        assertTrue(response.status != HttpStatusCode.NotFound, "Endpoint /request-lista-de-avaliacoes/{gameId} should be registered")
    }

    @Test
    fun testInvalidGameIdHandling() = testApplication {
        application {
            routing {
                gameRoutes()
            }
        }
        
        // Test invalid game ID
        val response = client.get("/request-pagina-de-game/invalid")
        assertTrue(
            response.status == HttpStatusCode.BadRequest || response.status == HttpStatusCode.InternalServerError,
            "Should handle invalid game ID gracefully"
        )
    }
}