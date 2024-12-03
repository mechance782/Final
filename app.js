const express = require(`express`);
const mariadb = require(`mariadb`);

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Gtchance*07',
    database: 'guestbook'
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

app.post('/success', (req, res) => {
    let data = req.body;
    res.render('confirmation', {data: data});
})

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});