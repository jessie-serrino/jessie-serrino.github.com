//Jessie Serrino's Javascript for Frogger


// Global variables in order to 
// keep track of game features.

// General game info
var levelNumber;
var scoreValue;
var livesLeft;
var jumpsAchieved;
var loopSpeed;
var gameOver;
var timeCount;
var ctx;
var timerId;

//Car variables
var cars;
var carSpeed;

//Images used
var sprites
var dead_image

//Log variables
var logs;
var logSpeed;

//Board variables
var lilyPads;
var board;
var water;

//Frog variables
var winningFrogs;
var deadFrog
var frog;
var fl = {'sx': 80, 'sy': 335}
var fr = {'sx': 10, 'sy': 334}
var fu = {'sx': 11, 'sy': 366}
var fd = {'sx': 79, 'sy': 366}


// Initializes values and draws a first look, called in
// the html file
function start_game(){
    setup();
    draw();
    timerId = setInterval("gameLoop()", loopSpeed)
}

/*
*  Key Down registers key down events and attributes them
*  to different frog movements. If escape is hit, it sets
*  the game to gameOver.
*/
function keyDown(event){
    code = event.keyCode;
    if(code >= 37 && code <= 40){
        frog.moving = true;
        if(code === 37)
        {
            frog.x = frog.x - 25; //left
            frog.dir = 'L';
            frog.sx = fl.sx
            frog.sy = fl.sy
        }
        else if(code === 38)
        {
            frog.y = frog.y - 33; //up
            frog.currentStep++;
            if(frog.jumpAchieved[frog.currentStep]==false)
                scoreValue = scoreValue + 10;       
            frog.jumpAchieved[frog.currentStep] = true;
            frog.dir = 'U';
            frog.sx = fu.sx
            frog.sy = fu.sy
        }
        else if(code === 39)
        {
            frog.x = frog.x + 25; //right
            frog.dir = 'R';
            frog.sx = fr.sx
            frog.sy = fr.sy
        }
        else{
             frog.y = frog.y + 33; //down
             frog.currentStep = frog.currentStep - 1;
             frog.dir = 'D'
             frog.sx = fd.sx
             frog.sy = fd.sy
        }
    }
    else if(code === 27)
        gameOver = true;
}

/*
*    This is the core of the game. It constantly checks if the
*    game is over, and if it is, it displays a gameover screen.
*    Otherwise, it updates the animation of the game and draws it.
*/
function gameLoop()
{
    if(gameOver){
        console.log("WE'RE DONE!");
        ctx.fillStyle="#191970"
        ctx.fillRect(0,0, 399, 560)
        ctx.fillStyle = "#4CC417";
        ctx.font="60px Helvetica";
        ctx.fillText("GAME OVER", 20, 250);
        ctx.font="20px Helvetica";
        ctx.fillText("Refresh the page to play again.", 20, 300);
        clearInterval(timerId);
    }
    else{
        timeCount++;
        update();
        draw();
    }
}

// This initializes important values for gameplay
// as well as the arrays for storage
function setup(){
    levelNumber = 1;
    scoreValue = 0;
    livesLeft = 5;
    gameOver = false;
    timeCount = 0;
    loopSpeed = 10;
    logSpeed = 1;
    carSpeed = 1;
    cars = []; //Initializes a place to store
    logs = []; // cars and logs
    lilyPads = [];
    winningFrogs = [];
    sprites = new Image();
    sprites.src = "assets/frogger_sprites.png";  
    dead_image = new Image();
    dead_image.src = "assets/dead_frog.png"
    makeObjects();
}

// Makes an object so that its ready to be drawn
function makeObject(x, y, sx, sy, w, h, dir){
    return {'x': x, 'y': y, 'sx': sx, 'sy':sy, 'w': w, 'h': h, 'dir': dir};
}


