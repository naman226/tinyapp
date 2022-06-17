const express = require('express');
const { getUserByEmail, generateRandomString, generateRandomId, userChecker, urlsForUser } = require('./helpers');
const app = express();
const morgan = require('morgan');
const cookies = require('cookie-session');
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookies({
  name: 'tiny',
  keys: ['it', 'is', 'an', 'app']
}));
app.use(bodyParser.urlencoded({ extended: false }));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {};

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(400).send("<h1>User not logged in</h1>");
    return;
  }
  const templateVars = { user: users[req.session.user_id], urls: urlsForUser(req.session.user_id, urlDatabase) };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect('/login');
  }
  const templateVars = { user: users[req.session.user_id], urls: urlDatabase };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!users[req.session.user_id]) {
    res.status(400).send("<h1>You must be logged in to create a new URL</h1>");
    return;
  } else if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("Short URL not found");
    return;
  } else if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    res.status(403).send("Access Denied");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("<h1>URL not found</h1>");
    return;
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.session.user_id], urls: urlDatabase };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.session.user_id], urls: urlDatabase };
  res.render("urls_login", templateVars);
});

app.post("/urls", (req, res) => {
  if (!users[req.session.user_id]) {
    res.status(400).send("<h1>You must be logged in to create a new URL</h1>");
    return;
  }
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: users[req.session.user_id].id };
  res.redirect(`/urls/${newShortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send("<h1>Operation not allowed</h>");
    return;
  }
});

app.post("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    const newShortURL = req.params.shortURL;
    urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: users[req.session.user_id].id };
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const valid = userChecker(req.body.email, users);
  const result = getUserByEmail(req.body.email, users);
  if (!valid && bcrypt.compareSync(req.body.password, result.password)) {
    req.session.user_id = result.id;
    res.redirect("/urls");
  } else {
    res.status(403).send("Error 403 Bad Request");
    return;
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const id = generateRandomId();
  const email = req.body.email;
  const pass = req.body.password;
  const valid = userChecker(email, users);
  const password = bcrypt.hashSync(pass, 10);
  console.log(password);
  if (!email || !pass || !valid) {
    res.status(400).send("Error 400 Bad Request");
    return;
  } else {
    users[id] = { id, email, password };
    req.session.user_id = users[id].id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Tiny app lisenting on port ${PORT}!`);
});






