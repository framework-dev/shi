---
title: Reading
toc: false
style: style.css
header: false
footer: false
sidebar: false
pager: false
---
<!-- head: "<link rel='stylesheet' href='style.css' type='text/css' media='all' />"
could be used above to load Google fonts -->
<div id="frame">
  <!-- <img class= "rs" src="data/riverSnow/riverSnow.jpg"> -->
  <div id="display" class="fade rs"></div>
</div>
<div id="byline">
  <!-- <div class="clmleft"> -->
    <span id="bytext"><cite>Reading</cite> by John Cayley</span>
  <!-- </div> -->
  <!-- <div class="clmright">
    <span style="font-size: 1.2vw;">John C.</span>
  </div> -->
</div>

```js
console.log("--- Reading, July 2025 ---");
import { config } from "/data/reading/config.js";
// --- DEBUG congiguration
// config.startingPoint = 2; // DEBUG when RECORDING & REDUCTING EDIT here
// config.numParas = 2; // DEBUG and here: number of scores built depends on this
// config.running = false; // DEBUG
import { mod, sleep, msToTime } from "/components/utils.js";
var displayElem = document.getElementById("display");
var paraNum, paras, scores, spels;
// --- preprocessing ---
console.log("--- preprocessing begins ---"); // DEBUG
spels = new Map(await FileAttachment("/data/reading/spels.json").json());
displayElem.innerHTML = Array.from(spels.values())
  .map((spel) => spel.html)
  .join("");
paras = await FileAttachment("/data/reading/paras.json").json();
scores = await FileAttachment("/data/reading/scores.json").json();
if (config.charFades) {
  const spels = document.querySelectorAll('.spel');
  for (const spel of spels) {
    let str = spel.textContent;
    let strlen = str.length;
    str = [...str].map(char => `<span class="char">${char}</span>`).join('');
    spel.innerHTML = str;
    // DEBUG console.log(str);
    spel.style.opacity = 1;
  }
}
// console.log(paras[config.startingPoint]); // DEBUG , paras, scores
console.log("--- preprocessing done ---"); // DEBUG
// --- animation, based on the play() method in observablehq.com/@shadoof/sounding ---
import { play } from "/components/play.js";
if (config.running) play();
```