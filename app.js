const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const fs = require('fs');  // Add this line
const csvParser = require('csv-parser');  // Add this line
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static('public'));

// Set up file upload using Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    // Render the home page with the CSV data
    res.render('home', { files: [], csvData: [] });
});

app.post('/upload', upload.single('csvFile'), (req, res) => {
    // Process the uploaded CSV file
    const csvData = [];
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            csvData.push(row);
        })
        .on('end', () => {
            // Render the home page with the CSV data
            res.render('home', { files: [], csvData: csvData });
        });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:8000}`);
});
