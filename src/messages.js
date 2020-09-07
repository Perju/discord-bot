let hello = ["Hola", "Que pasa", "Bienvenido"];

let welcome = [
  "Bienvenido al servidor",
  "Te damos la bienvenida",
  "Sientene Como en casa",
];

const getRndEl = (arr) => {
  return arr[Math.floor(Math.random() * arr.length - 1) + 1];
};

let text = {
  hello: hello,
  welcome: welcome,
};

let util = {
  getRndEl: getRndEl,
};

module.exports = { text, util };
