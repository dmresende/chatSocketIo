let counter = 0;
let socket;
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const toggleButton = document.getElementById("toggle-connection");

function initSocket() {
  socket = io("https://chatsocketio-x9ji.onrender.com", {
    ackTimeout: 10000,
  });

  socket.on("connect", () => {
    toggleButton.textContent = "Desconectar";
    console.log("Conectado ao servidor!");
  });

  socket.on("connect_error", (error) => {
    console.error("Erro de conexão:", error);
    toggleButton.textContent = "Tentar Reconectar";
  });

  socket.on("disconnect", () => {
    toggleButton.textContent = "Conectar";
    console.log("Desconectado do servidor");
  });

  socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  });
}

initSocket();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && socket.connected) {
    socket.emit("chat message", input.value, () => {
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
