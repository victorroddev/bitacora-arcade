const $ = id => document.getElementById(id);
const facts = [
  ["Un interruptor diminuto", "Un bit puede representar dos estados: 0 y 1. Con cinco bits puedes formar 32 patrones distintos."],
  ["El ritmo del procesador", "Un reloj de 1 GHz marca mil millones de ciclos por segundo. Una instrucción puede necesitar varios ciclos."],
  ["Colores en hexadecimal", "En la web, #00FF00 representa verde puro: los pares indican cuánto rojo, verde y azul se mezclan."],
  ["Ocho pequeños bits", "Un byte reúne ocho bits. Sus 256 patrones distintos pueden representar números del 0 al 255."],
  ["La lógica de una imagen", "Un píxel de una imagen monocromática solo necesita un bit para elegir entre dos colores."]
];
let binary = true, round = 0, factIndex = -1;
const random = n => Math.floor(Math.random() * n);
function generate() {
  round++;
  const step = 2 + random(6), start = 100 + random(80);
  const numbers = Array.from({length: binary ? 5 : 6}, (_, i) => binary ? random(2) : start + i * step);
  const answer = binary ? numbers.reduce((a,b) => a+b, 0) : step;
  $("nums").replaceChildren(...numbers.map(n => {
    const tile = document.createElement("span");
    tile.className = "num";
    tile.textContent = n;
    if (!binary) tile.style.fontSize = "clamp(14px, 3vw, 28px)";
    return tile;
  }));
  $("label").textContent = binary ? "TRIS BINARIO" : "MELATE LÓGICO";
  $("prompt").textContent = binary ? "¿Cuántos bits están encendidos?" : "¿Cuánto aumenta cada número?";
  $("round").textContent = `RONDA / ${String(round).padStart(3,"0")}`;
  $("feedback").textContent = "";
  const choices = new Set([answer]);
  while (choices.size < 3) choices.add(binary ? random(6) : 2 + random(6));
  $("choices").replaceChildren(...Array.from(choices).sort((a,b)=>a-b).map(value => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = value;
    button.onclick = () => {
      const correct = value === answer;
      $("feedback").textContent = correct ? "¡Correcto! Reto resuelto." : binary ? "Cuenta solo las casillas con un 1." : "Resta el primer número al segundo.";
      button.disabled = true;
      if (correct) for (const item of $("choices").children) item.disabled = true;
    };
    return button;
  }));
  factIndex = (factIndex + 1 + random(facts.length - 1)) % facts.length;
  $("factid").textContent = `DATO / 00${factIndex+1}`;
  [$("facttitle").textContent, $("fact").textContent] = facts[factIndex];
}
for (const id of ["tris","melate"]) $(id).onclick = () => {
  binary = id === "tris";
  $("tris").setAttribute("aria-pressed",binary);
  $("melate").setAttribute("aria-pressed",!binary);
  generate();
};
for (const id of ["play","past"]) $(id).onclick = () => {
  const play = id === "play";
  $("sim").hidden = !play;
  $("history").hidden = play;
  $("play").setAttribute("aria-pressed",play);
  $("past").setAttribute("aria-pressed",!play);
};
$("next").onclick = generate;
function showHistory() {
  $("rows").replaceChildren(...archivo[$("source").value].map(values => {
    const row = document.createElement("tr");
    for (const value of values) row.insertCell().textContent = value;
    return row;
  }));
}
$("source").onchange = showHistory;
showHistory();
generate();
