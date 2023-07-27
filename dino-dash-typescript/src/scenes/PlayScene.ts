import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/player";
class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene")
    }

    startTrigger : SpriteWithDynamicBody;
    player : Player;

    get gameHeight() {
        return this.game.config.height as number
    }

    create() {
        this.createEnvironment()
        this.createPlayer()
        this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0, 1).setAlpha(0)
        this.physics.add.overlap(this.startTrigger, this.player, () => {
            console.log('Collision')
        })

    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    createEnvironment() {
        this.add
            .tileSprite(0, this.gameHeight, 88, 26, 'ground')
            .setOrigin(0, 1)
    }

    update(time: number, delta: number): void {
        
    }
}

export default PlayScene