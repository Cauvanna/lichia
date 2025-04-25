import br.com.cauespuri.models.Admin
import br.com.cauespuri.models.User

fun main(){

    // cria objeto da nossa classe
    val caue = User(
        "Cauê",
        27,
        "12345"
    ) // não tem construtor, então não precisa passar nada
    val gi = Admin(
        "Giovanna",
        20,
        "4321"
    ) // não tem construtor, então não precisa passar nada)

    // caue.name = "Giovanna" // não pode mudar o nome, pois é val
    println(caue.auth("12345")) // true
    println(caue.auth("12346")) // false
    println(caue)

    println(gi)
    println(gi.auth("4321")) // true

    // Resulta em erro por TODO
    //gi.excluiUser(caue) // não implementado



}



