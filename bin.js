#!/usr/bin/env node
const compareJsonTranslations = require('./getDataFiles.js');

compareJsonTranslations(`${process.cwd()}`);