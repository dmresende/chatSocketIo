let counter = 0;

//TODO - HOJE USANDO O PROJETO LOCAL.
const socket = io();

//TODO - AJUSTAR PARA CHAMAR API PUBLICADA NO RENDER
// socket = io("https://chatsocketio-x9ji.onrender.com", {
//   ackTimeout: 10000,
// });
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const toggleBtn = document.getElementById("toggle-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    const clientOffset = `${socket.id}-${counter++}`;
    socket.emit("chat message", input.value, clientOffset);
    input.value = "";
  }
});

socket.on("chat message", (msg, serverOffset) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

toggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (socket.connected) {
    toggleBtn.textContent = "Conectar";
    socket.disconnect();
  } else {
    toggleBtn.textContent = "Desconectar";
    socket.connect();
  }
});