#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files.js');
const github = require('./lib/github.js');
const repo = require('./lib/repo.js');


clear();

console.log(chalk.hex("#003399")(
    figlet.textSync('Gitit',{
      horizontalLayout: 'full',
      verticalLayout: 'full',
      width: 80
    })
  ));

if(files.dirExists('.git')){
  console.log(chalk.hex("#990")`git is already intialised`);
  process.exit();
}
const getGithubToken = async () =>{

  let token =  await github.getStoredAuthToken();

  if(!token){
    token = await github.fetchAccessToken();
    return token;
  }
    return token;
}

const run = async () =>{
  try {
    const token = await getGithubToken();
    github.githubAuth(token);
    
    const url = await repo.createRemoteRepo();
    await repo.createGitignore();
    await repo.setUpRepo(url);

    await console.log(chalk.hex('#990')`All done`);

  } catch(e) {
    if(e){
      switch(e.status){
        case '401':
          console.log(chalk.red`Please provide right credentials`);
          break;
        case '422':
          console.log(chalk.red`Remote repository already exists`);
          break;
        default:
          console.log(chalk.red(e))
      }
    }
  } 
}

run();


