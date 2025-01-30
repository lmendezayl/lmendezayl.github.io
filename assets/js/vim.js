var pos = 0;
var jump = 55;
var pages = ["", "projects.html", "experience.html", "blog", "misc.html"]

document.onkeydown = function(e) {
  e = e || window.event;
  var home = "https://lmendezayl.github.io/";

  // UP AND DOWN SCROLLING
  if (e.keyCode == 74){ // j, down
    if (pos + jump <= 2000) pos += jump; // Fix this. If you try to do scrollHeight, you need to make sure it calculates that after everything loads.
    window.scrollTo(0, pos);
  }
  else if (e.keyCode == 75){ // k, up
    if (pos - jump >= 0) pos -= jump;
    window.scrollTo(0, pos);
  }

  // NEXT/PREV PAGE
  else if (e.keyCode == 76){ // si presionás 'l', vamos a la siguiente página
    var title;
    var url = document.location.href; // obtenemos la url actual
    if (url.includes("blog")){
        title = "blog"; // si la url tiene "blog", entonces asignamos el título como "blog"
    } else {
        // si no es un blog, tomamos la última parte de la url (quitando el ".html") como título
        title = url.split("/").slice(-1)[0].replace(".html", "");
    }
    
    var index = pages.indexOf(title); // buscamos la página actual en el array 'pages'
	if(index == -1) index = 0; // si no la encuentra, la ponemos en el primer índice (0)
    var newindex = pages[(index + 1) % pages.length]; // calculamos el índice de la siguiente página (circular)
    window.location.href = home + newindex; // redirigimos a la nueva página
}
  else if (e.keyCode == 72){ // si presionás 'h', vamos a la página anterior
    var title;
    var url = document.location.href; // obtenemos la url actual
    if (url.includes("blog")){
        title = "blog"; // si la url tiene "blog", asignamos el título como "blog"
    } else {
        // si no es un blog, tomamos la última parte de la url como título (sin el ".html")
        title = url.split("/").slice(-1)[0].replace(".html", "");
    }
    
    var index = pages.indexOf(title); // buscamos la página actual en el array 'pages'
	if(index == -1) index = 0; // si no la encuentra, la ponemos en el primer índice (0)
    var newindex = pages[(index - 1 + pages.length) % pages.length]; // calculamos el índice de la página anterior (circular)
    window.location.href = home + newindex; // redirigimos a la nueva página
  }
};
