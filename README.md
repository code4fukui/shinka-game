# shinka-game (しんかゲーム)

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple, physics-based web game where you tilt your device to merge falling circles. When two circles of the same size and color touch, they evolve (shinka/しんか) into a single, larger circle.

## Demo

Play the game here: **https://github.com/code4fukui/shinka-game

## How to Play

1.  Open the [demo link](https://code4fukui.github.io/shinka-game/) on a mobile device.
2.  Tap the "しんかゲーム" button to grant motion sensor permissions and start the game.
3.  Tilt your device to control gravity and move the circles.
4.  Guide circles of the same size to touch each other. They will automatically merge into a larger circle.

## Features

-   Physics-driven gameplay powered by [Matter.js](https://brm.io/matter-js/) via the [eg2d.js](https://github.com/code4fukui/eg2d/) library.
-   Automatic merging of same-sized circles to create progressively larger ones.
-   Interactive gravity control using device motion sensors.
-   Runs entirely in the browser with no installation needed.

## Dependencies

-   [eg2d.js](https://github.com/code4fukui/eg2d/)
-   [rnd.js](https://js.sabae.cc/rnd.js)

## Running Locally

1.  Clone this repository.
2.  Open the `index.html` file in a modern web browser.
3.  Click the start button to begin. For the full experience with gravity control, use a mobile browser.

## License

This project is licensed under the MIT License.