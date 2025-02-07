const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (i.e., not already taken)
const isValid = (username) => {
  if (!username) return false;
  return !users.some(user => user.username === username);
};

// Check if user is authenticated by verifying username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// ***** 작업 7: 등록된 사용자로 로그인 *****
// 엔드포인트: POST /login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 사용자명과 비밀번호 제공 여부 확인
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  
  // 사용자 인증 (users 배열에 등록된 사용자인지 확인)
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // JWT 토큰 생성 (비밀키는 'access'를 사용하며, 만료 시간은 3600초)
  let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 3600 });
  
  // 세션에 인증 정보를 저장합니다.
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// ***** 작업 8: 책 리뷰 추가 또는 수정 *****
// 엔드포인트: PUT /auth/review/:isbn
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // 세션에 사용자 인증 정보가 있는지 확인
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  
  const username = req.session.authorization.username;

  // 요청된 ISBN의 책 존재 여부 확인
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // 리뷰 내용이 제공되었는지 확인
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // 책 객체에 reviews 속성이 없으면 초기화
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  
  // 해당 사용자의 리뷰를 추가하거나 업데이트
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
    message: "Review successfully added/updated", 
    reviews: books[isbn].reviews 
  });
});

// ***** 작업 9: 책 리뷰 삭제 *****
// 엔드포인트: DELETE /auth/review/:isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // 세션에 사용자 인증 정보가 있는지 확인
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  
  const username = req.session.authorization.username;
  
  // 요청된 ISBN의 책 존재 여부 확인
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // 해당 책에 사용자의 리뷰가 있는지 확인
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user." });
  }
  
  // 해당 사용자의 리뷰 삭제
  delete books[isbn].reviews[username];
  
  return res.status(200).json({ 
    message: "Review successfully deleted.",
    reviews: books[isbn].reviews 
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
