const heightVw = 50;
const lineHeight = 2.8;
const linesPer = Math.floor(heightVw / lineHeight);
const config = {
  startingPoint: 0,
  numParas: 1,
  running: true,
  charFades: true,
  charInterval: 8,
  fadeWords: 5, // zero for no autoFade; -1 for scores do fading
  // cosmetic
  // "rColumn": 33,
  // lineHeight: lineHeight,
  // this is 9/16 of 1080:
  // heightVw: heightVw,
  // linesPer: linesPer,
  // viewPortPx: 956,
  // these times are all now hundredths of seconds
  creditsPause: 0, // zero for no credits
  interCycle: 300,
  interScore: 300,
  scoredPause: 100,
  slower: 1.3
}
export { config };