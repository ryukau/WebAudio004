function interp(a, b, r) {
    return (1 - r) * a + r * b;
}

function clamp(val, min, max) {
    return isNaN(val) ? 0 : Math.max(min, Math.min(val, max));
}

function randomInt(min, max) {
    // 戻り値は [min, max) の整数
    return Math.floor(min + Math.random() * (max - min));
}

function toN0(number) {
    if (isNaN(nubmer)) {
        return 0;
    }
    else {
        return (number < 0) ? 0 : number;
    }
}

function toColorCode(r, g, b) {
    // "#123456" といった形式のカラーコードを表す文字列を生成

    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    r = ("0" + Math.floor(r).toString(16)).slice(-2);
    g = ("0" + Math.floor(g).toString(16)).slice(-2);
    b = ("0" + Math.floor(b).toString(16)).slice(-2);
    return "#" + r + g + b;
}

function modFreq(a, b) {
    // 周波数 a が周波数 b から2オクターブの範囲になるまでオクターブを下げる
    // (4 * b) の 4 を適当に変えることで b からの範囲を設定

    while ((4 * b) <= a) {
        a /= 2;
    }
    return a;
}