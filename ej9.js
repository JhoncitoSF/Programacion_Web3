function miPromesa() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("exito");
    }, 3000);
  });
}

miPromesa().then((mensaje) => {
  console.log(mensaje);
});