const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field = [[]]) {
    this._field = field;
    this._locationX = 0;
    this._locationY = 0;
    this._field[0][0] = pathCharacter;
  }

  runGame() {
    let playing = true;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.isInBounds()) {
        console.log("Out of bounds instructions.");
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log("Sorry, you fell down a hole.");
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log("Congrats, you found your hat.");
        playing = false;
        break;
      }
      this._field[this._locationY][this._locationX] = pathCharacter;
    }
  }

  askQuestion() {
    const answer = prompt("Which way? ").toUpperCase();
    switch (answer) {
      case "U":
        this._locationY -= 1;
        break;
      case "D":
        this._locationY += 1;
        break;
      case "L":
        this._locationX -= 1;
        break;
      case "R":
        this._locationX += 1;
        break;
      default:
        console.log("Enter U, D, L or R");
        this.askQuestion();
        break;
    }
  }

  isInBounds() {
    return (
      this._locationY >= 0 &&
      this._locationX >= 0 &&
      this._locationY < this._field.length &&
      this._locationX < this._field[0].length
    );
  }

  isHat() {
    return this._field[this._locationY][this._locationX] === hat;
  }

  isHole() {
    return this._field[this._locationY][this._locationX] === hole;
  }

  print() {
    const displayString = this._field
      .map((row) => {
        return row.join("");
      })
      .join("\n");
    console.log(displayString);
  }
  x;

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map(() => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }

    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * width);
      hatLocation.y = Math.floor(Math.random() * height);
    }
    field[hatLocation.y][hatLocation.x] = hat;
    return field;
  }
}

const myfield = new Field(Field.generateField(10, 10, 0.2));
myfield.runGame();
