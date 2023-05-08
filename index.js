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

let myBooks = [];

function addBookToLibrary(title, author, pages, isRead, img) {
  if (myBooks.some((book) => book.title === title && book.author === author)) {
    return false;
  }
  let book;
  if (img === "null") {
    book = new Book(title, author, pages, isRead);
  } else {
    book = new Book(title, author, pages, isRead, img);
  }
  myBooks.push(book);
  return true;
}

function removeFromLibrary(title, author) {
  myBooks = myBooks.filter(
    (book) => book.title !== title && book.author !== author
  );
}

function getBook(title, author) {
  for (let book of myBooks) {
    if (book.title === title && book.author === author) {
      return book;
    }
  }
  return null;
}

function toggleFn(e) {
  const id = e.target.dataset.id;
  if (myBooks[id].isRead) {
    myBooks[id].isRead = false;
    e.target.previousSibling.innerText = "Status: In Progress";
    e.target.previousSibling.style.color = "#cf3a08";
  } else {
    myBooks[id].isRead = true;
    e.target.previousSibling.innerText = "Status: Read";
    e.target.previousSibling.style.color = "#4f5949";
  }
}

function removeBook(e) {
  const id = e.target.dataset.id;
  myBooks.splice(id, 1);
  reloadBooks();
}

const addGridTemplate = document.getElementById("add-grid-template");
const booksGrid = document.querySelector(".books-grid");

function createGridItem(book, i) {
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
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function popForm() {
  submitForm.reset();
  error.classList.remove("active");
  modal.classList.add("active");
  overlay.classList.add("active");
}

function reloadBooks() {
  booksGrid.innerHTML = "";
  booksGrid.innerHTML += addGridTemplate.innerHTML;
  const addBtn = document.querySelector(".add-button");
  addBtn.addEventListener("click", popForm, false);
  for (let i = 0; i < myBooks.length; i++) {
    createGridItem(myBooks[i], i);
  }
}

const addBtn = document.querySelector(".add-button");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".add-book-modal");
const closeForm = document.querySelector(".close-form");
const submitForm = document.querySelector(".add-book-form");
const error = document.querySelector(".error-message");
const sampleBtn = document.getElementById("sample");

addBtn.addEventListener("click", popForm, false);

closeForm.addEventListener("click", function () {
  modal.classList.remove("active");
  overlay.classList.remove("active");
});

submitForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("isRead").checked;
  const image = document.getElementById("cover");
  let img;
  if (image.files && image.files[0]) {
    getBase64(image.files[0]).then((data) => {
      img = data;
      if (addBookToLibrary(title, author, pages, isRead, img) === false) {
        error.classList.add("active");
      } else {
        modal.classList.remove("active");
        overlay.classList.remove("active");
        reloadBooks();
      }
    });
  } else {
    if (addBookToLibrary(title, author, pages, isRead) === false) {
      error.classList.add("active");
    } else {
      modal.classList.remove("active");
      overlay.classList.remove("active");
      reloadBooks();
    }
  }
});

sampleBtn.addEventListener("click", function () {
  addBookToLibrary(
    "The Hobbit",
    "J.R.R. Tolkien",
    295,
    false,
    "images/The-Hobbit.jpg"
  );
  addBookToLibrary(
    "The Last Thing He Told Me",
    "Laura Dave",
    320,
    false,
    "images/Last-Thing.jpg"
  );
  addBookToLibrary(
    "Left to Fear",
    "Blake Pierce",
    223,
    false,
    "images/Left-to-Fear.jpg"
  );
  addBookToLibrary(
    "Malibu Rising",
    "Taylor Jenkins Reid",
    384,
    false,
    "images/Malibu-Rising.jpg"
  );
  addBookToLibrary(
    "All the Light We Cannot See",
    "Anthony Doerrd",
    544,
    false,
    "images/All-the-Night.jpg"
  );
  reloadBooks();
});
