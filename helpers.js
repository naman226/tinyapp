const getUserByEmail = function(email, database) {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return undefined;
};
const generateRandomString = function() {
  let sol = Math.random().toString(16).slice(2, 8);
  return sol;
};
const generateRandomId = function() {
  let sol = Math.random().toString(16).slice(2, 6);
  return sol;
};
const userChecker = function(email, database) {
  for (let userCheck in database) {
    if (database[userCheck].email === email) {
      return false;
    }
  }
  return true;
};
const urlsForUser = function(id, database) {
  const obj = {};
  for (let key in database) {
    if (database[key].userID === id) {
      obj[key] = database[key];
    }
  }
  return obj;
};
module.exports = { getUserByEmail, generateRandomString, generateRandomId, userChecker, urlsForUser };