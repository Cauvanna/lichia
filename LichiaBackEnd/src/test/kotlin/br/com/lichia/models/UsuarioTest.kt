package br.com.lichia.models
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class UsuarioTest {

    // CLASSE USUARIO
    // Interações Usuario-Self

    @Test
    fun `autenticar deve retornar true para senha correta`() {
        val usuario = Usuario("Gi", 20, "senha123")
        assertTrue(usuario.autenticar("senha123"))
    }

    @Test
    fun `autenticar deve retornar false para senha incorreta`() {
        val usuario = Usuario("Gi", 20, "senha123")
        assertFalse(usuario.autenticar("senhaErrada"))
    }

    @Test
    fun `alterarSenha deve retornar false e manter senha caso senha incorreta`() {
        val usuario = Usuario("Gi", 20, "senha123")
        assertFalse(usuario.alterarSenha("senhaErrada", "novaSenha"))
    }

    @Test
    fun `alterarSenha deve retornar true e alterar senha caso senha correta`() {
        val usuario = Usuario("Gi", 20, "senha123")
        assertTrue(usuario.alterarSenha("senha123", "novaSenha"))
        assertTrue(usuario.senha == "novaSenha")
    }

    /****************************************************************************************************************/
    // Interações Usuario-Usuario

    @Test
    fun `solicitarAmizade deve retornar false para usuarios com visibilidade fechada`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario2.visibilidade = false
        assertFalse(usuario1.solicitarAmizade(usuario2))
}

    @Test
    fun `solicitarAmizade deve retornar false se usuario1 ja solicitou usuario2`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        assertFalse(usuario1.solicitarAmizade(usuario2)) // Enviando solicitação novamente
    }

    @Test
    fun `solicitarAmizade deve retornar false se usuario2 ja tem solicitacao de usuario1`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        usuario2.aceitarAmizade(usuario1) // Aceitando a amizade
        assertFalse(usuario2.solicitarAmizade(usuario1)) // Enviando solicitação novamente
    }

    @Test
    fun `solicitarAmizade deve retornar false se usuarios ja sao amigos`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        usuario2.aceitarAmizade(usuario1) // Aceitando a amizade
        assertFalse(usuario1.solicitarAmizade(usuario2)) // Enviando solicitação novamente
    }

    @Test
    fun `solicitarAmizade deve retornar true caso usuario1 e usuario2 caso nao sejam amigos, nem tenham se solicitado, além de adicionar usuarios à listaAmigos um do outro`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario2.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        usuario2.aceitarAmizade(usuario1) // Aceitando a amizade
        assertTrue(usuario1.listaAmigos.contains(usuario2)) // Verifica se usuario2 foi adicionado à lista de amigos de usuario1
        assertTrue(usuario2.listaAmigos.contains(usuario1)) // Verifica se usuario1 foi adicionado à lista de amigos de usuario2
    }

    @Test
    fun `aceitarAmizade deve retornar false caso usuario1 nao tenha solicitado usuario2`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario2.visibilidade = true // garantindo que é usuário aberto
        assertFalse(usuario2.aceitarAmizade(usuario1)) // Aceitando a amizade
    }

    @Test
    fun `aceitarAmizade deve retornar true caso usuario1 esteja nas solicitacoes de usuario2, e corretamente alterar propriedades de ambos`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario2.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        assertTrue(usuario2.aceitarAmizade(usuario1)) // Aceitando a amizade
        assertTrue(usuario1.listaAmigos.contains(usuario2)) // Verifica se usuario2 foi adicionado à lista de amigos de usuario1
        assertTrue(usuario2.listaAmigos.contains(usuario1)) // Verifica se usuario1 foi adicionado à lista de amigos de usuario2
    }

    @Test
    fun `recusarAmizade deve retornar false caso usuario1 nao tenha solicitado usuario2`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario2.visibilidade = true // garantindo que é usuário aberto
        assertFalse(usuario2.recusarAmizade(usuario1)) // Aceitando a amizade
    }

    @Test
    fun `recusarAmizade deve retornar true caso usuario1 tenha solicitado usuario2, e remover usuario1 das solicitacoes de usuario2`() {
        val usuario1 = Usuario("Gi", 20, "senha123")
        val usuario2 = Usuario("Caue", 20, "senha123")
        usuario1.visibilidade = true // garantindo que é usuário aberto
        usuario2.visibilidade = true // garantindo que é usuário aberto
        usuario1.solicitarAmizade(usuario2)
        assertTrue(usuario2.recusarAmizade(usuario1)) // Recusando amizade
        assertFalse(usuario2.listaSolicitacoes.contains(usuario1)) // Verifica se usuario1 foi removido da lista de solicitacoes de usuario2
    }

    @Test
    fun `removerAmizade deve retornar false caso usuario1 nao seja amigo de usuario2`() {
        val usuario1 = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val usuario2 = Usuario(nome = "Caue", idade = 20, senha = "senha123")
        assertFalse(usuario2.listaAmigos.contains(usuario1)) // Verifica se usuario1 não está na lista de amigos de usuario2
        assertFalse(usuario2.removeAmizade(usuario1)) // Recusando amizade
    }

    @Test
    fun `removerAmizade deve retornar true caso usuario1 seja amigo de usuario2, e remover usuario1 dos amigos de usuario2`() {
        val usuario1 = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val usuario2 = Usuario(nome = "Caue", idade = 20, senha = "senha123", listaAmigos = mutableListOf(usuario1))
        assertTrue(usuario2.listaAmigos.contains(usuario1)) // Verifica se usuario1 está na lista de amigos de usuario2
        assertTrue(usuario2.removeAmizade(usuario1)) // Recusando amizade
        assertFalse(usuario2.listaAmigos.contains(usuario1)) // Verifica se usuario1 foi removido da lista de amigos de usuario2
    }


    /****************************************************************************************************************/
    // Interações Usuario-Game

    @Test
    fun `adicionarDesejo retorna true caso sucedido e adiciona game a lista de desejos de usuario`() {
        val usuario = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        assertTrue(usuario.listaDesejos.isEmpty()) // assegurando que lista de desejos do usuário está vazia
        usuario.adicionaDesejo(game)
        assertTrue(usuario.listaDesejos.contains(game)) // Verifica se game foi adicionado à lista de desejos de usuario
        assertTrue(game.listaDesejantes.contains(usuario)) // Verifica se usuario foi adicionado à lista de desejantes de game
    }

    @Test
    fun `adicionarDesejo eh mal sucedido caso game ja esteja na lista de desejos do usuario`() {
        val usuario = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        assertTrue(usuario.listaDesejos.isEmpty()) // assegurando que lista de desejos do usuário está vazia
        assertTrue(usuario.adicionaDesejo(game))
        assertTrue(usuario.listaDesejos.contains(game)) // Verifica se game foi adicionado à lista de desejos de usuario
    }

    @Test
    fun `removeDesejo retorna true caso sucedido e remove game da lista de desejos do usuario`() {
        val usuario = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        usuario.listaDesejos = mutableListOf(game)
        game.listaDesejantes = mutableListOf(usuario)
        assertTrue(usuario.removeDesejo(game))
        assertFalse(usuario.listaDesejos.contains(game)) // Verifica se game foi removido da lista de desejos de usuario
    }

    @Test
    fun `removeDesejo retorna false caso game a ser removido nao esteja na lista de desejos do usuario` (){
        val usuario = Usuario(nome = "Gi", idade = 20, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        assertFalse(usuario.listaDesejos.contains(game)) // Verifica se game não está na lista de desejos de usuario
        assertFalse(usuario.removeDesejo(game)) // Verifica se game não está na lista de desejos de usuario
    }

    /****************************************************************************************************************/
    // Interações Usuario-Registro

    @Test
    fun `criaRegistro cria objeto registro novo e o coloca na lista de registros do usuario criador` (){
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        assertTrue(usuario.criaRegistro(game))
        assertFalse(game.listaRegistros.isEmpty()) // Verifica registro foi adicionado à lista de registros do game
        assertTrue(game.listaRegistros[0].visibilidade == usuario.visibilidade) // Verifica se foi criado com a mesma visibilidade do usuario
        assertTrue(usuario.listaGames[0] == game) // Verifica se game foi adicionado à lista de games do usuario

    }

    @Test
    fun `removeRegistro bem sucedido remove objeto registro da lista de registros do usuario` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val registro = Registro(usuario = usuario, game = game)
        game.listaRegistros = mutableListOf(registro)
        usuario.listaGames = mutableListOf(game)
        assertTrue(usuario.removeRegistro(game))
        assertTrue(game.listaRegistros.isEmpty()) // Verifica se registro foi removido do game
    }

    @Test
    fun `removeRegistro eh mal sucedido se o jogo nao eh encontrado na lista games do usuario` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val registro = Registro(usuario = usuario, game = game)
        assertTrue(usuario.listaGames.isEmpty()) // Verifica se lista de games do usuario está vazia
        assertFalse(usuario.removeRegistro(game))
    }

    @Test
    fun `removeRegistro eh mal sucedido se o jogo nao possui registro pedido` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val registro = Registro(usuario = usuario, game = game)
        assertTrue(game.listaRegistros.isEmpty()) // Verifica se lista de registros do game está vazia
        assertFalse(usuario.removeRegistro(game))
    }

    /****************************************************************************************************************/
    // Interações Usuario-Resenha

    @Test
    fun `criaResenha cria objeto resenha nova e o coloca na lista de resenhas do jogo` (){
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        assertTrue(usuario.criaResenha(game, "Fenomenal!", 10))
        assertFalse(game.listaResenhas.isEmpty()) // Verifica registro foi adicionado à lista de registros do game
        assertTrue(game.listaResenhas[0].visibilidade == usuario.visibilidade) // Verifica se foi criado com a mesma visibilidade do usuario
        assertTrue(usuario.listaGames[0] == game) // Verifica se game foi adicionado à lista de games do usuario

    }

    @Test
    fun `removeResenha bem sucedido remove objeto resenha da lista de resenhas do jogo` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val resenha = Resenha(usuario = usuario, game = game, "Fenomenal!", nota = 10)
        game.listaResenhas = mutableListOf(resenha)
        usuario.listaGames = mutableListOf(game)
        assertTrue(usuario.removeResenha(game))
        assertTrue(game.listaResenhas.isEmpty()) // Verifica se resenha foi removida do game
    }

    @Test
    fun `removeResenha eh mal sucedido se o jogo nao eh encontrado na lista games do usuario` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val resenha = Resenha(usuario = usuario, game = game, "Fenomenal!", nota = 10)
        assertTrue(usuario.listaGames.isEmpty()) // Verifica se lista de games do usuario está vazia
        assertFalse(usuario.removeResenha(game))
    }

    @Test
    fun `removeResenha eh mal sucedido se o jogo nao possui resenha pedido` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val resenha= Resenha(usuario = usuario, game = game, "Fenomenal!", nota = 10)
        assertTrue(game.listaResenhas.isEmpty()) // Verifica se lista de resenhas do game está vazia
        assertFalse(usuario.removeResenha(game))
    }

    /****************************************************************************************************************/
    // Utilitários

    @Test
    fun `toString printa nome e idade do usuario` (){
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        assert((usuario.toString()) == "Usuario(nome='Caue', idade=27)")
    }

    /*****************************************************************************************************************/
    // SUBCLASSE ADMIN

    // Interações Admin-Registro

    @Test
    fun `apagaRegistroQualquer bem sucedido remove registro de usuario qualquer` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val admin = Admin(nome = "Gi", idade = 20, senha ="senha321")
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val registro = Registro(usuario = usuario, game = game)
        game.listaRegistros = mutableListOf(registro)
        assertTrue(admin.apagaRegistroQualquer(registro))
        assertTrue(game.listaRegistros.isEmpty()) // Verifica se game foi removido da lista de registros de usuario
    }

    /*****************************************************************************************************************/
    // SUBCLASSE ADMIN

    // Interações Admin-Resenha

    @Test
    fun `apagaResenhaQualquer bem sucedido remove resenha de usuario qualquer` (){
        val game = Game(titulo = "Zelda", genero = "Aventura", anoLancamento = 2023)
        val admin = Admin(nome = "Gi", idade = 20, senha ="senha321")
        val usuario = Usuario(nome = "Caue", idade = 27, senha ="senha123")
        val resenha = Resenha(usuario = usuario, game = game, "Fenomenal!", nota = 10)
        game.listaResenhas = mutableListOf(resenha)
        assertTrue(admin.apagaResenhaQualquer(resenha))
        assertTrue(game.listaResenhas.isEmpty()) // Verifica se game foi removido da lista de registros de usuario
    }

}
