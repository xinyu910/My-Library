/*
function Book(title, author, pages, isRead, img = "images/cover2.jpg") {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.img = img;
  this.info = () => {
    let readString = this.isRead === true ? "read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pages}, ${readString}`;
  };
}
*/

class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = 0,
    isRead = false,
    img = "images/cover2.jpg"
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.img = img;
  }
}

class Library {
  constructor() {
    this.myBooks = [];
  }

  addBookToLibrary(book) {
    if (this.bookExist(book)) {
      return false;
    }
    this.myBooks.push(book);
    return true;
  }

  bookExist(newBook) {
    return this.myBooks.some(
      (book) => book.title === newBook.title && book.author === newBook.author
    );
  }

  removeFromLibrary(thisBook) {
    myBooks = myBooks.filter(
      (book) => book.title !== thisBook.title && book.author !== thisBook.author
    );
  }
}

const library = new Library();

const addGridTemplate = document.getElementById("add-grid-template");
const booksGrid = document.querySelector(".books-grid");
const sampleBtn = document.getElementById("sample");
//add-form
const addBtn = document.querySelector(".add-button");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".add-book-modal");
const closeForm = document.querySelector(".close-form");
const submitForm = document.querySelector(".add-book-form");
const error = document.querySelector(".error-message");

//let myBooks = [];

//Form listners and helper functiosn
const popForm = () => {
  submitForm.reset();
  error.classList.remove("active");
  modal.classList.add("active");
  overlay.classList.add("active");
};
addBtn.addEventListener("click", popForm, false);

closeForm.addEventListener("click", () => {
  modal.classList.remove("active");
  overlay.classList.remove("active");
});

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const getNewBook = async () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("isRead").checked;
  const image = document.getElementById("cover");
  if (image.files && image.files[0]) {
    const img = await getBase64(image.files[0]);
    return new Book(title, author, pages, isRead, img);
  } else {
    return new Book(title, author, pages, isRead);
  }
};

//rerender books helper
const toggleFn = (e) => {
  const id = e.target.dataset.id;
  if (library.myBooks[id].isRead) {
    library.myBooks[id].isRead = false;
    e.target.previousSibling.innerText = "Status: In Progress";
    e.target.previousSibling.style.color = "#cf3a08";
  } else {
    library.myBooks[id].isRead = true;
    e.target.previousSibling.innerText = "Status: Read";
    e.target.previousSibling.style.color = "#4f5949";
  }
};

const removeBook = (e) => {
  const id = e.target.dataset.id;
  library.myBooks.splice(id, 1);
  reloadBooks();
};

const createGridItem = (book, i) => {
  const gridItem = document.createElement("div");
  const bookInfo = document.createElement("div");
  const image = document.createElement("img");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const status = document.createElement("div");
  const readStatus = document.createElement("p");
  const toggle = document.createElement("button");
  const deleteBtn = document.createElement("button");

  gridItem.dataset.id = i;
  gridItem.classList.add("grid-item");
  image.setAttribute("src", book.img);
  bookInfo.classList.add("book-info");
  title.classList.add("info-title");
  title.innerText = book.title;
  author.classList.add("info-author");
  author.innerText = book.author;
  pages.classList.add("info-pages");
  pages.innerText = book.pages;
  status.setAttribute("id", "status");
  readStatus.classList.add("read-status");
  if (book.isRead === true) {
    readStatus.innerText = "Status: Read";
    readStatus.style.color = "#4f5949";
  } else {
    readStatus.innerText = "Status: In Progress";
    readStatus.style.color = "#cf3a08";
  }
  toggle.classList.add("toggle-button");
  toggle.textContent = "Toggle";
  toggle.dataset.id = i;
  deleteBtn.classList.add("delete-button");
  deleteBtn.textContent = "Remove";
  deleteBtn.dataset.id = i;

  toggle.addEventListener("click", toggleFn);
  deleteBtn.addEventListener("click", removeBook);

  gridItem.appendChild(image);
  bookInfo.appendChild(title);
  bookInfo.appendChild(author);
  bookInfo.append(pages);
  status.appendChild(readStatus);
  status.appendChild(toggle);
  bookInfo.appendChild(status);
  bookInfo.appendChild(deleteBtn);
  gridItem.appendChild(bookInfo);
  booksGrid.appendChild(gridItem);
};

const reloadBooks = () => {
  booksGrid.innerHTML = "";
  booksGrid.innerHTML += addGridTemplate.innerHTML;
  const newAddBtn = document.querySelector(".add-button");
  newAddBtn.addEventListener("click", popForm, false);
  for (let i = 0; i < library.myBooks.length; i++) {
    createGridItem(library.myBooks[i], i);
  }
};

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let newBook;
  getNewBook().then((book) => {
    newBook = book;
    if (library.addBookToLibrary(newBook) === false) {
      error.classList.add("active");
    } else {
      modal.classList.remove("active");
      overlay.classList.remove("active");
      reloadBooks();
    }
  });
});

sampleBtn.addEventListener("click", () => {
  library.addBookToLibrary(
    new Book(
      "The Hobbit",
      "J.R.R. Tolkien",
      295,
      false,
      "images/The-Hobbit.jpg"
    )
  );
  library.addBookToLibrary(
    new Book(
      "The Last Thing He Told Me",
      "Laura Dave",
      320,
      false,
      "images/Last-Thing.jpg"
    )
  );
  library.addBookToLibrary(
    new Book(
      "Left to Fear",
      "Blake Pierce",
      223,
      false,
      "images/Left-to-Fear.jpg"
    )
  );
  library.addBookToLibrary(
    new Book(
      "Malibu Rising",
      "Taylor Jenkins Reid",
      384,
      false,
      "images/Malibu-Rising.jpg"
    )
  );
  library.addBookToLibrary(
    new Book(
      "All the Light We Cannot See",
      "Anthony Doerrd",
      544,
      false,
      "images/All-the-Night.jpg"
    )
  );
  reloadBooks();
});
