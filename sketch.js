var rects = []; // create circle & square variables
var numRects = 30;
var cir;

var bgImg; // setup the image scroll
var x1 = 0;
var x2;

var scrollSpeed = 2;

let timer = 0 // setup timer value & get timer element
let gameScreen = 0; // setup current view
let score = 0; // setup score
let BASE_URL='http://localhost:3000/api/v1/'

var user;

function setup() { //SETUP FUNCTION
	createCanvas(windowWidth,windowHeight);

  bgImg = loadImage("./assets/background.jpg"); //game play background
	init_background_image = loadImage("./assets/start_screen_background.jpg");
  x2 = width;

	for(i=0;i<numRects;i++) {   //this builds our squares
		r = new rectObj(random(width),random(height), random(10,50), random(10,50) ) // generate a rectObj
		rects.push(r);
	}

	cir = new circleObj(20);   // create a mouse object (circle)

	loginForm = document.getElementById('login-form')
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault()
		let name = document.getElementById("user-name").value

		fetch(BASE_URL+'users', {
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    method: "POST",
	    body: JSON.stringify({name})
		})
			.then(response => response.json())
			.then(userObj => {
				user = userObj
			})

		document.getElementById("overlay").style.display = "none";
		gameScreen = 1
	})
}

function draw() {
	if (gameScreen == 0) {
    initScreen();
  } else if (gameScreen == 1) {
    playScreen();
  } else if (gameScreen == 2) {
    gameOverScreen();
  }
}

function initScreen() { //loads startup background
	background(init_background_image);
}

function playScreen() {

	image(bgImg, x1, 0, width, height);
	image(bgImg, x2, 0, width, height);
	x1 -= scrollSpeed;
	x2 -= scrollSpeed;
	if (x1 < -width){
	 x1 = width;
	}
	if (x2 < -width){
	 x2 = width;
	}

	for(i=0;i<numRects;i++){
		rects[i].disp();
		rects[i].collide( cir ); //collide against the circle object
	}

	fill(255); 	//Update Timer
	textSize(36);
	textAlign(CENTER);
	text(`${timer}`, (width/2 - 100), 40);
	if (frameCount % 60 === 0) {
		timer++;
	}
	if (gameScreen == 1 && timer > 60) {
		gameScreen = 2;
	}

	textSize(36); //Update Score
	text(`Score: ${score}`, (width/2 + 100), 40);

	cir.disp(mouseX,mouseY); //pass the x,y pos in to the circle.

}

function rectObj(x,y,w,h){
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.color = color(random(255),random(255),random(255))
	this.hit = false;

	this.collide = function(obj){

		this.hit = collideRectCircle(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.dia); //collide the cir object into this rectangle object.

		if(this.hit){
			this.color = color(0) //set this rectangle to be black if it gets hit
			score++;
		}
	}

	this.disp = function(){
		noStroke();
		fill(this.color);
		this.x += 3 //move to the right!
		if(this.x > width){ //loop to the left!
			this.x = -this.w;
		}
		rect(this.x,this.y,this.w,this.h);
	}

}

function circleObj(dia){
	this.dia = dia;
	this.color = color(random(255),random(255),random(255))
	this.x;
	this.y;

	this.disp = function(x,y){
		this.x = x;
		this.y = y;
		noStroke();
		fill(this.color);
		ellipse(this.x,this.y,this.dia,this.dia);
	}

}

function updateScore() {
	document.getElementById("scoreDisplay").innerHTML = `${user.data.attributes.name}, your score is: ${score}`;
}

function gameOverScreen() {
	remove();
	document.getElementById("end-game-overlay").style.display = "block";
	updateScore();
	fetch(BASE_URL+'games', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({user_id: user.data.id, score: score, type: "games"})
	})
}
