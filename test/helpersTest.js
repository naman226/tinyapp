const { assert } = require('chai');
const { getUserByEmail, userChecker } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, testUsers[expectedUserID]);
  });
  it('should return undefined when email does not exist', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    assert.equal(user, undefined);
  });
});

describe('userChecker', function() {
  it('should return false if user email is found in database', function() {
    const user = userChecker("user@example.com", testUsers);
    assert.isFalse(user);
  });
});