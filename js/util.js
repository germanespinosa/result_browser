function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
parameters = getUrlVars();

project_folder = "https://raw.githubusercontent.com/germanespinosa/results/master/" + parameters["result"] + "/";
img_folder = project_folder + "img/";

function round(a){
    return(Math.round(a * 100)/ 100);
}

function loadfile (url, callback) {
    let request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(null);
}