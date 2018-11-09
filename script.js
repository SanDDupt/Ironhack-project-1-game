var canvas = document.getElementById("structure");
var ctx = canvas.getContext("2d");

var canvasWidth = 710;
var canvasHeight = 580;

var clickCount = 0; //compte le nombre de click pour savoir quel joueur doit jouer
var player1 = new Player("yellow", false);
var player2 = new Player("red", true);
var jetons = []; //liste des (emplacement + couleur) de tous les jetons

var positions = [
  //tableau à deux dimensions (7X6)
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

var audioWon = new Audio("audio_file_Won.mp3");
var audioDraw = new Audio("audio_file_Draw.mp3");

ctx.scale(0.8, 0.8);

drawBoard();

// le plateau est dessiné comme un succession de bandes horizontales et de bandes verticales
function drawBoard() {
  ctx.fillStyle = "#0000FF";
  // 6 lignes
  for (var i = 0; i < 7; i++) {
    ctx.fillRect(0, 100 + 100 * i, 700, 20);
  }
  // 7 colonnes
  ctx.fillRect(0, 100, 10, 600);
  for (var j = 0; j < 6; j++) {
    ctx.fillRect(90 + 100 * j, 100, 20, 600);
  }
  ctx.fillRect(690, 100, 10, 600);
}

//Positionner un jeton au-dessus d'une colonne choisie grâce à la souris :
document.getElementById("structure").addEventListener("click", function(evt) {
  // permet de connaître les coordonnées du point cliqué par la souris (evt.clientX,evt.clientY)
  var rect = canvas.getBoundingClientRect();
  // repositionnement dans le canvas en tenant compte du décalage lors de la mise en page
  for (var j = 0; j < 7; j++) {
    if (
      evt.clientX - rect.left >= 100 * j * 0.8 &&
      evt.clientX - rect.left < (100 + 100 * j) * 0.8
    ) {
      if (positions[0][j] !== 0) {
        // empêche de placer plus de 6 jetons par colonne
        return;
      }

      x = 50 + 100 * j; //position initiale du jeton
      y = 50;

      clickCount++;

      var player; // définition du player
      if (clickCount % 2 === 0) {
        player = player2;
      } else {
        player = player1;
      }

      var jeton = new Jeton(x, y, player); // définition du jeton
      jetons.push(jeton); //liste de tous les jetons créés

      for (var k = 0; k < 6; k++) {
        // contrôle la descente des jetons  avec maxy
        if (positions[5 - k][j] === 0) {
          jeton.maxy = 660 - 100 * k;
          positions[5 - k][j] = jeton;
          break;
        }
      }
    }
  }
  gameOver();
});

function Jeton(x, y, player) {
  // dessine un jeton au dessus du plateau, position initiale fixée, joueur fixé
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
  this.maxy = 0;
  this.goDown = function() {
    if (this.y <= this.maxy - this.vy) {
      this.y += this.vy;
    }
  };
}

function Player(color, even) {
  this.color = color; // Joueur1/"#FFFF00" ; Joueur2/"#FF0000"
  this.even = even; // c'est un booléan : Joueur1/FALSE ; Joueur2/TRUE
  this.score = 0;
}

function update() {
  // descente du jeton dans le plateau
  ctx.clearRect(0, 0, 710, 720);
  jetons.forEach(function(jeton) {
    // dessiner tous les jetons déjà crées
    jeton.goDown();
    jeton.draw();
  });
  drawBoard(); // plateau dessiné après les jetons pour que ces derniers descendent derrière
}
var intervalId = setInterval(update, 20); // la fonction setInterval() renvoie un identifiant rangé dans une variable

function isWon() {
  // retourne un boolean, suivant qu'il y a un gagnant (true) ou aucun gagnant (false)
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 7; j++) {
      var result = testAlign(i, j);
      if (result) {
        positions[i][j].player.score++;
        return true;
      }
    }
  }
  return false;
}

function testAlign(x, y) {
  for (var vx = -1; vx < 2; vx++) {
    for (var vy = -1; vy < 2; vy++) {
      if (vx === 0 && vy === 0) {
        continue;
      }
      var result = testAlignWithDirection(x, y, vx, vy);
      if (result) {
        return true;
      }
    }
  }
  return false;
}

function testAlignWithDirection(x, y, vx, vy) {
  // test dans les 8 directions, avec test d'arrêt quand on sort du plateau
  if (
    x + 3 * vx < 0 ||
    x + 3 * vx >= 6 ||
    y + 3 * vy < 0 ||
    y + 3 * vy >= 7 ||
    positions[x][y] === 0
  ) {
    return false;
  } else if (
    positions[x + vx][y + vy].player === positions[x][y].player &&
    positions[x + 2 * vx][y + 2 * vy].player === positions[x][y].player &&
    positions[x + 3 * vx][y + 3 * vy].player === positions[x][y].player
  ) {
    return true;
  }
  return false;
}

function updateScore() {
  // écrire dans les boutons jaune et rouge pour les scores
  var yellowScore = document.getElementById("yellow-score");
  yellowScore.innerHTML = player1.score;

  var redScore = document.getElementById("red-score");
  redScore.innerHTML = player2.score;
}

function gameOver() {
  // affichage du message "WON!" en fin de partie, si alignement de 4 jetons
  if (isWon()) {
    setTimeout(function() {
      ctx.font = "bold 120pt Trebuchet MS";
      ctx.fillStyle = "#7E7774";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var centreX = canvasWidth / 2;
      var centreY = canvasHeight / 2;
      ctx.save();
      clearInterval(intervalId);
      ctx.fillText("WON!", centreX, centreY + 100);
      ctx.restore();

      updateScore(); // incrémentation du score

      audioWon.play(); // appel du jingle "Won"
    }, 3000);
  }

  // affichage du message "DRAW!" en fin de partie, si les 42 jetons ont été joués sans obtenir d'alignement
  else if (clickCount === 42) {
    setTimeout(function() {
      ctx.font = "bold 120pt Trebuchet MS";
      ctx.fillStyle = "#7E7774";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var centreX = canvasWidth / 2;
      var centreY = canvasHeight / 2;
      ctx.save();
      clearInterval(intervalId);
      ctx.fillText("IMPASSE!", centreX, centreY + 100);
      ctx.restore();

      audioDraw.play(); // appel du jingle "Draw"
    }, 2000);
  }
}
// BOUTON RESTART
document.getElementById("restart-button").onclick = function() {
  clearInterval(intervalId);
  ctx.clearRect(0, 0, 710, 720);
  drawBoard();

  clickCount = 0; // réinitialisation de toutes les variables nécessaires (pas de players !)
  jetons = [];
  positions = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  update();
  intervalId = setInterval(update, 20);
};
