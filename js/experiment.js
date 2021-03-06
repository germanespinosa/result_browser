
window.onload = function () {
    let experiment_name = parameters.experiment;
    let title = document.getElementById("title");
    title.innerHTML = experiment_name;
    loadSettings();
    load_experiment(experiment_name);
    updateView();
};

function load_experiment(experiment_name){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = document.getElementById("content");
        let groups = experiment.groups;
        let width = (window.innerWidth - 200) / groups.length;
        let header = "<div class='group_table group_header'>"
        let HTML = "<div class='group_body'><div class='group_table'>";
        for (let i=0;i<groups.length;i++){
            let group = groups[i].name;
            header += "<div class='group_header' id='header_" + group + "'>";
            header += "<div class='title' id='title_" + group + "' ><img src='css/img/download.png' style='height: 15px;width: 15px;cursor: pointer' onclick='download_set(\"" + group + "\")'/> " + group + "</div>";
            header += "<div class='stats' id='stats_" + group + "'></div>";
            header += "</div>";
            HTML += "<div class='group_column' id='" + group + "'>";
            HTML += "<div class='maps' id='maps_" + group + "'></div>";
            HTML += "</div>";
        }
        header +="</div>";
        HTML +="</div></div>";
        content.innerHTML = header + HTML;

        var sheet = document.createElement('style')
        sheet.innerHTML = ".group_table { column-count: " + groups.length + ";}";
        document.body.appendChild(sheet);

        for (let i=0;i<groups.length;i++){
            let group = groups[i].name;
            let content = document.getElementById("stats_"+group);
            LoadStats (content, groups[i], width);
        }

        for (let i=0;i<groups.length;i++){
            let group = groups[i].name
            let content = document.getElementById("maps_" + group);
            let worlds = groups[i].worlds;
            for (let j=0;j<worlds.length;j++){
                let world = worlds[j].name;
                AddMap(width, width, content, experiment_name, group, world,"", GetUrl("world.html",experiment_name,group,world));
            }
        }
        Render();
    });
}

function download_csv(){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = get_data(experiment.groups);
        console.log(content);
        download(content,"experiment.csv");
    });
}

function download_set(group){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = get_data(get_item_by_name(experiment.groups,group).worlds);
        console.log(content);
        download(content,"group_" + group +".csv");
    });
}