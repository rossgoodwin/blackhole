var blackholes;
var sphereSize;
var stepSize = 3;
var curRad = 5.0;

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function preload() {
  blackholes = loadJSON('data/blackholes.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  blackholes.sort(function(a,b){ return a['radius'] - b['radius']; });
  console.log(blackholes);
  sphereSize = 25;
  camX = -windowWidth;
  camZ = 0;
}

function draw() {
  background(255, 248, 231); // cosmic latte

  orbitControl();

  var camX = -windowWidth+max(Math.pow(frameCount, 1.2), 300)*Math.log(frameCount*frameCount);
  var camY = -frameCount*Math.log(frameCount);
  var camZ = max(600, frameCount)*Math.log(frameCount*frameCount)-100;

  camera(camX, camY, camZ);

  ambientLight(255, 248, 231);
  directionalLight(255, 248, 231, 0, 0, 10);

  translate(-windowWidth/2, windowHeight/2, 0);

  var totalX = 0;
  for (var i=0; i<blackholes.length; i++) {
    if (i % stepSize === 0) {
      if (i === 0) {
        basicMaterial(249, 105, 14);
      } 
      else {
        ambientMaterial(10,0,15,235);
      }
      var bh = blackholes[i];
      var radius = bh['radius_ratio'] * sphereSize;
      ellipsoid(radius,radius,radius);

      if (i < blackholes.length-stepSize) {
        var nextRadius = blackholes[i+stepSize]['radius_ratio']*sphereSize;
        var xOver = radius+nextRadius+nextRadius/4;
        if (camX+width/2 > totalX && i != 0) {
          curRad = bh['radius_ratio'];
          $('#textbox').html(
            '<p class="infop">NAME: '+bh['name']+'<br>SCHWARZCHILD RADIUS: '+parseInt(bh['radius']).toExponential(4)+' METERS</p>'
          );
        }
        totalX += xOver;
        translate(xOver, radius-nextRadius, 0);
      }
    }
  }
}