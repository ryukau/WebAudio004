//
// Synth
//
// curve.js が必要
//

const BASE_FREQ = 440;
const CURVE_RESOLUTION = 128;

var bSplineCurve = new BSplineCurve(CURVE_RESOLUTION, 1024);

class EnvelopeParam {
  constructor(type) {
    this.curve = null
    if (type === "attack") {
      this.curve = bSplineCurve.Attack
    }
    else if (type === "decay") {
      this.curve = bSplineCurve.Decay
    }

    this.time = 0.1
    this.tension = Math.floor(this.curve.length / 2)
  }

  get Time() {
    return this.time
  }

  get Curve() {
    return this.curve[this.tension]
  }

  set Time(time) {
    this.time = toN0(time)
  }

  set Tension(tension) {
    this.tension = clamp(Math.floor(tension * (CURVE_RESOLUTION - 1)), 0, this.curve.length - 1)
  }
}

// アタックとディケイを備えた簡単なFMオペレータ
class FmOperator {
  constructor(ctxAudio) {
    this.gain = ctxAudio.createGain()

    this.osc
    this.setNewOscillator(ctxAudio)

    this.attack = new EnvelopeParam("attack")
    this.decay = new EnvelopeParam("decay")

    this.lastTriggeredTime = 0
  }

  get Oscillator() {
    return this.osc
  }

  get Attack() {
    return this.attack
  }

  get Decay() {
    return this.decay
  }

  connect(node) {
    this.gain.connect(node)
  }

  setNewOscillator(ctxAudio) {
    this.osc = ctxAudio.createOscillator()
    this.osc.frequency.value = 60
    this.osc.connect(this.gain)
  }

  triggerAt(ctxAudio, time) {
    this.setNewOscillator(ctxAudio)

    var curve = this.attack.Curve.slice(0)
    for (var i = 0; i < curve.length; ++i) {
      curve[i] *= 2400
    }

    var curve2 = this.decay.Curve.slice(0)
    for (var i = 0; i < curve2.length; ++i) {
      curve2[i] *= 2400
    }

    this.osc.detune.cancelScheduledValues(this.lastTriggeredTime)
    this.gain.gain.cancelScheduledValues(this.lastTriggeredTime)
    this.lastTriggeredTime = time

    this.osc.detune.setValueCurveAtTime(curve, time, this.attack.Time)
    this.osc.detune.setValueCurveAtTime(curve2, time + this.attack.Time + 0.001, this.decay.Time)

    this.gain.gain.setValueCurveAtTime(this.attack.Curve, time, this.attack.Time)
    this.gain.gain.setValueCurveAtTime(this.decay.Curve, time + this.attack.Time + 0.001, this.decay.Time)

    this.prevEndTime = time + this.attack.Time + 0.001 + this.decay.Time // debug

    this.osc.start(time)
    this.osc.stop(time + this.attack.Time + this.decay.Time)
  }
}
