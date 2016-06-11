///////////////////////////////////////////////////////
/////////// Created by Ethan Friedman 2016 ////////////
///////////// Free to use with attribution ////////////
//// Contact ethanjfriedman@gmail.com with issues /////
//////////////////// Github repo: /////////////////////
// https://github.com/Ethanjfriedman/classRandomizer //
///////////////////////////////////////////////////////

'use strict';

var fs = require('fs');

/*
syntax for using this file is
node rotateGroups.js sourcefile [,destinationfile]

this file is intended for groups of TWO students: to rotate the students
among those groups quickly
*/

// validate that required number of arguments is present
if (process.argv.length < 3) {
  console.log('required syntax for using this file is');
  console.log('node rotategroups.js sourcefile [,destinationfile]');
  console.log('if destinationfile is not specified, default is ./rotatedGroups.jjs');
  process.exit(1);
}

// read the file and store it in groups
fs.readFile(process.argv[2], (err, data) => {
  if (err) {
    console.error.bind('error reading sourcefile', err);
  } else {
    const groups = JSON.parse(data);
    const result = groups.map((g,i,a) => {
      let newGroup = [];
      newGroup.push(g[0]);
      if (i === 0) {
        newGroup.push(a[a.length - 1][1]);
      } else {
        newGroup.push(a[i - 1][1]);
      }
      return newGroup;
    });
    console.log(result);

    const outputFile = process.argv[3] || './rotatedGroups.js';
    fs.writeFile(outputFile, JSON.stringify(result),(err) => {
      if (err) {
        console.error.bind('error writing to output file', err);
      } else {
        console.log('groups rotated and stored in', outputFile);
        console.log('groups are', groups);
      }
    });
  }
});

// [[a,b],[c,d],[e,f]] => [[a,f],[c,b],[e,d]]
