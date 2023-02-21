class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = [];

    network.levels.forEach((level, i) => {
      if (i === 0) {
        outputs = Level.feedForward(givenInputs, level);
      } else {
        outputs = Level.feedForward(outputs, level);
      }
    });

    return outputs;
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount).fill(null);
    this.outputs = new Array(outputCount).fill(null);
    this.biases = new Array(outputCount).fill(null);

    this.weights = [];

    this.inputs.forEach((_, i) => {
      this.weights[i] = new Array(outputCount).fill(null);
    });

    Level.#randomize(this);
  }

  static #randomize(level) {
    level.inputs.forEach((_, i) => {
      level.outputs.forEach((_, j) => {
        level.weights[i][j] = Math.random() * 2 - 1; // [-1, 1]
      });
    });

    level.biases.forEach((biase) => {
      biase = Math.random() * 2 - 1; // [-1, 1]
    });
  }

  static feedForward(givenInputs, level) {
    level.inputs.forEach((_, i) => {
      level.inputs[i] = givenInputs[i];
    });

    const outputs = level.outputs.map((_, i) => {
      let sum = 0;

      level.inputs.forEach((input, j) => {
        sum += input * level.weights[j][i];
      });

      return sum > level.biases[i] ? 1 : 0;
    });

    return outputs;
  }
}
