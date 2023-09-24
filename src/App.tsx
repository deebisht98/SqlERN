import "./App.css";
import { useState, useEffect } from "react";

type book = {
  Bookid: string;
  title: string;
  description: string;
  imgUrl: string;
};

type NavProps = {
  form: {
    show: boolean;
    data: book;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      data: book;
    }>
  >;
};

function Nav({ form, setForm }: NavProps) {
  return (
    <nav className="nav">
      <span
        className="branding"
        onClick={() =>
          setForm({
            show: false,
            data: {
              Bookid: "",
              title: "",
              description: "",
              imgUrl: "",
            },
          })
        }
      >
        BookShelf
      </span>
      <div className="routes">
        <span onClick={() => setForm({ ...form, show: true })}>Add Book</span>
      </div>
    </nav>
  );
}

function App() {
  const [books, setBooks] = useState<book[]>([]);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    show: false,
    data: {
      Bookid: "",
      title: "",
      description: "",
      imgUrl: "",
    },
  });

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetch("http://localhost:8800/books");
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }
        const books: book[] = await response.json();
        setBooks(books);
      } catch (err) {
        setError(`${err}`);
      }
    };
    getBooks();
  }, []);

  const handleBookDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8800/books/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      const data = await response.json();
      const newArr = books.filter((book) => book.Bookid !== id);
      setBooks(newArr);

      alert(data.message);
    } catch (err) {
      setError(`${err}`);
    }
  };

  function BookList() {
    return (
      <>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {books.length > 0 ? (
          <main className="shelf">
            {books.map((book) => (
              <div key={book.Bookid} className="book">
                <img
                  src={book.imgUrl}
                  alt={`${book.title}_img`}
                  className="image"
                />
                <h5>{book.title}</h5>
                <p title={book.description}>{book.description}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setForm({ show: true, data: book })}>
                    Edit
                  </button>
                  <button onClick={() => handleBookDelete(book.Bookid)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </main>
        ) : (
          <h2>No books available right now...</h2>
        )}
      </>
    );
  }

  function Form({
    data,
    books,
    setBooks,
  }: {
    data: book;
    books: book[];
    setBooks: React.Dispatch<React.SetStateAction<book[]>>;
  }) {
    const [formState, setFormState] = useState(data);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { Bookid, title, description, imgUrl } = formState;
      if (!title || !description || !imgUrl) {
        alert("Please fill all the fields.");
      }

      try {
        let url = "http://localhost:8800/books";
        if (Bookid) {
          url += `/${Bookid}`;
        }
        const response = await fetch(url, {
          method: Bookid ? "PUT" : "POST",
          body: JSON.stringify(formState),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }

        const data = (await response.json()) as book;
        let newBookArr = [];
        if (Bookid) {
          newBookArr = books.map((book) => {
            return book.Bookid === Bookid ? data : book;
          });
        } else {
          newBookArr = [...books, data];
        }
        setBooks(newBookArr);
        setForm({
          show: false,
          data: {
            Bookid: "",
            title: "",
            description: "",
            imgUrl: "",
          },
        });
        alert(
          Bookid ? "Book Updated Successfully." : "New Book Added Successfully."
        );
      } catch (err) {
        setError(`${err}`);
      }
    };

    return (
      <form className="my-form" onSubmit={submitForm}>
        <label>
          <span className="required">Title:</span>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
          />
        </label>
        <label>
          <span className="required">Description:</span>
          <input
            type="text"
            name="description"
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
          />
        </label>
        <label>
          <span className="required">Image URL:</span>
          <input
            type="text"
            name="imgUrl"
            value={formState.imgUrl}
            onChange={(e) =>
              setFormState({ ...formState, imgUrl: e.target.value })
            }
          />
        </label>
        <button type="submit">Submit</button>
        <button
          onClick={() =>
            setForm({
              show: false,
              data: {
                Bookid: "",
                title: "",
                description: "",
                imgUrl: "",
              },
            })
          }
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="main_container">
      <Nav form={form} setForm={setForm} />
      {form.show ? (
        <Form data={form.data} books={books} setBooks={setBooks} />
      ) : (
        <BookList />
      )}
    </div>
  );
}

export default App;
