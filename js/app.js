'use strict';

var tileX = 101,
    tileY = 83;


//Superclass used for enemy and player subclasses
var Entity = function() {
    this.height = 170;
    this.width = 80;
};

//Draw character and enemy sprites to the screen
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y * tileY - 10);
};

// Enemies our player must avoid
var Enemy = function() {

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Entity.call(this);
    this.sprite = "images/enemy-bug.png";
    this.x = 0 - this.width;
    this.y = this.randomNumber(1, 4);
    this.speed = this.randomNumber(40, 176);
};

Enemy.prototype = Object.create(Entity.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers
    this.x = this.x + (dt * this.speed);

    //IF x location is higher than width of map
    if (this.x > 506) {

        //Reset x position and get new random y position
        this.x = 0;
        this.y = this.randomNumber(1, 4);
    }

    //Check for collision after moving
    this.collision();
};

//Check for collision with player
Enemy.prototype.collision = function() {

    //IF enemy sprite is occupying the same space as player sprite
    if (this.x + this.width > (player.x) &&
        this.x < (player.x) + player.width &&
        this.y == player.y) {

        //Reset max number of enemies
        maxEnemies = 5;

        player.reset();
    }
};

// Random number generator for enemy y position and speed
Enemy.prototype.randomNumber = function(min, max) {
    var num = Math.floor(Math.random() * (max - min) + min);
    return num;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Entity.call(this);
    this.xMod = 2;
    this.x = this.xMod * tileX;
    this.y = 5;
    this.sprite = "images/char-boy.png"
};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function(e) {
    switch (e) {
        case 'left':
            if (this.xMod > 0) {
                this.xMod -= 1;
                this.x = this.xMod * tileX;
            }
            break;

        case 'right':
            if (this.xMod < 4) {
                this.xMod += 1;
                this.x = this.xMod * tileX;
            }
            break;

        case 'up':
            if (this.y > 0) {
                this.y = this.y - 1;
            }

            //IF player reaches the top of the map
            //run win function
            if (this.y === 0) {
                this.win();
            }
            break;

        case 'down':
            if (this.y < 5) {
                this.y = this.y + 1;
            }
            break;
    }
};

Player.prototype.handleInput = function(e) {

    this.update(e);
};

Player.prototype.win = function() {

    //IF there are currently less enemeies
    //spawning than the hardcap allows
    if (maxEnemies < hardCap) {

        //Increase number of enemies spawning
        //By 1
        maxEnemies += 1;
    };
    setTimeout(this.reset,500);
};

Player.prototype.reset = function(){
    //Reset player location
    this.xMod = 2;
    player.x = this.xMod * tileX;
    player.y = 5;

    //Empty allEnemies array
    allEnemies = [];

    //Resume spawning enemies
    spawnEnemies();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player(),
    allEnemies = [],
    maxEnemies = 5,
    hardCap = 10;

//Function to create new enemies up to a
//hardcapped number, set to a timer
function spawnEnemies() {
    if (allEnemies.length < maxEnemies) {
        allEnemies.push(new Enemy);
        setTimeout(spawnEnemies, 1000);
    };

};

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Begin spawning enemies
spawnEnemies();