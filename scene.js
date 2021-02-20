export class MyScene extends Phaser.Scene {
    constructor(key, semigroup) {
        super(key);
        this.semigroup = semigroup;
        this.semigroup.boxes = { D:[], R:[], L:[], H:[] };
        this.state = 'empty';
        this.idealCounter = 0;
    }

    create() {
        // main camera for viewing eggbox diagram, set up so that the
        // whole diagram will be visible
        this.cameras.main.setSize(800, 700);
        let totalNrLClasses = 0;
        this.semigroup.L.forEach( e => totalNrLClasses += e.length );
        let expectedHeight = totalNrLClasses * 100 + this.semigroup.D.length * 100;
        this.cameras.main.setZoom(700 / expectedHeight);
        this.cameras.main.setScroll(0, (expectedHeight - 700) / 2);

        // console camera
        this.cameras.add(0, 700, 800, 100).setScroll(-6000,-6000);

        // console text
        this.text = this.add.text(-5990, -5990, "<console>");
        this.text.setWordWrapWidth(780);
        this.hotkeys = new Hotkeys(this.input.keyboard);

        // todo refine these 'on' events to box elements using Phaser Groups
        // click and hover events for boxes
        this.input.on('gameobjectdown', (pointer, gameObject) =>
            {this.text.setText(this.textPrefix + String(this.stringElements(gameObject.elements)))});
        this.input.on('gameobjectover', (pointer, gameObject) =>
            {gameObject.setFillStyle('0x696969')});
        this.input.on('gameobjectout', (pointer, gameObject) => 
            {gameObject.setFillStyle(gameObject.color)});
    }

    update() {
        if (this.hotkeys.up.isDown)
        {
            this.cameras.main.scrollY -= 4;
        }
        else if (this.hotkeys.down.isDown)
        {
            this.cameras.main.scrollY += 4;
        }
        if (this.hotkeys.left.isDown)
        {
            this.cameras.main.scrollX -= 4;
        }
        else if (this.hotkeys.right.isDown)
        {
            this.cameras.main.scrollX += 4;
        } else if (this.hotkeys.q.isDown)
        {
            this.cameras.main.zoom += 0.01;
        } else if (this.hotkeys.w.isDown)
        {            
            this.cameras.main.zoom -= 0.01;
        }
    }

    drawDClasses() {
        this.changeState('D');
        if (this.D != undefined) {
            this.D.setVisible(true);
            return;
        }
        this.D = this.add.group();
        let y = 0;
        for (var i = 0; i < this.semigroup.D.length; i++) {
            let nrRClasses = this.semigroup.R[i].length,
                nrLClasses = this.semigroup.L[i].length;
            y += nrLClasses * 50;
            this.semigroup.boxes.D[i] = new GreensXClass(
                this.semigroup.D[i], this.semigroup.D_ranks[i], false, this.D,
                this, 400, y, nrRClasses * 100, nrLClasses * 100, '0xA8A8A8');
            y += nrLClasses * 50 + 100;
        }
    }

    drawRClasses() {
        this.changeState('R');
        if (this.R != undefined) {
            this.R.setVisible(true);
            return;
        }
        this.R = this.add.group();
        let y = 0,
            x = 0,
            nrLClasses = 0,
            nrRClasses = 0;
        for (var i = 0; i < this.semigroup.R.length; i++) { // for each D-class
            nrLClasses = this.semigroup.L[i].length;
            nrRClasses = this.semigroup.R[i].length;
            y += nrLClasses * 50;
            x = 400 + (nrRClasses - 1) * 50;
            this.semigroup.boxes.R[i] = [];
            for (var j = 0; j < this.semigroup.R[i].length; j++) {
                this.semigroup.boxes.R[i][j] = new GreensXClass(
                    this.semigroup.R[i][j], this.semigroup.R_kernels[i][j],
                    true, this.R, this, x, y, 100, nrLClasses * 100, '0xA8A8A8');
                x -= 100;
            }
            y += nrLClasses * 50 + 100;
        }
    }

    drawLClasses() {
        this.changeState('L');
        if (this.L != undefined) {
            this.L.setVisible(true);
            return;
        }
        this.L = this.add.group();
        let y = 50,
            nrLClasses = 0,
            nrRClasses = 0;
        for (var i = 0; i < this.semigroup.L.length; i++) { // for each D-class
            nrLClasses = this.semigroup.L[i].length;
            nrRClasses = this.semigroup.R[i].length;
            this.semigroup.boxes.L[i] = [];
            for (var j = 0; j < this.semigroup.L[i].length; j++) {
                this.semigroup.boxes.L[i][j] = new GreensXClass(
                    this.semigroup.L[i][j], this.semigroup.L_images[i][j],
                    false, this.L, this, 400, y, nrRClasses * 100, 100, '0xA8A8A8');
                y+= 100;
            }
            y += 100;
        }
    }

    drawHClasses() {
        this.changeState('H');
        if (this.H != undefined) {
            this.H.setVisible(true);
            return;
        }
        this.H = this.add.group();
        let y = 50,
            x = 0,
            nrLClasses = 0,
            nrRClasses = 0;
        for (var i = 0; i < this.semigroup.D.length; i++) { // for each D-class
            nrLClasses = this.semigroup.L[i].length;
            nrRClasses = this.semigroup.R[i].length;
            this.semigroup.boxes.H[i] = [];
            for (var j = 0; j < nrLClasses; j++) {
                x = -(nrRClasses - 1) * 50;
                for (var k = 0; k < nrRClasses; k++) {
                    this.semigroup.boxes.H[i][j * nrRClasses + k]
                        = new GreensXClass(this.semigroup.H[i][j * nrRClasses + k],
                            this.semigroup.H_groups[i][j * nrRClasses + k], false,
                            this.H, this, 400 + x, y, 100, 100, '0xA8A8A8');
                    x += 100;
                }
                y += 100;
            }
            y += 100;
        }
    }

    clearBoxColours() {
        let boxes = this.semigroup.boxes[this.state];
        if (this.state == "D") { 
            boxes = [boxes]
        };

        for (var d of boxes) {
            for (var box of d) {
                box.setFillStyle('0xA8A8A8');
                box.color = "0xA8A8A8";
            }
        }
    }

    highlightIdeal() {
        let boxes = this.semigroup.boxes[this.state];
        if (this.state == "D") { 
            boxes = [boxes]
        };

        this.clearBoxColours();

        for (var d of boxes) {
            for (var box of d) {
                if (box.elements.some( e => this.semigroup.ideals[this.idealCounter].includes(e) )) {
                    box.setFillStyle('0x6E1718');
                    box.color = "0x6E1718";
                }
            }
        }
    }

    stringElements(c) {
        let out = "[";
        for (var i = 0; i < c.length; i++) {
            if (i != 0) { out += ", " }
            out += "[" + String(this.semigroup.elm[c[i] - 1]) + "]";
        }
        out += "]";
        return out;
    }

    changeState(state) {
        if (this.state == state) {
            return;
        }
        if (this.state != 'empty') {
            this[this.state].setVisible(false);
        }
        this.state = state;
        this.textPrefix = '<' + state + '-class>: ';
        this.idealCounter = 0;
        this.clearBoxColours();
    }
}

