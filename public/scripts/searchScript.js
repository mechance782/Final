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