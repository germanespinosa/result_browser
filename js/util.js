agents=['prey','predator']
results=['goal attained','goal not attained', 'all']

function getUrlVars() {
    let vars = {};
    let query = window.location.href.split("#")[0].replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
parameters = getUrlVars();
project_folder = "https://raw.githubusercontent.com/germanespinosa/results/master/" + parameters["experiment"] + "/";
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

Range = function(a,b){
    let r=[];
    if (typeof b == "undefined"){
        for (let i=0;i<a;i++) r.push(i);
    } else {
        for (;a<b;a++) r.push(a);
    }
    return r;
}

function GetUrl(url, experiment, group, world, set){
    let uri = url + "?experiment=" + experiment;
    if (typeof group != "undefined") uri += "&group=" + group;
    if (typeof world != "undefined") uri += "&world=" + world;
    if (typeof set != "undefined") uri += "&set=" + set;
    return uri;
}

function NavigateTo (url){
    window.location= url + "&Winner=" + Winner +  "&Agent=" + Agent
}
