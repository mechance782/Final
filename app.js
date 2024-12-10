const express = require(`express`);
const mariadb = require(`mariadb`);
require('dotenv').config();

// store databse information in pool with env variables
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app = express();

const PORT = 300;

app.use(express.urlencoded({extended: false}));


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

// The searchFor function parses through search information to build a query string
// to search the database with
async function searchFor(search){
    // connect to database
    const conn = await connect();

    // format and set some necessary variables
    const keyword = escapeQuotation(search.keyword);
    const rating = search.searchAudienceRating;
    const star = search.searchStar;
    const searchTime = search.searchTime;
    let data;
    // and boolean determines where the concatenation should include an 'and' or a 'where' sql command
    let and = false;
    let nestedOrder = false;
    // set up search query string to build on / with
    let timeOrderBy = `, timestamp DESC`;
    let searchQuery = `SELECT * FROM posts `;

    // if keyword is not empty, search for the string in titles, or comments
    if (keyword !== ""){
        if (and){
            searchQuery+= `AND `;
        } else {
            searchQuery+= `WHERE `
            and = true;
        }
        searchQuery+= `((show_title LIKE '%${keyword}%') 
                OR (review_title LIKE '%${keyword}%') OR (review_comment LIKE '%${keyword}%')) `;
    }

    // if the user searched genres, iterate through the genres array and search for each genre
    // index 0 in genres search array is always empty to help handle cases where the user does
    // NOT search for any genres
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

    // if user searches a username, check for usernames containing the search
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

    // every search is automatically sorted by time descending, so we only need to check
    // for input when the time is not desc. 
    if (searchTime !== 'DESC'){
        if (searchTime !== 'ASC'){
            // get the machines current date
            const currDate = new Date();
            let pastDate = new Date();

            if (searchTime === 'pastMonth'){
                // set the date to 30 days in the past (for the search)
                // and subtract 8 hours (to match Pacific Time Zone)
                pastDate.setDate(currDate.getDate() - 30);
                pastDate.setHours(pastDate.getHours() - 8);

                // format date for database interaction and search
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
        // if the star search is not asc or desc then it's a number
        if ((star !== 'ASC') && (star !== 'DESC')){
            // format for database interaction
            const starNumber = Number(star);
            if (and){
                searchQuery+= `AND (star_rating = ${starNumber}) `;
            } else {
                searchQuery+= `WHERE (star_rating = ${starNumber}) `;
                and = true;
            }
        } else if (star === 'ASC'){
            // order by statements are added to a different string 
            // because they need to be tacked on to the search query at the end of all the 'where' statements
            nestedOrder = true;
            orderBy= `ORDER BY star_rating ASC`;
        } else {
            nestedOrder = true;
            orderBy= `ORDER BY star_rating DESC`;
        }
    }

    // if nested order is true, that means the query is ordering by 2 columns at the same time
    if (nestedOrder) {
        orderBy+= timeOrderBy;
        searchQuery+= orderBy;
    } else {
        // if nested order is false, then the query is ordered by time desc by default
        searchQuery += `ORDER BY `;
        searchQuery+= timeOrderBy.substring(1, timeOrderBy.length);
    }

    // searches can only return up to 24 posts for now
    searchQuery+= ` LIMIT 24`;
    try {
        data = await conn.query(searchQuery);
        conn.end();
        return data;
    } catch (err) {
        console.log('Error with sql query: ' + err);
    }
}

// the getkeywords function gets all text inputs from a post and returns post data from related posts.
// It seperates each word and puts it into an array. Then it goes through the array and 
// if the word is longer than 3 characters, it's considered a keyword. Each keyword
// is added to the search query string to search for any posts with similar text inputs.
// If there are no keywords in a post, or no matches in the database, then the function 
// returns recent posts instead.
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
    let noValidWords = true;
    let selectQuery = `SELECT * FROM posts WHERE (`;
    for (let i =0; i < keywords.length; i++){
        if (keywords[i].length > 3){
            if (andOr === false){
                selectQuery+= `(show_title LIKE '%${keywords[i]}%') 
                OR (review_title LIKE '%${keywords[i]}%') OR (review_comment LIKE '%${keywords[i]}%') `
                andOr = true;
                noValidWords = false;
            } else {
                selectQuery+= `OR (show_title LIKE '%${keywords[i]}%') 
                OR (review_title LIKE '%${keywords[i]}%') OR (review_comment LIKE '%${keywords[i]}%') `;
                noValidWords = false;
            }
        }
    }
    selectQuery+= `) AND ( id != ${post[0].id} ) ORDER BY timestamp DESC LIMIT 6`;

    if (noValidWords){
        selectQuery = `SELECT * FROM posts WHERE ( id != ${post[0].id} ) ORDER BY timestamp DESC LIMIT 6`;
    }

    let data = await conn.query(selectQuery);
    if (data.length < 1 ){
        data = await conn.query(`SELECT * FROM posts WHERE ( id != ${post[0].id} ) ORDER BY timestamp DESC LIMIT 6`);
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

    // form validation
    let isValid = true;
    if (data.starRating === 0){
        isValid = false;
    }

    if (data.showTitle === ""){
        isValid = false;
    } else if (data.showTitle.length >= 100){
        isValid = false;
    }

    if (Array.isArray(data.genres)){
        if (data.genres.length > 5){
            isValid = false;
        }
    } else if (data.genres === ""){
        isValid = false;
    }

    if (data.audienceRating === ""){
        isValid = false;
    }

    if (data.reviewTitle.length > 100){
        isValid = false;
    }

    if (data.reviewComment.length > 500){
        isValid = false;
    }

    if (data.username.length > 20){
        isValid = false;
    }
    if (data.username.length !== 0){
        if (data.username.length <= 3 ){
            isValid = false;
        }
        const validChars = /^[a-zA-Z0-9_.]+$/;
        const letters = /[a-zA-Z]+/;
        if ((!validChars.test(data.username))|| (!letters.test(data.username))){
            isValid = false;
        }
    }
    if (!isValid){
        res.redirect('form');
    }

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
app.post('/search', async (req, res) => {
    let search =  req.body;
    let data = {};
    data = await searchFor(search);
    res.render('search', {data: data, search: search});
})

// search page for links for usernames and genres
app.get('/search/:category/:query', async (req, res) => {
    const { category, query } = req.params;
    let data;
    // create empty/default search for the search.ejs page to accept
    let search = {
        keyword: '',
        author: '',
        genres: '',
        searchAudienceRating: '',
        searchStar: '',
        searchTime: 'DESC'
    };
    const conn = await connect();
    if (category === 'genre'){
        data = await conn.query(`SELECT * FROM posts WHERE genres LIKE '%${query}%' ORDER BY timestamp DESC LIMIT 24`);
        search.genres = ['', query];
    } else if (category === 'username'){
        data = await conn.query(`SELECT * FROM posts WHERE username LIKE '%${query}%' ORDER BY timestamp DESC LIMIT 24`);
        search.author = query;
    }
    conn.end();
    res.render('search', {data: data, search: search });
})

// route to view an individual post (and it's related posts)
app.get('/viewPost/:id', async (req, res) => {
    const { id } = req.params;
    const conn = await connect();
    const post = await conn.query(`SELECT * FROM posts WHERE id = ${id}`);
    conn.end();
    const relatedPosts = await getKeywords(post);
    res.render('viewPost', {data: post, related: relatedPosts});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});