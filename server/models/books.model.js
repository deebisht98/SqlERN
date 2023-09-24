import booksDB from "../db/booksDb.js";

let createTodos = `create table if not exists books(
                          Bookid int not null auto_increment,
                          title varchar(50) not null,
                          description varchar(250) not null,
                          imgUrl varchar(250) not null,
                          PRIMARY KEY (Bookid)
                      )`;

booksDB.query(createTodos, (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Connected to books DB");
});

function Book(book) {
  this.title = book.title;
  this.description = book.description;
  this.imgUrl = book.imgUrl;
}

Book.create = (newBook, result) => {
  booksDB.query("INSERT INTO books SET ?", newBook, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created book: ", { Bookid: res.insertId, ...newBook });
    result(null, { Bookid: res.insertId, ...newBook });
  });
};

Book.getById = (id, result) => {
  booksDB.query(`SELECT * FROM books WHERE Bookid = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found book: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Book.getAll = (result) => {
  let query = "SELECT * FROM books";

  booksDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("books: ", res);
    result(null, res);
  });
};

Book.updateById = (id, book, result) => {
  booksDB.query(
    "UPDATE books SET title = ?, description = ?, imgUrl = ? WHERE Bookid = ?",
    [book.title, book.description, book.imgUrl, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated book: ", { Bookid: id, ...book });
      result(null, { Bookid: id, ...book });
    }
  );
};

Book.removeById = (id, result) => {
  booksDB.query("DELETE FROM books WHERE Bookid = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted book with id: ", id);
    result(null, res);
  });
};

export default Book;
