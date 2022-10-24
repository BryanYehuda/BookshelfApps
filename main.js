const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function() {
    console.log(books);
    const submitForm = document.getElementById('input-book');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById('incomplete-bookshelf-list');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('complete-bookshelf-list');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isChecked)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
});

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isChecked) {
    return {
        id,
        title,
        author,
        year,
        isChecked
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function addBook() {
    const bookTitle = document.getElementById('input-book-title').value;
    const bookAuthor = document.getElementById('input-book-author').value;
    const bookYear = document.getElementById('input-book-year').value
    const bookChecked = document.getElementById("input-book-is-complete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookChecked);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;
    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book-item');
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement('div');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isChecked) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        });

        textContainer.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        });

        textContainer.append(checkButton);
    }
    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) {
        alert('Buku Tidak Ditemukan!');
        return;
    } else {
        bookTarget.isChecked = true;
        alert('Buku Berhasil Ditambahkan ke Selesai Dibaca')
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) {
        alert('Buku Tidak Ditemukan!');
        return;
    } else {
        todos.splice(bookTarget, 1);
        alert('Buku Berhasil Dihapus')
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) {
        alert('Buku Tidak Ditemukan!');
        return;
    } else {
        bookTarget.isChecked = false;
        alert('Buku Berhasil Ditambahkan ke Belum Selesai Dibaca')
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}