function Mouse(canvas) {
    this.canvas = canvas;
    this.initMouse();
}

Mouse.prototype.BUTTON_REVERSE = {
    '1': 'left',
    '2': 'center',
    '3': 'right'
};
Mouse.prototype.BUTTON = {
    'left': '1',
    'center': '2',
    'right': '3'
};

Mouse.prototype.SCROLL_REVERSE = {
    '1': 'Up',
    '-1': 'Down'
};
Mouse.prototype.SCROLL = {
    'Up': '1',
    'Down': '-1'
};


Mouse.prototype.initMouse = function () {

    this.buttonMap = [];

    for (var button in this.BUTTON_REVERSE) {
        this.buttonMap[button] = false;
    }


    var self = this;

    //désactiver la fenetre contextuelle
    this.canvas.oncontextmenu = new Function("return false");

    // evenement a l'activation du click
    var eventActivateMouseButtonDown = new CustomEvent("activatemousebutton");
    this.canvas.addEventListener("mousedown", function (e) {
        if (e.which in self.BUTTON_REVERSE && self.buttonMap[e.which] != true) {
            self.buttonMap[e.which] = true;
            eventActivateMouseButtonDown.buttonCode = e.which;
            eventActivateMouseButtonDown.button = self.BUTTON_REVERSE[e.which];
            eventActivateMouseButtonDown.buttonsActivated = self.getButtonsActivated();
            eventActivateMouseButtonDown.coordonates = {x: e.clientX, y: e.clientY};
            document.dispatchEvent(eventActivateMouseButtonDown);
        }
    });

    // evenement a la desactivation du click
    var eventActivateMouseButtonUp = new CustomEvent("deactivatemousebutton");
    this.canvas.addEventListener("mouseup", function (e) {
        if (e.which in self.BUTTON_REVERSE && self.buttonMap[e.which] != false) {
            self.buttonMap[e.which] = false;
            eventActivateMouseButtonUp.buttonCode = e.which;
            eventActivateMouseButtonUp.button = self.BUTTON_REVERSE[e.which];
            eventActivateMouseButtonUp.buttonsActivated = self.getButtonsActivated();
            eventActivateMouseButtonUp.coordonates = {x: e.clientX, y: e.clientY};
            document.dispatchEvent(eventActivateMouseButtonUp);
        }
    });


    // evenement lors d'un scroll
    var eventActivateMouseScroll = new CustomEvent("activatemousescroll");
    var mouseScrollHandler = function (e) {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta in self.SCROLL_REVERSE) {
            eventActivateMouseScroll.scrollCode = delta;
            eventActivateMouseScroll.position = self.SCROLL_REVERSE[delta];
            document.dispatchEvent(eventActivateMouseScroll);
        }
    };

    document.addEventListener("mousewheel", mouseScrollHandler);
    document.addEventListener("DOMMouseScroll", mouseScrollHandler);

    //evenement lors d'un click avec mouvement
    var eventMouseMoveWhileClick = new CustomEvent("mousemovewhileclick");
    this.canvas.addEventListener("mousemove", function (e) {
        if (self.getButtonsActivated().length > 0) {
            eventMouseMoveWhileClick.bottonCode = self.getButtonsActivated();
            eventMouseMoveWhileClick.coord = {};
            eventMouseMoveWhileClick.coord.x = e.clientX;
            eventMouseMoveWhileClick.coord.y = e.clientY;
            eventMouseMoveWhileClick.buttonsActivateds = self.getButtonsActivated();
            document.dispatchEvent(eventMouseMoveWhileClick);
        }
    });

};

Mouse.prototype.getButtonsActivated = function () {
    var activatedButtons = [];

    for (var button in this.BUTTON_REVERSE) {
        if (this.buttonMap[button] == true) {
            activatedButtons.push(button);
        }
    }
    return activatedButtons;
};


module.exports = Mouse;