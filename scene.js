export class MyScene extends Phaser.Scene {
    constructor(key, semigroup) {
        super(key);
        this.semigroup = semigroup;
        this.semigroup.boxes = { D:[], R:[], L:[], H:[] };
        this.state = 'empty';
        this.idealCounter = 0;
    }

    create() {
        this.cameras.main.setSize(800, 700);
        let totalNrLClasses = 0;
        this.semigroup.L.forEach( e => totalNrLClasses += e.length );
        let expectedHeight = totalNrLClasses * 100 + this.semigroup.D.length * 100;
        this.cameras.main.setZoom(700 / expectedHeight);
        this.cameras.main.setScroll(0, (expectedHeight - 700) / 2);
        this.cameras.add(0, 700, 800, 100).setScroll(-6000,-6000);
        this.text = this.add.text(-5990, -5990, "<console>");
        this.text.setWordWrapWidth(780);
        this.hotkeys = new Hotkeys(this.input.keyboard);
        // this.input.on('gameobjectdown', (pointer, gameObject) => {console.log(gameObject.elements)} );
        this.input.on('gameobjectdown', (pointer, gameObject) =>
            {this.text.setText(this.textPrefix + String(this.classElements(gameObject.elements)))});
        this.input.on('gameobjectover', (pointer, gameObject) =>
            {gameObject.setFillStyle('0x696969')});
        this.input.on('gameobjectout', (pointer, gameObject) => 
            {gameObject.setFillStyle('0xA8A8A8')});
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
        //  else if (this.hotkeys.d.isDown)
        // {
        //     this.drawDClasses();
        // } else if (this.hotkeys.r.isDown)
        // {            
        //     this.drawRClasses();
        // } else if (this.hotkeys.l.isDown)
        // {            
        //     this.drawLClasses();
        // } else if (this.hotkeys.h.isDown)
        // {            
        //     this.drawHClasses();
        // } else if (this.hotkeys.i.isDown)
        // {
        //     this.highlightIdeal(this.semigroup.ideals[this.idealCounter], this.state);
        //     this.idealCounter = (this.idealCounter + 1) % this.semigroup.ideals.length;
        // }
    }

    drawDClasses() {
        if (this.state == 'D') {
            return;
        }
        this.state = 'D';
        this.textPrefix = '<D-class>: ';
        let y = 0;
        for (var i = 0; i < this.semigroup.D.length; i++) {
            let nrRClasses = this.semigroup.R[i].length,
                nrLClasses = this.semigroup.L[i].length;
            y += nrLClasses * 50;
            this.semigroup.boxes.D[i] = this.add.rectangle(400, y, nrRClasses * 100, nrLClasses * 100, '0xA8A8A8');
            this.semigroup.boxes.D[i].setStrokeStyle(5, '0x000000', 0.1);
            this.semigroup.boxes.D[i].setInteractive();
            this.semigroup.boxes.D[i].elements = this.semigroup.D[i];
            y += nrLClasses * 50 + 100;
        }
    }

    drawRClasses() {
        if (this.state == 'R') {
            return;
        }
        this.state = 'R';
        this.textPrefix = '<R-class>: ';
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
                this.semigroup.boxes.R[i][j] = this.add.rectangle(x, y, 100, nrLClasses * 100, '0xA8A8A8');
                this.semigroup.boxes.R[i][j].setStrokeStyle(5, '0x000000', 0.1);
                this.semigroup.boxes.R[i][j].setInteractive();
                this.semigroup.boxes.R[i][j].elements = this.semigroup.R[i][j];
                x -= 100;
            }
            y += nrLClasses * 50 + 100;
        }
    }

    drawLClasses() {
        if (this.state == 'L') {
            return;
        }
        this.textPrefix = '<L-class>: ';
        this.state = 'L';
        let y = 50,
            nrLClasses = 0,
            nrRClasses = 0;
        for (var i = 0; i < this.semigroup.L.length; i++) { // for each D-class
            nrLClasses = this.semigroup.L[i].length;
            nrRClasses = this.semigroup.R[i].length;
            this.semigroup.boxes.L[i] = [];
            for (var j = 0; j < this.semigroup.L[i].length; j++) {
                this.semigroup.boxes.L[i][j] = this.add.rectangle(400, y, nrRClasses * 100, 100, '0xA8A8A8');
                this.semigroup.boxes.L[i][j].setStrokeStyle(5, '0x000000', 0.1);
                this.semigroup.boxes.L[i][j].setInteractive();
                this.semigroup.boxes.L[i][j].elements = this.semigroup.L[i][j];
                y+= 100;
            }
            y += 100;
        }
    }

    drawHClasses() {
        if (this.state == 'H') {
            return;
        }
        this.textPrefix = '<H-class>: ';
        this.state = 'H';
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
                        = this.add.rectangle(400 + x, y, 100, 100, '0xA8A8A8');
                    this.semigroup.boxes.H[i][j * nrRClasses + k].setStrokeStyle(5, '0x000000', 0.1);
                    this.semigroup.boxes.H[i][j * nrRClasses + k].setInteractive();
                    this.semigroup.boxes.H[i][j * nrRClasses + k].elements
                        = this.semigroup.H[i][j * nrRClasses + k];
                    x += 100;
                }
                y += 100;
            }
            y += 100;
        }
    }

    highlightIdeal(ideal, state) {
        switch (state) {
            case "D":
                this.hightlight(ideal, this.semigroup.boxes.D);
                break;
            case "R":
                this.hightlight(ideal, [].concat.apply([], this.semigroup.boxes.R));
                break;
            case "L":
                this.hightlight(ideal, [].concat.apply([], this.semigroup.boxes.L));
                break;
            case "H":
                this.hightlight(ideal, [].concat.apply([], this.semigroup.boxes.H));
                break;
        }
    }

    hightlight(ideal, list) {
        for (var i = 0; i < list.length; i++) {
            list[i].setFillStyle('0xA8A8A8');
            if (list[i].elements.some( e => ideal.includes(e) )) {
                list[i].setFillStyle('0x6E1718');
            }
        }
    }

    classElements(c) {
        let out = "[";
        for (var i = 0; i < c.length; i++) {
            if (i != 0) { out += ", " }
            out += "[" + String(this.semigroup.elm[c[i] - 1]) + "]";
        }
        out += "]";
        return out;
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

        this.d.on('down', () => { this.scene.drawDClasses() });
        this.r.on('down', () => { this.scene.drawRClasses() });
        this.l.on('down', () => { this.scene.drawLClasses() });
        this.h.on('down', () => { this.scene.drawHClasses() });
        this.i.on('down', () => {
            console.log(this.scene.idealCounter);
            console.log(this.scene.semigroup.ideals, this.scene.state);
            this.scene.highlightIdeal(this.scene.semigroup.ideals[this.scene.idealCounter], this.scene.state);
            this.scene.idealCounter = (this.scene.idealCounter + 1) % this.scene.semigroup.ideals.length;
        });
    }
}