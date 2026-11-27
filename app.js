const $ = id => document.getElementById(id);
// La primera opción es la correcta. Se mezclan antes de mostrarlas.
const questions = [
  ["¿Cuántos bits forman un byte?", ["8", "4", "16"], "Un byte reúne ocho bits y admite 256 patrones distintos."],
  ["¿Qué lenguaje le da estilo a una página web?", ["CSS", "SQL", "HTML"], "CSS define colores, tamaños y posiciones en la página."],
  ["¿Qué significa la G de RGB?", ["Green", "Gray", "Gold"], "RGB son las iniciales en inglés de rojo, verde y azul."],
  ["¿Qué valor decimal tiene el binario 101?", ["5", "3", "7"], "Sus posiciones valen 4, 2 y 1: al sumar 4 + 0 + 1 obtienes 5."],
  ["¿Qué color da una pantalla al encender rojo y verde al máximo y apagar el azul?", ["Amarillo", "Violeta", "Blanco"], "La luz roja y la verde se suman para producir amarillo."],
  ["¿Cuál es un formato de imagen vectorial?", ["SVG", "JPEG", "PNG"], "SVG describe formas con geometría: puedes ampliarlas sin pixelarlas."]
];
const channels = ["Rojo", "Verde", "Azul"];
let deck, values, index;

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderColor() {
  $("nums").replaceChildren(...channels.map((name, i) => {
    const tile = document.createElement("span");
    tile.textContent = `${name}: ${values[i] ?? "?"}`;
    return tile;
  }));
  const rgb = channels.map((_, i) => values[i] ?? 0);
  $("swatch").style.backgroundColor = `rgb(${rgb.join(",")})`;
  $("colorCode").textContent = values.length === 3
    ? "#" + rgb.map(n => n.toString(16).padStart(2, "0")).join("").toUpperCase()
    : "Color en construcción";
}

function showQuestion() {
  const [prompt, options, fact] = deck[index];
  $("round").textContent = `PREGUNTA ${index + 1} / 3`;
  $("label").textContent = `Desbloquea el canal ${channels[index].toLowerCase()}`;
  $("prompt").textContent = prompt;
  $("feedback").textContent = "";
  $("next").hidden = true;
  $("choices").replaceChildren(...shuffled(options).map(option => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = option;
    button.onclick = () => {
      button.disabled = true;
      if (option !== options[0]) {
        $("feedback").textContent = "Prueba otra opción. Tu mezcla sigue intacta.";
        return;
      }
      for (const choice of $("choices").children) choice.disabled = true;
      values.push(Math.floor(Math.random() * 256));
      renderColor();
      $("feedback").textContent = `¡Correcto! ${fact} ${channels[index]}: ${values[index]}.`;
      if (values.length === 3) $("label").textContent = "¡Color completo!";
      $("next").textContent = values.length === 3 ? "Crear otro color ↻" : "Siguiente pregunta →";
      $("next").hidden = false;
    };
    return button;
  }));
}

function newGame() {
  deck = shuffled(questions).slice(0, 3);
  values = [];
  index = 0;
  renderColor();
  showQuestion();
}
$("next").onclick = () => {
  if (values.length === 3) return newGame();
  index++;
  showQuestion();
};
for (const id of ["play", "past"]) $(id).onclick = () => {
  const play = id === "play";
  $("sim").hidden = !play;
  $("history").hidden = play;
  $("play").setAttribute("aria-pressed", play);
  $("past").setAttribute("aria-pressed", !play);
};
function showHistory() {
  $("rows").replaceChildren(...archivo[$("source").value].map(values => {
    const row = document.createElement("tr");
    for (const value of values) row.insertCell().textContent = value;
    return row;
  }));
}
$("source").onchange = showHistory;
showHistory();
newGame();
