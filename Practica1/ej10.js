/*Usa callbacks cuando la operación es simple y solo necesitas ejecutar una función
después de otra. En cambio, usa promesas cuando trabajas con operaciones
asincrónicas más complejas o encadenadas, ya que permiten un código más limpio,
organizado y fácil de mantener, evitando el anidamiento excesivo (callback hell)*/

//callbcaack simple
function tareaCallback(callback) {
  setTimeout(() => {
    console.log("Callback: Paso 1");
    callback();
  }, 1000);
}
tareaCallback(() => {
  console.log("Callback: Paso 2");
});


//callback hell (muchos pasos)
setTimeout(() => {
  console.log("Callback Hell: Paso 1");
  setTimeout(() => {
    console.log("Callback Hell: Paso 2");
    setTimeout(() => {
      console.log("Callback Hell: Paso 3");
    }, 1000);
  }, 1000);
}, 1000);


//promesas (mejor para varios pasos)
function tareaPromesa(mensaje) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Promesa:", mensaje);
      resolve();
    }, 1000);
  });
}
tareaPromesa("Paso 1")
  .then(() => tareaPromesa("Paso 2"))
  .then(() => tareaPromesa("Paso 3"))
  .then(() => console.log("Promesas: Terminado"));