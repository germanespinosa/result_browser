
window.onload = function () {
    let experiment_name = parameters.experiment;
    let group_name = parameters.group;
    let wold_name = parameters.world;
    let title = document.getElementById("title");
    title.innerHTML = parameters.world;
    loadSettings();
    load_world(experiment_name,group_name,wold_name);
};

function load_world(experiment_name, group_name, world_name){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = document.getElementById("content");
        let world = experiment.groups[group_name].worlds[world_name];
        let sets = Object.keys(world.sets);
        let HTML = "<div class='group_table'>";
        for (let i=0;i<sets.length;i++){
            HTML += "<div class='group_column' id='" + sets[i] + "'>";
            HTML += "<div class='title' id='title_" + sets[i] + "'>" + sets[i] + "</div>";
            HTML += "<div class='stats' id='stats_" + sets[i] + "'></div>";
            HTML += "<div class='maps' id='maps_" + sets[i] + "'></div>";
            HTML += "</div>";
        }
        HTML +="</div>"
        content.innerHTML = HTML;

        var sheet = document.createElement('style')
        sheet.innerHTML = ".group_table { column-count: " + sets.length + ";}";
        document.body.appendChild(sheet);

        for (let i=0;i<sets.length;i++){
            let set_ = sets[i]
            let content = document.getElementById("stats_" + set_);
            LoadStats (content,world.sets[set_], 300);
        }
        for (let i=0;i<sets.length;i++){
            let set_ = sets[i]
            let content = document.getElementById("maps_" + set_);
            AddMap(300,300,content, experiment_name, group_name, world_name, set_, GetUrl("set.html",experiment_name,group_name,world_name,set_));
        }
        Render();
        updateView();
    });
}

function download_csv(){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = get_data(experiment["groups"][parameters.group].worlds[parameters.world].sets);
        console.log(content);
        download(content,"world.csv");
    });
}