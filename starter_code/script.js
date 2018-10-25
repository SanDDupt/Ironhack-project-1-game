

var canvas = document.getElementById('structure');
var ctx = canvas.getContext("2d");


canvas.style.border = "1px solid red";
// Grand rectangle bleu
ctx.fillStyle = "#0000FF";
ctx.lineWidth = "10";
ctx.fillRect(0,100, 700,600);

// 42 Trous
for (var i = 0; i < 6; i++) {
  for (var j = 0; j < 7; j++) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(50 + 100*j, 150 + 100*i, 40, 0, 2 * Math.PI, true);
    ctx.fill();
  }
}

//Positionner un jeton au-dessus d'une colonne choisie grâce à la souris
document.getElementById('structure').addEventListener('click',function(evt) {


  for (var j = 0; j < 7; j++) {


  if (evt.clientX >= (100*j) && evt.clientX <= (100+100*j)){
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.arc((50+100*j), 50, 40, 0, 2 * Math.PI, true);
    ctx.fill();
  }

}
  
});












