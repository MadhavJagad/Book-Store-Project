const BookModel = require("../../Model/Books/book.model");


const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      publicationYear,
      description,
      price,
      // image,
    } = req.body;
    console.log(req.file);
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).send({
        success: false,
        error: "Please upload an image file",
      });
    }

    const photoBase64 = req.file.buffer.toString("base64");

    // const photoBase64 = req.file ? req.file.buffer.toString("base64") : null;
    // Validation
    if (
      !title ||
      !author ||
      !category ||
      // !image ||
      !publicationYear ||
      !description ||
      !price
    ) {
      return res.status(400).send({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const book = await BookModel.create({
      title,
      author,
      category,
      publicationYear,
      description,
      price,
      image: photoBase64,
    });
    res.status(201).send({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Failed to create book",
      error: err.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: err.message,
    });
  }
};



module.exports = {
  createBook,
  getAllBooks,
  getBook,
};
