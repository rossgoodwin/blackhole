var blackholes;
var sphereSize;
var stepSize = 3;
var curRad = 5.0;
var camX, camY, camZ;
var img;

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function preload() {
  blackholes = loadJSON('data/blackholes.json');
  img = loadImage('assets/sun.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  blackholes.sort(function(a,b){ return a['radius'] - b['radius']; });
  console.log(blackholes);
  sphereSize = 25;
}

function draw() {
  background(0, 0, 0);

  orbitControl();


  if (frameCount < 600) {
    camX = (200-windowWidth)+50*Math.log(frameCount*frameCount);
    camY = 200-Math.log(frameCount*frameCount);
    camZ = Math.log(frameCount*frameCount) - 200;
  } else if (frameCount > 599 && frameCount < 2048) {
    directionalLight(255,248,231,0,0,-10);
    camX += Math.log(frameCount*frameCount);
    camY += -Math.log(frameCount);
    camZ += Math.log(frameCount*frameCount);
  } else {
    $('#poembox').fadeIn("slow");
    directionalLight(255,248,231,0,0,-10);
    camX += 10*Math.log(frameCount*frameCount);
    camY += -Math.log(frameCount);
    camZ += Math.log(frameCount*frameCount);
  }

  camera(camX, camY, camZ);

  translate(-windowWidth/2, windowHeight/2, 0);

  var totalX = 0;
  for (var i=0; i<blackholes.length; i++) {
    if (i % stepSize === 0) {
      var bh = blackholes[i];
      var radius = bh['radius_ratio'] * sphereSize;

      if (i === 0) {
        push();
        // translate(radius*2, -radius*2, -radius);
        // rotateX(-PI/4)
        // rotateZ(-PI/4)
        // // rotateZ(-PI/2)
        // pointLight(231, 231, 231, 100, 100, 0);
        // basicMaterial(245, 215, 110, 127);
        // // rotateY(-frameCount*0.02);
        // // tint(255, 127);
        // cone(radius*0.5, radius*3);
        pop();

        texture(img);
      } 
      else {
        specularMaterial(51);
      }

      push();
      var rnd = Math.random();

      if (i === 0) {
        rotateY(frameCount * 0.007);
        // rnd = 2.0;
      } else if (rnd < 0.33) {
        rotateX(frameCount * Math.random() * 0.1);
      } else if (rnd >= 0.33 && rnd < 0.66) {
        rotateY(frameCount * Math.random() * 0.1);        
      } else {
        rotateZ(frameCount * Math.random() * 0.1);        
      }     

      sphere(radius);
      pop();

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
