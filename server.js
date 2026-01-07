const express = require('express');
const { nanoid } = require('nanoid');
const app = express();

app.use(express.json());

let books = []; // simpan data buku di memory

// CREATE: Tambah buku (POST /books)
app.post('/books', (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id }
  });
});

// READ ALL: Tampilkan semua buku (GET /books)
app.get('/books', (req, res) => {
  const bookList = books.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  return res.status(200).json({
    status: 'success',
    data: { books: bookList }
  });
});

// READ DETAIL: Tampilkan detail buku (GET /books/:bookId)
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { book }
  });
});

// UPDATE: Perbarui buku (PUT /books/:bookId)
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
  }

  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  });
});

// DELETE: Hapus buku (DELETE /books/:bookId)
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
  }

  books.splice(index, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus'
  });
});

// Jalankan server di port 9000
app.listen(9000, () => {
  console.log('Server running at http://localhost:9000');
});
