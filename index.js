const path = require("path");

module.exports = (robot, scripts) => {
  const scriptsPath = path.resolve(__dirname, "src");

  if (scripts && !scripts.includes("*")) {
    if (scripts.includes(script)) robot.loadFile(scriptsPath, script);
  } else {
    robot.loadFile(scriptsPath, script);
  }
};
