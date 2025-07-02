const Book = require("./book.model");

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book
const getABook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book
const postABook = async (req, res) => {
  try {
    const { title, description, category, trending, oldPrice, newPrice, author, publishedDate, coverImage } = req.body;
    const bookData = {
      title,
      description,
      category,
      trending,
      oldPrice,
      newPrice,
      author,
      publishedDate,
      coverImage
    };
    // If there's a file upload, use its path (overrides URL if both are present)
    if (req.body.coverImage) {
      bookData.coverImage = req.body.coverImage;
    }
    const newBook = await Book.create(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a book
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, trending, oldPrice, newPrice, author, publishedDate, coverImage } = req.body;
    const bookData = {
      title,
      description,
      category,
      trending,
      oldPrice,
      newPrice,
      author,
      publishedDate,
      coverImage
    };
    // If there's a file upload, use its path (overrides URL if both are present)
    if (req.file) {
      bookData.coverImage = req.file.path;
    }
    const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top selling books
const getTopSellingBooks = async (req, res) => {
  try {
    const topBooks = await Book.find({}).sort({ sold: -1 }).limit(4);
    res.status(200).json(topBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended books
const getRecommendedBooks = async (req, res) => {
  try {
    const recommendedBooks = await Book.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json(recommendedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest news
const getLatestNews = async (req, res) => {
  try {
    const latestNews = await Book.find({}).sort({ publishedDate: -1 }).limit(4);
    res.status(200).json(latestNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get books by genre
const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const books = await Book.find({ category: genre });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getABook,
  postABook,
  UpdateBook,
  deleteABook,
  getTopSellingBooks,
  getRecommendedBooks,
  getLatestNews,
  searchBooks,
  getBooksByGenre,
};