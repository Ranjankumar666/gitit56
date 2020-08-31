const inquirer = require('inquirer');
const argv = require('minimist')(process.argv.slice(2));
const files = require('./files.js');

module.exports ={
  getCredentials: () =>{
   const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address: ',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password: ',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  getTwoWayAuthCode: () =>{
    return inquirer.prompt({
      name: 'twoWayAuthCode',
      type: 'input',
      message: 'Enter two way auth Code ( check your email ):',
      validate: (val) =>{
        if(val.length)
          return true;
        else
          return 'Please enter the code: '
      }
    })
  },
  getRepoDetails: () =>{
    

    const questions= [
      {
      name: 'name',
      type: 'input',
      message: 'Enter the repo name:',
      //default: argv._[0] || files.getCWD(),
      validate: (val) =>{
        if(val.length)
          return true;
        else 
          return 'Please enter the repo name'
        }
      },
      {
      name: 'description',
      type: 'input',
      message: 'Enter description: ',
      default: argv._[1] || 'testing purposes',
      validate: (val) =>{
        if(val.length)
          return true;
        else 
          return 'Please enter the description'
        }
      },
      {
        name: 'visibility',
        type: 'list',
        choices: ['public', 'private'],
        default: 'public',
        message: 'Private or Public'
      }
    ]
    return inquirer.prompt(questions);
  },
  getGitignoreDetails: (filelist) =>{
    return inquirer.prompt({
      name:'gitignore',
      type: 'checkbox',
      choices: filelist,
      default: ['node_modules', 'bower_componets'],
      message: 'Select files to ignore ( use <space> to select)'
    })
  }
}
