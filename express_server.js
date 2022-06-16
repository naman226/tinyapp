const express = require('express');
const app = express();
const morgan = require('morgan');
const cookies = require('cookie-parser');
const PORT = 8080;
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookies());
app.use(bodyParser.urlencoded({extended: false}));
const generateRandomString = function() {
  let sol = Math.random().toString(16).slice(2, 8);
  return sol;
};
const generateRandomId = function() {
  let sol = Math.random().toString(16).slice(2, 6);
  return sol;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

const getUserByEmail = function(email) {
for (let userId in users) {
 if (users[userId].email === email ) {
  return users[userId];
  }
 }
 return null;
};

const userChecker = function(email) {
  for (let userCheck in users ) {
   if (users[userCheck].email === email) {
    return false;
    }
  }
return true;
};

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], urls: urlDatabase };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies['user_id']] };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
app.post("/urls/:shortURL", (req, res) => {
  const newShortURL = req.params.shortURL;
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});
app.post("/login", (req, res) => {
  const result = getUserByEmail(req.body.email);
  res.cookie("user_id", result.id);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], urls: urlDatabase };
  res.render("urls_register", templateVars);
});
app.post("/register", (req, res) => {
const id = generateRandomId();
const email = req.body.email;
const password = req.body.password;
const valid = userChecker(email);
if ( !email || !password || !valid ) {   
  res.status(400).send("Error 400 Bad Request");
} else {
  users[id] = { id, email, password };
res.cookie("user_id", users[id].id);
res.redirect("/urls");
}
});
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], urls: urlDatabase };
  res.render("urls_login", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app lisenting on port ${PORT}!`);
});






