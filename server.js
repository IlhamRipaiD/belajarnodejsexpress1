const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Menggunakan middleware untuk parsing data POST
app.use(express.urlencoded({ extended: true }));

// Fungsi untuk membaca data mahasiswa dari file JSON
function getMahasiswa() {
  const data = fs.readFileSync('./data/mahasiswa.json', 'utf-8');
  return JSON.parse(data);
}

// Fungsi untuk menyimpan data mahasiswa ke file JSON
function saveMahasiswa(mahasiswa) {
  fs.writeFileSync('./data/mahasiswa.json', JSON.stringify(mahasiswa, null, 2));
}

// Fungsi untuk menghitung jumlah mahasiswa
function getJumlahMahasiswa() {
  const mahasiswa = getMahasiswa();
  return mahasiswa.length;
}

// Set view engine ke EJS dan tentukan lokasi views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mengarahkan ke halaman dashboard
app.get('/', (req, res) => {
  const mahasiswa = getMahasiswa(); // Ambil semua data mahasiswa
  const jumlahMahasiswa = getJumlahMahasiswa(); // Hitung jumlah mahasiswa

  // Kirimkan data mahasiswa dan jumlah mahasiswa ke dashboard.ejs
  res.render('dashboard', { mahasiswa, jumlahMahasiswa });
});

// Route untuk tambah mahasiswa
app.get('/add', (req, res) => {
    res.render('add'); // Ganti dari res.sendFile ke res.render
  });

app.post('/add', (req, res) => {
  const { nama, nim } = req.body;
  const mahasiswa = getMahasiswa();
  mahasiswa.push({ nama, nim });
  saveMahasiswa(mahasiswa);
  res.redirect('/');
});

// Route untuk edit mahasiswa
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const mahasiswa = getMahasiswa()[id];
  res.render('edit', { mahasiswa, id });
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nama, nim } = req.body;
  const mahasiswa = getMahasiswa();
  mahasiswa[id] = { nama, nim };
  saveMahasiswa(mahasiswa);
  res.redirect('/');
});

// Route untuk hapus mahasiswa
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  const mahasiswa = getMahasiswa();
  mahasiswa.splice(id, 1);
  saveMahasiswa(mahasiswa);
  res.redirect('/');
});

// Jalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
