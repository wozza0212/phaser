import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene")
    }

    create() {
        alert('The PlayScene has started!')
    }
}

export default PlayScene