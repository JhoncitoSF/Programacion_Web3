
//función que devuelve una promesa
function tarea() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Proceso terminado");
    }, 1000);
  });
}

//forma con PROMESAS
tarea().then((mensaje) => {
  console.log("Con promesa:", mensaje);
});


//forma con ASYNC/AWAIT
async function ejecutar() {
  let mensaje = await tarea();
  console.log("Con async/await:", mensaje);
}
ejecutar();