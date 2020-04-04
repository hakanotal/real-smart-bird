const WIDTH = 1280;
const HEIGHT = 640;

class Bird {
    constructor(brain) {
      this.X = 150;
      this.Y = random()*HEIGHT;
      this.R = 40;
      this.Gravity = 0.4;
      this.Speed = 0;

      this.score = 0;
      this.fitness = 0;

      if(brain){
        this.brain = brain.copy();
      } else {
        this.brain = new NeuralNetwork(5, 4, 2);
      }
    }
  
    move(jump) {
      if (jump === true) this.Speed = -6;
      this.Speed += this.Gravity;
      this.Y += this.Speed;
    }
  
    show() {
      this.score++;
      fill("white");
      strokeWeight(5);
      stroke('black');
      circle(this.X, this.Y, this.R);
    }
  
    detectCollision(pipe){
      //Check collision with the nearest pipe.
      if(pipe.X <= this.X && this.X <= pipe.X + pipe.W){
        if((pipe.Y1 <= this.Y && this.Y <= pipe.Y1 + pipe.H1) || (pipe.Y2 <= this.Y && this.Y <= pipe.Y2 + pipe.H2)){
          return true;
        }
      }
      //Check collision with the screen borders.
      if(this.Y <= this.R/2 || this.Y >= HEIGHT - this.R/2) {
        return true;
      }
      return false;
    }
  
    think(pipe){
      let inputs = [];
      inputs[0] = this.X / WIDTH;
      inputs[1] = this.Y / HEIGHT;
      inputs[2] = pipe.X / WIDTH;
      inputs[3] = (pipe.Y1+pipe.H1) / HEIGHT;
      inputs[4] = pipe.Y2 / HEIGHT;
      let outputs = this.brain.feedForward(inputs);
      if(outputs[0] > outputs[1]){
        this.move(true);
      }else{
        this.move(false);
      }
    }
  }