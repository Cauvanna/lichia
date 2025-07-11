package br.com.lichia.models

// Para guardar data de nascimento
import java.time.LocalDate
import java.time.Period

import br.com.lichia.dao.DesejoDAO
import br.com.lichia.dao.GameDAO

open class Usuario(
    val nome: String,
    // (*) Colocar limite mínimo? Ideia: usar classificação indicativa de jogos para mostrar ou não conforme idade
    private var senha: String,
    var visibilidade: Boolean = true, // Privacidade padrão é true (conta aberta)
    val dataNascimento: LocalDate,
    val dataCadastro: LocalDate = LocalDate.now(), // Agora usa LocalDate
    var listaSolicitacoes: MutableList<Usuario> = mutableListOf(), // Lista de solicitações de amizade
    var listaAmigos: MutableList<Usuario> = mutableListOf(), // Lista de amigos
    var listaGames: MutableList<Game> = mutableListOf(), // Lista de jogos
    // var listaRegistros: MutableList<Registro> = mutableListOf(), // Lista de registros
    // var listaResenhas: MutableList<Resenha> = mutableListOf(), // Lista de resenhas
    @Transient // Evita serialização desse campo, para não ser persistido no banco de dados
    var listaDesejos: MutableList<Game> = mutableListOf(), // Lista de desejos
    val id: Int = -1, // ID único do usuário (inicializado como -1 para indicar que ainda não foi definido, pode ser gerado automaticamente posteriormente
)
{

    // Obtém a idade do usuário com base na data de nascimento
    val idade: Int
        get() = Period.between(dataNascimento, LocalDate.now()).years

    // Interações Usuario-Self
    fun autenticar(senha: String) : Boolean =
        this.senha == senha

    fun alterarSenha(senha: String, senhaNova: String) : Boolean {
        if (this.senha == senha) {
            this.senha = senhaNova
            println("Senha alterada com sucesso!")
            return true // senha alterada com sucesso
        } else {
            println("Senha incorreta. Não foi possível alterar a senha.")
            return false
        }
    }


    /****************************************************************************************************************/
    // Interações Usuario-Usuario

    fun solicitarAmizade(usuario: Usuario) : Boolean{
        if (usuario.visibilidade) {
            if (usuario !in listaAmigos && this !in usuario.listaSolicitacoes && usuario !in listaSolicitacoes) {
                usuario.listaSolicitacoes.add(this)
                println("Solicitação de amizade enviada para ${usuario.nome}")
                return true
            } else if (usuario in listaAmigos) {
                println("Você já é amigo de ${usuario.nome}.")
                return false
            } else if (this in usuario.listaSolicitacoes) {
                println("Você já enviou uma solicitação de amizade para ${usuario.nome}.")
                return false
            }  else if (usuario in listaSolicitacoes) {
                println("Você já recebeu uma solicitação de amizade de ${usuario.nome}. Use aceitarAmizade($usuario) para aceitá-la.")
                return false
            }

        } else {
            println("Não é possível enviar solicitação de amizade para ${usuario.nome}, pois a conta dele é fechada.")
            return false
        }
        return false
    }

    fun aceitarAmizade(usuario: Usuario) : Boolean{
        if (usuario in listaSolicitacoes) {
            listaAmigos.add(usuario)
            usuario.listaAmigos.add(this)
            listaSolicitacoes.remove(usuario)
            println("Você agora é amigo de ${usuario.nome}")
            return true
        } else {
            println("Nenhuma solicitação de amizade recebida de ${usuario.nome}.")
            return false
        }
    }

    fun recusarAmizade(usuario: Usuario) : Boolean {
        if (usuario in listaSolicitacoes) {
            listaSolicitacoes.remove(usuario)
            println("Solicitação de amizade de ${usuario.nome} recusada.")
            return true
        } else {
            println("Nenhuma solicitação de amizade recebida de ${usuario.nome}.")
            return false
        }
    }

    fun removeAmizade(usuario: Usuario): Boolean {
        if (usuario in listaAmigos) {
            listaAmigos.remove(usuario)
            usuario.listaAmigos.remove(this)
            println("Amizade com ${usuario.nome} removida.")
            return true
        } else {
            println("Você não é amigo de ${usuario.nome}.")
            return false
        }
    }

    /****************************************************************************************************************/
    // Interações Usuario-Game

    fun adicionaDesejo(game: Game) : Boolean{
        val sucesso = DesejoDAO.adicionarDesejo(this, game)

        if (sucesso) {
            listaDesejos.add(game)  // só atualiza se deu certo no banco
            game.listaDesejantes.add(this)
            println("$nome adicionou jogo ${game.titulo} adicionado à lista de desejos.")
            return true
        } else {
            println("Jogo ${game.titulo} já está na lista de desejos de $nome!")
            return false
        }
    }

    fun removeDesejo(game: Game) : Boolean {
        val sucesso = DesejoDAO.removerDesejo(this, game)
        if (sucesso) {
            listaDesejos.remove(game)
            game.listaDesejantes.remove(this)
            println("$nome removeu jogo ${game.titulo} removido da lista de desejos.")
            return true
        } else {
            println("Jogo ${game.titulo} não está na lista de desejos.")
            return false
        }
    }

    // Usar essa função para syncar no login/load de um usuário da DB
    fun carregarDesejosDoBanco() {
        val gameIds = DesejoDAO.obterDesejosDoUsuario(this)
        // Usamos função que busca os games pelo ID
        this.listaDesejos = gameIds.mapNotNull { id -> GameDAO.getGameById(id) }.toMutableList()
    }


    /****************************************************************************************************************/
    // Interações Usuario-Avaliacao (unificado)

    fun criaAvaliacao(game: Game, nota: Int? = null, resenha: String = "", jogou: Boolean = true): Boolean {
        val avaliacao = Avaliacao(usuario = this, game = game, nota = nota, visibilidade = this.visibilidade, resenha = resenha)
        game.listaAvaliacoes.add(avaliacao)
        if (game !in this.listaGames) {
            this.listaGames.add(game)
        }
        println("Avaliação criada para o jogo ${game.titulo}.")
        return true
    }

    fun removeAvaliacao(game: Game): Boolean {
        val avaliacao = game.listaAvaliacoes.find { it.usuario == this }
        return if (avaliacao != null) {
            game.listaAvaliacoes.remove(avaliacao)
            println("Avaliação removida para o jogo ${game.titulo}.")
            true
        } else {
            println("Nenhuma avaliação encontrada para o jogo ${game.titulo}.")
            false
        }
    }

    // Remover métodos antigos de registro e resenha
    // fun criaRegistro(game: Game) ...
    // fun removeRegistro(game: Game) ...
    // fun criaResenha(game: Game, comentario: String, nota: Int) ...
    // fun removeResenha(game: Game) ...
    /****************************************************************************************************************/
    // Utilitários

    // to string precisa de override
    override fun toString(): String {
        return "Usuario(nome='$nome', visibilidade='${visibilidade}, dataNascimento=$dataNascimento)"
    }
}


/*****************************************************************************************************/

class Admin(
    nome: String,
    senha: String,
    dataNascimento: LocalDate
) : Usuario(nome, senha, true, dataNascimento) {
    fun excluirUsuario(usuario: Usuario) {
        TODO("Not yet implemented")
    }

    fun converteUsuarioParaAdmin(usuario: Usuario) {
        // Lógica para converter um usuário em admin
        // Isso pode envolver a adição do usuário a uma lista de administradores
        TODO("Not yet implemented")
    }

    fun apagaAvaliacaoQualquer(
        avaliacao: Avaliacao
    ): Boolean {
        val game = avaliacao.game
        game.listaAvaliacoes.remove(avaliacao)
        println("Avaliação removida para o jogo ${game.titulo} do usuário ${avaliacao.usuario}.")
        return true
    }
}
