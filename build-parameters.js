#!/usr/bin/env node
const fs = require('fs');
const colors = require('colors');
const path = require('path');
const readLine = require('readline');
const distPath = process.argv[2];
const parametersPath = process.argv[3];

/**
 * Build diff between parameters.json and parameters.json.dist
 *
 * @param dist
 * @param parameters
 * @returns {Array}
 */
function getDiff(dist, parameters) {
  let diff = [];

  Object.keys(dist).forEach(key => {
    if (!parameters.hasOwnProperty(key)) {
      diff.push(key);
    }
  })

  return diff;
}

/**
 * Prompt the question with the defaultAnswer from parameters.json.dist
 *
 * @param question
 * @param defaultAnswer
 */
function askQuestion(question, defaultAnswer) {
  input.setPrompt(question.green.bold + ` (${defaultAnswer})`.green + ' : ');
  input.prompt();
}

/**
 * Output a new parameters.json.
 *
 * @param parameters
 */
function writeJson(parameters, parametersPath) {
  fs.writeFile(parametersPath, JSON.stringify(parameters, null, 4), 'utf8', (err) => {
    if (err) {
      console.error(err.message.error);
      process.exit(-1);
    }

    console.log('parameters.json successfully updated'.green);
    process.exit(0);
  });
}

//Exit script if no arguments given.
if (!distPath || !parametersPath) {
  console.log('You have to define path for your dist file and parameter file.'.red);
  console.log('Ex: build-parameters /path/to/parameters.json.dist /path/to/parameters.json'.red);
  process.exit(-1);
}

//Check if dist file exist
if (!fs.existsSync(path.resolve(distPath))) {
  console.log(path.resolve(distPath));
  console.log('Unable to find dist file.'.red);
  process.exit(-1);
}

const dist = JSON.parse(
  fs.readFileSync(
    path.resolve(distPath),
    'utf8'
  )
);

let parameters = {};

//Check if parameters file already exist, and get values
if (fs.existsSync(path.resolve(parametersPath))) {
  parameters = require(path.resolve(parametersPath));
}


console.log('------------------------'.green);
console.log('Building parameters file'.green.bold);
console.log('------------------------'.green);

const diff = getDiff(dist, parameters);

//Exit script if there is no diff between the two files.
if (diff.length === 0) {
  console.log('Parameters.json is already up to date'.yellow);
  process.exit(0);
}

const input = readLine.createInterface(process.stdin, process.stdout);
let counter = 0;

askQuestion(diff[counter], dist[diff[counter]]);

//Handle user input on each question.
input.on('line', (answer) => {
  if (answer === '') {
    answer = dist[diff[counter]];
  }

  parameters[diff[counter]] = answer;
  counter++;

  if (counter < diff.length) {
    askQuestion(diff[counter], dist[diff[counter]]);
  } else {
    writeJson(parameters, path.resolve(parametersPath));
  }
});
