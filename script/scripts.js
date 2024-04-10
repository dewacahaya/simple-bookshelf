// SEARCH BAR
function searchBar() {
  const searchBar = document.querySelector(".search-bar");

  searchBar.addEventListener("focus", function () {
    this.placeholder = "";
  });

  searchBar.addEventListener("blur", function () {
    this.placeholder = "Cari Buku";
  });
}
window.addEventListener("load", searchBar);
// SEARCH BAR
// INPUT
function coverImage() {
  const coverImage = document.querySelector("#cover");
  coverImage.addEventListener("focus", function () {
    this.placeholder = "";
  });
  coverImage.addEventListener("blur", function () {
    this.placeholder = "Masukkan cover buku *link gambar";
  });
}
window.addEventListener("load", coverImage);
function inputTitle() {
  const inputTitle = document.querySelector("#title");

  inputTitle.addEventListener("focus", function () {
    this.placeholder = "";
  });

  inputTitle.addEventListener("blur", function () {
    this.placeholder = "Masukkan judul buku";
  });
}
window.addEventListener("load", inputTitle);

function inputAuthor() {
  const inputAuthor = document.querySelector("#author");

  inputAuthor.addEventListener("focus", function () {
    this.placeholder = "";
  });

  inputAuthor.addEventListener("blur", function () {
    this.placeholder = "Masukkan penulis buku";
  });
}
window.addEventListener("load", inputAuthor);

function inputPublisher() {
  const inputPublisher = document.querySelector("#publish");

  inputPublisher.addEventListener("focus", function () {
    this.placeholder = "";
  });

  inputPublisher.addEventListener("blur", function () {
    this.placeholder = "Masukkan tahun terbit buku";
  });
}
window.addEventListener("load", inputPublisher);
// INPUT

// MAIN FUNCTIONS
document.addEventListener("DOMContentLoaded", function () {
  const books = [];
  const RENDER_EVENT = "renderBook";
  const searchBars = document.querySelectorAll("#search-bar");

  searchBars.forEach(function (searchBar) {
    searchBar.addEventListener("input", function () {
      const searchValue = searchBar.value.toLowerCase();
      const containerId =
        searchBar.parentElement.nextElementSibling.getAttribute("id");
      const bookList =
        containerId === "books"
          ? books.filter((book) => !book.isCompleted)
          : books.filter((book) => book.isCompleted);

      const filteredBooks = bookList.filter((book) => {
        return (
          book.title.toLowerCase().includes(searchValue) ||
          book.author.toLowerCase().includes(searchValue) ||
          book.publishYear.toString().includes(searchValue)
        );
      });

      const container = document.getElementById(containerId);
      container.innerHTML = "";
      filteredBooks.forEach(function (book) {
        const bookElement = createBookList(book);
        container.append(bookElement);
      });
    });
  });

  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    window.alert("Buku sudah tersimpan!");
    addNewBooks();
  });

  function addNewBooks() {
    const cover = document.getElementById("cover").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publishYear = document.getElementById("publish").value;

    const generatedID = generateId();
    const newBook = generatedNewBook(
      generatedID,
      cover,
      title,
      author,
      publishYear,
      false
    );
    books.push(newBook);

    document.getElementById("cover").value = "";
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("publish").value = "";

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    function generateId() {
      return +new Date();
    }

    function generatedNewBook(id, cover, title, author, publishYear, isRead) {
      return {
        id,
        cover,
        title,
        author,
        publishYear,
        isRead,
      };
    }
  }
  document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });

  function createBookList(newBook) {
    const coverBook = document.createElement("img");
    coverBook.setAttribute("src", newBook.cover);
    coverBook.setAttribute("alt", "ini cover buku");
    coverBook.classList.add("shadow");

    const bookTitle = document.createElement("h2");
    bookTitle.innerText = newBook.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + newBook.author;

    const bookPublishYear = document.createElement("p");
    bookPublishYear.innerText = "Tahun rilis buku: " + newBook.publishYear;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(bookTitle, bookAuthor, bookPublishYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(coverBook, textContainer);
    container.setAttribute("id", `book-${newBook.id}`);

    if (newBook.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.innerText = "Batalkan";
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
        undoBookFromReaded(newBook.id);
      });

      const trashButton = document.createElement("button");
      trashButton.innerText = "Hapus Buku";
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
        removeBookFromReaded(newBook.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.innerText = "Tandai sudah dibaca";
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
        addBookToReaded(newBook.id);
      });

      container.append(checkButton);
    }

    return container;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedReadedBook = document.getElementById("books");
    uncompletedReadedBook.innerHTML = "";

    const completedReadBook = document.getElementById("completed-read");
    completedReadBook.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = createBookList(bookItem);
      if (!bookItem.isCompleted) uncompletedReadedBook.append(bookElement);
      else completedReadBook.append(bookElement);
    }
  });

  function addBookToReaded(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeBookFromReaded(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus buku ini?"
    );
    if (confirmDelete) {
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    } else {
      return;
    }
  }

  function undoBookFromReaded(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const bookList = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, bookList);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = "saved-book";
  const STORAGE_KEY = "BOOKSHELF_APPS";

  function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
// MAIN FUNCTIONS
