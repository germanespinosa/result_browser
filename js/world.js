
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
        let world = get_item_by_name(get_item_by_name(experiment.groups,group_name).worlds,world_name);
        let sets = world.sets;
        let width = (window.innerWidth - 100) / sets.length;
        let HTML = "<div class='group_table'>";
        for (let i=0;i<sets.length;i++){
            let set_name = sets[i].name;
            HTML += "<div class='group_column' id='" + set_name + "'>";
            HTML += "<div class='title' id='title_" + set_name + "'>" + set_name + "</div>";
            HTML += "<div class='stats' id='stats_" + set_name + "'></div>";
            HTML += "<div class='maps' id='maps_" + set_name + "'></div>";
            HTML += "</div>";
        }
        HTML +="</div>"
        content.innerHTML = HTML;

        var sheet = document.createElement('style')
        sheet.innerHTML = ".group_table { column-count: " + sets.length + ";}";
        document.body.appendChild(sheet);

        for (let i=0;i<sets.length;i++){
            let set_ = sets[i].name;
            let content = document.getElementById("stats_" + set_);
            LoadStats (content,sets[i], width);
        }
        for (let i=0;i<sets.length;i++){
            let set_ = sets[i].name;
            let content = document.getElementById("maps_" + set_);
            AddMap(width,width,content, experiment_name, group_name, world_name, set_, GetUrl("set.html",experiment_name,group_name,world_name,set_));
        }
        Render();
        updateView();
    });
}

function download_csv(){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = get_data(get_item_by_name(get_item_by_name(experiment.groups,parameters.group).worlds,parameters.world).sets);
        console.log(content);
        download(content,"world.csv");
    });
}