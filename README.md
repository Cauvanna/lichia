# Lichia (nome provisório)
Uma rede social para registro, avaliação e recomendação de videogames.

# Motivação
Já existem redes sociais para avaliação de games como o [Backloggd](www.backloggd.com/), assim como sistemas de recomendação de games, por exemplo, aquele usado pela [Steam](store.steampowered.com/app/2767030/Marvel_Rivals/?gad_source=1). Mas não encontramos algum software que fizesse ambos de forma unificada. Além disso, gostaríamos de um sistema de recomendação mais pormenorizado que os existentes.

# Escopo
O software deve ter as seguintes funcionalidades:
- Registro e avaliação de jogos jogados;
- Funcionamento como redes sociais de avaliação;
- Espaço para resenhas em texto;
- Sistema de amizades, possibilidade de ver avaliações de amigos;
- Algoritmo de recomendação de jogos baseados em notas dadas e/ou na escolha de múltiplos jogos como base, entre outros filtros possíveis (gênero, duração, data de lançamento).

# Relação com conteúdo da aula
- Bancos de dados/tabelas: Uso de uma biblioteca de jogos, com dados como nome, gênero, ano de lançamento, etc.
- Uso de Orientação a Objetos: Converter os dados em classes para representar os jogos e seus atributos. Usuários enquanto classes.
- Testes: cobertura mínima de 90% do projeto com testes automatizados.

# BACK END: Processo de Criação

- Linguagem: Kotlin

# Criando REST API
- Seguimos o [tutorial do Alex Felipe sobre o tema](https://youtu.be/UGo1j_Eq4qc).

# BUILD: Gradlew
- Nosso sistema de build é o Gradle e as propriedades mais importantes estão em LichiaBackEnd/build.gradle.kts
- Para dar build no projeto, abra o terminal no diretório LichiaBackEnd e digite
    $ ./gradlew build
- Flag para mais informações (útil para entender falhas na build): 
    --warning-mode all
- Note que os TESTES rodam automaticamente ao realizar a build e os seus resultados podem ser vistos LichiaBackEnd/build/reports/tests/test/index.html.
- Para rodar o projeto, use
    $ ./gradlew run
Neste versão de commit, isso faz com que o servidor comece a rodar. Para visitá-lo, mantenha o terminal aberto enquanto acessa os endereços definidos em LichiaBackEnd/src/main/br/com/lichia/plugins/Routing.kt
- OBS: Ao manejar o arquivo por dentro do IntelliJ, algumas alterações nos arquivos farão com que o ícone de um elefante (símbolo do Gradlew) apareça próximo ao canto superior direito. Clique nele para que o Gradlew seja "informado" sobre as atualizações feitas e dê um build na versão atualizada.
- Para dar buid e run dentro do intelliJ, abra o menu do Gradle (elefante no menu lateral direito). Build: pasta build, e duplo clique no arquivo build. Run: pasta application, duplo clique no arquivo run.


# FRAMEWORK: Ktor
- Usado para criar projeto de aplicação web. Para iniciar a base do projeto, usamos o [gerador do site oficial](https://start.ktor.io/settings). Usamos o Gradle como build system. 
- Mais informações sobre o projeto base criado pelo gerador no arquivo LichiaBackEnd/src/README.md. É um README criado automaticamente ao usarmos o gerador do ktor.
- HOCON como arquivo de configuração (está no arquivo LichiaBackEnd/src/main/resources/application.conf)
- Para mais informações e tutoriais do Ktor, visite o [site docs oficial](https://ktor.io/docs/welcome.html).
- Para rodar o servidor, execute o arquivo LichiaBackEnd/src/main/br/com/lichia/plugins/Application.kt. O endereço usado será exibido no terminal (mas deve ser o local host http://0.0.0.0:8080). Para ver o que está acontecendo, basta visitar este endereço em um navegador.
- Exemplos deste commit: http://0.0.0.0:8080/ (apenas um servidor dizendo Hello World!); http://0.0.0.0:8080/static/index.html (abre página do Task Manager Client que criamos como exemplo do tutorial do Alex Felipe, mas não tem a ver com nosso projeto ainda). 
- Para criação e edição dos nomes dos endereços do servidor, vá no arquivo LichiaBackEnd/src/main/br/com/lichia/plugins/Routing.kt
- A pasta LichiaBackEnd/src/main/br/com/lichia/repositories contém os arquivos para implementação do exemplo do Task Manager do tutorial do Alex Felipe (e do site do Ktor). Também há o arquivo Task.kt (pasta models do main)


# Front-end e Back-end: informações úteis
- No tutorial do Ktor ["Create a RESTful API"](https://ktor.io/docs/server-create-restful-apis.html#via-browser), checar a sessão "Content Negotiation via JavaScript". Por ora, nosso código exibe um JSON diretamente no browser. Mais pra frente, vamos querer que um JavaScript esteja rodando no browser para manejar essa exibição. Podemos usar um framework como React para cuidar disso. No nosso código atual, isso é apenas simulado no arquivo LichiaBackEnd/src/main/resources/static/index.html.
