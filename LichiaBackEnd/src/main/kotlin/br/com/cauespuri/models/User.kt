package br.com.cauespuri.models

// construtor primário, já na declaração da classe
open class User( // open indica que não é final (pode ser herdada)
    name: String = "",
    val age: Int = 20,
    val password: String = ""
) {
//    // Usuário padrão terá nome com esse comportamento
//    open var name: String = name.uppercase() //inicializa o nome em maiúsculo
//        set(value) {
//            // garante que qualquer alteração no nome também será toda em maiúsculo
//            field = value.uppercase() // field é a variável que armazena o valor
//        }

    // Aqui usei val na abordagem de que o atributo em si não pode ser alterado após a inicialização
    open val name: String = name.uppercase()

    open fun auth(password: String): Boolean {
        return this.password == password
    }

    override fun toString(): String {
        return "User(name='$name', age=$age)"
    }
}

// Podemos criar classe herdeira no mesmo arquivo
// Toda classe herdeira precisa explicitar o construtor da classe mãe
class Admin(
    override val name: String,
    age: Int,
    password: String,
) : User(name = name, age = age, password = password)
{
    // sobrescrita de função
    override fun auth(password: String): Boolean {
        print("Autenticando admin: ")
        return super.auth(password)
    }

    // DICA: TODO é uma função que alerta que o código ainda não foi implementado
    fun excluiUser(user: User) {
        TODO("Not yet implemented")
    }
}

// Obs.: na subclasse, não poderia usar o val name, pois name já foi declarado na classe mãe
// Mas posso usar override, se fosse útil pra algo

