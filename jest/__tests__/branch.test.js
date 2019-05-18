let branches = require('../branches.js')

describe('Multiple branches test', ()=> {
    test('should get Hello Levon', ()=> {
          expect(branches('Levon')).toBe('Hello Levon')
    });
    test('should get Hello World', ()=> {
          expect(branches('World')).toBe('Hello World')
    });
})
