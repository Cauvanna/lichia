# Lichia
Uma rede social para registro, avaliação e recomendação de videogames. Este é um projeto desenvolvido para a disciplina Introdução ao Desenvolvimento de Sistemas de Software (MAC0350), ministrado pelo professor Paulo Roberto Miranda Meirelles na USP.

# Motivação
Já existem redes sociais para avaliação de games como o [Backloggd](www.backloggd.com/), assim como sistemas de recomendação de games, por exemplo, aquele usado pela [Steam](store.steampowered.com/app/2767030/Marvel_Rivals/?gad_source=1). Mas não encontramos algum software que fizesse ambos de forma unificada. Além disso, gostaríamos de um sistema de recomendação mais pormenorizado que os existentes.

# Objetivos
Queremos que o software possua as seguintes funcionalidades:
- Registro e avaliação de jogos jogados;
- Funcionamento similar a redes sociais de avaliação;
- Espaço para resenhas em texto;
- Sistema de amizades, possibilidade de ver avaliações de amigos;
- Algoritmo de recomendação de jogos baseados em notas dadas e/ou na escolha de múltiplos jogos como base, entre outros filtros possíveis (gênero, duração, data de lançamento).

# Relação com conteúdo da aula
## Bancos de dados/tabelas:
- postgreSQL como formato para nosso Banco de Dados.
- pgAdmin para gerencialmento.
- 2 tabelas principais: users e gamers.
- 2 tabelas que os relacionam: desejos e avaliacoes.

## Uso de Orientação a Objetos:
Converter os dados em classes para abstração do nosso problema:
- Game e Usuario enquanto principais classes, cujos atributos, métodos e relações entre si definem o funcionamento do nosso software.

## Testes
- Cobertura mínima de 90% do projeto com testes automatizados.

# BACK END: Mapa do Projeto
- Linguagem: Kotlin
- Os itens a seguir ajudam a entender a estrutura do projeto e como os diferentes arquivos relacionam-se entre si para produzir os comportamentos desejados da aplicação web Lichia.
- Incluímos algumas dicas que podem ajudar a dar continuidade no desenvolvimento do projeto.

