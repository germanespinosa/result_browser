
window.onload = function () {
    let element = document.getElementById("view");
    var view = "all"
    if (typeof parameters["view"] == "string"){
        view = parameters["view"];
    }
    element.value = view;
    load_world_details();
    element.onchange = load_world_details;
    let agents = document.getElementById("agents");
    set_visibility()
    agents.onchange = set_visibility;
};

function load_world_details() {
    loadfile(project_folder +'experiment.json', function(data) {
        var tag = document.getElementById("content")
        let view = document.getElementById("view").value;
        var entropyInd = parameters['entropy']
        var worldInd = parameters['world']
        var spawn_locations = data.worlds[entropyInd][worldInd].spawn_locations;
        var sheet = document.createElement('style')
        sheet.innerHTML = "#content { column-count: " + spawn_locations.length + ";}";
        document.body.appendChild(sheet);
        var HTML="";
        for (var j = 0; j < spawn_locations.length; j++) {
            x = spawn_locations[j][0];
            y = spawn_locations[j][1];
            HTML += "<div class='world'>";
            HTML += "<a href='episodesbrowse.html?result="+parameters["result"]+"&entropy="+ parameters["entropy"]+"&world=" + parameters["world"] + "&x=" + x + "&y=" + y + "'>";
            HTML += "<img class='prey' src='" + img_folder + "world_" + worldInd + "_" + entropyInd + "_prey_" + view + "_" + x + "_" + y + ".png' />";
            HTML += "<img class='predator' src='" + img_folder + "world_" + worldInd + "_" + entropyInd + "_predator_" + view + "_" + x + "_" + y + ".png' />";
            HTML += "</a></div>";
        }
        HTML += "</div>";
        tag.innerHTML = HTML;
    });
}

function set_visibility(){
    let agents = document.getElementById("agents");
    if (agents.value == "both"){
        var sheet = document.createElement('style')
        sheet.innerHTML = ".prey {  opacity: 0.5;} .predator {  opacity: 0.5;}";
        document.body.appendChild(sheet);
    } else if (agents.value == "prey"){
        var sheet = document.createElement('style')
        sheet.innerHTML = ".prey {  opacity: 1;} .predator {  opacity: 0;}";
        document.body.appendChild(sheet);
    } else {
        var sheet = document.createElement('style')
        sheet.innerHTML = ".prey {  opacity: 0;} .predator {  opacity: 1;}";
        document.body.appendChild(sheet);
    }
}