// This function creates all of the animated objects as well as any
// objects that are important for collisions.
function makeObjects(){
    initializeFrog();
    for(var w = 0; w < 5; w++){
        winningFrogs[w] = makeObject(15+85*w,80, fd.sx, fd.sy, 24, 24, 'U');
        winningFrogs[w].status = "inactive"
    }
    makeCars();
    makeLogs();
    makeLilyPads();
    //water
    water = {'x': 0, 'y': 58 , 'w': 399, 'h': 213}
    board = {'x': 0,'y': 73, 'w': 399, 'h': 480}
    deadFrog.drawsLeft = 0
    deadFrog.x = 0
    deadFrog.y = 0
}

// This function creates a new frog whose position is
// automatically set to the bottom of the screen.
function initializeFrog()
{
    frog = makeObject(185, 508, 12, 367, 24, 24, 'U');
    frog.moving = false;
    frog.currentStep = 0;
    frog.jumpAchieved = []
    for(var j=0 ; j < 13; j++)
        frog.jumpAchieved[j] = false;
    frog.state = "alive"
    frog.logSafe = false;     
}

/*
 * These next two functions look ugly, but are crucial to creating    
 * some uniqueness among the frogs and cars.
*/

// This function creates rows of cars.
function makeCars()
{
    //first row
    cars[0] = makeObject(150, 312, 102, 300, 55, 25,'L')
    cars[1] = makeObject(300, 312, 102, 300, 55, 25,'L')
    //second row
    cars[2] = makeObject(300, 340, 43, 263, 30, 30,'R')
    cars[3] = makeObject(150, 340, 43, 263, 30, 30,'R')
    cars[4] = makeObject(0, 340, 43, 263, 30, 30,'R')
    //third row
    cars[5] = makeObject(240, 374, 7, 263, 30, 25,'L')
    cars[6] = makeObject(120, 374, 7, 263, 30, 25,'L')
    cars[7] = makeObject(0, 374, 7, 263, 30, 25,'L')
    //fourth row
    cars[8] = makeObject(0, 408, 7, 300, 30, 25,'R')
    cars[9] = makeObject(120, 408, 7, 300, 30, 25,'R')
    cars[10] = makeObject(240, 408, 7, 300, 30, 25,'R')
    //fifth row
    cars[11] = makeObject(0, 439, 80, 264, 30, 25,'L')
    cars[12] = makeObject(150, 439, 80, 264, 30, 25,'L')
    cars[13] = makeObject(300, 439, 80, 264, 30, 25,'L')
}
// This function creates rows of logs.
function makeLogs()
{
    //first row
    logs[0] = makeObject(-100, 110, 5, 195, 120, 26,'L');
    logs[1] = makeObject(60, 110, 5, 195, 120, 26,'L'); 
    logs[2] = makeObject(220, 110, 5, 195, 120, 26,'L');   
    logs[3] = makeObject(380, 110, 179, 301, 46, 26,'L'); //Snake 
    //second row
    logs[4] = makeObject(-100, 143, 5, 195, 120, 26,'R');
    logs[5] = makeObject(60, 143, 153, 372, 100, 26,'R'); //Alligator
    logs[6] = makeObject(220, 143, 5, 195, 120, 26,'R');   
    logs[7] = makeObject(380, 143, 5, 195, 120, 26,'R');  
    //third row    
    logs[8] = makeObject(-140, 176, 5, 164, 180, 26,'L');
    logs[9] = makeObject(110, 176, 5, 164, 180, 26,'L');
    logs[10] = makeObject(360, 176, 5, 164, 180, 26,'L');
    //fourth row
    logs[11] = makeObject(0, 209, 5, 227, 90, 26, 'R');
    logs[12] = makeObject(160, 209, 5, 227, 90, 26, 'R');
    logs[13] = makeObject(320, 209, 5, 227, 90, 26, 'R');     
    //fifth row
    logs[14] = makeObject(0, 242, 5, 227, 90, 26, 'L');
    logs[15] = makeObject(160, 242, 5, 227, 90, 26, 'L');
    logs[16] = makeObject(320, 242, 14, 407, 30, 25, 'L'); //Turtle
    
    makeAnimalsInvisible();
}

