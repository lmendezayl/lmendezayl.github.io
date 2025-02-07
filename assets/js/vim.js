var pos = 0;
var jump = 55;
var pages = ["", "projects.html", "experience.html"]

document.onkeydown = function (e) {
  e = e || window.event;
  let home = "https://lmendezayl.github.io/";

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
    var title = url.split("/").slice(-1)[0].replace(".html", "");
    var url = document.location.href; 
    var index = pages.indexOf(title); 
    if (index == -1) index = 0; 
    var newindex = pages[(index + 1) % pages.length]; 
    window.location.href = home + newindex;
  }
  else if (e.key == "h") { // h, previous
    var url = document.location.href; 
    var title = url.split("/").slice(-1)[0].replace(".html", "");
    var index = pages.indexOf(title); 
    if (index == -1) index = 0; 
    var newindex = pages[(index - 1 + pages.length) % pages.length]; 
    window.location.href = home + newindex; // redirigimos a la nueva página
  }
};
