const carCanvas = document.querySelector("#carCanvas");
carCanvas.width = 200;

const networkCanvas = document.querySelector("#networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const cars = generateCars(300);

let bestCar = cars[0];

(function giveBestCarBestBrain() {
  const bestBrain = localStorage.getItem("bestBrain");

  if (bestBrain) {
    cars.forEach((car, i) => {
      car.brain = JSON.parse(bestBrain);

      if (i != 0) {
        NeuralNetwork.mutate(car.brain, 0.15);
      }
    });
  }
})();

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2.8),
  new Car(road.getLaneCenter(3), -500, 30, 50, "DUMMY", 3),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 3),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];

  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  // update traffic and AI cars
  traffic.forEach((car) => car.update(road.borders, []));
  cars.forEach((car) => car.update(road.borders, traffic));

  // find the fastest car
  const bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  // reset canvas heights
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // translate road view
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);

  // draw road and cars
  traffic.forEach((car) => car.draw(carCtx, "#002"));
  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => car.draw(carCtx, "#428"));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();

  // draw neural network
  networkCtx.lineDashOffset = time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // continue animation
  requestAnimationFrame(animate);
}
