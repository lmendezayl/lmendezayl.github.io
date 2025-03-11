var pos = 0;
var jump = 55;
var pages = ["", "projects.html", "experience.html", "equipment.html", "about.html"]

document.onkeydown = function (e) {
  e = e || window.event;
  let home = "http://127.0.0.1:5500/";

  // UP AND DOWN SCROLLING
  if (e.key == "j" ) { // j, down
    if (pos + jump <= 2000) pos += jump; 
    window.scrollTo(0, pos);
  }
  else if (e.key == "k") { // k, up
    if (pos - jump >= 0) pos -= jump;
    window.scrollTo(0, pos);
  }

  // NEXT/PREV PAGE
  else if (e.key == "l") { // l, next
    var url = document.location.href; 
    var title = url.split("/").slice(-1)[0].replace(".html", "");
    var index = pages.indexOf(title); 
    if (index == -1) index = 0; 
    var newindex = pages[(index + 1) % pages.length]; 
    window.location.href = home + newindex;
    home = window.location.href;
  }
  else if (e.key == "h") { // h, previous
    var url = document.location.href; 
    var title = url.split("/").slice(-1)[0].replace(".html", "");
    var index = pages.indexOf(title); 
    if (index == -1) index = 0; 
    var newindex = pages[(index - 1 + pages.length) % pages.length]; 
    window.location.href = home + newindex;
    home = window.location.href; // redirigimos a la nueva página
  }
};
