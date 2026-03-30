function ejecutarCallback(callback) {
  setTimeout(callback, 2000);
}

function saludar() {
  console.log("Hola después de 2 seg");
}

ejecutarCallback(saludar);