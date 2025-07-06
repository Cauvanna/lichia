# Usuario API Endpoints

Esta documentação descreve os endpoints implementados para funcionalidades de usuário no backend Lichia.

## Endpoints Implementados

### 1. POST /registro
Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "nome": "string",
  "idade": "int", 
  "senha": "string",
  "visibilidade": "boolean (opcional, padrão: true)"
}
```

**Response:**
```json
{
  "registrado": "boolean",
  "mensagem": "string",
  "usuario": {
    "id": "int",
    "nome": "string", 
    "idade": "int",
    "visibilidade": "boolean",
    "dataCadastro": "long"
  }
}
```

### 2. POST /login
Autentica um usuário existente.

**Request Body:**
```json
{
  "nome": "string",
  "senha": "string"
}
```

**Response:**
```json
{
  "sucesso": "boolean",
  "mensagem": "string",
  "usuario": {
    "id": "int",
    "nome": "string",
    "idade": "int", 
    "visibilidade": "boolean",
    "dataCadastro": "long"
  }
}
```

### 3. POST /logout
Finaliza a sessão do usuário.

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Logout realizado com sucesso"
}
```

### 4. POST /request-adicionar-desejo
Adiciona um jogo à lista de desejos do usuário.

**Request Body:**
```json
{
  "gameId": "int",
  "usuarioId": "int"
}
```

**Response:**
```json
{
  "sucesso": "boolean",
  "mensagem": "string"
}
```

### 5. POST /request-remover-desejo
Remove um jogo da lista de desejos do usuário.

**Request Body:**
```json
{
  "gameId": "int",
  "usuarioId": "int"
}
```

**Response:**
```json
{
  "sucesso": "boolean",
  "mensagem": "string"
}
```

### 6. POST /request-criar-avaliacao
Cria uma nova avaliação para um jogo.

**Request Body:**
```json
{
  "gameId": "int",
  "usuarioId": "int",
  "nota": "int (1-10)",
  "comentario": "string (opcional)"
}
```

**Response:**
```json
{
  "sucesso": "boolean",
  "mensagem": "string"
}
```

### 7. POST /request-remover-avaliacao
Remove uma avaliação existente.

**Request Body:**
```json
{
  "gameId": "int",
  "usuarioId": "int"
}
```

**Response:**
```json
{
  "sucesso": "boolean",
  "mensagem": "string"
}
```

### 8. GET /request-lista-de-desejos/{usuarioId}
Obtém a lista de desejos de um usuário.

**Response:**
```json
[
  {
    "id": "int",
    "titulo": "string",
    "genero": "string",
    "anoLancamento": "int",
    "consoleLancamento": "string",
    "ehHandheld": "boolean",
    "maxJogadores": "int",
    "temOnline": "boolean",
    "publisher": "string",
    "temSequencia": "boolean",
    "precoUsual": "double",
    "duracaoMainStoryAverage": "double",
    "duracaoMainStoryExtras": "double",
    "duracaoCompletionistAverage": "double"
  }
]
```

### 9. GET /request-painel-usuario/{usuarioId}
Obtém dados do painel do usuário (estatísticas).

**Response:**
```json
{
  "usuario": {
    "id": "int",
    "nome": "string",
    "idade": "int",
    "visibilidade": "boolean",
    "dataCadastro": "long"
  },
  "estatisticas": {
    "totalDesejos": "long",
    "totalAvaliacoes": "long", 
    "totalRegistros": "long"
  }
}
```

### 10. GET /request-pagina-usuario/{usuarioId}
Obtém dados do perfil público do usuário.

**Response:**
```json
{
  "usuario": {
    "id": "int",
    "nome": "string",
    "idade": "int",
    "visibilidade": "boolean",
    "dataCadastro": "long"
  },
  "avaliacoesPublicas": [
    {
      "jogo": "string",
      "nota": "int",
      "comentario": "string",
      "dataAvaliacao": "long"
    }
  ]
}
```

### 11. GET /request-historico-avaliacoes/{usuarioId}
Obtém o histórico completo de avaliações do usuário.

**Response:**
```json
[
  {
    "id": "int",
    "gameId": "int",
    "usuarioId": "int",
    "nota": "int",
    "comentario": "string",
    "dataAvaliacao": "long"
  }
]
```

## Tabelas de Banco de Dados

Os seguintes objetos Table foram adicionados ao banco de dados:

- **Users**: Armazena informações dos usuários
- **Registros**: Armazena registros de jogos dos usuários
- **Resenhas**: Armazena avaliações/resenhas dos usuários
- **ListaDesejos**: Armazena a lista de desejos dos usuários

## Códigos de Status HTTP

- **200 OK**: Operação realizada com sucesso
- **400 Bad Request**: Dados inválidos fornecidos
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Validações Implementadas

- Verificação de duplicatas para registros e avaliações
- Validação de IDs de usuário e jogo
- Validação de notas (1-10)
- Verificação de visibilidade de perfis
- Verificação de existência de recursos antes de operações