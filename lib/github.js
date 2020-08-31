const configStore = require('configstore');
const CLI = require('clui');
const {Octokit} = require('@octokit/rest');
const {createBasicAuth} = require('@octokit/auth-basic');


const Spinner = CLI.Spinner;
const files = require('./files.js');
const pkg = require('../package.json');
const inquirer = require('./inquirer.js');

const conf = new configStore(pkg.name);


let octokit ;

module.exports ={
  getInstance : () =>{
    // console.log(octokit.repos.createForAuthenticatedUser());
    return octokit;
  },
  getStoredAuthToken: () =>{
    return conf.get('github.token')
  },
  fetchAccessToken: async ()=>{
    const credentials = await inquirer.getCredentials();
    const status = new Spinner('Please wait , while we authenticate you....');

    status.start();

    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa () {
        status.stop();
        const res = await files.getTwoAuthCode();
        status.start();

        return res.twoWayAuthCode;

      },
      token: {
        scopes:['user','public_repo','repo','repo:status'],
        note: 'gitit'
      }
    });

    try{
      let response = await auth();

      if(response.token){
        conf.set('github.token', response.token);
        return response.token;
      }
      else{
        throw new Error('No token was found in response')
      }
    }finally{
      status.stop();
    }
  },
  githubAuth: (token) =>{
    octokit = new Octokit({
      auth : token
    })
  }
}
