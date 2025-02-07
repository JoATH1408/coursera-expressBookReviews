const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 작업 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // username과 password가 제공되었는지 확인
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // 사용자가 이미 존재하는지 확인 (isValid 함수가 true일 때만 사용 가능)
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists." });
  }

  // 새로운 사용자 추가
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered." });
});

// 작업 1: Get the book list available in the shop
public_users.get('/', (req, res) => {
  // JSON.stringify를 사용하여 보기 좋게 출력 (들여쓰기 4)
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// 작업 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});
  
// 작업 3: Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let filteredBooks = [];

  // books 객체의 각 키를 순회하며 요청된 저자와 일치하는 책을 찾음
  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      filteredBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the specified author." });
  }
});

// 작업 4: Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let filteredBooks = [];

  // books 객체의 각 키를 순회하며 요청된 제목과 일치하는 책을 찾음
  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      filteredBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the specified title." });
  }
});

// 작업 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // 해당 책의 리뷰가 없으면 빈 객체를 반환
    const reviews = book.reviews || {};
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
