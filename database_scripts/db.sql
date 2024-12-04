CREATE DATABASE tv_reviews;

USE tv_reviews;
CREATE TABLE posts(
	id INT auto_increment PRIMARY KEY,
    show_title VARCHAR(100),
    genres VARCHAR(250),
    audience_rating VARCHAR(10),
    star_rating INT,
    review_title VARCHAR(100),
    review_comment VARCHAR(500),
    username VARCHAR(20),
    timestamp DATETIME DEFAULT NOW()
);