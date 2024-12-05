const express = require(`express`);
const mariadb = require(`mariadb`);
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app = express();

const PORT = 300;

app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to database');
        return conn;
    } catch (err) {
        console.log('Error connecting to database: ' + err);
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/success', (req, res) => {
    res.send("You must post to access this page!");
});


function escapeQuotation(input){
    let sentence = input.split("");
    for (let i = 0; i < sentence.length; i++){
        if ((sentence[i] === "'")||(sentence[i] === '"')){
            if (i === 0){
                sentence.unshift(`\\`);
                i++;
            } else {
                sentence.splice((i), 0, "\\");
                i++;
            }
        }
    }
    let output = "";
    for (let i=0; i < sentence.length; i++){
        output+= sentence[i];
    }
    return output;
}

app.post('/success', async (req, res) => {
    const data = req.body;
    let showTitle = escapeQuotation(data.showTitle);

    const conn = await connect();

    await conn.query(`INSERT INTO posts (show_title, genres, audience_rating,
        star_rating, review_title, review_comment, username) VALUES (
        '${showTitle}', '${data.genres}', '${data.audienceRating}', ${data.starRating},
         '${data.reviewTitle}', '${data.reviewComment}', '${data.username}'
        )`);
    res.render('confirmation', {data: data});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});