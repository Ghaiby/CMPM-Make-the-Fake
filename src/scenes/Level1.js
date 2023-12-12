//class from play
class Level1 extends Phaser.Scene {
    constructor (){
        super('Level1')
    }

    preload(){
        this.load.image('background', './assets/moon_background.png');
        this.load.image('platform', './assets/moon_platform.png');
        this.scoob = this.load.image('Scooby', './assets/Scooby.png')
        this.load.image('test', './assets/moon.png')
        this.load.image('ammo', './assets/shoot.png')
        this.load.image('ss', './assets/scooby snax.png')
    }

    create() {
        //background image
        this.add.image(game.config.width / 2, game.config.height / 2, 'background');

        //add ammo
        this.Ammo = this.physics.add.sprite(25, 50, 'ammo').body.setAllowGravity(false)
        this.Ammo2 = this.physics.add.sprite(50, 50, 'ammo').body.setAllowGravity(false)
        this.Ammo3 = this.physics.add.sprite(75, 50, 'ammo').body.setAllowGravity(false)
        this.All_Ammo  = [this.Ammo, this.Ammo2, this.Ammo3]

        this.ss = this.physics.add.sprite(game.config.width / 2, game.config.height / 4.8 - 50, 'ss').body.setAllowGravity(false)
        this.scooby = new Scooby(this, game.config.width / 2, game.config.height);

        //set up enemies 
        this.enemies = this.physics.add.group();
        this.enemy1 = new Enemy(this, game.config.width / 3 - 50, game.config.height / 2, 'test')        
        this.enemy2 = new Enemy(this, game.config.width / 6 - 50, game.config.height / 2, 'test')
        this.enemy3 = new Enemy(this, game.config.width / 1.2 - 120, game.config.height / 2, 'test')        
        this.enemy4 = new Enemy(this, game.config.width / 1.1 - 100, game.config.height / 1.5, 'test')
        
        //physics set up
        this.physics.world.gravity.y = 130;

        //if collide with enemies, game over
        this.physics.add.collider(this.scooby, this.enemies, (scooby, enemy1) => {
            this.scene.start('gameOver')
        })

        //enemy / ammo collision done separately so that not all enemies disappear
        //Ammo & Enemy Handling
        // Loop through each enemy in the group
        this.enemies.children.iterate((enemy) => {
            for(let i = 0; i < 3; i++){
                this.physics.add.collider(this.All_Ammo[i], enemy, (Ammo, enemy) => {
                    enemy.body.enable = false
                    //this.Ammo.body.enable = false
                    enemy.x = 9999
                    this.All_Ammo[i].x = 9999
                })
            }
        });       

        //platform set up
        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.scooby, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);        

        this.createPlatform(game.config.width / 3, game.config.height / 1.6, 1.5);
        this.createPlatform(game.config.width / 1.4, game.config.height / 1.6, 1.5);

        this.createPlatform(game.config.width / 6, game.config.height / 1.2, 1);
        this.createPlatform(game.config.width / 1.2, game.config.height / 1.2, 1);

        this.createPlatform(game.config.width / 6, game.config.height / 3.6, 1);
        this.createPlatform(game.config.width / 1.2, game.config.height / 3.6, 1);

        this.createPlatform(game.config.width / 2.4, game.config.height / 2.4, 1);
        this.createPlatform(game.config.width / 1.6, game.config.height / 2.4, 1);

        this.createPlatform(game.config.width / 2, game.config.height / 4.8, 1);

        //shoot / instructions key        
        this.instructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        //debug keys 
        NUMS.ONE = this.input.keyboard.addKey(NUMS.ONE);
        NUMS.TWO = this.input.keyboard.addKey(NUMS.TWO);        
        NUMS.THREE = this.input.keyboard.addKey(NUMS.THREE);
        this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //shooting bools
        this.ammo_true = false;
        this.ammo1_left = false;
        this.ammo2_left = false;
        this.ammo3_left = false;
        this.scooby.left = false;


        //instruction text
        this.instruct_config = {
            fontFamily: 'Courier',
            fontSize: '24px',
            backgroundColor: '#FACADE',
            color: '#843605',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 710
        }

