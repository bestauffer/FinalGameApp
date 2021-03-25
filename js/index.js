// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/sand.png";

// Image for walls
var wallsReady = false;
var wallsImage = new Image();
wallsImage.onload = function () {
	wallsReady = true;
};
wallsImage.src = "images/cactus.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/pharaoh.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/mummy.png";

// Obstacle image
var obstacleReady = false;
var obstacleImage = new Image();
obstacleImage.onload = function () {
	obstacleReady = true;
};
obstacleImage.src = "images/tumbleweed.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};

var tumbleweed1 = {
	x:350,
	y:100
};
var tumbleweed2 = {
	x:250,
	y:600
};
var tumbleweed3 = {
	x:600,
	y:300
};
var tumbleweed4 = {
	x:100,
	y:500
};

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	do{
	// Throw the monster somewhere on the screen randomly
	monster.x = 50 + (Math.random() * (canvas.width - 150));
	monster.y = 50 + (Math.random() * (canvas.height - 150));
	} while(touchingObstacle(monster));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && hero.y > 50) { //  holding up key    
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y < canvas.height - (80 + 6)) { //  holding down key    
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x > (40+4)) { // holding left key    
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x < canvas.width - (70 + 20)) { // holding right key    
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		if(monstersCaught > 4){
			alert("You win!");
		}
		else{
		reset();
		}
	}
	if(touchingObstacle(hero)){
		alert("You ran into the tumbleweed! Game over.");
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		//Fills in the 256x256 background image until it fills the whole 800x800 space
		for(i=0; i<800; i+=256){
			for(k=0; k<800; k+=256){
				ctx.drawImage(bgImage, i, k);
			}
		}
	}

	if (wallsReady) {
		for(i=0; i<800; i+=50){
			ctx.drawImage(wallsImage, i, 0);
			ctx.drawImage(wallsImage, 0, i);
			ctx.drawImage(wallsImage, 750, i);
			ctx.drawImage(wallsImage, i, 750);
		}
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (obstacleReady) {
		ctx.drawImage(obstacleImage, tumbleweed1.x, tumbleweed1.y);
		ctx.drawImage(obstacleImage, tumbleweed2.x, tumbleweed2.y);
		ctx.drawImage(obstacleImage, tumbleweed3.x, tumbleweed3.y);
		ctx.drawImage(obstacleImage, tumbleweed4.x, tumbleweed4.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Mummies caught: " + monstersCaught, 50, 50);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

function touchingObstacle(who){
	if(
		(who.x <= (tumbleweed1.x + 45)
			&& tumbleweed1.x <= (who.x + 27)
			&& who.y <= (tumbleweed1.y + 37)
			&& tumbleweed1.y <= (who.y + 35)) ||
		(who.x <= (tumbleweed2.x + 45)
			&& tumbleweed2.x <= (who.x + 27)
			&& who.y <= (tumbleweed2.y + 37)
			&& tumbleweed2.y <= (who.y + 35)) ||
		(who.x <= (tumbleweed3.x + 45)
			&& tumbleweed3.x <= (who.x + 27)
			&& who.y <= (tumbleweed3.y + 37)
			&& tumbleweed3.y <= (who.y + 35)) ||
		(who.x <= (tumbleweed4.x + 45)
			&& tumbleweed4.x <= (who.x + 27)
			&& who.y <= (tumbleweed4.y + 37)
			&& tumbleweed4.y <= (who.y + 35))
	){
		return true;
	}
	else{
		return false;
	}
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
