fun main () {
    // retorno padrão é vazio
    println("Hello, Lichia!")

    // variáveis
    val numero = 10 // val significa que valor não vai mudar (note que ele colocou como Int)
    var numero2: Int = 10 // se quiser explicitar o tipo
    // numero = 11 // não dá certo
    numero2 = 11 // dá certo

    // Não existe tipagem dinamica, tipagem é a mesma da declaração pra sempre
    // Mesmos tipos de java, mas não existe diferença com primitivos, tudo é objeto (com maiúsculo)
    // se fizermos decompile a partir do bytecode, tudo vai ser convertido pra tipo primitivo
    // A saída Unit da função main, ele é convertido no void do java
    val numero3: Float = 10f // precisa do f pra entender que é float

    val total =  numero2 + numero3 // não precisa de cast, ele faz automaticamente
    println("o numero inicial eh: " + numero) //funciona, mas dá pra fazer melhor
    println("o numero2 eh: $numero2") // string template (variável entrou pra string)
    // esse template de string permite até mesmo realizar código dentro do print
    println("numero3 eh: $numero3")
    println("total eh: ${numero2 + numero3}") // use chaves pra executar código dentro do template
    println(""" 
        
        exemplo de 3 aspas:
        numero + numero2 = ${numero + numero2}
    
        mantem  a formatação e já deu esse trimIndent de dica pra deixar bonito
    """)
}


