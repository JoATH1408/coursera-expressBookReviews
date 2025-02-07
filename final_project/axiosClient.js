// axiosClient.js
const axios = require('axios');

// 새 기본 URL 설정
const BASE_URL = 'https://fkepsqkq-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

// 작업 10: Async/Await를 사용하여 상점에서 사용할 수 있는 책 목록을 가져오기
async function getAllBooks() {
  try {
    // Express 서버의 일반 엔드포인트 GET '/' 호출
    const response = await axios.get(`${BASE_URL}/`);
    console.log('Task 10 - All Books:');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching all books:', error.message);
  }
}

// 작업 11: Async/Await를 사용하여 ISBN을 기반으로 책 세부정보 가져오기
async function getBookByISBN(isbn) {
  try {
    // GET '/isbn/:isbn' 엔드포인트 호출
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    console.log(`Task 11 - Book Details for ISBN ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
  }
}

// 작업 12: Async/Await를 사용하여 저자를 기반으로 한 책 세부정보 가져오기
async function getBooksByAuthor(author) {
  try {
    // GET '/author/:author' 엔드포인트 호출 (저자 이름 인코딩)
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Task 12 - Books by Author "${author}":`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books by author "${author}":`, error.message);
  }
}

// 작업 13: Async/Await를 사용하여 제목을 기반으로 한 책 세부정보 가져오기
async function getBooksByTitle(title) {
  try {
    // GET '/title/:title' 엔드포인트 호출 (제목 인코딩)
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Task 13 - Books with Title "${title}":`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books with title "${title}":`, error.message);
  }
}

// 테스트를 위해 모든 함수를 순차적으로 실행
async function runTasks() {
  // 작업 10
  await getAllBooks();
  
  // 작업 11: 예시 ISBN 값 (예: 1)
  await getBookByISBN(1);
  
  // 작업 12: 예시 저자 (대소문자 구분 없이 처리됨)
  await getBooksByAuthor('Chinua Achebe');
  
  // 작업 13: 예시 제목 (대소문자 구분 없이 처리됨)
  await getBooksByTitle('Things Fall Apart');
}

runTasks();
