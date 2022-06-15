const express = require('express');
const app = express();
const morgan = require('morgan');
const cookies = require('cookie-parser');
const PORT = 8080;
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookies());
const generateRandomString = function() {
  let sol = Math.random().toString(16).slice(2, 8);
  return sol;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};


app.use(bodyParser.urlencoded({extended: true}));
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
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]  };
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
  console.log(req.body);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app lisenting on port ${PORT}!`);
});






