/*
	https://editor.p5js.org
*/
function setup() {
  const maxX = 700;
  const maxY = 600;
  createCanvas(maxX, maxY);
  background(240);
  strokeWeight(2);
  function v (points) {
    let pointV = [];
    points.forEach(p =>
      pointV.push(
        createVector(
          p[0],
          maxY - p[1]
        )
      )
    );
    fill(100, 200, 255, 150);
    stroke(0);
    beginShape();
    for (let pt of pointV) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    noStroke();
    fill(255, 0, 0);
    for (let pt of pointV) {
      circle(pt.x, pt.y, 8);
    }
    stroke(0);
    for (let i = 0; i < pointV.length; i++) {
      let next = (i + 1) % pointV.length;
      line(pointV[i].x, pointV[i].y, pointV[next].x, pointV[next].y);
    }
  }
  [
    [
      [700,600],
      [550,600],
      [0,350],
      [0,250],
      [550,250],
      [0,0],
      [150,0],
      [700,250],
      [700,350],
      [150,350]
    ],
    [
      [150,0],
      [700,0],
      [700,250],
      [600,205],
      [600,100],
      [370,100]
    ],
    [
      [315,425],
      [535,525],
      [700,525],
      [700,425]
    ],
    [
      [0,425],
      [0,525],
      [385,525],
      [165,425]
    ]
  ].forEach(vert => v(vert));
}