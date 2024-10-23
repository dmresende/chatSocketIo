const socket = io('https://chatsocketio-x9ji.onrender.com', {
  withCredentials: true, // Permite enviar cookies e credenciais, se necessário
  autoConnect: true      // Conecta automaticamente
});

let counter = 0;
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const toggleButton = document.getElementById("toggle-connection");

function initSocket() {
  socket = io('https://chatsocketio-x9ji.onrender.com', {
    withCredentials: true,
    autoConnect: true,
    auth: {
      serverOffset: 0,
    },
  });

  socket.on("connect", () => {
    toggleButton.textContent = "Desconectar";
    //messages.innerHTML = ''; // Limpa mensagens antigas ao reconectar
  });

  socket.on("disconnect", () => {
    toggleButton.textContent = "Conectar";
  });

  // socket.on("chat message", (msg, serverOffset) => {
  //   const item = document.createElement("li");
  //   const content = document.createElement("span");
  //   content.className = "message-content";
  //   content.textContent = msg;
  //   item.appendChild(content);
  //   messages.appendChild(item);
  //   window.scrollTo(0, document.body.scrollHeight);
  //   socket.auth.serverOffset = serverOffset;
  // });
  socket.on('chat message', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
}

initSocket();

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    // Envia mensagem para o backend
    socket.emit('chat message', input.value, Date.now(), () => {
      input.value = '';
    });
  }
});

toggleButton.addEventListener("click", () => {
  if (socket.connected) {
    socket.disconnect();
  } else {
    socket.connect();
  }
});
