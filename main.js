import { MyScene } from './scene.js'
import { semigroup } from './semigroupData.js'

let visualiser = new MyScene('myScene', semigroup);

let gameConfig = { 
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: [visualiser],
    backgroundColor: "0xB0B553"
};

let game = new Phaser.Game(gameConfig);