## Criando REST API
- Seguimos o [tutorial do Alex Felipe sobre o tema](https://youtu.be/UGo1j_Eq4qc).

## BUILD: Gradlew
- Nosso sistema de build é o Gradle e as propriedades mais importantes estão em LichiaBackEnd/build.gradle.kts
- Para dar build no projeto, abra o terminal no diretório LichiaBackEnd e digite
	- ./gradlew build
- Flag para mais informações (útil para entender falhas na build): 
	- --warning-mode all
- Note que os TESTES rodam automaticamente ao realizar a build e os seus resultados podem ser vistos LichiaBackEnd/build/reports/tests/test/index.html.
- OBS: Ao manejar o projeto por dentro do IntelliJ, algumas alterações nos arquivos farão com que o ícone de um elefante (símbolo do Gradlew) apareça próximo ao canto superior direito. Clique nele para que o Gradlew seja "informado" sobre as atualizações feitas. Algumas partes do código podem deixar de funcionar caso o Gradle não esteja atualizado.
- Para rodar o projeto, use
	- ./gradlew run

	- Isso faz com que o nosso servidor de backend comece a rodar. É necessário que ele esteja rodando para que o servidor no frontend funcione corretamente. Para acessar as rotas do backend, mantenha o terminal aberto enquanto visita os endereços definidos em LichiaBackEnd/src/main/br/com/lichia/plugins/Routing.kt. Note que muitas rotas são definidas por outros arquivos, como GameRoutes.kt e UsuarioRoutes.kt, mas eles são referenciados em Routing.kt de qualquer forma.
- Tabém é possível realizar build e run dentro do contexto do intelliJ, basta abrir o menu do Gradle (elefante no menu lateral direito):
	- Build: pasta build, e duplo clique no arquivo build. 
	- Run: pasta application, duplo clique no arquivo run.

## FRAMEWORK: Ktor
- Usado para criar projeto de aplicação web. Para iniciar a base do projeto, usamos o [gerador do site oficial](https://start.ktor.io/settings). Usamos o Gradle como build system. 
- Mais informações sobre o projeto base criado pelo gerador no arquivo LichiaBackEnd/src/README.md. É um README criado automaticamente ao usarmos o gerador do ktor.
- HOCON como arquivo de configuração (está no arquivo LichiaBackEnd/src/main/resources/application.conf)
- Para mais informações e tutoriais do Ktor, visite o [site docs oficial](https://ktor.io/docs/welcome.html).
- Para rodar o servidor, execute o run do gradle (explicado no item anterior) ou rode o arquivo LichiaBackEnd/src/main/br/com/lichia/plugins/Application.kt. O endereço usado será exibido no terminal (mas por padrão, será o http://localhost/8080 ou  http://0.0.0.0:8080).
- Para criação e edição dos nomes dos endereços do servidor, vá no arquivo LichiaBackEnd/src/main/br/com/lichia/plugins/Routing.kt


## Base de Dados
- Para reunir uma lista razoavelmente vasta de títulos de videogames e seus atributos, usamos como base o arquivo videoGames.csv fornecido pelo site do [CORGIS Dataset Project](https://corgis-edu.github.io/corgis/csv/video_games/). O CORGIS é um projeto dedicado a fornecer Datasets destinados especialmente para estudos, o que nos pareceu bem adequado ao nosso projeto. O .csv está em /LichiaBackEnd/DataSets/ArquivoOriginalCorgis/videoGames.csv. 
- Após criarmos tabelas para Games e Usuários em postgres usando o pgAdmin, alimentamos a tabela de Games com os dados relevantes de videoGames.csv. Isso foi feito em Application.kt, invocando a função importGamesFromCSV(), que está atualmente comentada, para que não fiquemos reimportando o .csv toda vez que rodarmos o servidor (mas mantivemos a linha caso precisemos importar tudo de novo por alguma corrupção da nossa base de dados). A importação usa o código definido em CSVImporter.kt e as relações entre videoGame.csv e nosso banco de dados é dado pelo arquivo Tables.kt.
- A tabela users começa inicialmente vazia, e pode ser preenchida manualmente via postrgreSQL (use pgAdmin para maior facilidade) ou usando o endpoint para registros, definido no arquivo LichiaBackEnd/src/main/br/com/lichia/routes/UsuarioRoutes.kt. Para esta segunda opção, você pode preencher a tabela usando as funcionalidades do próprio software, mas também precisará já estar rodando o servidor do frontend. Basta entrar na página de registro (http://localhost:5173/register) e seguir as instruções.

## Manejo de Servidor e Base de Dados: PGADMIN v9.2
Estamos usando o PGAdmin para manejar os servidores e nossa database, escrita em PostgreSQL. Você não precisa usar os dados a seguir para criar seu servidor, mas vamos mantê-lo no Readme como exemplo (além de para nossa própria lembrança):
- Nome do servidor: LichiaLocal
- Port: 5432 (padrão para postgres)
- Username: postgres (nome padrão)
- Senha: lichia1234 (não estamos preocupados com segurança aqui)

## Endpoints e comunicação com Front End
De forma geral, o frontend é quem cuida das relações de nosso software com visitantes e usuários do sistema. Ele deve permitir que os usuários realizem solicitações, e enviá-las para endpoints definidos em conjunto com o backend. Este por sua vez, realiza o processamento necessário no sistema e no banco de dados, devolvendo então o que for solicitado.
- Usamos JSON como tipo de arquivo em comum para realizar as trocas entre frontend e backend através dos endereços de endpoints. Assim, qualquer comunicação entre essas partes precisa estar pronta para criar e processar arquivos JSON.

## POSTMAN: testando endpoints
- Embora não seja necessário, usamos o postman para testar gets e posts no backend. 
- Foi especialmente útil para ver o funcionamento isolado dos endpoints antes da integração com o frontend.
- De forma geral, fazemos com que ele se conecte a URLs específicas de nosso servidor (endpoints) para receber ou enviar jsons.

# Uso de IA
- Estamos usando o chatgpt4, algumas vezes no seu próprio site, outras vezes através do plugin github copilot no IntelliJ Community Version.
- Quando no contexto do IntelliJ, usamos o copilot v4.1 junto a um arquivo copilot-instructions.md. Criamos este arquivo seguindo [as direções dadas no próprio site do github](https://docs.github.com/en/copilot/concepts/about-customizing-github-copilot-chat-responses).
- Para o frontend, foi usado especialmente o Gemini 2.5.
- Recomendações: percebemos que, de forma geral, apesar de a IA poder ser uma forte aliada no desenvolvimento do projeto, há algumas formas de usá-la que são melhores do que outra. Não costuma ser uma boa ideia deixar a encargo da IA definir a lógica do projeto a nível mais geral. Ela costuma brilhar mais quando usada na forma de um "estagiário" muito eficaz: escreve códigos trabalhosos, mas que o desenvolvedor é capaz de entender. Ela também é boa para aprender ou lembrar regras de sintaxe, especialmente para projetos mais complexos que envolvam o uso de muitas terminologias divergentes. Mas é bom que se instrua ela a explicar o que está fazendo quando o objetivo for este tipo de aprendizado.

# Pendências
Algumas funcionalidades dos objetivos originais ainda não puderam ser implementadas:
- Algoritmo de recomendação de games.
- Usuário Administrador.
- Sistema de Amizades.

# Ideias para desenvolvimento futuro
- Inclusão de fotos que não sejam hardcoded. Problema: direitos autorais e necessidade de pagar para obter banco de dados com imagens de games, sendo que deveria ser um projeto de software livre.
- Trocar fotos de perfis por artes de "emojis" originais (comum em softwares do tipo, como em fotos de perfil de lojas da plastation, da Nintendo, etc.)
