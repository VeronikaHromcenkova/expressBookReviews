const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  if (isValid(username)) {
    users.push({username, password})
    return res.status(201).json({message: "User is registered"});
  } else {
    return res.status(300).json({message: "Yet to be implemented"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params
  const selected_book = books[isbn]
  res.send(JSON.stringify(selected_book))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params
    let result = {}
    Object.entries(books).forEach(([isbn, book]) => {
        if (book.author === author) {
          result[isbn] = book;
        }
      });
    res.send(JSON.stringify(result))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params
    let result = {}
    Object.entries(books).forEach(([isbn, book]) => {
        if (book.title === title) {
          result[isbn] = book;
        }
      });
    res.send(JSON.stringify(result))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params
    const result = books[isbn]?.reviews
    res.send(JSON.stringify(result))
});

module.exports.general = public_users;
