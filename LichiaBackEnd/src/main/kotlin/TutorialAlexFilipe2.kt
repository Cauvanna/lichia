fun main () {
    // retorno padrão é vazio
    println("Hello, Lichia!")

    // selecionar código e usar ctrl + alt + m para extrair função dele

    // variáveis
    var numero: Int = 10
    var numero2: Float = 10f // precisa do f pra entender que é float
    val total: Float = soma(numero, numero2)

    // outra forma de enviar os parâmetros (independente da ordem)
    val total2: Float = soma(b = numero2, a = numero)

    if (numero > 10) {
        println("o numero eh maior que 10")
    } else {
        println("o numero nao eh menor que 10")
    }

    // OUtra sintaxe de if (funções também são expressões
    val result: Any = if (numero > 10) {  // Any é o supertipo de tudo (como Object de java)
        println("o numero eh maior que 10")
        10 // Tipo poderia ser int também
    } else {
        println("o numero nao eh menor que 10")
        20
    }

    // Não há operador ternário, mas o mais próximo é como segue:
    val result2: Int = if (numero > 10) 10 else 20

    // when é próximo do switch case
    when (numero) {
        1 -> println("um")
        2 -> println("dois")
        3 -> println("tres")
        in 4..10 -> println("quatro a dez")
        else -> println("outro numero")
    }


    // Dica também pode ser usado para resultados diferentes a partir de um tipo
    val x : Any = -5
    val y : Int = 5
    val z : String = "5"
    testaTipo(x)
    testaTipo(y)
    testaTipo(z)

    // laço for é diferente, usa range

    val range: IntRange = 1..5 // range de 1 a 5
    for (i in range) {
        print("i = $i ")
    }

    // alternativamente
    for (i in 1..5) {
        println("i = $i ")
    }

    // versão com in
    for (n: String in listOf<String>("Lichia", "eh", "bom")) {
        println("n = $n")
    }

    // while é igual

    var i = 0
    while (i < 5) {
        println("i = $i")
        i++
    }



}

private fun testaTipo(variavel: Any) {
    when (variavel) {
        is Int -> println("variavel eh um inteiro")
        is String -> println("variavel eh uma string")
        is Float -> println("variavel eh um float")
        else -> println("variavel eh outro tipo")
    }
}


// Note a forma "idiomática" de declarar variáveis
private fun soma(
    a: Int,
    b: Float
): Float {
    // Valor de retornoZ também precisa se estático! (definir tipo na assinatura)
    return a + b
}

// Outra sintaxe ainda mais simples
// Pode até remover tipagem explícita por conta do formato de expressão
private fun soma2(a: Int, b: Float) = a + b