        this.i_visible = false //instructions toggle
        
    }

    update(){
        //switch levels for Debug purposes 
        this.instruct = this.add.text(10, 100, 'Use the left and right arrow keys to move around!', this.instruct_config).setVisible(false);
        this.instruct = this.add.text(10, 100, 'Press F to shoot! (But beware! You have limited ammo! Check the top left corner to see how much you have left)\nPress space to jump, avoid enemies, and most importantly,\nCollect the Scooby Snacks (the box with the s at the top)\n! Finally, Press I to make this text go away!', this.instruct_config).setVisible(false);
        this.instruct = this.add.text(10, 100, 'Use the left and right arrow keys to move around! Press F to shoot! (But beware! You have limited ammo! Check the top left corner to see how much you have left)\nPress space to jump, avoid enemies, and most importantly,\nCollect the Scooby Snacks (the box with the s at the top)\n! Finally, Press I to make this text go away!', this.instruct_config).setVisible(false);
        this.instruct = this.add.text(10, 100, 'Use the left and right arrow keys to move around! Press F to shoot! (But beware! You have limited ammo! Check the top left corner to see how much you have left)\nPress space to jump, avoid enemies, and most importantly,\nCollect the Scooby Snacks (the box with the s at the top)\n! Finally, Press I to make this text go away!', this.instruct_config).setVisible(false);
        console.log(this.scooby.left)
        //check direction Scooby is facing for shooting
        if (Phaser.Input.Keyboard.JustDown(this.LEFT)) {
            console.log("Turn")
            this.scooby.left = true
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.RIGHT)) {
            console.log("Turn")
            this.scooby.left = false
        }
        if (Phaser.Input.Keyboard.JustDown(NUMS.ONE)) {
            this.sound.play('sfx_select');
            this.scene.start('Level1');    
        }else if(Phaser.Input.Keyboard.JustDown(NUMS.TWO)){
            this.sound.play('sfx_select');
            this.scene.start('Roman'); 
        }else if(Phaser.Input.Keyboard.JustDown(NUMS.THREE)){
            this.sound.play('sfx_select');
            this.scene.start('Level3'); 
            
        } else if (Phaser.Input.Keyboard.JustDown(this.instructions)) {
            if (!this.i_visible) {
                this.instruct.setVisible(true);
                this.i_visible = true;
            } else if (this.i_visible) {                
                this.instruct.setVisible(false);
                this.i_visible = false;
            }
        }
        else if(Phaser.Input.Keyboard.JustDown(this.shoot)){
            console.log(this.scooby.left)
            if (this.ammo_count < 2) {
                if (this.scooby.left) {
                    this.ammo1_left = true;
                }
                this.ammo1 = true
                this.Ammo.x = this.scooby.x            
                this.Ammo.y = this.scooby.y
                this.ammo_count++
            } else if (this.ammo_count < 3) {                
                this.ammo2 = true
                if (this.scooby.left) {
                    this.ammo2_left = true;
                }
                this.Ammo2.x = this.scooby.x
                this.Ammo2.y = this.scooby.y
                this.ammo_count++
                console.log("ammo check")
                console.log(this.ammo2_left)
            } else if (this.ammo_count < 4) {               
                this.ammo3 = true
                if (this.scooby.left) {
                    this.ammo3_left = true;
                }
                
                console.log("ammo check")
                console.log(this.ammo3_left)
                this.Ammo3.x = this.scooby.x
                this.Ammo3.y = this.scooby.y
                this.ammo_count++
            }
            
        }
        //make ammo move when shot
            if (this.ammo1) {
                if (this.ammo1_left) {
                    this.Ammo.x -= 4
                } else {
                        this.Ammo.x += 4
                }
            }
            if (this.ammo2) {
                if (this.ammo2_left) {
                    this.Ammo2.x -= 4
                } else {
                        this.Ammo2.x += 4
                }
            }
            if (this.ammo3) {
                if (this.ammo3_left) {
                    this.Ammo3.x -= 4
                } else {
                        this.Ammo3.x += 4
                }
            }
        //update sprites     
        this.scooby.update()
        this.enemy1.update()
        this.enemy2.update()
        this.enemy3.update()
        this.enemy4.update()
    }

    //function for creating the platforms in the scence 
    createPlatform(x, y, scale) {
        const platform = this.platforms.create(x, y, 'platform');
        platform.setScale(scale);
        platform.setOrigin(0.5, 0.5);
    
        // Enable physics for the platform
        this.physics.world.enable(platform);
        platform.setImmovable(true);
    }

    
}