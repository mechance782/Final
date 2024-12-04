
document.getElementById("menuButton").onclick = function() {
    if (document.getElementById("menu").style.display === "none"){
        document.getElementById("menu").style.display = "block";
        document.getElementById("menuButton").style.color = "#5B9FAE";
        document.getElementById("menuButton").style.backgroundColor = "#2c2c2c";
    } else {
        document.getElementById("menu").style.display = "none";
        document.getElementById("menuButton").style.color = "";
        document.getElementById("menuButton").style.backgroundColor = "";
    }
};

let star = 0;

document.getElementById("starDisplay").onclick = function(event){
    let element = event.target;
    if (element.id.includes("Star")){
        element.style.color = "#FFBF00";

        if (element.id.includes("one")){
            star = 1;
            document.getElementById("twoStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("threeStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("fourStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("fiveStar").style.color = "rgb(255, 255, 255, 0.4)";
        } else if (element.id.includes("two")){
            star = 2;
            document.getElementById("oneStar").style.color = "#FFBF00";
            document.getElementById("threeStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("fourStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("fiveStar").style.color = "rgb(255, 255, 255, 0.4)";
        } else if (element.id.includes("three")){
            star = 3;
            document.getElementById("oneStar").style.color = "#FFBF00";
            document.getElementById("twoStar").style.color = "#FFBF00";
            document.getElementById("fourStar").style.color = "rgb(255, 255, 255, 0.4)";
            document.getElementById("fiveStar").style.color = "rgb(255, 255, 255, 0.4)";
        } else if (element.id.includes("four")){
            star = 4;
            document.getElementById("oneStar").style.color = "#FFBF00";
            document.getElementById("twoStar").style.color = "#FFBF00";
            document.getElementById("threeStar").style.color = "#FFBF00";
            document.getElementById("fiveStar").style.color = "rgb(255, 255, 255, 0.4)";
        } else if (element.id.includes("five")){
            star = 5;
            document.getElementById("oneStar").style.color = "#FFBF00";
            document.getElementById("twoStar").style.color = "#FFBF00";
            document.getElementById("threeStar").style.color = "#FFBF00";
            document.getElementById("fourStar").style.color = "#FFBF00";
            
        }
        document.getElementById("starRating").value = star;
        document.getElementById("starOutput").innerHTML = "(" + star + " stars)";
    }
};

document.getElementById("reviewForm").onsubmit = function() {
    clearErrors();
    let isValid = true;
    if (star === 0){
        isValid = false;
        document.getElementById("ratingErr").style.display = "block";
    }

    let showTitle = document.getElementById("showTitle").value;
    if (showTitle === ""){
        isValid = false;
        document.getElementById("showErr").style.display = "block";
    }
    if (showTitle.length >= 100){
        isValid = false;
        document.getElementById("showMaxErr").style.display = "block";
    }

    let genreChecks = document.getElementsByClassName("genre");
    let genreCount = 0;
    for (let i = 0; i < genreChecks.length; i++){
        if (genreChecks[i].checked){
            genreCount++;
        }
    }
    if (genreCount === 0){
        isValid = false;
        document.getElementById("noGenreErr").style.display = "block";
    }
    if (genreCount > 5){
        isValid = false;
        document.getElementById("maxGenreErr").style.display = "block";
    }

    let audienceRatings = document.getElementsByName("audienceRating");
    let ratingIsChecked = true;
    for (let i=0; i < audienceRatings.length; i++){
        ratingIsChecked = false;
        if (audienceRatings[i].checked){
            ratingIsChecked = true;
            i = audienceRatings.length;
        }
    }
    if (ratingIsChecked === false){
        isValid = false;
        document.getElementById("audienceRatingErr").style.display = "block";
    }

    let reviewTitle = document.getElementById("reviewTitle").value;
    if (reviewTitle.length >= 100){
        isValid = false;
        document.getElementById("reviewTitleMaxErr").style.display = "block";
    }

    let reviewComment = document.getElementById("reviewComment").value;
    if (reviewComment.length >= 500){
        isValid = false;
        document.getElementById("reviewCommentMaxErr").style.display = "block";
    }

    let username = document.getElementById("username").value;

    if (usernameValidation(username) === false){
        isValid = false;
    }

    return isValid;
}

// https://www.geeksforgeeks.org/username-validation-in-js-regex/
// info about using regular expressions for username validation was found here ^
function usernameValidation(username){
    let nameValid = true;
    if (username.length >= 25 ){
        document.getElementById("usernameMaxErr").style.display = "block";
        nameValid = false;
    }
    if (username.length <= 3 ){
        document.getElementById("usernameMinErr").style.display = "block";
        nameValid = false;
    }
    const validChars = /^[a-zA-Z0-9_.]+$/;
    const letters = /[a-zA-Z]+/;
    if ((!validChars.test(username))|| (!letters.test(username))){
        document.getElementById("invalidUsername").style.display = "block"
        nameValid = false;
    }
    
    return nameValid;
}

function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for (let i=0; i < errors.length; i++){
        errors[i].style.display = "none";
    }
}

