//promesa
function tareaPromesa() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Promesa terminada");
    }, 1000);
  });
}

//callback
function tareaCallback(callback) {
  setTimeout(() => {
    callback("Promesa terminada");
  }, 2000);
}
tareaCallback((mensaje) => {
  console.log(mensaje);
});