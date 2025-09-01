const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
  sort(tests) {
    // Sort tests to ensure they run in a specific order
    return tests.sort((testA, testB) => {
      // Run auth tests first
      if (testA.path.includes('auth') && !testB.path.includes('auth')) {
        return -1;
      }
      if (!testA.path.includes('auth') && testB.path.includes('auth')) {
        return 1;
      }
      
      // Run user tests after auth
      if (testA.path.includes('user') && !testB.path.includes('user')) {
        return -1;
      }
      if (!testA.path.includes('user') && testB.path.includes('user')) {
        return 1;
      }
      
      // Run pipeline tests after user
      if (testA.path.includes('pipeline') && !testB.path.includes('pipeline')) {
        return -1;
      }
      if (!testA.path.includes('pipeline') && testB.path.includes('pipeline')) {
        return 1;
      }
      
      // Default alphabetical order
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
