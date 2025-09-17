// scripts/create-worklets-shim.js
// Creates node_modules/react-native-worklets/plugin.js as a shim.
// Tries to require react-native-reanimated/plugin if available, otherwise exports a no-op plugin.

const fs = require("fs");
const path = require("path");

try {
  const targetDir = path.join(
    process.cwd(),
    "node_modules",
    "react-native-worklets"
  );
  const targetFile = path.join(targetDir, "plugin.js");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const content = `// Auto-generated shim: react-native-worklets/plugin
try {
  module.exports = require('react-native-reanimated/plugin');
} catch (e) {
  module.exports = function () { return { visitor: {} }; };
}
`;

  fs.writeFileSync(targetFile, content, { encoding: "utf8" });
} catch (err) {
  // Don't throw; postinstall should not fail the install
  // eslint-disable-next-line no-console
  console.warn(
    "create-worklets-shim failed:",
    err && err.message ? err.message : err
  );
}
