// 先読みタイマー: 時間でソートしたArrayに関数を持たせる。

const oscillatorType = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
    ];

const MAX_CHORD = 16;
const MAX_HARMONICS = 32;

const BASE_DURATION = 0.200;
const DURATION_MULTIPLIER = 3;

var ctxAudio = new AudioContext();

var gainNode = ctxAudio.createGain();
gainNode.connect(ctxAudio.destination);
var gain = 1;

var fmop = new FmOperator(ctxAudio);
fmop.connect(gainNode);

// timer event
var timerplaySound;

//
initUI();

//
//
//

function playSound() {
    stopSound();

    fmop.Attack.Tension = Math.random();
    fmop.Decay.Tension = Math.random();
    fmop.triggerAt(ctxAudio, ctxAudio.currentTime);

    ctxAudio.resume();

    var duration = BASE_DURATION * Math.pow(2, randomInt(0, DURATION_MULTIPLIER));
    gainNode.gain.setValueAtTime(gain, ctxAudio.currentTime);

    timerplaySound = setTimeout(playSound, 1000 * duration);
}

function stopSound() {

    clearTimeout(timerplaySound);
}


//
// UI
//

function removeAllChild(elem)
{
    while(elem.firstChild)
        elem.removeChild(elem.firstChild);
}

function initUI() {

}

function onMouseDownButtonKill() {
    stopSound();
}

function onMouseDownButtonPlay() {
    playSound();
}

function onMouseUpButtonPlay() {
    stopSound();
}

function onInputRangeGain(value, elem) {
    gain = clamp(value, elem.min, elem.max);
    elem.value = gain;
}