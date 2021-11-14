var robot = require("robotjs");

class OSControl {
  constructor() {}
  move() {
    console.log("Testing the robot control");
    robot.setMouseDelay(0);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = screenSize.height / 2 - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++) {
      let y = height * Math.sin((twoPI * x) / width) + height;
      robot.moveMouse(x, y);
    }
    console.log("Ending robot test");
  }

  type(text) {
    robot.typeString(text);
  }
}

module.exports = OSControl;
