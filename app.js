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

// app.use(express.static('public'));
app.use(express.static(__dirname + "/public"));

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

async function searchFor(search){
    let data;
    const conn = await connect();
    const keyword = escapeQuotation(search.keyword);
    const rating = search.searchAudienceRating;
    const star = search.searchStar;
    const searchTime = search.searchTime;
    let and = false;
    let nestedOrder = false;
    let timeOrderBy = `, timestamp DESC`;
    let searchQuery = `SELECT * FROM posts `;

    if (keyword !== ""){
        searchQuery+= `WHERE ((show_title LIKE '%${keyword}%') 
        OR (review_title LIKE '%${keyword}%') OR (review_comment LIKE '%${keyword}%')) `;
        and = true;
    }

    if (search.genres !== ""){
        if (and){
            for(let i =1; i < search.genres.length; i++){
                searchQuery+= `AND (genres LIKE '%${search.genres[i]}%') `;  
            }
        } else {
            searchQuery+= `WHERE (genres LIKE '%${search.genres[1]}%') `;
            for(let i =2; i < search.genres.length; i++){
                searchQuery+= `AND (genres LIKE '%${search.genres[i]}%') `;  
            }
            and = true;
        }
    }

    if (search.author !== ""){
        if (and){
            searchQuery+= `AND (username LIKE '%${search.author}%') `;
        } else {
            searchQuery+= `WHERE (username LIKE '%${search.author}%') `;
            and = true;
        }
    }
    
    if (rating !== ''){
        if (and){
            searchQuery+= `AND (audience_rating = '${rating}') `;
        } else {
            searchQuery+= `WHERE (audience_rating = '${rating}') `;
            and = true;
        }
    }

    if (searchTime !== 'DESC'){
        if (searchTime !== 'ASC'){
            const currDate = new Date();
            let pastDate = new Date();
            if (searchTime === 'pastMonth'){
                pastDate.setDate(currDate.getDate() - 30);
                pastDate.setHours(pastDate.getHours() - 8);
                pastDate = pastDate.toISOString();
                pastDate = pastDate.substring(0, 19);
                if (and){
                    searchQuery+= `AND (timestamp > '${pastDate}') `;
                } else {
                    searchQuery+= `WHERE (timestamp > '${pastDate}') `;
                    and = true;
                }
            } else if (searchTime === 'pastDay'){
                pastDate.setDate(currDate.getDate() - 1);
                pastDate.setHours(pastDate.getHours() - 8);
                pastDate = pastDate.toISOString();
                pastDate = pastDate.substring(0, 19);
                if (and){
                    searchQuery+= `AND (timestamp > '${pastDate}') `;
                } else {
                    searchQuery+= `WHERE (timestamp > '${pastDate}') `;
                    and = true;
                }
            } else if (searchTime === 'pastYear'){
                pastDate.setFullYear(currDate.getFullYear() - 1);
                pastDate.setHours(pastDate.getHours() - 8);
                pastDate = pastDate.toISOString();
                pastDate = pastDate.substring(0, 19);
                if (and){
                    searchQuery+= `AND (timestamp > '${pastDate}') `;
                } else {
                    searchQuery+= `WHERE (timestamp > '${pastDate}') `;
                    and = true;
                }
            }
        } else {
            timeOrderBy = `, timestamp ASC`;
        }
    }

    if (star !== ''){
        if ((star !== 'ASC') && (star !== 'DESC')){
            const starNumber = Number(star);
            if (and){
                searchQuery+= `AND (star_rating = ${starNumber}) `;
            } else {
                searchQuery+= `WHERE (star_rating = ${starNumber}) `;
                and = true;
            }
        } else if (star === 'ASC'){
            nestedOrder = true;
            orderBy= `ORDER BY star_rating ASC`;
        } else {
            nestedOrder = true;
            orderBy= `ORDER BY star_rating DESC`;
        }
    }

    if (nestedOrder) {
        orderBy+= timeOrderBy;
        searchQuery+= orderBy;
    } else {
        searchQuery += `ORDER BY `;
        searchQuery+= timeOrderBy.substring(1, timeOrderBy.length);
    }

    searchQuery+= ` LIMIT 24`;
    try {
        data = await conn.query(searchQuery);
        conn.end();
        return data;
    } catch (err) {
        console.log('Error with sql query: ' + err);
    }
}

async function getKeywords(post){
    let keywords = [];
    let showTitle = escapeQuotation(post[0].show_title);
    let reviewTitle = escapeQuotation(post[0].review_title);
    let reviewComment = escapeQuotation(post[0].review_comment);
    showTitle = showTitle.split(" ");
    reviewTitle = reviewTitle.split(" ");
    reviewComment = reviewComment.split(" ")
    keywords = keywords.concat(showTitle);
    keywords = keywords.concat(reviewTitle);
    keywords = keywords.concat(reviewComment);
    const conn = await connect();
    let andOr = false;
    let selectQuery = `SELECT * FROM posts WHERE (`;
    for (let i =0; i < keywords.length; i++){
        if (keywords[i].length > 3){
            if (andOr === false){
                selectQuery+= `(show_title LIKE '%${keywords[i]}%') 
                OR (review_title LIKE '%${keywords[i]}%') OR (review_comment LIKE '%${keywords[i]}%') `
                andOr = true;
            } else {
                selectQuery+= `OR (show_title LIKE '%${keywords[i]}%') 
                OR (review_title LIKE '%${keywords[i]}%') OR (review_comment LIKE '%${keywords[i]}%') `;
            }
        }
    }
    selectQuery+= `) AND ( id != ${post[0].id} ) LIMIT 6`;
    let data = await conn.query(selectQuery);
    if (data.length < 2 ){
        data = await conn.query(`SELECT * FROM posts ORDER BY timestamp DESC LIMIT 6`);
    }
    conn.end();
    return data;
}

// ROUTES 
app.get('/', async (req, res) => {
    const conn = await connect();
    const data = await conn.query(`SELECT * FROM posts ORDER BY timestamp DESC LIMIT 6`);
    conn.end();
    res.render('home', {data: data});
});

app.get('/form', (req, res) => {
    res.render('form');
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

    let id = await conn.query(`SELECT id FROM posts ORDER BY id DESC LIMIT 1`);
    id = id[0].id;
    conn.end();
    res.redirect(`/viewPost/${id}`);
});

// Search page without any searches
app.get('/search', (req, res) => {
    res.render('search', {data: [], search: []});
});

// Search page after sending search query
//  keyword
//  author
//  searchGenre
//  searchAudienceRating
//  searchStar
//  searchTime
app.post('/search', async (req, res) => {
    let search =  req.body;
    console.log(search);
    let data = await searchFor(search);
    res.render('search', {data: data, search: search});
})

app.get('/search/:category/:query', async (req, res) => {
    const { category, query } = req.params;
    let data;
    const conn = await connect();
    let author;
    if (category === 'genre'){
        data = await conn.query(`SELECT * FROM posts WHERE genres LIKE '%${query}%' ORDER BY timestamp DESC LIMIT 24`);
    } else if (category === 'username'){
        data = await conn.query(`SELECT * FROM posts WHERE username LIKE '%${query}%' ORDER BY timestamp DESC LIMIT 24`);
    }
    conn.end();
    res.render('search', {data: data, search: query });
})

app.get('/viewPost/:id', async (req, res) => {
    const { id } = req.params;
    const conn = await connect();
    const post = await conn.query(`SELECT * FROM posts WHERE id = ${id}`);
    conn.end();
    const relatedPosts = await getKeywords(post);
    console.log(relatedPosts);
    res.render('viewPost', {data: post, related: relatedPosts});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});