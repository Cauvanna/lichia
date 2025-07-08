package br.com.lichia.routes

/*
    * GameRoutes.kt é um arquivo que define as rotas relacionadas aos jogos no servidor Ktor.
    * Vamos começar listando os jogos para que o frontend possa obtê-los do banco de dados.
 */

import br.com.lichia.database.Desejos
import br.com.lichia.database.Games
import br.com.lichia.database.Usuarios
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import org.jetbrains.exposed.sql.transactions.transaction
import br.com.lichia.dto.GameDTO
import br.com.lichia.dto.GameDetalhadoDTO
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.selectAll

@Serializable
data class ListaGamesParaUsuarioRequest(
    val comunicacao: String,
    val username: String,
    val token: String
)

@Serializable
data class ListaGamesParaUsuarioErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class PaginaDeJogoRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String,
    val token: String
)

@Serializable
data class PaginaDeJogoErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RequestListaDeDesejantesRequest(
    val comunicacao: String,
    val usr_solicitante: String = "",
    val id_usr_solicitante: Int = 0,
    val token: String = "",
    val id_game: Int
)

@Serializable
data class RequestListaDeDesejantesErroResponse(
    val comunicacao: String,
    val mensagem: String
)

@Serializable
data class RequestListaDeAvaliacoesRequest(
    val comunicacao: String,
    val id_jogo: Int,
    val username: String = "",
    val token: String = ""
)

@Serializable
data class AvaliacaoListaResponseItem(
    val autor: String,
    val id_autor: Int,
    val nota: Double?,
    val data_criacao: String,
    val resenha: String
)

@Serializable
data class RequestListaDeAvaliacoesErroResponse(
    val comunicacao: String,
    val mensagem: String
)


