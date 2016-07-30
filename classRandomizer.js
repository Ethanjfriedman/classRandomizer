/* eslint-disable no-console */

// // // // // // // // // // // // // // // // // // // // // // // // // // // /
// // // // // / Created by Ethan Friedman 2016 // // // // // //
// // // // // // / Free to use with attribution // // // // // //
// //  Contact ethanjfriedman@gmail.com with issues // // /
// // // // // // // // // //  Github repo: // // // // // // // // // // /
//  https:// github.com/Ethanjfriedman/classRandomizer //
// // // // // // // // // // // // // // // // // // // // // // // // // // // /

/* SYNTAX FOR USING THIS SCRIPT IS
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
group size, so that 'node classRandomizer.js classList.json 3 output.js -s'
(for a class of 29 students) will result in 9 groups of 3 students
each and 1 group of 2 students. The default is '-b'.
*/

const fs = require('fs');

// TODO need more error handling here
// ADD: validate sourcefile path
if (process.argv.length < 4 || isNaN(parseInt(process.argv[3], 10))) {
  console.log('required syntax for using this file is\n' +
  'node classRandomizer.js sourcefile groupSize\nwhere ' +
  'groupSize is an integer < classSize / 2;\noptional params ' +
  'include destination file (will be created if not pre-existing)--default ' +
  'destination file if not supplied is "./output.js"\nand whether ' +
  'to create [-b]igger groups or [-s]maller groups to deal with ' +
  'remaining students if classSize is not evenly divisible by groupSize');
  process.exit(1);
}

fs.readFile(process.argv[2], (err, data) => {
  if (err) {
    console.error.bind('error reading classlist', err);
  } else {
    const classList = JSON.parse(data);

    const groupSize = parseInt(process.argv[3], 10);
    const outputFile = process.argv[4] || './output.js';
    const direction = process.argv[5] || '-b';
    const classSize = classList.length;
    const mod = Math.floor(classSize / groupSize);
    const remainder = classSize % groupSize;
    const groups = [];
    console.log('groupsize', groupSize, 'mod', mod, 'remainder', remainder);

    const randomStudent = arr => arr.splice(Math.floor(Math.random() * arr.length), 1)[0];

    const grouper = (lim, rem, src) => {
      const group = [];
      for (let i = 0; i < lim; i++) {
        group.push(randomStudent(src));
      }
      if (rem) {
        group.push(randomStudent(src));
      }
      return group;
    };

    if (direction === '-s') {
      groups.push(grouper(mod - groupSize - remainder, 0, classList));
      for (let i = 0; i < groupSize - remainder; i++) {
        groups.push(grouper(groupSize - 1, 0, classList));
      }
    }

    if (direction === '-b') {
      console.log('b');
      for (let i = 0; i < mod; i++) {
        groups.push(grouper(groupSize, remainder, classList));
      }
    }

    fs.writeFile(outputFile, JSON.stringify(groups), (error) => {
      if (error) {
        console.log('error writing output file', err);
      } else {
        console.log(`groups successfully created and written to ${outputFile}`, groups);
      }
    });
  }
});
