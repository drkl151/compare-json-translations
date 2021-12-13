module.exports = function (pathToFolder) {
  try {
    const fs = require('fs');
    const path = require('path');
    const shell = require("shelljs");
    const currentDirGetTable = __dirname.replace(/\\/g, '/');

    const createdConfig = new Promise((resolve) => {
      const jsonInDir = fs.readdirSync(pathToFolder).filter(file => path.extname(file) === '.json');
      const result = {};

      jsonInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join(pathToFolder, file), 'utf8');
        const json = JSON.parse(fileData.toString());
        const fileName = path.parse(file).name;

        result[fileName] = { ...json };
      });


      fs.writeFile(`${currentDirGetTable}/src/compare-json-translations.config.js`, `export default ${JSON.stringify(result)}`, (err) => { resolve() });
    })

    createdConfig.then(() => {
      const qwe = shell.exec(`cd ${currentDirGetTable} && npm run serve`);
    });

  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', err);
  }
}