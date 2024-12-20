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