'use strict';

const fs = require('fs');

fs.readFile(process.argv[2], (err, data) => {
  if (err) {
    console.error.bind(console, 'error reading sourcefile');
  } else {
    const labPairings = JSON.parse(data);
    const header = "# Lab Pairings\n\n| Group | Partner 1 | Partner 2 |\n| --- | --- | --- |\n";
    const body = labPairings.map((g, i) => {
      let p1 = Math.round(Math.random());
      let p2 = p1 === 1 ? 0 : 1;
      return "| " + (i+1) + " | " + g[p1] + " | " + g[p2] + " |\n";
    }).join('');
    const footer = "\n ##### Generated with a little Node script; see https://github.com/Ethanjfriedman/classRandomizer";

    const fullMarkdown = header + body + footer;
    const outputFile = process.argv[3] || "./LabPairings.md";
    fs.writeFile(outputFile, fullMarkdown, (e) => {
      if (e) {
        console.error.bind(console, 'error writing file');
      }
    });
  }
});
