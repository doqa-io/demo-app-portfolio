module.exports = {
    testEnvironment: 'node',
    globalSetup: '<rootDir>/tests/globalSetup.js',
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/globalSetup.js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['index.js', 'db.js', 'dbSetup.js'],
};
