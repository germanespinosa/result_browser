
window.onload = function () {
    let element = document.getElementById("view");
    var view = "all"
    if (typeof parameters["view"] == "string"){
        view = parameters["view"];
    }
    element.value = view;
    load_world_details();
    element.onchange = load_world_details;
};


function load_world_details() {
    loadfile('https://raw.githubusercontent.com/germanespinosa/results/master/' + parameters['result'] + '/experiment.json', function(data) {
        var tag = document.getElementById("content")
        let view = document.getElementById("view").value;
        var entropyInd = parameters['entropy']
        var worldInd = parameters['world']
        var spawn_locations = data.worlds[entropyInd][worldInd].spawn_locations;
        for (var j = 0; j < spawn_locations.length; j++) {
            x = spawn_locations[j][0];
            y = spawn_locations[j][1];
            tag.innerHTML += "" + parameters['result'] + "" + entropyInd + "<div><a href='episodesbrowse.html?result="+parameters["result"]+"&entropy="+ parameters["entropy"]+"&world=" + parameters["world"] + "&x=" + x + "&y=" + y + "'><img class='prey' src='https://raw.githubusercontent.com/germanespinosa/results/master/hi_complexity/img/world_" + worldInd + "_" + entropyInd + "_prey_" + view + "_" + x + "_" + y + ".png' /><img class='predator' src='https://raw.githubusercontent.com/germanespinosa/results/master/hi_complexity/img/world_" + worldInd + "_" + entropyInd + "_predator_" + view + "_" + x + "_" + y + ".png' /></a></div>"
        }
        tag.innerHTML += "</div>";
    });
}