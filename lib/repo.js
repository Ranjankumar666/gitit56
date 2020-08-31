const _ = require('lodash');
const fs = require('fs');
const inquirer = require('./inquirer.js');
const gh = require('./github.js');
const touch = require('touch');
const simpleGit = require('simple-git');
const git = simpleGit();
const Spinner = require('clui').Spinner;


module.exports ={
  createGitignore: async () =>{
    const filelist = _.without(fs.readdirSync('.'), '.gitignore', '.git');

    if(filelist.length){
      const filesToIgnore = await inquirer.getGitignoreDetails(filelist);

      if(filesToIgnore.gitignore.length){
        fs.writeFileSync('.gitignore', filesToIgnore.gitignore.join('/n'));
      }else{
        touch('.gitignore');
      }
    }else{
      touch('.gitignore');
    }
  },

  setUpRepo: async (url) =>{
    const status = new Spinner('Creating ....');

    status.start();

    try{
      git.init()
        .then(() => git.add('.gitignore'))
        .then(() => git.add('./*'))
        .then(() => git.commit('Intial commit'))
        .then(() => git.addRemote('origin', url))
        .then(() => git.push('origin', 'master'))

    }catch(err){
      console.log(err)
    }finally{
      status.stop();
    }
  },

  createRemoteRepo: async (url) =>{
    const github = gh.getInstance();

    const answers=  await inquirer.getRepoDetails();

    let data = {
        name: answers.name,
        description: answers.description,
        private: (answers.visibility === 'private')
    }

    const status = new Spinner('Please wait while repository is being created ....');

    status.start();

    try{
      const response = await  github.repos.createForAuthenticatedUser(data);
      console.log(response.data.ssl_url);
      return response.data.ssh_url;
    }finally{
      status.stop();
    }


  }
}
