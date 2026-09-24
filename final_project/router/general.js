const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }

  // Check if the username already exists
  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  // Register the new user
  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// ============================================================
// Task 10: Get the book list available in the shop using async/await
// ============================================================
public_users.get('/', async function (req, res) {
  try {
    // Simulate async fetch using Promise
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };

    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// ============================================================
// Task 11: Get book details based on ISBN using async/await
// ============================================================
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ============================================================
// Task 12: Get book details based on Author using async/await
// ============================================================
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const result = {};
        Object.keys(books).forEach((isbn) => {
          if (books[isbn].author === author) {
            result[isbn] = books[isbn];
          }
        });
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject("No books found by this author");
        }
      });
    };

    const result = await getBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// ============================================================
// Task 13: Get book details based on Title using async/await
// ============================================================
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const result = {};
        Object.keys(books).forEach((isbn) => {
          if (books[isbn].title === title) {
            result[isbn] = books[isbn];
          }
        });
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const result = await getBooksByTitle(title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;