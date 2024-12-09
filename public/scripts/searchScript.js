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

document.onclick = function (event) {
    if (document.getElementById("menu").style.display === "block"){
        if ((event.target.id != "menu") && (event.target.id != "menuButton")){
            document.getElementById("menu").style.display = "none";
            document.getElementById("menuButton").style.color = "";
            document.getElementById("menuButton").style.backgroundColor = "";
        }
    }
}

document.getElementById("genreButton").onclick = function() {
    if (document.getElementById("genreDropDown").style.display === "none"){
        if (window.innerWidth > 960){
            document.getElementById("genreDropDown").style.display = "block";
        } else {
            document.getElementById("genreDropDown").style.display = "flex";
        }
        document.getElementById("genreButtonDown").style.display = "none";
        document.getElementById("genreButtonUp").style.display = "inline";
        } else {
        document.getElementById("genreDropDown").style.display = "none";
        document.getElementById("genreButtonDown").style.display = "inline";
        document.getElementById("genreButtonUp").style.display = "none";
        }
};

document.getElementById("searchForm").onsubmit = function() {
    clearErrors();
    let isValid = true;

    let keyword = document.getElementById("keyword").value;
    if (keyword.length > 100){
        document.getElementById("keywordMaxErr").style.display = "block";
        isValid = false;
    }

    let author = document.getElementById("author").value;
    if (author.length > 20 ){
        document.getElementById("authorMaxErr").style.display = "block";
        isValid = false;
    }
    return isValid;
}

function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for (let i=0; i < errors.length; i++){
        errors[i].style.display = "none";
    }
};