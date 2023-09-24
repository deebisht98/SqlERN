import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import booksRouter from "./routes/books.route.js";

dotenv.config();

const app = express();

app.use(cors({ allow: "*" }));
app.use(express.json());
app.use("/books", booksRouter);

app.get("/books", (req, res) => {
  const query = "SELECT * from books";
  db.query(query, (error, data) => {
    if (error) {
      res.status(400).json({
        error: error.sqlMessage,
      });
      return;
    }
    res.status(200).json({
      books: data,
    });
  });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
