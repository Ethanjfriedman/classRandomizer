///////////////////////////////////////////////////////
/////////// Created by Ethan Friedman 2016 ////////////
///////////// Free to use with attribution ////////////
//// Contact ethanjfriedman@gmail.com with issues /////
//////////////////// Github repo: /////////////////////
// https://github.com/Ethanjfriedman/classRandomizer //
///////////////////////////////////////////////////////

/*SYNTAX FOR USING THIS SCRIPT IS
node classRandomizer.js path/to/classfile groupsize [,path/to/outputfile direction]
classfile must be a json array of students.
groupsize is the number of students you'd like in each group
outputfile will be overwritten if it exists, and created if it does not
if outputfile is not supplied, it will default to './output.js'
direction is what you want to do with the remainder: '-b' (for bigger) will
add the remainder to the group size, e.g.:
'node classRandomizer.js classList.json 3 output.js -b' will attempt to split the students up into
groups of three with as many groups of 4 as necessary depending on count
i.e., if there were 29 students, there will be 9 total groups: 7 of 3 students
each and 2 groups of 4 students each
if you supply direction as '-s' (for smaller), the remainder will subtract from the
group size, so that 'node classRandomizer.js classList.json 3 output.js -s' (for a class of 29 students)
will result in 9 groups of 3 students each and 1 group of 2 students.
The default is '-b'.
*/

var classList = [];
var fs = require('fs');

//TODO need more error handling here
//ADD: validate sourcefile path
if (process.argv.length < 4 || parseInt(process.argv[3] == NaN)) {
  console.log('required syntax for using this file is');
  console.log('node classRandomizer.js sourcefile groupSize');
  console.log('where groupSize is an integer < classSize / 2; optional params include destination file (will be created if not pre-existing)--default destination file if not supplied is "./output.js" ');
  console.log('and whether to create [-b]igger groups or [-s]maller groups to deal with remaining students if classSize is not evenly divisible by groupSize');
  process.exit(1);
}
//get the data and stick it in classList
fs.readFile(process.argv[2], function(err, data) {
  if (err) {
    console.error.bind('error reading classlist', err);
  } else {
    classList = JSON.parse(data);

    var groupSize = parseInt(process.argv[3]);
    var outputFile = process.argv[4] || './output.js';
    var direction = process.argv[5] || '-b';
    var classSize = classList.length;
    var mod = Math.floor(classSize / groupSize);
    var remainder = classSize % groupSize;
    var groups = [];

    var randomStudent = function(arr) {
      return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    };

    if (direction == '-b') {
      console.log('b');
      for (var i = 0; i < mod; i++) {
        var group = [];
        for (var j = 0; j < groupSize; j++) {
          // var rand = Math.floor(Math.random() * classList.length);
          group.push(randomStudent(classList));
        }
        if (i < remainder) {
          group.push(randomStudent(classList));
        }
        groups.push(group);
      }
    }

    if (direction == '-s') {
      for (var i = 0; i < mod - (groupSize - remainder); i++) {
        var group = [];
        for (var j = 0; j < groupSize; j++) {
          group.push(randomStudent(classList))
        }
        groups.push(group);
      }
      for (var i = 0; i < groupSize - remainder; i++) {
        var group = [];
        for (var j = 0; j < groupSize - 1; j++) {
          group.push(randomStudent(classList));
        }
        groups.push(group);
      }
    }

    fs.writeFile(outputFile, JSON.stringify(groups), function(err) {
      if (err) {
        console.log('error writing output file', err);
      } else {
        console.log('groups successfully created and written to ' + outputFile, groups);
      }
    });
  }
});
