var robot = require("robotjs");

class OSControl {
  constructor() {
    this.oldCordinate = [];
  }
  moveTest() {
    console.log("Testing the robot control");
    robot.setMouseDelay(0);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = screenSize.height / 2 - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++) {
      let y = height * Math.sin(twoPI * x / width) + height;
      robot.moveMouse(x, y);
    }
    console.log("Ending robot test");
  }

  move(x, y) {
    if (this.oldCordinate.length === 0) {
      this.oldCordinate = [x, y];
      return;
    }

    let newX = this.oldCordinate[0] - x;
    let newY = this.oldCordinate[1] - y;

    const currentPos = robot.getMousePos();

    let newPosX = Math.trunc(currentPos.x - newX);
    let newPosY = Math.trunc(currentPos.y - newY);

    robot.moveMouse(newPosX, newPosY);
    this.oldCordinate = [x, y];
  }

  mouseClick() {}

  mouseClickRelease() {
    this.oldCordinate = [];
  }

  type(text) {
    if (text.length > 1) {
      text = text.toLowerCase();
      robot.keyTap(text);
    } else {
      robot.typeString(text);
    }
  }
}

module.exports = OSControl;
