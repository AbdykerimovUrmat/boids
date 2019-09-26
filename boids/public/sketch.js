let boids = [];
let percSlider;
let num = 100;
let perc;
function setup() {
    createCanvas(900, 620);
    percSlider = createSlider(0, 100, 1, 1);
    for (let i = 0; i < num; i++) {
        boids.push(new Boid())
    }
}


function draw() {
    strokeWeight(2);
    stroke(255);
    
    background(51);
    perc = percSlider.value();
    for (let boid of boids) {
        boid.flock(boids);
        boid.edges();
        boid.update();
        boid.show();
    }

}