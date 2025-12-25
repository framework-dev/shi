---
title: Maple Bridge
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
  img {
    position: absolute;
    border: none;
    top: -1.5vw;
    left: 0;
    height: 100%;
    width: auto;
  }
  img.zi {
    filter: invert(1);
  }
  #frame {
    font-size: 2vw;
  }
  #display {
    top: 2.8vw;
    left: 18vw;
  }
</style>
<div id="frame">
  <img class= "zi" src="data/mapleBridge/ZhengGui_shu_FengQiaoYeBo_ZhangJi.jpg">
  <div id="display" class="fade"></div>
</div>
<div id="byline">
  <!-- <div class="clmleft"> -->
    <span id="bytext"><cite>Maple Bridge Mooring at Night</cite> by Zhang JI (fl. ), translated by John for 2025/26.<br>Original calligraphy by and courtesy of Zheng Gui.</span>
  <!-- </div> -->
  <!-- <div class="clmright">
    <span style="font-size: 1.2vw;">John C.</span>
  </div> -->
</div>

```js
console.log("--- Maple Bridge, Dec 2025 ---");
import { config } from "/data/mapleBridge/config.js";
// --- DEBUG congiguration
// config.startingPoint = 2; // DEBUG when RECORDING & REDUCTING EDIT here
// config.numParas = 2; // DEBUG and here: number of scores built depends on this
// config.running = false; // DEBUG
import { mod, sleep, msToTime } from "/components/utils.js";
var displayElem = document.getElementById("display");
var paraNum, paras, scores, spels;
// --- preprocessing ---
console.log("--- preprocessing begins ---"); // DEBUG
spels = new Map(await FileAttachment("/data/mapleBridge/spels.json").json());
displayElem.innerHTML = Array.from(spels.values())
  .map((spel) => spel.html)
  .join("");
paras = await FileAttachment("/data/mapleBridge/paras.json").json();
scores = await FileAttachment("/data/mapleBridge/scores.json").json();
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
async function play() {
  console.log("entered play()");
  let cycStart,
    fadePause = 0,
    fadeWords = config.fadeWords,
    idx,
    loopCount = 0,
    loopMsg,
    paraNum = config.startingPoint,
    prevScore,
    rdnScore,
    score,
    scoreName,
    scoreNum = 0,
    toggle = true,
    yieldMsg;
  if (config.fadeWords > 0) await sleep(config.interCycle);
  while (config.running) { // stopped with false in config
    if (paraNum == config.startingPoint) cycStart = Date.now();
    // loop forever ...
    loopMsg = `loop: ${loopCount++}`;
    // >>> show whatever is currently visible in the display element
    if (config.fadeWords < 1 ) {
      displayElem.style.opacity = 1;
      await sleep(300);
    }
    // <<<
    score = scores[scoreNum];
    // >>> (currently) unused mechanism for generating quasi-random scores on the fly (see 'Uchaf'):
    // if (typeof scores[scoreNum] === "string") {
    //   switch (scores[scoreNum]) {
    //     case "schorus":
    //       // score = schorus();
    //       break;
    //     default:
    //       throw new Error("unknown score-building function name");
    //   }
    //   prevScore = score;
    // } else {
    //   score = scores[scoreNum];
    // }
    // <<<
    // console.log(scoreSet, "scoreNum", scoreNum, scoreSet[scoreNum]); // DEBUG
    console.log("score:", scoreNum, "score items:", score.length);
    //
    // This is where we inner-loop through each item in the current score and
    // display the string of its spel for the length of time in its pause property.
    for (idx = 0; idx < score.length; idx++) {
      if (!config.running) break;
      let spelId = score[idx].id;
      // an 'AUTOFADE' score item can override the config.fadeWords default
      if (spelId === "AUTOFADE") { 
        console.log("autoFade");
        // calculate autofade based on word number
        fadePause = 0;
        fadeWords = score[idx].pause;
        for (let fi = 0; fi < fadeWords; ++fi) {
          let fidx = (idx + fi + 1) % score.length;
          fadePause += score[fidx].pause;
        }
        continue;
      }
      // >>> provide some info:
      let str = "[pause]";
      if (spelId !== "PAUSE") {
        str = spels.get(spelId);
        if (str !== undefined) str = str.string;
      }
      yieldMsg =
        loopMsg + `, score: ${scoreNum}, item: ${idx}, paraNum: ${paraNum}, id: ${spelId}, `;
      yieldMsg += `string: '${str}', pause: ${score[idx].pause}`;
      console.log(yieldMsg);
      // <<< (in other contexts:) yield yieldMsg;
      //
      // >>> these next lines do all the work
      let elem;
      if (spelId !== "PAUSE") {
        elem = document.getElementById(spelId);
        if (config.charFades) {
          await charToggle(elem);
        } else {
          elem.classList.toggle("visible");
        }
      }
      await sleep(score[idx].pause); // pauses usually taken from the temporal data
      if (spelId === "PAUSE") continue;
      // not a pause item, so check for fadeWords
      if (fadeWords > 0) {
        fadePause = 0;
        for (let fi = 0; fi < fadeWords; ++fi) {
          let fidx = mod((fi + idx + 1), score.length);
          fadePause += score[fidx].pause;
        }
      }
      if (fadePause > 0) {
        // let ridx = mod(idx - fadeWords, score.length);
        // fadePause += score[idx].pause - score[ridx].pause;
        sleep(fadePause).then(() => {
          elem.classList.toggle("visible");
        });
      }
    } // end of loop thru current score
    await sleep(fadePause + config.interScore); // pause between scores
    // >>> remove old paragraph:
    if (config.fadeWords === 0) {
      displayElem.style.opacity = 0;
      await sleep(275);
      paras[paraNum].forEach(p => document.getElementById(p).classList.toggle("visible"));
      await sleep(50);
    }
    // <<<
    // bump paraNum
    paraNum = ++paraNum;
    if (paraNum >= (config.numParas + config.startingPoint)) {
      console.log("--- end of cycle --- Duration:", msToTime(Date.now() - cycStart)); // DEBUG
      paraNum = config.startingPoint;
      scoreNum = -1; // might need checking, needed if scores data for > paraNums exists
      await sleep(config.interCycle); // end of cycle pause
      if (config.creditsPause > 0) {
        let bl = document.getElementById("byline");
        bl.style.opacity = 1;
        await sleep(config.creditsPause); // credits pause
        bl.style.opacity = 0;
        await sleep(config.interCycle); // end of cycle pause
      }
    }
    // bump scoreNum
    scoreNum = ++scoreNum % scores.length;
  } // end of (endless) while loop
}
async function charToggle (spel) {
  const chars = Array.from(spel.children);
  for (const char of chars) {
    char.classList.toggle("visible");
    // DEBUG console.log(letter.textContent);
    await sleep(char.classList.contains("visible") ? config.charInterval : 0);
  }
}
if (config.running) play();
```