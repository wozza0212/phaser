export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y:number) {
        super(scene, x, y, 'dino-idle')
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.init();

    }

    init() {
        this
        .setGravityY(5000)
        .setCollideWorldBounds(true)
        .setBodySize(44, 92)
        .setOrigin(0, 1)
           
    }
}