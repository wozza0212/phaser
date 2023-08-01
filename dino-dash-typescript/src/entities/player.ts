import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    scene: GameScene


    constructor(scene: GameScene, x: number, y:number) {
        super(scene, x, y, 'dino-idle')
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.init();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

    }

    init() {

        
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this
        .setGravityY(5000)
        .setCollideWorldBounds(true)
        .setBodySize(44, 92)
        .setOrigin(0, 1)

        this.registerAnimations();

        
           
    }

    update() {
        const { space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
        
        if(isSpaceJustDown && onFloor){
            this.setVelocityY(-1600)
        }

        if(this.body.deltaAbsY() > 0) {
            
            this.anims.stop();
            this.setTexture('dino-run', 0)
        } else {
            this.playRunAnimation();
        }

        if(this.body.deltaAbsX() === 0) {
            this.anims.stop();
        } else {
            this.playRunAnimation();
        }

        if(!this.scene.isGameRunning) {
            return;
        }


        console.log(this.body.deltaAbsX());


    }

    playRunAnimation() {
        this.play('dino-run', true);
    }


    registerAnimations() {
        this.anims.create({
            key: 'dino-run',
            frames: this.anims.generateFrameNames('dino-run', {start : 2, end : 3}), //last 2 frames, starts at 0
            frameRate: 20,
            repeat: -1
        });
    }
}