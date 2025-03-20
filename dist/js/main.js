function TopBarRespond() {
    var x = document.getElementById("topNavBar");
    if (x.className === "topnav") {
        x.className += "responsive";
    } else {
        x.className = "topnav"
    }
}