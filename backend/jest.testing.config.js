module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests-team/**/*.test.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests-team/setup.js'
  ]
};