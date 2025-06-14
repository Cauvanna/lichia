package br.com.lichia.models

// Para guardar data de nascimento
import java.time.LocalDate
import java.time.Period

open class Usuario(
    val nome: String,
    // (*) Colocar limite mínimo? Ideia: usar classificação indicativa de jogos para mostrar ou não conforme idade
    var senha: String,
    var visibilidade: Boolean = true, // Privacidade padrão é true (conta aberta)
    val dataNascimento: LocalDate,
    val dataCadastro: Long = System.currentTimeMillis(), // Grava momento da criação
    var listaSolicitacoes: MutableList<Usuario> = mutableListOf(), // Lista de solicitações de amizade
    var listaAmigos: MutableList<Usuario> = mutableListOf(), // Lista de amigos
    var listaGames: MutableList<Game> = mutableListOf(), // Lista de jogos
    // var listaRegistros: MutableList<Registro> = mutableListOf(), // Lista de registros
    // var listaResenhas: MutableList<Resenha> = mutableListOf(), // Lista de resenhas
    var listaDesejos: MutableList<Game> = mutableListOf() // Lista de desejos
)
{

    // Obtém a idade do usuário com base na data de nascimento
    val idade: Int
        get() = Period.between(dataNascimento, LocalDate.now()).years

    // Interações Usuario-Self
    fun autenticar(senha: String) =
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
        if (game !in listaDesejos) {
            listaDesejos.add(game)
            game.listaDesejantes.add(this)
            println("$nome adicionou jogo ${game.titulo} adicionado à lista de desejos.")
            return true
        } else {
            println("Jogo ${game.titulo} já está na lista de desejos de $nome!")
            return false
        }
    }

    fun removeDesejo(game: Game) : Boolean {
        if (game in listaDesejos) {
            listaDesejos.remove(game)
            game.listaDesejantes.remove(this)
            println("$nome removeu jogo ${game.titulo} removido da lista de desejos.")
            return true
        } else {
            println("Jogo ${game.titulo} não está na lista de desejos.")
            return false
        }
    }

    /****************************************************************************************************************/
    // Interações Usuario-Registro

    fun criaRegistro(game: Game) : Boolean {
        val registro = Registro(usuario = this, game = game, jogou = true)
        // se usuário tem conta aberta, seus registros são públicos por padrão
        registro.visibilidade = this.visibilidade

        game.listaRegistros.add(registro)
        this.listaGames.add(game)
        println("Registro criado para o jogo ${game.titulo}.")
        return true
    }

    fun removeRegistro(game: Game) : Boolean {
        // se game está na lista de games do usuário
        val game = this.listaGames.find { it == game }
        if (game != null) {

            // se o registro está na lista de registros do jogo
            val registro = game.listaRegistros.find { it.game == game }
            if (registro != null) {
                game.listaRegistros.remove(registro)
                println("Registro removido para o jogo ${game.titulo}.")
                return true
            } else {
                println("Nenhum registro encontrado para o jogo ${game.titulo}.")
                return false
            }
        } else {
            println("Jogo não encontrado na lista de games de $nome.")
            return false
        }
    }

    /****************************************************************************************************************/
    // Interações Usuario-Resenha

    fun criaResenha(
        game: Game,
        comentario: String,
        nota: Int
    ) : Boolean
    {
        val resenha = Resenha(usuario = this, game = game, comentario = comentario, nota = nota)

        // se usuário tem conta aberta, suas resenhas também são públicas por padrão
        resenha.visibilidade = this.visibilidade

        game.listaResenhas.add(resenha)
        this.listaGames.add(game)
        println("Registro criado para o jogo ${game.titulo}.")
        return true
    }

    fun removeResenha(game: Game) : Boolean {
        // se game está na lista de games do usuário
        val game = this.listaGames.find { it == game }
        if (game != null) {

            // se a resenha está na lista de resenhas do jogo
            val registro = game.listaResenhas.find { it.game == game }
            if (registro != null) {
                game.listaResenhas.remove(registro)
                println("Registro removido para o jogo ${game.titulo}.")
                return true
            } else {
                println("Nenhum registro encontrado para o jogo ${game.titulo}.")
                return false
            }
        } else {
            println("Jogo não encontrado na lista de games de $nome.")
            return false
        }
    }
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

    fun apagaRegistroQualquer(
        registro: Registro
    ): Boolean
    {
        val game = registro.game
        registro.game.listaRegistros.remove(registro)
        println("Registro removido para o jogo ${game.titulo} do usuário ${registro.usuario}.")
        return true
    }

    fun apagaResenhaQualquer(
        resenha: Resenha
    ): Boolean
    {
        val game = resenha.game
        resenha.game.listaResenhas.remove(resenha)
        println("Registro removido para o jogo ${game.titulo} do usuário ${resenha.usuario}.")
        return true
    }
}
