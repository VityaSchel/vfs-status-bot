/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {},
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['node_modules', 'src/database', 'src/test', 'src/types'],
  transformIgnorePatterns: ['node_modules/(?!chalk)/.+\.js', 'node_modules/(?!#ansi-styles)/'],
  transform: {
    '^.+\.(j|t)sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '#(.*)': '<rootDir>/node_modules/$1'
  }
}

