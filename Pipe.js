class Pipe {
    constructor() {
      this.X = WIDTH;
      this.Y1 = 0;
      this.H1 = 50 + (Math.random()*390);
      this.W = 150;
      this.Space = 150;
      this.Velocity = 10;
  
      this.Y2 = this.Y1 + this.H1 + this.Space;
      this.H2 = HEIGHT - (this.H1 + this.Space);
    }
  
    move(pipes) {
      if(this.X === WIDTH/2) pipes.push(new Pipe());
      this.X -= this.Velocity;
    }
  
    show() {
      fill("black");
      rect(this.X, this.Y1, this.W, this.H1);
      rect(this.X, this.Y2, this.W, this.H2);
    }
  }