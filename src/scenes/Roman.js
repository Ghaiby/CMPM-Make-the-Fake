class Roman extends Phaser.Scene{
    constructor (){
        super('Roman')
    }

    preload(){
        this.load.image('colosseum', './assets/Roman_background.png');
        this.load.image('roman_platform', './assets/RP.png');
    }

    create(){
        this.add.image(game.config.width/2, game.config.height/2, 'colosseum');

        this.scooby = new Scooby(this, game.config.width / 2, game.config.height / 2);

        this.platforms = this.physics.add.staticGroup();

        this.createPlatform(game.config.width / 3, game.config.height / 1.6, 1.5);
        this.createPlatform(game.config.width / 1.4, game.config.height / 1.6, 1.5);

        this.createPlatform(game.config.width / 6, game.config.height / 1.2, 1);
        this.createPlatform(game.config.width / 1.2, game.config.height / 1.2, 1);

        this.createPlatform(game.config.width / 6, game.config.height / 3.6, 1);
        this.createPlatform(game.config.width / 1.2, game.config.height / 3.6, 1);

        this.createPlatform(game.config.width / 2, game.config.height / 4.8, 1);
        
        //physics set up
        this.physics.world.gravity.y = 180;       
        this.physics.add.collider(this.scooby, this.platforms);


        NUMS.ONE = this.input.keyboard.addKey(NUMS.ONE);
        NUMS.TWO = this.input.keyboard.addKey(NUMS.TWO);
    }

    update(){
        //switch levels for Debug purposes 
        if (Phaser.Input.Keyboard.JustDown(NUMS.ONE)) {
            this.sound.play('sfx_select');
            this.scene.start('Level1');    
        }else if(Phaser.Input.Keyboard.JustDown(NUMS.TWO)){
            this.sound.play('sfx_select');
            this.scene.start('Roman'); 
        }
        this.scooby.update()
    }

    createPlatform(x, y, scale) {
        const platform = this.platforms.create(x, y, 'roman_platform');
        platform.setScale(scale);
        platform.setOrigin(0.5, 0.5);
        this.physics.world.enable(platform);
        platform.setImmovable(true);
      }
}