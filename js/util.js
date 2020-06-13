agents=['prey','predator']
results=['goal attained','goal not attained', 'all']
fill_colors = ["red", "blue"];
agent_colors = ["green", "orange"];

function getUrlVars() {
    let vars = {};
    let query = window.location.href.split("#")[0].replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
parameters = getUrlVars();
results_folder = "https://raw.githubusercontent.com/germanespinosa/results/master/";
project_folder = results_folder + parameters["experiment"] + "/";
img_folder = project_folder + "heatmaps/";

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

function download(data, filename) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    hiddenElement.click();
}

function get_item_by_name(list, name){
    for (let i=0 ;i<list.length;i++)
        if (list[i].name == name) return list[i];
}