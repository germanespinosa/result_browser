
window.onload = function () {
    let element = document.getElementById("view");
    var view = "all"
    if (typeof parameters["view"] == "string"){
        view = parameters["view"];
    }
    element.value = view;
    load_results();
    element.onchange = load_results;
    let agents = document.getElementById("agents");
    set_visibility()
    agents.onchange = set_visibility;
};

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

function load_results(){
    loadfile('https://raw.githubusercontent.com/germanespinosa/results/master/' + parameters['result'] + '/experiment.json', function(data) {
        let view = document.getElementById("view").value;
        var tag = document.getElementById("content")
        var HTML = ""
        var entropies = Object.keys(data.summary)

        var sheet = document.createElement('style')
        sheet.innerHTML = "#content { column-count: " + entropies.length + ";}";
        document.body.appendChild(sheet);

        for (var i = 0; i < entropies.length; i++) {
            var entropyInd = entropies[i];
            HTML += "<div class='entropy'><div class='entropy_title'><h2>Entropy: 0." + entropies[i] + "</h2><h2>survival rate:" + round(data.summary[entropyInd].survival_rate ) + "</h2><h2> Avg. length:" + round(data.summary[entropyInd].avg_length) + "</h2></div>";
            var entropy = data.worlds[entropyInd];
            var worlds = Object.keys(entropy);
            for (var j = 0; j < worlds.length; j++) {
                var worldInd = worlds[j];
                HTML += "<div class='world'><a href='worlddetail.html?result=" + parameters['result'] + "&entropy=" + entropyInd + "&world=" + worldInd + "&view=" + view + "'><img class='prey' src='https://raw.githubusercontent.com/germanespinosa/results/master/" + parameters['result'] + "/img/world_" + worldInd + "_" + entropyInd + "_prey_" + view + ".png' /><img class='predator' src='https://raw.githubusercontent.com/germanespinosa/results/master/" + parameters['result'] + "/img/world_" + worldInd + "_" + entropyInd + "_predator_" + view + ".png' /></a></div>"
            }
            HTML += "</div>"
        }
        tag.innerHTML = HTML;
    });

}