const birdCount = 50;
let mutationCount = 1;
let maxScore = 0;
let birds = [];
let deads = [];
let pipes = [];

function pickOne() {
  //Pick the best bird and mutate
  let child = new Bird(deads[birdCount-1].brain);
  child.brain.mutation(0.1);
  return child;
}

function nextGen() {
  maxScore = Math.max(maxScore, deads[birdCount-1].score);
  //Calculate Fitnesses
  let sum = 0;
  for(bird of deads) sum += bird.score;
  for(bird of deads) bird.fitness = bird.score/sum;
  
  //Reset
  for (let i = 0; i < birdCount; i++) birds[i] = pickOne();
  deads = [];
  pipes = [];
  pipes[0] = new Pipe();
  mutationCount++;
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  //Start
  for (let i = 0; i < birdCount; i++) birds.push(new Bird());
  pipes[0] = new Pipe();
}

function draw() {
  clear();
  background("lightblue");
  
  //Pipes
  if(pipes[0].X + pipes[0].Space <= 0) pipes.splice(0, 1);
  for (pipe of pipes) {
    pipe.show();
    pipe.move(pipes);
  }
  //Birds
  for(let i=0; i<birds.length; i++){
    birds[i].show();
    birds[i].think(pipes[0]);
    if(birds[i].detectCollision(pipes[0])) deads.push(birds.splice(i, 1)[0]);
  }
  if(birds.length === 0) nextGen();

  strokeWeight(2);
  textSize(24);
  fill('red');
  text('Generation :', WIDTH-250, 30);
  text(mutationCount, WIDTH-100, 30);
  text('Max Score :', WIDTH-250, 60);
  text(maxScore, WIDTH-100, 60);
}