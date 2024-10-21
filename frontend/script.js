let counter = 0;
let socket;
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const toggleButton = document.getElementById("toggle-connection");

function initSocket() {
  socket = io({
    ackTimeout: 10000,
    retries: 3,
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

  socket.on("chat message", (msg, serverOffset) => {
    const item = document.createElement("li");
    const content = document.createElement("span");
    content.className = "message-content";
    content.textContent = msg;
    item.appendChild(content);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
  });
}

initSocket();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && socket.connected) {
    const clientOffset = `${socket.id}-${counter++}`;
    socket.emit("chat message", input.value, clientOffset, () => {
      input.value = "";
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
