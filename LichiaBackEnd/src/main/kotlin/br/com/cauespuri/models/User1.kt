package br.com.cauespuri.models

// OBS: por padrão é public e final
class User1 {

    // não precisa de métodos get e set, já tem por padrão (encapsulado, não vemos)
    var name: String = "" // precisa ser inicializado
        // set só pro usuário ter método que possa alterar a propriedade de forma personalizada
        // e sem ter que criar um método get pra propriedade
        set(value) {
            // field é de fato o atributo, altera internamente
            field = value.uppercase()
        }
        // get só pra mostrar que de fato estamos alterando o valor do atributo
        get(){
            println("buscando do get")
            return field
        }

    // Mas se não houver necessidade de personalizar nada, pode só deixar assim
    var age: Int = 20


}
