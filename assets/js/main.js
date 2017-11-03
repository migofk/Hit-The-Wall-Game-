var canvas = document.getElementById('canvas');
var mainObect = document.getElementById('mainObect');
var wall = document.getElementById('wall');
var myGamePiece = new component(60, 60, mainObect, 170, 500);
var myGameWall = new component(1000, 60, wall, 0, 0);
var MRclear =canvas.getContext("2d");
var isPaused = false;
var isWin = 40;
var wallStatus = ['images/wall.png','images/wallHalfCracked.png','images/wallCracked.png'];

// creating game object
function component (width, height, img, x, y) {
  this.x = x,
  this.y = y,
  this.width = width,
  this.height = height,
  this.dirX = 0,
  this.dirY = -1,
  this.img = img,
  this.update = function(){
    var ctx = canvas.getContext("2d");
    ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
  }
  this.newPos = function(){
    this.x += this.dirX;
    this.y += this.dirY;

  }

}

// handling change the wall pictures
function changeWallStatus(){
if((isWin <= 30) && (isWin >= 20) ){
  $(wall).attr('src', wallStatus[1]);
  wall = document.getElementById('wall');

}
if((isWin <= 20) && (isWin >= 10) ){
  $(wall).attr('src', wallStatus[2]);
  wall = document.getElementById('wall');

}
if((isWin === 40)){
  $(wall).attr('src', wallStatus[0]);
  wall = document.getElementById('wall');

}
return wall
}

// handling resetting the game objects
function reset(obj,x,y,width,height,dirX,dirY){
  obj.x = x;
  obj.y = y;
  obj.width = width;
  obj.height = height;
  obj.dirX = dirX;
  obj.dirY = dirY;
  return obj;
}



// handling playing audio
function playAudio(src){
  var audio = new Audio(src);
  audio.play();
}

// handling game
function GameArea(){
MRclear.clearRect(0,0,canvas.width,canvas.height);
myGamePiece.update();
myGameWall.update();
}
// handling moving objects the colliding
function MoveObject(obj){

var topCollider = myGameWall.height;
var bottomCollider = canvas.height-obj.height;
var leftCollider = 1;
var rightCollider = canvas.width-obj.height;
if(obj.y <= topCollider ){
playAudio('sounds/soft_Breaking.mp3');
obj.dirY = obj.dirY*-1;
if(obj.dirX === 0){
  isWin = isWin-3;
  $('#status').html(isWin);
}
else{
isWin--;
$('#status').html(isWin);
}
}
if(obj.y >= bottomCollider ){
isPaused = true;
alert("you lose!");
obj = reset(obj,170,500,60,60,0,-1);
isWin = 40;
}
if(obj.x <= leftCollider ){
playAudio('sounds/side-hitting.mp3');
obj.dirX = obj.dirX*-1;
}
if(obj.x >= rightCollider ){
playAudio('sounds/side-hitting.mp3');
obj.dirX = obj.dirX*-1;
}

obj.newPos();

}




//handling play and pause
$('#play').click(function(event) {
  event.preventDefault();
  isPaused = false;
});
$('#pause').click(function(event) {
  event.preventDefault();
   isPaused = true;
});

//controller touching the object
$('#canvas').click(function(event) {
  event.preventDefault();
  var mCx = event.pageX - $(this).offset().left;
  var mCy = event.pageY - $(this).offset().top;
  //alert(mCx+"------"+myGamePiece.x+myGamePiece.width);

  var gpSec = myGamePiece.width/3;


  if((mCy >= myGamePiece.y) && (mCy <= myGamePiece.y+myGamePiece.height)
  && (mCx >= myGamePiece.x) && (mCy >= myGamePiece.x+myGamePiece.width) ){
    myGamePiece.dirY = -1;
    if (mCx < myGamePiece.x+gpSec) {
    playAudio('sounds/touching.mp3');
    myGamePiece.dirX = -1;
    }
    if ((mCx > myGamePiece.x+gpSec) && (mCx < myGamePiece.x+(gpSec*2))) {
    playAudio('sounds/touching2.mp3');
    myGamePiece.dirX = 0;
    }
    if ((mCx > myGamePiece.x+gpSec*2) && (mCx < myGamePiece.x+(gpSec*3))) {
    playAudio('sounds/touching3.mp3');
    myGamePiece.dirX = 1;
    }

  }
});

// handling game looping
setInterval(function () {
  if(!isPaused){
    if(isWin <= 0){
    isPaused = true;
    $('#status').html("00");
    alert('You Win!');
    obj = reset(myGamePiece,170,500,60,60,0,-1);
    isWin = 40;
    }
    else{
      GameArea();
      MoveObject(myGamePiece);
      $('#status').html(isWin);
      myGameWall.img = changeWallStatus();
    }

  }

}, 3);
//start the game
GameArea();
