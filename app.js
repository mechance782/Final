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

// if data input has quotations, this function inserts back slashes to escape the quotation
// to avoid errors when reading data into database
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

// ROUTES 
app.get('/', async (req, res) => {
    const conn = await connect();
    const data = await conn.query(`SELECT * FROM posts ORDER BY timestamp DESC LIMIT 6`);

    res.render('home', {data: data});
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.get('/success', (req, res) => {
    res.send("You must post to access this page!");
});

app.post('/success', async (req, res) => {
    const data = req.body;
    const showTitle = escapeQuotation(data.showTitle);
    const reviewTitle = escapeQuotation(data.reviewTitle);
    const reviewComment = escapeQuotation(data.reviewComment);
    let username = data.username;
    if (username === ''){
        username = 'anonymous';
    }

    const conn = await connect();

    await conn.query(`INSERT INTO posts (show_title, genres, audience_rating,
        star_rating, review_title, review_comment, username) VALUES (
        '${showTitle}', '${data.genres}', '${data.audienceRating}', ${data.starRating},
         '${reviewTitle}', '${reviewComment}', '${username}'
        )`);

    //get timestamp and concat onto data object to send to confirmations page
    let timestampSql = await conn.query(`SELECT DATE(timestamp) AS timestamp FROM posts ORDER BY timestamp DESC LIMIT 1`);
    timestampSql = new Date(timestampSql[0].timestamp);
    const timestamp = {
        year: timestampSql.getFullYear(),
        month: timestampSql.getMonth() +1,
        day: timestampSql.getDate()
    };

    res.render('confirmation', {data: data, timestamp: timestamp});
});

app.get('/search', async (req, res) => {

    res.render('search', {data: false});
});

app.post('/search', async (req, res) => {


})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});