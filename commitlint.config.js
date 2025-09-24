module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce the type (feat, fix, docs, etc)
    'type-enum': [
      2,
      'always',
      [
        'feat',      // new feature
        'fix',       // bug fix
        'docs',      // documentation
        'style',     // formatting, etc
        'refactor',  // code refactoring
        'perf',      // performance
        'test',      // tests
        'chore',     // build/CI stuff
      ],
    ],
    // Enforce scope optional, lowercase, followed by colon
    'scope-case': [0, 'always'], // optional: disable strict case
    'subject-case': [0, 'never'], // allow any case in subject
    'header-max-length': [2, 'always', 100], // optional, max length
  },
};