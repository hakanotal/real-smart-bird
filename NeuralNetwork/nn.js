function sigmoid(x){
    return 1 / (1 + Math.exp(-x));
}
function derSigmoid(x){
    //return sigmoid(x) * (1 - sigmoid(x));
    return x * (1 - x);
}

class NeuralNetwork{
    constructor(inputs, hiddens, outputs){
        if(inputs instanceof NeuralNetwork){
            this.input = inputs.input;
            this.hidden = inputs.hidden;
            this.output = inputs.output;

            this.weights_I = inputs.weights_I.copy();
            this.weights_H = inputs.weights_H.copy();

            this.bias_I = inputs.bias_I.copy();
            this.bias_H = inputs.bias_H.copy();
        } else {
            this.input = inputs;
            this.hidden = hiddens;
            this.output = outputs;

            this.weights_I = new Matrix(this.hidden, this.input);
            this.weights_I.random();
            this.weights_H = new Matrix(this.output, this.hidden);
            this.weights_H.random();

            this.bias_I = new Matrix(this.hidden, 1);
            this.bias_I.random();
            this.bias_H = new Matrix(this.output, 1);
            this.bias_H.random();

            this.learningRate = 0.1;
        }
    }

    feedForward(input_array){
        //Input
        let input = Matrix.fromArray(input_array);
        //Hidden
        let hidden = Matrix.multiply(this.weights_I, input);
        hidden.add(this.bias_I);
        hidden.map(sigmoid);
        //Output
        let output = Matrix.multiply(this.weights_H, hidden);
        output.add(this.bias_H);
        output.map(sigmoid);

        return Matrix.toArray(output);
    }

    backPropagation(input_array, answer_array){
        //FEED FORWARD
        //Input
        let inputs = Matrix.fromArray(input_array);
        //Hidden
        let hiddens = Matrix.multiply(this.weights_I, inputs);
        hiddens.add(this.bias_I);
        hiddens.map(sigmoid);
        //Output
        let outputs = Matrix.multiply(this.weights_H, hiddens);
        outputs.add(this.bias_H);
        outputs.map(sigmoid);

        //BACK PROPAGATION
        //Answers
        let answers = Matrix.fromArray(answer_array);
        //Errors of Outputs
        let errors_O = Matrix.subtract(answers, outputs);
        //Errors of Hiddens
        let weights_H_T = Matrix.transpose(this.weights_H);
        let errors_H = Matrix.multiply(weights_H_T, errors_O);

        //Gradient of Outputs
        let gradient_O = Matrix.map(outputs, derSigmoid);
        gradient_O.multiply(errors_O);
        gradient_O.multiply(this.learningRate);
        //Deltas for Hidden Weights
        let hiddens_T = Matrix.transpose(hiddens);
        let delWeight_H = Matrix.multiply(gradient_O, hiddens_T);
        //Update Hidden Weights and Bias
        this.weights_H.add(delWeight_H);
        this.bias_H.add(gradient_O);

        //Gradient of Hiddens
        let gradient_H = Matrix.map(hiddens, derSigmoid);
        gradient_H.multiply(errors_H);
        gradient_H.multiply(this.learningRate);
        //Deltas for Input Weights
        let inputs_T = Matrix.transpose(inputs);
        let delWeight_I = Matrix.multiply(gradient_H, inputs_T);
        //Update Input Weights and Bias
        this.weights_I.add(delWeight_I);
        this.bias_I.add(gradient_H);
    }

    train(iteration, data){
        for (let n = 0; n < iteration; n++) {
            let d = random(data);
            this.backPropagation(d.input, d.answer);
        }
    }

    copy(){
        return new NeuralNetwork(this);
    }

    mutation(rate){
        function mutate(value){
            if(random() < rate) return random()*2 - 1;
            else return value;
        }
        this.weights_I.map(mutate);
        this.weights_H.map(mutate);
        this.bias_I.map(mutate);
        this.bias_H.map(mutate);
    }
}