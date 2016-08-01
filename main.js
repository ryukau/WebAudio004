// 先読みタイマー: 時間でソートしたArrayに関数を持たせる。

const oscillatorType = [
  "sine",
  "square",
  "sawtooth",
  "triangle"
];

const BASE_DURATION = 0.200
const DURATION_MULTIPLIER = 3

var ctxAudio = new AudioContext()

var gainNode = ctxAudio.createGain()
gainNode.connect(ctxAudio.destination)
var gain = 1

var fmOperator = new FmOperator(ctxAudio)
fmOperator.connect(gainNode)

// timer event
var timerplaySound

function playSound() {
  stopSound()

  fmOperator.Attack.Tension = Math.random()
  fmOperator.Decay.Tension = Math.random()
  fmOperator.triggerAt(ctxAudio, ctxAudio.currentTime)

  ctxAudio.resume()

  var duration = BASE_DURATION * Math.pow(2, randomInt(0, DURATION_MULTIPLIER))
  gainNode.gain.setValueAtTime(gain, ctxAudio.currentTime)

  timerplaySound = window.setTimeout(playSound, 1000 * duration)
}

function stopSound() {
  window.clearTimeout(timerplaySound)
}


//
// UI
//

function onMouseDownButtonKill() {
  stopSound()
}

function onMouseDownButtonPlay() {
  playSound()
}

function onMouseUpButtonPlay() {
  stopSound()
}

function onInputRangeGain(value, elem) {
  gain = clamp(value, elem.min, elem.max)
  elem.value = gain
}