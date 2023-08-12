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
    obstacles : Phaser.Physics.Arcade.Group;
    clouds : Phaser.GameObjects.Group;
    ground : Phaser.GameObjects.TileSprite;
    gameSpeed: number = 5

    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;

    scoreText: Phaser.GameObjects.Text;

    gameOverContainer: Phaser.GameObjects.Container;


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

        this.createObstacles();
        this.createGameOVerContainer();
        this.createAnimations();

        this.handleGameStart();
        this.handleObstacleCollisions();
        this.handleGameRestart();
        this.createScore();

    }

    update(time: number, delta: number): void {
        if(!this.isGameRunning){return;}

        this.spawnTime += delta
        if(this.spawnTime >= this.spawnInterval) {
            this.SpawnObstacle();
            this.spawnTime = 0
        }

        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)
        Phaser.Actions.IncX(this.clouds.getChildren(), -3)

        console.log(this.obstacles.getChildren().length)

        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) {
                this.obstacles.remove(obstacle)
            }
        })

        this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if (cloud.getBounds().right < 0) {
                cloud.x = this.gameWidth + 100
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


        this.clouds = this.add.group();

        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2, 170, 'cloud'),
            this.add.image(this.gameWidth -80 , 80, 'cloud'),
            this.add.image(this.gameWidth / 1.3, 100, 'cloud'), 
        ])

        this.clouds.setAlpha(0)
    }

    createGameOVerContainer() {
        this.gameOverText = this.add.image(0, 0, 'game-over');
        this.restartText = this.add.image(0, 60, 'restart').setInteractive();

        this.gameOverContainer = this.add
        .container(this.gameWidth/2, this.gameHeight/4, [this.gameOverText, this.restartText])
        .setAlpha(0);
    }

    createObstacles() {
        this.obstacles = this.physics.add.group()
    }

    handleGameRestart() {
        this.restartText.on('pointerdown', () => {
            this.physics.resume();
            this.player.setVelocityY(0)

            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();

            this.isGameRunning = true;
        })

    }

    handleObstacleCollisions() {
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.anims.pauseAll();

            this.player.die();

            this.gameOverContainer.setAlpha(1);

            this.spawnTime = 0;
            this.gameSpeed = 5;
        });

    }

    handleGameStart() {
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setOrigin(0, 1)
            .setAlpha(0)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y === 10){
                this.startTrigger.body.reset(0, this.gameHeight);
                this.scoreText.setAlpha(1);
                return;
            }

            this.clouds.setAlpha(1)

            
    
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

    createScore() {
        this.scoreText = this.add.text(this.gameWidth, 0, '00000', {
            fontSize: 30,
            fontFamily: 'Pixel',
            color: '#535353',
            resolution: 5
        })
            .setOrigin(1, 0)
            .setAlpha(0)
    }

    SpawnObstacle() {

        // Yposition = 340
        // Xposition = randomly between 600 and 900
        const obstaclesCount = PRELOAD_CONFIG.cactusCount + PRELOAD_CONFIG.birdsCount;
        const obstacleNumber = Math.floor(Math.random() 
        * obstaclesCount) + 1;
        const distance = Phaser.Math.Between(600, 1000)
        let obstacle;

        if(obstacleNumber > PRELOAD_CONFIG.cactusCount) {

            const enemyPossibleHeight = [20, 70]
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * 2)]

            obstacle = this.obstacles
            .create(this.gameWidth + distance, this.gameHeight - enemyHeight, `enemy-bird`)
            obstacle.play('enemy-bird-fly', true)
            



        } else {
            obstacle = this.obstacles
            .create(distance, this.gameHeight, `obstacle-${obstacleNumber}`)
            .setScale(0.6)
    
        }

        obstacle 
            .setOrigin(0, 1)
            .setImmovable()
            
    }


    createAnimations() {
        this.anims.create({
            key: 'enemy-bird-fly',
            frames: this.anims.generateFrameNumbers('enemy-bird'),
            frameRate: 6,
            repeat: -1
        })
    }
}

export default PlayScene