import express from "express";
import { booksController } from "../controllers/books.controller.js";

const booksRouter = express.Router();

booksRouter.get("/", booksController.getBooks);
booksRouter.get("/:id", booksController.getBook);
booksRouter.post("/", booksController.createBook);
booksRouter.put("/:id", booksController.updateBook);
booksRouter.delete("/:id", booksController.deleteBook);

export default booksRouter;
