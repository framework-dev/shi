---
title: you
toc: false
header: false
footer: false
sidebar: false
pager: false
---
<style>
  html {
    background-color: var(--black);
  }
  body {
    background-color: var(--black);
  }
  #frame {
    font-family: "Nunito Sans", sans;
    background-color: var(--black);
    font-size: 5vw;
    font-variation-settings:
      "wght" 900,
      "wdth" 100,
      "YTLC" 500;
    letter-spacing: .2vw;
  }
  span {
    margin: .2vw;
  }
  .char {
    opacity: 0;
    transition: opacity .5s ease-in-out;
    -o-transition: opacity .5s ease-in-out;
    -ms-transition: opacity .5s ease-in-out;
    -moz-transition: opacity .5s ease-in-out;
    -webkit-transition: opacity .5s ease-in-out;
  }

  .char.visible {
    opacity: 1;
  }
</style>
<!-- head: "<link rel='stylesheet' href='/data/you/style.css' type='text/css' media='all' />" -->
<div id="frame">
  <div id="display" class="fade rs"></div>
</div>

```js
console.log("--- you, Sep 2025 ---");
import { config } from "/data/you/config.js";
// --- DEBUG congiguration
// config.startingPoint = 2; // DEBUG when RECORDING & REDUCTING EDIT here
// config.numParas = 2; // DEBUG and here: number of scores built depends on this
// config.running = false; // DEBUG
var displayElem = document.getElementById("display");
var paraNum, paras, scores, spels;
// --- preprocessing ---
console.log("--- preprocessing begins ---"); // DEBUG
spels = new Map(await FileAttachment("/data/you/spels.json").json());
displayElem.innerHTML = Array.from(spels.values())
  .map((spel) => spel.html)
  .join("");
paras = await FileAttachment("/data/you/paras.json").json();
scores = await FileAttachment("/data/you/scores.json").json();
if (config.charFades) {
  const spels = document.querySelectorAll('.spel');
  for (const spel of spels) {
    let str = spel.textContent;
    let strlen = str.length;
    str = [...str].map(char => `<span class="char">${char}</span>`).join('');
    // next line for this piece only
    // str = spel.id == "you_2" ? str.replaceAll("you", "you big") : str;
    spel.innerHTML = str;
    // console.log(str); // DEBUG
    spel.style.opacity = 1;
  }
}
// console.log(paras[config.startingPoint]); // DEBUG , paras, scores
console.log("--- preprocessing done ---"); // DEBUG
// --- animation, based on the play() method in observablehq.com/@shadoof/sounding ---
import { play } from "/components/play.js";
console.log("scores:", scores); // DEBUG
if (config.running) play(config, displayElem, spels, paras, scores);
```