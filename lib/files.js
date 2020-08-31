const fs = require('fs');
const path = require('path');

module.exports ={
  getCWD: () =>{
    return path.basename(process.cwd());
  },

  dirExists: (filePath) =>{
    return fs.existsSync(filePath)
  }
}
