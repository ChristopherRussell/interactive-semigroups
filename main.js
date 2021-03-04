import { BaseScene } from './baseScene.js'
import { semigroupData } from './semigroupData.js'

let main = new BaseScene('main', semigroupData);

let gameConfig = { 
    type: Phaser.AUTO,
    width: 2000,
    height: 1500,
    scene: [main],
    backgroundColor: "0xB0B553"
};

let game = new Phaser.Game(gameConfig);