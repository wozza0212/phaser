import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/player";
class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene")
    }
    startTrigger : SpriteWithDynamicBody;
    player : Player;
    ground : Phaser.GameObjects.TileSprite;

    get gameHeight() {
        return this.game.config.height as number
    }

    get gameWidth() {
        return this.game.config.width as number
    }

    create() {
        this.createEnvironment()
        this.createPlayer()
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setOrigin(0, 1)
            .setAlpha(0)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y === 10){
                this.startTrigger.body.reset(0, this.gameHeight);
                console.log('Moving upper trigger')
                return;
            }
            this.startTrigger.body.reset(20000, 20000) //off screen

            const rollOutEvent = this.time.addEvent({
                delay: 1000/60,
                loop: true, 
                callback: () => {
                    this.player.setVelocityX(80)
                    this.ground.width += 17;

                    if (this.ground.width >= this.gameWidth){
                        rollOutEvent.remove();
                        this.player.setVelocityX(0)
                        console.log('Stopping rollout')
                    }

                }
            })

        })

    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    createEnvironment() {
        this.ground = this.add
            .tileSprite(0, this.gameHeight, 88, 26, 'ground')
            .setOrigin(0, 1)
    }

    update(time: number, delta: number): void {

        
    }
}

export default PlayScene