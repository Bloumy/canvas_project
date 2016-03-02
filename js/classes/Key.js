function Key() {
    this.initKeyMap();
}

Key.prototype.KEY = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    A: 65,
    D: 68,
    Q: 81,
    S: 83,
    W: 87,
    Z: 90,
    a: 97,
    d: 100,
    q: 113,
    s: 115,
    w: 119,
    z: 122
};

Key.prototype.KEY_REVERSE = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'A',
    68: 'D',
    81: 'Q',
    83: 'S',
    87: 'W',
    90: 'Z',
    97: 'a',
    100: 'd',
    113: 'q',
    115: 's',
    119: 'w',
    122: 'z'
};

Key.prototype.initKeyMap = function () {

    this.keyMap = [];

    for (var key in this.KEY_REVERSE) {
        this.keyMap[key] = false;
    }

    var self = this;
    var eventKeyDown = new CustomEvent("activatekey");
    window.onkeydown = function (e) {
        if (e.keyCode in self.KEY_REVERSE && self.keyMap[e.keyCode] != true) {
            self.keyMap[e.keyCode] = true;
            eventKeyDown.keyCode = e.which || e.keyCode;
            eventKeyDown.key = self.KEY_REVERSE[e.keyCode];
            eventKeyDown.keysActivated = self.getKeysActivated();
            document.dispatchEvent(eventKeyDown);
        }
    };

    var eventKeyUp = new CustomEvent("deactivatekey");
    window.onkeyup = function (e) {
        if (e.keyCode in self.KEY_REVERSE && self.keyMap[e.keyCode] != false) {
            self.keyMap[e.keyCode] = false;
            eventKeyUp.keyCode = e.which || e.keyCode;
            eventKeyUp.key = self.KEY_REVERSE[e.keyCode];
            eventKeyUp.keysActivated = self.getKeysActivated();
            document.dispatchEvent(eventKeyUp);
        }
    };
};

Key.prototype.getKeysActivated = function () {
    var activatedKeys = [];

    for (var key in this.KEY_REVERSE) {
        if (this.keyMap[key] == true) {
            activatedKeys.push(key);
        }
    }
    return activatedKeys;
};

module.exports = Key;