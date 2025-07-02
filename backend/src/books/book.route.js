const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getABook, UpdateBook, deleteABook, getTopSellingBooks, getRecommendedBooks, getLatestNews, searchBooks, getBooksByGenre } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router =  express.Router();

// frontend => backend server => controller => book schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something

// post a book
router.post("/create-book", verifyAdminToken, postABook)

// get all books
router.get("/", getAllBooks);

// Get top selling books
router.get("/top-sellers", getTopSellingBooks);

// Get recommended books
router.get("/recommended", getRecommendedBooks);

// Get latest news
router.get("/latest-news", getLatestNews);

// Search books
router.get("/search", searchBooks);

// Get books by genre
router.get("/genre/:genre", getBooksByGenre);

// single book endpoint
router.get("/:id", getABook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

router.delete("/:id", verifyAdminToken, deleteABook)


module.exports = router;
