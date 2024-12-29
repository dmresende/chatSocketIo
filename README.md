# Socket.IO Chat 

Este é um aplicativo de chat em tempo real construído com Node.js, Express e Socket.IO. Ele oferece uma interface de usuário e funcionalidades de chat em tempo real.

## Características

- Chat em tempo real
- Interface de usuário elegante e responsiva
- Persistência de mensagens usando SQLite
- Suporte para múltiplos núcleos de CPU usando clustering

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Estrutura do Projeto

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/socket-io-chat-elegante.git
   cd socket-io-chat-elegante
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o servidor:
   ```
   npm run dev
   ```

4. Abra o navegador e acesse `http://localhost:3000`, verifique a porta 3000 se está disponivel, caso contrário ajuste.

## Uso

- Digite sua mensagem na caixa de texto e pressione "Enviar" ou a tecla Enter para enviar.
- Use o botão "Desconectar/Conectar" para gerenciar sua conexão com o servidor.

## Tecnologias Utilizadas

- Node.js
- Express
- Socket.IO
- SQLite
- HTML5/CSS3
- JavaScript

## Esstrutura
```
testeSocketIO/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── server.js
│   │   └── socket.js
│   ├── chat.db
│   └── package.json
└── frontend/
    └── public/
        ├── index.html
        ├── css/
        │   └── styles.css
        └── js/
            └── chat.js
```

## Obserevações
- caso não consiga executar via vercel e render, tente baixar o projeto e executar localmente.

## Licença
Documentação do projeto: https://socket.io/docs

## Autor

Douglas Resende
