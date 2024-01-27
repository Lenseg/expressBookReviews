const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios');

async function getBooksList() {
  const list = await axios.get('/');
  return list.json();
}


async function getBookOnISBN(isbn) {
  const book = await axios.get(`/isbn/${isbn}`);
  return book.json();
}


async function getBookOnAuthor(author) {
  const book = await axios.get(`/author/${author}`);
  return book.json();
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn,
  book = books[isbn];
  if(book) {
    return res.status(200).json(JSON.stringify(book));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author,
  book = books.find(b => b.author === author);
  if(book) {
    return res.status(200).json(JSON.stringify(book));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title,
  books = books.filter(b => b.title === title);
  if(books) {
    return res.status(200).json(JSON.stringify(books));
  } else {
    return res.status(404).json({message: "NO books found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn,
  book = books[isbn];
  if(book) {
    return res.status(200).json(JSON.stringify(book.reviews));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