fun Route.gameRoutes() {
    route("/games") {
        get {
            val gameList = transaction {
                Games.selectAll().map { gameRow ->
                    val gameId = gameRow[Games.id].value
                    val quantDesejantes = Desejos.selectAll().count { desejo -> desejo[Desejos.gameId] == gameId }
                    val avaliacoes = br.com.lichia.database.Avaliacoes.selectAll().filter { av -> av[br.com.lichia.database.Avaliacoes.gameId] == gameId && av[br.com.lichia.database.Avaliacoes.nota] != null }
                    val notaMedia = if (avaliacoes.isNotEmpty()) {
                        avaliacoes.map { av -> av[br.com.lichia.database.Avaliacoes.nota]!! }.average()
                    } else 0.0
                    br.com.lichia.dto.GameDetalhadoDTO(
                        id = gameRow[Games.id].value,
                        titulo = gameRow[Games.titulo],
                        genero = gameRow[Games.genero],
                        anoLancamento = gameRow[Games.anoLancamento],
                        consoleLancamento = gameRow[Games.consoleLancamento],
                        ehHandheld = gameRow[Games.ehHandheld],
                        maxJogadores = gameRow[Games.maxJogadores],
                        temOnline = gameRow[Games.temOnline],
                        publisher = gameRow[Games.publisher],
                        temSequencia = gameRow[Games.temSequencia],
                        precoUsual = gameRow[Games.precoUsual],
                        duracaoMainStoryAverage = gameRow[Games.duracaoMainStoryAverage],
                        duracaoMainStoryExtras = gameRow[Games.duracaoMainStoryExtras],
                        duracaoCompletionistAverage = gameRow[Games.duracaoCompletionistAverage],
                        quant_desejantes = quantDesejantes,
                        nota_media = notaMedia
                    )
                }
            }
            call.respond(gameList)
        }
    }
    route("/request-lista-games") {
        post {
            val req = call.receive<ListaGamesParaUsuarioRequest>()
            // Se for visitante (username e token vazios), retorna a lista sem checagem
            if (req.username.isBlank() && req.token.isBlank()) {
                val gameList = transaction {
                    Games.selectAll().map {
                        GameDTO(
                            id = it[Games.id].value,
                            titulo = it[Games.titulo],
                            genero = it[Games.genero],
                            anoLancamento = it[Games.anoLancamento],
                            consoleLancamento = it[Games.consoleLancamento],
                            ehHandheld = it[Games.ehHandheld],
                            maxJogadores = it[Games.maxJogadores],
                            temOnline = it[Games.temOnline],
                            publisher = it[Games.publisher],
                            temSequencia = it[Games.temSequencia],
                            precoUsual = it[Games.precoUsual],
                            duracaoMainStoryAverage = it[Games.duracaoMainStoryAverage],
                            duracaoMainStoryExtras = it[Games.duracaoMainStoryExtras],
                            duracaoCompletionistAverage = it[Games.duracaoCompletionistAverage]
                        )
                    }
                }
                call.respond(gameList)
                return@post
            }
            // Se não for visitante, checa o token
            val tokenEsperado = "user-${req.username}-logado"
            if (req.token != tokenEsperado) {
                call.respond(ListaGamesParaUsuarioErroResponse(
                    comunicacao = "request-lista-games",
                    mensagem = "token de login de usuario invalido"
                ))
                return@post
            }
            // Se o token está correto, retorna a lista de jogos
            val gameList = transaction {
                Games.selectAll().map {
                    GameDTO(
                        id = it[Games.id].value,
                        titulo = it[Games.titulo],
                        genero = it[Games.genero],
                        anoLancamento = it[Games.anoLancamento],
                        consoleLancamento = it[Games.consoleLancamento],
                        ehHandheld = it[Games.ehHandheld],
                        maxJogadores = it[Games.maxJogadores],
                        temOnline = it[Games.temOnline],
                        publisher = it[Games.publisher],
                        temSequencia = it[Games.temSequencia],
                        precoUsual = it[Games.precoUsual],
                        duracaoMainStoryAverage = it[Games.duracaoMainStoryAverage],
                        duracaoMainStoryExtras = it[Games.duracaoMainStoryExtras],
                        duracaoCompletionistAverage = it[Games.duracaoCompletionistAverage]
                    )
                }
            }
            call.respond(gameList)
        }
    }
    route("/request-pagina-de-game") {
        post {
            val req = call.receive<PaginaDeJogoRequest>()
            // Se for visitante (username e token vazios), não checa token
            if (req.username.isBlank() && req.token.isBlank()) {
                val gameDetalhadoDTO = transaction {
                    Games.selectAll().where { Games.id eq req.id_jogo }.singleOrNull()?.let {
                        val quantDesejantes = Desejos.selectAll().count { desejo -> desejo[Desejos.gameId] == it[Games.id].value }
                        val avaliacoes = br.com.lichia.database.Avaliacoes.selectAll().filter { av -> av[br.com.lichia.database.Avaliacoes.gameId] == it[Games.id].value && av[br.com.lichia.database.Avaliacoes.nota] != null }
                        val notaMedia = if (avaliacoes.isNotEmpty()) {
                            avaliacoes.map { av -> av[br.com.lichia.database.Avaliacoes.nota]!! }.average()
                        } else 0.0
                        GameDetalhadoDTO(
                            id = it[Games.id].value,
                            titulo = it[Games.titulo],
                            genero = it[Games.genero],
                            anoLancamento = it[Games.anoLancamento],
                            consoleLancamento = it[Games.consoleLancamento],
                            ehHandheld = it[Games.ehHandheld],
                            maxJogadores = it[Games.maxJogadores],
                            temOnline = it[Games.temOnline],
                            publisher = it[Games.publisher],
                            temSequencia = it[Games.temSequencia],
                            precoUsual = it[Games.precoUsual],
                            duracaoMainStoryAverage = it[Games.duracaoMainStoryAverage],
                            duracaoMainStoryExtras = it[Games.duracaoMainStoryExtras],
                            duracaoCompletionistAverage = it[Games.duracaoCompletionistAverage],
                            quant_desejantes = quantDesejantes,
                            nota_media = notaMedia
                        )
                    }
                }
                if (gameDetalhadoDTO == null) {
                    call.respond(PaginaDeJogoErroResponse(
                        comunicacao = "request-pagina-de-game",
                        mensagem = "id_jogo nao encontrado"
                    ))
                    return@post
                }
                call.respond(gameDetalhadoDTO)
                return@post
            }
            // Se não for visitante, checa apenas o token
            val tokenEsperado = "user-${req.username}-logado"
            if (req.token != tokenEsperado) {
                call.respond(PaginaDeJogoErroResponse(
                    comunicacao = "request-pagina-de-game",
                    mensagem = "token de usuario invalido"
                ))
                return@post
            }
            // Token válido, busca o jogo normalmente
            val gameDetalhadoDTO = transaction {
                Games.selectAll().where { Games.id eq req.id_jogo }.singleOrNull()?.let {
                    val quantDesejantes = Desejos.selectAll().count { desejo -> desejo[Desejos.gameId] == it[Games.id].value }
                    val avaliacoes = br.com.lichia.database.Avaliacoes.selectAll().filter { av -> av[br.com.lichia.database.Avaliacoes.gameId] == it[Games.id].value && av[br.com.lichia.database.Avaliacoes.nota] != null }
                    val notaMedia = if (avaliacoes.isNotEmpty()) {
                        avaliacoes.map { av -> av[br.com.lichia.database.Avaliacoes.nota]!! }.average()
                    } else 0.0
                    GameDetalhadoDTO(
                        id = it[Games.id].value,
                        titulo = it[Games.titulo],
                        genero = it[Games.genero],
                        anoLancamento = it[Games.anoLancamento],
                        consoleLancamento = it[Games.consoleLancamento],
                        ehHandheld = it[Games.ehHandheld],
                        maxJogadores = it[Games.maxJogadores],
                        temOnline = it[Games.temOnline],
                        publisher = it[Games.publisher],
                        temSequencia = it[Games.temSequencia],
                        precoUsual = it[Games.precoUsual],
                        duracaoMainStoryAverage = it[Games.duracaoMainStoryAverage],
                        duracaoMainStoryExtras = it[Games.duracaoMainStoryExtras],
                        duracaoCompletionistAverage = it[Games.duracaoCompletionistAverage],
                        quant_desejantes = quantDesejantes,
                        nota_media = notaMedia
                    )
                }
            }
            if (gameDetalhadoDTO == null) {
                call.respond(PaginaDeJogoErroResponse(
                    comunicacao = "request-pagina-de-game",
                    mensagem = "id_jogo nao encontrado"
                ))
                return@post
            }
            call.respond(gameDetalhadoDTO)
        }
    }
    route("/request-lista-de-desejantes") {
        post {
            val req = call.receive<RequestListaDeDesejantesRequest>()
            val visitante = req.id_usr_solicitante == 0 || req.usr_solicitante.isBlank() || req.token.isBlank()
            var resposta: Any? = null
            transaction {
                // 1. Checa se o game existe
                val gameExiste = Games.selectAll().any { it[Games.id].value == req.id_game }
                if (!gameExiste) {
                    resposta = RequestListaDeDesejantesErroResponse(
                        comunicacao = "request-lista-de-desejantes",
                        mensagem = "id de game inválido"
                    )
                    return@transaction
                }
                if (!visitante) {
                    // 2. Checa se o usuário solicitante existe
                    val usuarioSolicitante = Usuarios.selectAll().find { it[Usuarios.id] == req.id_usr_solicitante }
                    if (usuarioSolicitante == null) {
                        resposta = RequestListaDeDesejantesErroResponse(
                            comunicacao = "request-lista-de-desejantes",
                            mensagem = "id de usuário solicitante inválido"
                        )
                        return@transaction
                    }
                    // 3. Checa se o token é válido
                    val tokenEsperado = "user-${req.usr_solicitante}-logado"
                    if (req.token != tokenEsperado) {
                        resposta = RequestListaDeDesejantesErroResponse(
                            comunicacao = "request-lista-de-desejantes",
                            mensagem = "token de login do solicitante inválido"
                        )
                        return@transaction
                    }
                }
                // Busca todos os desejos para o game
                val desejos = Desejos.selectAll().filter { it[Desejos.gameId] == req.id_game }
                val listaUsuarios = desejos.mapNotNull { desejo ->
                    val usuario = Usuarios.selectAll().find { it[Usuarios.id] == desejo[Desejos.usuarioId] }
                    usuario?.let {
                        br.com.lichia.routes.UsuarioListaResponseItem(
                            id = it[Usuarios.id],
                            nome = it[Usuarios.nome],
                            senha = it[Usuarios.senha],
                            visibilidade = it[Usuarios.visibilidade],
                            data_cadastro = it[Usuarios.dataCadastro].toString(),
                            data_nascimento = it[Usuarios.dataNascimento].toString(),
                            logado = it[Usuarios.logado]
                        )
                    }
                }
                resposta = listaUsuarios
            }
            call.respond(resposta!!)
        }
    }
    route("/request-lista-de-avaliacoes") {
        post {
            val req = call.receive<RequestListaDeAvaliacoesRequest>()
            val visitante = req.username.isBlank() || req.token.isBlank()
            var resposta: Any? = null
            transaction {
                // Checa se o jogo existe
                val jogoExiste = Games.selectAll().any { it[Games.id].value == req.id_jogo }
                if (!jogoExiste) {
                    resposta = RequestListaDeAvaliacoesErroResponse(
                        comunicacao = "request-lista-de-avaliacoes",
                        mensagem = "id de jogo inválido"
                    )
                    return@transaction
                }
                if (!visitante) {
                    val tokenEsperado = "user-${req.username}-logado"
                    if (req.token != tokenEsperado) {
                        resposta = RequestListaDeAvaliacoesErroResponse(
                            comunicacao = "request-lista-de-avaliacoes",
                            mensagem = "token de login invalido"
                        )
                        return@transaction
                    }
                }
                // Busca avaliações do jogo
                val avaliacoes = br.com.lichia.database.Avaliacoes.selectAll().filter { it[br.com.lichia.database.Avaliacoes.gameId] == req.id_jogo }
                val listaAvaliacoes = avaliacoes.map { avaliacao ->
                    val usuario = Usuarios.selectAll().find { it[Usuarios.id] == avaliacao[br.com.lichia.database.Avaliacoes.usuarioId] }
                    AvaliacaoListaResponseItem(
                        autor = usuario?.get(Usuarios.nome) ?: "",
                        id_autor = usuario?.get(Usuarios.id) ?: -1,
                        nota = avaliacao[br.com.lichia.database.Avaliacoes.nota],
                        data_criacao = avaliacao[br.com.lichia.database.Avaliacoes.data].format(
                            java.time.format.DateTimeFormatter.ofPattern("EEE-dd-MMM-yyyy").withLocale(java.util.Locale("pt", "BR"))
                        ),
                        resenha = avaliacao[br.com.lichia.database.Avaliacoes.resenha]
                    )
                }
                resposta = listaAvaliacoes
            }
            call.respond(resposta!!)
        }
    }
}
