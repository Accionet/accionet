/* eslint-disable no-console */
const exec = require('child_process').exec;

let testFiles = [];
let running = false;
const timeout = 20000;

let ok_count = 0;
let failure_count = 0;


function dequeue() {
  const elem = testFiles[0];
  testFiles = testFiles.slice(1, testFiles.length);
  return elem;
}

function queue(elem) {
  testFiles.push(elem);
}

function addTest(path) {
  queue(path);
  if (!running) {
    running = true;
    runNextTest();
  }
}

function runNextTest() {
  const path = dequeue();
  if (!path) {
    return;
  }
  console.log('\x1b[36m%s\x1b[0m', `Running test: ${path}`); // cyan

  exec(`mocha --timeout ${timeout} ${path} `, (error, stdout) => {
    console.log(stdout);
    if (stdout.indexOf('failing') < 0) {
      ok_count += 1;
      console.log('\x1b[32m%s\x1b[0m', `Test ${path} finished`);
    } else {
      failure_count += 1;
      console.log('\x1b[31m%s\x1b[0m', `Test ${path} finished with error`);
    }
    if (ok_count) {
      console.log('\x1b[42m%s\x1b[0m', `${ok_count} OK`);
    }
    if (failure_count) {
      console.log('\x1b[41m%s\x1b[0m', `${failure_count} failure`);
    }


    runNextTest();
  });
}

function getChilds(path) {
  exec(`ls ${path} `, (error, stdout) => {
    const lines = stdout.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const newPath = `${path}/${lines[i]}`;
      if (lines[i].endsWith('.js')) {
        addTest(newPath);
      } else if (lines[i].indexOf('.' < 0) && lines[i] !== '') {
        getChilds(newPath);
      }
    }
  });
}


dequeue();
getChilds('test/unit-testing');