class Hotkeys {
    constructor(keyboardPlugin) {
        this.scene = keyboardPlugin.scene;
        this.left = keyboardPlugin.addKey('LEFT', true, true);
        this.up = keyboardPlugin.addKey('UP', true, true);
        this.right = keyboardPlugin.addKey('RIGHT', true, true);
        this.down = keyboardPlugin.addKey('DOWN', true, true);
        this.space = keyboardPlugin.addKey('SPACE', true, false);
        this.d = keyboardPlugin.addKey('D', true, false);
        this.r = keyboardPlugin.addKey('R', true, false);
        this.l = keyboardPlugin.addKey('L', true, false);
        this.h = keyboardPlugin.addKey('H', true, false);
        this.q = keyboardPlugin.addKey('Q', true, false);
        this.w = keyboardPlugin.addKey('W', true, false);
        this.i = keyboardPlugin.addKey('I', true, false);

        // controls
        this.d.on('down', () => { this.scene.drawDClasses() });
        this.r.on('down', () => { this.scene.drawRClasses() });
        this.l.on('down', () => { this.scene.drawLClasses() });
        this.h.on('down', () => { this.scene.drawHClasses() });
        this.i.on('down', () => {
            this.scene.highlightIdeal(this.scene.semigroup.ideals[this.scene.idealCounter], this.scene.state);
            this.scene.idealCounter = (this.scene.idealCounter + 1) % this.scene.semigroup.ideals.length;
        });
    }
}

class GreensXClass extends Phaser.GameObjects.Rectangle {
    constructor(elements, label, isRClass, phaserGroup, ...args) {
        super(...args);
        this.scene.add.existing(this);
        this.setStrokeStyle(5, '0x000000', 0.2);
        this.color = "0xA8A8A8";
        this.setInteractive();
        this.elements = elements;
        this.text = this.scene.add.text(this.x, this.y, "", { fontSize: '30px', align: 'center' });
        if (isRClass) {
            this.text.setText(stringKernel(label));
            this.text.setX(this.text.x + this.text.height / 2);
            this.text.setY(this.text.y - this.text.width / 2);
            this.text.setAngle(90);
        } else {
            this.text.setText(String(label));
            this.text.setX(this.text.x - this.text.width / 2);
            this.text.setY(this.text.y - this.text.height / 2);
        }
        phaserGroup.addMultiple([this, this.text]);
    }
}

function stringKernel(list) {
    let out = "";
    for (var i = 0; i < list.length; i++) {
        if (i != 0) { out += "|" }
        out += String(list[i]);
    }
    return out;
}