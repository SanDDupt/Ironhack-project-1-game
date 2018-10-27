var canvas = document.getElementById("structure");
var ctx = canvas.getContext("2d");
var clickCount = 0; //compte le nombre de click pour savoir quel joueur doit jouer
var player1 = new Player("yellow", false);
var player2 = new Player("red", true);
var jetons = []; //liste des (emplacement + couleur) de tous les jetons

var positions = [ //tableau à deux dimensions (7X6)
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]
]; 

drawBoard();
function drawBoard() { // le plateau est dessiné comme un succession de bandes horizontales et de bandes verticales
  canvas.style.border = "1px solid red";
  ctx.fillStyle = "#0000FF";

  ctx.fillRect(0, 100, 10, 600);
  for (var i = 0; i < 8; i++) {
    ctx.fillRect(90 + 100 * i, 100, 20, 600);
  }

  for (var j = 0; j < 7; j++) {
    ctx.fillRect(0, 100 + 100 * j, 700, 20);
  }
}

//Positionner un jeton au-dessus d'une colonne choisie grâce à la souris :
document.getElementById("structure").addEventListener("click", function(evt) {
  // permet de connaître les coordonnées du point cliqué par la souris (evt.clientX,evt.clientY)
  for (var j = 0; j < 7; j++) {
    if (evt.clientX >= 100 * j && evt.clientX < 100 + 100 * j) {
      x = 50 + 100 * j; //position initiale du jeton
      y = 50;
      //var indexLine = j;
       
      clickCount++;

      var player; // définition du player
      if (clickCount % 2 === 0) {
        player = player2;
      } else {
        player = player1;
      }

      var jeton = new Jeton(x, y, player); // définition du jeton
      jetons.push(jeton); //liste de tous les jetons créés
    }
  }
});

function Jeton(x, y, player) { // dessine un jeton au dessus du plateau, position initiale fixée, joueur fixé
  this.x = x;
  this.y = y;
  this.vy = 5;
  this.radius = 40;
  this.player = player;
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.player.color;
    ctx.fill();
  };
  this.goDown = function () {

    jeton.y += jeton.vy;

  }

}

function Player(color, even) {
  this.color = color; // Joueur1/"#FFFF00" ; Joueur2/"#FF0000"
  this.even = even; // c'est un booléan : Joueur1/FALSE ; Joueur2/TRUE
}

function update() { // descente du jeton dans le plateau
  ctx.clearRect(0, 0, 710, 720);
  jetons.forEach(function(jeton) { // dessiner tous les jetons déjà crées

    jeton.goDown();
    
    
    jeton.draw();
  }); 
  drawBoard(); // dessiné après les jetons pour que ces derniers descendent derrière
}
setInterval(update, 20);



//function Game(//player, count, positions) {}
