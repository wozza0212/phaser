import Phaser from "phaser";
import { SpriteWithDynamicBody } from "../types";
import { Player } from "../entities/Player";
import { GameScene } from './GameScene'
import { PRELOAD_CONFIG } from "..";
class PlayScene extends GameScene {

    // Playscene => Super => Gamescene => Super => Phaser.Scene
    constructor() {
        super("PlayScene")
    }
    startTrigger : SpriteWithDynamicBody;
    player : Player;
    obstacles : Phaser.Physics.Arcade.Group
    ground : Phaser.GameObjects.TileSprite;
    gameSpeed: number = 5


    spawnInterval: number = 1500
    spawnTime: number = 0
    obstacleNumber: number

    get gameHeight() {
        return this.game.config.height as number
    }
    
    get gameWidth() {
        return this.game.config.width as number
    }

    create() {
        this.createEnvironment()
        this.createPlayer()
        this.obstacles = this.physics.add.group()
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setOrigin(0, 1)
            .setAlpha(0)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y === 10){
                this.startTrigger.body.reset(0, this.gameHeight);
                return;
            }
            this.startTrigger.body.reset(20000, 20000) //off screen

            const rollOutEvent = this.time.addEvent({
                delay: 1000/60,
                loop: true, 
                callback: () => {
                    this.player.playRunAnimation();
                    this.player.setVelocityX(80)
                    this.ground.width += 17;

                    if (this.ground.width >= this.gameWidth){
                        rollOutEvent.remove();
                        this.player.setVelocityX(0)
                        this.isGameRunning = true;
                    }

                }
            })

        })

    }

    update(time: number, delta: number): void {
        if(!this.isGameRunning){return;}


        this.spawnTime += delta
        if(this.spawnTime >= this.spawnInterval) {
            this.SpawnObstacle();
            this.spawnTime = 0
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)

        console.log(this.obstacles.getChildren().length)

        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) {
                this.obstacles.remove(obstacle)
            }
        })

        this.ground.tilePositionX += this.gameSpeed
    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    createEnvironment() {
        this.ground = this.add
            .tileSprite(0, this.gameHeight, 88, 26, 'ground')
            .setOrigin(0, 1)
    }

    SpawnObstacle() {

        // Yposition = 340
        // Xposition = randomly between 600 and 900
        const obstacleNumber = Math.floor(Math.random() * PRELOAD_CONFIG.cactusCount) + 1
        const distance = Phaser.Math.Between(600, 900)

        this.obstacles.create(distance, this.gameHeight, `obstacle-${obstacleNumber}`)
        .setOrigin(0, 1)
        
    }
}

export default PlayScene