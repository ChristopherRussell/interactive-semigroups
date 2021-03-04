import { EggBoxScene } from "./eggBoxScene.js"

export class BaseScene extends Phaser.Scene {
    constructor(key, data) {
        super(key);
        this.semigroup = data.semigroup; 
        this.lattice = data.lattice; // Congruence Lattice of this.semigroup
        this.count = 0;
        this.zones = [];
    }

    create() {
        let window1 = this.createWindow(EggBoxScene, this.semigroup);
        let window2 = this.createWindow(EggBoxScene, this.lattice.quotientSemigroups.semi1);
        this.activeWindow = window1;

        this.hotkeys = new Hotkeys(this.input.keyboard);
    }

    update() {
        if (this.hotkeys.up.isDown)
        {
            this.activeWindow.cameras.main.scrollY -= 4;
        }
        else if (this.hotkeys.down.isDown)
        {
            this.activeWindow.cameras.main.scrollY += 4;
        }
        if (this.hotkeys.left.isDown)
        {
            this.activeWindow.cameras.main.scrollX += 4;
        }
        else if (this.hotkeys.right.isDown)
        {
            this.activeWindow.cameras.main.scrollX -= 4;
        } else if (this.hotkeys.q.isDown)
        {
            this.activeWindow.cameras.main.zoom += 0.01;
        } else if (this.hotkeys.w.isDown)
        {            
            this.activeWindow.cameras.main.zoom -= 0.01;
        }
    }

    createWindow(sceneClass, data) {
        var x = Phaser.Math.Between(64, 128);
        var y = Phaser.Math.Between(64, 128);

        var handle = 'window' + this.count++;
        console.log(handle);

        // This zone covers the camera of a scene, giving us hitbox
        // for dragging the camera around.
        var zone = this.add.zone(x, y, 600, 600).setInteractive().setOrigin(0);        
        // newest window hgas depth priority for on click events
        // zone.setDepth(this.count - 1);

        var scene = new sceneClass(handle, data, zone);

        this.input.setDraggable(zone);
        this.input.enableDebug(zone);

        zone.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
            scene.refresh();
            // this.scene.zoneToTop(this);
        });

        // We want to be able to change active window by clicking (or dragging)
        zone.on('pointerdown', function() {
            this.scene.activeWindow = scene;
        })

        // this.zones.push(zone);
        return this.scene.add(handle, scene, true);
    }

    // zoneToTop(zone) {
    //     console.log("moving zone to top: ");
    //     if (zone.depth == this.zones.length) { return }
    //     for (var i = 0; i < this.zones.length; i++) {
    //         this.zones[i].setDepth(this.zones[i].depth - 1);
    //     }
    //     zone.setDepth(this.zones.length);
    // }
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
        // this.i = keyboardPlugin.addKey('I', true, false);
        this.c = keyboardPlugin.addKey('C', true, false);

        // controls
        this.d.on('down', () => { this.scene.activeWindow.drawDClasses() });
        this.r.on('down', () => { this.scene.activeWindow.drawRClasses() });
        this.l.on('down', () => { this.scene.activeWindow.drawLClasses() });
        this.h.on('down', () => { this.scene.activeWindow.drawHClasses() });
        // this.i.on('down', () => { this.scene.highlightIdeal() });
        this.c.on('down', () => { this.scene.activeWindow.nextCongruence() });
    }
}