// This makes the animals featured among the logs and makes them
// invisible so that the user will die in collision with them.
function makeAnimalsInvisible()
{
    for(var i = 0; i < logs.length; i++)
        logs[i].invisible = false;
    logs[3].invisible = true; // Snake
    logs[5].invisible = true; // Alligator
    logs[16].invisible = true;  // Turtle
}

// This creates lilypads so that the frog can land safely at the
// end.
function makeLilyPads()
{
    lilyPads[0] = makeObject(15, 80, 267, 370, 24, 28, 'U');
    lilyPads[1] = makeObject(100, 80, 267, 370, 24, 28, 'U');
    lilyPads[2] = makeObject(185, 80, 267, 370, 24, 28, 'U');
    lilyPads[3] = makeObject(269, 80, 267, 370, 24, 28, 'U');
    lilyPads[4] = makeObject(354, 80, 267, 370, 24, 28, 'U');
}

/*
    Draw functions that illustrate the changes made with every    
    frame.
*/

// This function renders the canvas and draws the
// base of the board.
function draw() {
   canvas = document.getElementById('game');
   
   // Check if canvas is supported on browser
   if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            drawBase();
    }
   else {
       alert('Sorry, canvas is not supported on your browser!');
       clearInterval(timerId);
   }
}

//This draws the base and then calls helper functions in order to
// draw other aspects of the game.
//       Note: Most of the locations are hard coded for painting
//         as their values do not change.
function drawBase(){
 // Callback to draw the following aspects:
        //Water
        ctx.fillStyle="#191970";
        ctx.fillRect(0,0,399,275);
        //Road
        ctx.fillStyle="#000000";
        ctx.fillRect(0,270,399,300);  
        //Frogger header
        ctx.drawImage(sprites,0,0,399,110,0,0,399,110);
        //Purple roadsides
        ctx.drawImage(sprites,0,118,399,40,0,270,399,40);
        ctx.drawImage(sprites,0,118,399,40,0,468,399,40);

        for(var i = 0 ; i < lilyPads.length; i++){
            var l = lilyPads[i];
            ctx.fillStyle = "#005500"
            ctx.fillRect(l.x, l.y, l.w, l.h);
        }
        drawScoreBoard();
        drawAnimations();
}

//This draws the score board, and keeps it up to date.
//      Note: Most of the locations to paint are hard
//      coded as their values do not change.
function drawScoreBoard(){
    ctx.fillStyle = "#4CC417";
    ctx.font="20px Arial";
    
    //Draws the level
    ctx.fillText("Level " + levelNumber , 80, 530);
    ctx.font="12px Arial";
    //Draws the score
    ctx.fillText("Score: " + scoreValue , 0, 550);
    //Draws the high score
    ctx.fillText("Time: " + (timeCount/100) , 80, 550);
    //Draws the lives left
    for(var i = 0; i < livesLeft ; i++)
        ctx.drawImage(sprites,12,331,30,30,15*i,515,20,20);
}

// This draws the current state of the animations using
// their internal stored values.
function drawAnimations(){
    
        //Drawing the logs, using internally saved parameters
        for(var j = 0; j < logs.length; j++){
            var l = logs[j];
            ctx.drawImage(sprites, l.sx, l.sy, l.w, l.h, l.x, l.y, l.w, l.h);            
        } 

        //Drawing the frog using internally saved parameters
        if(frog.state !== "dead"){
            ctx.drawImage(sprites, frog.sx, frog.sy, frog.w, 
                        frog.h, frog.x, frog.y, frog.w, frog.h);
        }
        //Drawing the cars, using internally saved parameters
        for(var i = 0; i < cars.length; i++){
            var c = cars[i];
            ctx.drawImage(sprites, c.sx, c.sy, c.w, c.h, c.x, c.y, c.w, c.h);      
        }
        for(var k = 0; k < winningFrogs.length; k++){
            var w = winningFrogs[k];
            if(w.status == "active")
                ctx.drawImage(sprites, w.sx, w.sy, w.w, w.h, w.x, w.y, w.w, w.h);     
        } 
        if(deadFrog.drawsLeft !== 0){
            ctx.drawImage(dead_image, 0, 0, 30, 30, deadFrog.x, deadFrog.y, 30, 30)
            deadFrog.drawsLeft = deadFrog.drawsLeft - 1   
        } 
}


