import { mod, sleep, msToTime } from "/components/utils.js";
async function play(config, displayElem, scores, spels) {
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
   // >>> show whatever is currently visible in the display element
  if (config.fadeWords < 1 ) {
    console.log(">>> show whatever is currently visible in the display element");
    displayElem.style.opacity = 1;
    await sleep(300);
  }
  // <<<
 if (typeof config.paraFadeWords != "undefined") fadeWords = config.paraFadeWords[paraNum];
 while (config.running) { // stopped with false in config
    if (paraNum == config.startingPoint) cycStart = Date.now();
    // loop forever ...
    loopMsg = `loop: ${loopCount++}`;
    // TODO - ALLOW MULTIPLE SCORED PER PARA (scoreNum goes to 0 on paraNum change)
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
    console.log("scores:",scores); // DEBUG
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
      // console.log(yieldMsg);
      // <<< (in other contexts:) yield yieldMsg;
      //
      // >>> these next lines do all the WORK
      let elem;
      let charToggle = async (spel) => {
        const chars = Array.from(spel.children);
        for (const char of chars) {
          char.classList.toggle("visible");
          // DEBUG console.log(letter.textContent);
          await sleep(char.classList.contains("visible") ? config.charInterval : 0);
        }
      }
      if (spelId !== "PAUSE") {
        elem = document.getElementById(spelId);
        if (config.charFades) {
          await charToggle(elem);
        } else {
          elem.classList.toggle("visible");
        }
        // DEBUG console.log(elem.innerHTML);
      }
      await sleep(score[idx].pause * config.slower); // pauses usually taken from the temporal data
      if (spelId === "PAUSE") continue;
      // not a pause item, so check for fadeWords
      if (fadeWords > 0) {
        fadePause = 0;
        for (let fi = 0; fi < fadeWords; ++fi) {
          let fidx = mod((fi + idx + 1), score.length);
          fadePause += score[fidx].id != "PAUSE" ? score[fidx].pause : 0;
        }
      }
      if (fadePause > 0) {
        // let ridx = mod(idx - fadeWords, score.length);
        // fadePause += score[idx].pause - score[ridx].pause;
        sleep(fadePause * config.slower).then(async () => {
          if (config.charFades) {
            await charToggle(elem);
          } else {
            elem.classList.toggle("visible");
          }
        });
      }
    } // end of loop thru current score
    // DEBUG console.log("fadePause", fadePause, "interScr", config.interScore);
    await sleep((fadePause + config.interScore) * config.slower); // pause between scores
    // >>> remove old paragraph:
    if (config.fadeWords === 0) {
      console.log(">>> remove old paragraph");
      displayElem.style.opacity = 0;
      await sleep(275 * config.slower);
      paras[paraNum].forEach(p => document.getElementById(p).classList.toggle("visible"));
      await sleep(50 * config.slower);
    }
    // <<<
    // bump paraNum if more than one
    if (config.numParas > 1) {
      paraNum = ++paraNum % config.numParas;
      if (paraNum == 0) paraNum += config.startingPoint;
    }
    if (paraNum == config.startingPoint) {
      console.log("--- end of cycle --- Duration:", msToTime(Date.now() - cycStart)); // DEBUG
      await sleep(config.interCycle * config.slower); // end of cycle pause
      if (config.creditsPause > 0) {
        let bl = document.getElementById("byline");
        bl.style.opacity = 1;
        await sleep(config.creditsPause * config.slower); // credits pause
        bl.style.opacity = 0;
        await sleep(config.interCycle * config.slower); // end of cycle pause
      }
    }
    // bump scoreNum
    scoreNum = ++scoreNum % scores.length;
  } // end of (endless) while loop
}
export { play }