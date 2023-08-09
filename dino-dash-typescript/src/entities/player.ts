import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    scene: GameScene


    constructor(scene: GameScene, x: number, y:number) {
        super(scene, x, y, 'dino-run')
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
        .setOffset(20, 0);

        this.registerAnimations();

        
           
    }

    update() {
        const { space, down } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const isDownJustDown = Phaser.Input.Keyboard.JustDown(down);
        const isDownJustUp = Phaser.Input.Keyboard.JustUp(down);

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
        
        if(isSpaceJustDown && onFloor){
            this.setVelocityY(-1600)
        }

        if(isDownJustDown && onFloor) {
            this.body.setSize(this.body.width, 58);
            this.setOffset(60, 34);
        }

        if(isDownJustUp && onFloor) {
            this.body.setSize(44, 92);
            this.setOffset(20, 0);
        }

        if (!(this.scene as any).isGameRunning) {
            return;
          }

        if(this.body.deltaAbsY() > 0) {
            
            this.anims.stop();
            this.setTexture('dino-run', 0)
        } else {
            this.playRunAnimation();
        }

        // if(this.body.deltaAbsX() === 0) {
        //     this.anims.stop();
        // } else {
        //     this.playRunAnimation();
        // }

        if(!this.scene.isGameRunning) {
            return;
        }


    }

    playRunAnimation() {
        // ternary operater 

        this.body.height <= 58 ?
        this.play('dino-down', true) : 
        this.play('dino-run', true);


    }


    registerAnimations() {
        this.anims.create({
            key: 'dino-run',
            frames: this.anims.generateFrameNames('dino-run', {start : 2, end : 3}), //last 2 frames, starts at 0
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'dino-down',
            frames: this.anims.generateFrameNames('dino-down'), //last 2 frames, starts at 0
            frameRate: 10,
            repeat: -1
        });
    }

    die() {
        this.anims.pause();
        this.setTexture('dino-hurt');
    }
}