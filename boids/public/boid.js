class Boid {
    constructor() {
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.position = createVector(random(width), random(height));
        this.acceleration = createVector();
        this.maxF = 1;
        this.maxSpeed = 4;
        this.gAngle = 100;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    align(boids) {
        let steering = createVector();
        let perception = perc;
        let total = 0;
        for (let other of boids) {
            let toOther = p5.Vector.sub(other.position, this.position);
            let angle = toOther.angleBetween( this.velocity);
            angle = angle / PI * 180;
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d <= perception && other != this && angle <= this.gAngle) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxF);
        }
        return steering;
    }

    flock(boids) {
        let separation = this.separation(boids);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        this.acceleration.mult(0);
        this.acceleration.add(alignment);
        this.acceleration.add(separation);
        this.acceleration.add(cohesion);
    }

    cohesion(boids) {
        let steering = createVector();
        let perception = perc;
        let total = 0;
        for (let other of boids) {
            let toOther = p5.Vector.sub(other.position, this.position);
            let angle = toOther.angleBetween( this.velocity);
            angle = angle / PI * 180;
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d <= perception && other != this && abs(angle) <= this.gAngle) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxF);
        }
        return steering;
    }
    separation(boids) {
        let steering = createVector();
        let perception = perc;
        
        let total = 0;
        for (let other of boids) {
            let toOther = p5.Vector.sub(other.position, this.position);
            let angle = toOther.angleBetween( this.velocity);
            angle = angle / PI * 180;
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d <= perception && other != this && abs(angle) <= this.gAngle) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxF);
        }
        return steering;
    }
    show() {
        stroke(255);
        strokeWeight(1);
        line(this.position.x, this.position.y, this.position.x + (10 * this.velocity.x * cos(this.gAngle)), this.position.y);
        line(this.position.x, this.position.y, this.position.x, this.position.y + 10 * this.velocity.y * sin(this.gAngle));
        point(this.position.x, this.position.y);
    }
}