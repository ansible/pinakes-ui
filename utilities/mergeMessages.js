/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
const program = require('commander');
const fs = require('fs');
const { sync: globSync } = require('glob');
const { sync: mkdirpSync } = require('mkdirp');
const last = require('lodash/last');

let MESSAGES_PATTERN = 'build/messages/**/*.json';
let LANG_DIR = 'locales/';
let LANG_PATTERN = 'locales/**/messages.json';
let IGNORED = ['translations', 'data'];

program
  .option('-p, --pattern <value>', 'file pattern')
  .option('-I, --ignore-files <value>', 'array of ignored files')
  .option(
    '-L, --lang-pattern <value>',
    'pattern to look for files with languages'
  )
  .option('-l, --lang-dir <dir>', 'folder with languages');

const rootFolder = `${process.cwd()}/`;

program.parse(process.argv);
if (program.ignoreFiles) {
  IGNORED = program.ignoreFiles.split(',');
}

if (program.pattern) {
  MESSAGES_PATTERN = program.pattern;
}

if (program.langDir) {
  LANG_DIR = program.langDir;
}

if (program.langPattern) {
  LANG_PATTERN = `${LANG_DIR}${program.langPattern}`;
}

// Merge translated json files (es.json, fr.json, etc) into one object
// so that they can be merged with the eggregated 'en' object below
const localeMessages = (filename) => {
  const file = fs.readFileSync(filename, 'utf8');
  const messages = JSON.parse(file);
  let collection = {};
  Object.keys(messages).forEach((key) => {
    if (collection.hasOwnProperty(key)) {
      throw new Error(`Duplicate message id: ${key}`);
    }

    collection[key] = messages[key].defaultMessage;
  });
  return collection;
};

const mergedTranslations = globSync(`${rootFolder}${LANG_PATTERN}`)
  .map((filename) => {
    const locale = filename.split('/').reverse()[1];
    const file = last(filename.split('/'));
    if (!IGNORED.includes(file)) {
      return { [locale]: localeMessages(filename) };
    }
  })
  .reduce((acc, localeObj) => {
    return { ...acc, ...localeObj };
  }, {});

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(`${rootFolder}${MESSAGES_PATTERN}`)
  .map((filename) => fs.readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    Object.keys(descriptors).forEach((key) => {
      if (collection.hasOwnProperty(key)) {
        throw new Error(`Duplicate message id: ${key}`);
      }

      collection[key] = descriptors[key].defaultMessage;
    });
    return collection;
  }, {});
// Create a new directory that we want to write the aggregate messages to
mkdirpSync(`${rootFolder}${LANG_DIR}`);

// Merge aggregated default messages with the translated json files and
// write the messages to this directory
fs.writeFileSync(
  `${rootFolder}${LANG_DIR}data.json`,
  JSON.stringify({ en: defaultMessages || {}, ...mergedTranslations }, null, 2)
);

fs.writeFileSync(
  `${rootFolder}${LANG_DIR}translations.json`,
  JSON.stringify({ ...defaultMessages } || {}, null, 2)
);
