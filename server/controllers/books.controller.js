import Book from "../models/books.model.js";

const getBooks = async (req, res) => {
  Book.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    else res.send(data);
  });
};

const getBook = async (req, res) => {
  Book.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found book with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving book with id ${req.params.id}.`,
        });
      }
    } else res.send(data);
  });
};

const createBook = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const newBook = new Book({
    title: req.body.title,
    description: req.body.description,
    imgUrl: req.body.imgUrl,
  });

  Book.create(newBook, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    else res.send(data);
  });
};

const updateBook = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Book.updateById(req.params.id, new Book(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found book with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating book with id ${req.params.id}`,
        });
      }
    } else res.send(data);
  });
};

const deleteBook = async (req, res) => {
  Book.removeById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found book with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete book with id ${req.params.id}`,
        });
      }
    } else res.send({ message: `book was deleted successfully!` });
  });
};

export const booksController = {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
