const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading directory");
            return;
        }
        res.render("index", { files: files });
    });
});

app.get('/file/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf8", function (err, filedata) {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }
        res.render("show", { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function (req, res) {
    res.render("edit", { filename: req.params.filename });
});

app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error renaming file");
            return;
        }
        res.redirect('/');
    });
});

app.post('/create', function (req, res) {
    const title = req.body.title.split(' ').join('');
    const body = req.body.body;

    fs.writeFile(`./files/${title}.txt`, body, 'utf8', function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating file");
            return;
        }
        res.redirect('/');
    });
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

