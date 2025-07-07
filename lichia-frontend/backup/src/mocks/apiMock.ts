import { api } from '../services/api';
import MockAdapter from 'axios-mock-adapter';

// Dados falsos que vamos usar como resposta
import gamesData from '../assets/games.json';
import loginSuccess from './loginSuccess.json';

// Cria uma instância do simulador para o nosso 'api' (axios)
const mock = new MockAdapter(api, { delayResponse: 500 }); // delay de 500ms para simular a rede

// 1. SIMULAÇÃO DO ENDPOINT DE LOGIN (POST /login)
mock.onPost('/login').reply((config) => {
  // Pega os dados que o formulário enviou
  const { username, senha } = JSON.parse(config.data);

  // Simula uma lógica de login simples
  if (username === 'teste' && senha === '123') {
    // Se o login for correto, retorna status 200 (OK) e os dados de sucesso
    return [200, loginSuccess];
  } else {
    // Se incorreto, retorna status 401 (Não Autorizado) com uma mensagem de erro
    return [401, { message: 'Usuário ou senha inválidos' }];
  }
});

// 2. SIMULAÇÃO DO ENDPOINT DE REGISTRO (POST /register)
mock.onPost('/register').reply((config) => {
  // Pega os dados do novo usuário
  const newUser = JSON.parse(config.data);
  console.log('Dados recebidos para registro (mock):', newUser);

  // Simplesmente retorna sucesso (status 201 - Created)
  return [201, { message: 'Usuário registrado com sucesso!' }];
});

// 3. SIMULAÇÃO DO ENDPOINT DE LISTA DE JOGOS (GET /api/games)
mock.onGet('/api/games').reply(200, gamesData);


// Adicione outras simulações aqui conforme for desenvolvendo...
// Ex: mock.onGet('/api/reviews/123').reply(200, listaDeReviewsParaOJogo123);

console.log('API Mock está ativa!');

// Exportamos o mock para garantir que o arquivo seja executado
export default mock;