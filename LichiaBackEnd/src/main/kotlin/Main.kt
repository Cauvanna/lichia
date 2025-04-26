package br.com.lichia.models



fun main() {
    val caue = Usuario("Cauê", 27, "1234")
    val gi = Admin("Gi", 20, "4321")
    println(caue)
    val chato = Usuario("Chato", 22, "1111")

    val marioOdissey = Game(
        "Super Mario Odissey",
        "Aventura",
        2017,
        listOf("Switch"),
    )

    val zeldaTOTK = Game(
        "Zelda: Tears of the Kingdom",
        "Aventura",
        2023,
        listOf("Switch"),
    )


    // Interação Usuário-Usuário

    val registro1 = Registro(caue, marioOdissey)
    println(caue)

    caue.solicitarAmizade(gi)
    gi.aceitarAmizade(caue)
    println(caue in gi.listaAmigos)

    caue.criaRegistro(zeldaTOTK)
//    println(caue.listaRegistros[0].game)





}
