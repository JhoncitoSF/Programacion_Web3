//callback
function tareaCallback(callback) {
  setTimeout(() => {
    callback("callback terminado");
  }, 1000);
}

//promesa
function tareaPromesa() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("callback terminado");
    }, 1000);
  });
}
tareaPromesa().then((mensaje) => {
  console.log(mensaje);
});