/*
 * Update functions that have the elements move and check whether or not
 * the state of the game has changed (ex: frogger died, level up, etc)
*/

function update(){
    updateCars();
    updateLogs();
    updateUserInfo();
    
}

function updateLogs(){
    frog.logSafe = false;
    for(var j = 0; j < logs.length ; j++)
    {
        if(logs[j].dir === 'L'){
            logs[j].x = logs[j].x - logSpeed;
            if(logs[j].x < -200)
                logs[j].x = 500;
        }
        else{
            logs[j].x = logs[j].x + logSpeed;
            if(logs[j].x > 600)
                logs[j].x = -200;  
        }
        if(within(logs[j]) && !logs[j].invisible){
            frog.logSafe = true;
            if(logs[j].dir === 'L')
                frog.x = frog.x - logSpeed;
            else
                frog.x = frog.x + logSpeed;
        }
    }    
    
}

function updateCars(){
    for(var i = 0; i < cars.length ; i++){
        if(cars[i].dir === 'L'){
            cars[i].x = cars[i].x - carSpeed;
            if(cars[i].x < -100)
                cars[i].x = 500;
        }
        else{
            cars[i].x = cars[i].x + carSpeed;
            if(cars[i].x > 450)
                cars[i].x = -100;  
        }
        if(within(cars[i]))
            deadFrog();
    }   
}


function updateUserInfo(){
    frog.lilySafe = false;
    var winCount = 0;
    for(var k = 0; k < lilyPads.length; k++)
    {
        if(within(lilyPads[k]) && winningFrogs[k].status == "inactive")
        {
            frog.lilySafe = true;  
            scoreValue = scoreValue + 50;
            winningFrogs[k].status = "active";
        
            for(var j=0 ; j < 13; j++)
                frog.jumpAchieved[j] = false;
            frog.currentStep = 0;
            frog.x = 185
            frog.y = 508
        }
        else if(winningFrogs[k].status == "active")
        {
             winCount++;
        }
    }
    
    if(!within(board) || within(water) && !frog.logSafe && !frog.lilySafe)
        deadFrog();
    else if (winCount === lilyPads.length)
        levelUp();    
}

/*
* Status functions that specialize certain events
*/

//Dead frog updates the frog information and assists
// the animation of the dying frog. Otherwise it
// ends the game
function deadFrog(){
    frog.state = "dead"
    if(livesLeft > 0){
        livesLeft = livesLeft - 1;
        deadFrog.drawsLeft = 40;
        deadFrog.x = frog.x
        deadFrog.y = frog.y
        initializeFrog();
    }
    else{
        console.log("Game over. All frogs dead.")
        gameOver = true;
    }
}

// LevelUp triggers if the frog has made it home in 5
// locations. It makes the carspeed and the log speed 
// one frame faster, and updates the level number
function levelUp(){
    levelNumber++;
    logSpeed++;
    carSpeed = logSpeed;
    scoreValue = scoreValue + 1000;
    for(var w = 0; w < 5; w++)
        winningFrogs[w].status = "inactive"
}


/*
* Within functions that check collisions
*
*/

// Point within is a helper function that determines
// whether a point is in an object
function pointWithin(obj, x, y)
{
    if(obj.x <= x && x <= (obj.x + obj.w))
        if(obj.y <= y && y <= (obj.y + obj.h))
            return true;
    return false;
}

// Within takes in an object and returns true if any of the
// frogs corners intersect it.
function within(obj)
{ 
    if(pointWithin(obj, frog.x, frog.y))
        return true
    else if(pointWithin(obj, frog.x + frog.w, frog.y))
        return true
    else if(pointWithin(obj, frog.x + frog.w, frog.y + frog.h ))
        return true
    else if(pointWithin(obj, frog.x, frog.y + frog.h ))
        return true
    return false
}

//Checks whether the frog falls within any of the lilies.
function withinLilies()
{
    for(var x = 0; x < lilyPads.length; x++)
        if(within(lilyPads[x])) return true;
    return false;
}




