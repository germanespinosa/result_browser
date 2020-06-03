
window.onload = function () {
    let experiment_name = parameters.experiment;
    let group_name = parameters.group;
    let wold_name = parameters.world;
    let set_name = parameters.set;
    let title = document.getElementById("title");
    title.innerHTML = parameters.world;
    loadSettings();
    load_set(experiment_name,group_name,wold_name,set_name);
};

function load_set(experiment_name, group_name, world_name, set_name){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = document.getElementById("content");
        let world = experiment.groups[group_name].worlds[world_name];
        let sets = Object.keys(world.sets);
        let HTML = "";
        HTML += "<div class='set_layout' >";
            HTML += "<div class='left_spacer'></div>";
            HTML += "<div class='left_pane' id='" + set_name + "'>";
                HTML += "<div class='title' id='title_" + set_name + "'>" + set_name + "</div>";
                HTML += "<div class='episodes' id='episodes_" + set_name + "' experiment='" + experiment_name + "' group='" + group_name + "' world='" + world_name + "' set='" + set_name + "'></div>";
            HTML += "</div>";
            HTML += "<div class='right_pane' id='replay'>";
                HTML += "<div class='title' id='title_replay'>replay</div>";
                HTML += "<div class='current_episode' id='current_episode'></div>";
                HTML += "<div class='control_box' id='control_box'>";
                    HTML += "<div class='btn btn_first' id='btn_first' onclick='first()'></div>";
                    HTML += "<div class='btn btn_prev' id='btn_prev' onclick='prev()'></div>";
                    HTML += "<div class='btn btn_play' id='btn_play' onclick='play()'></div>";
                    HTML += "<div class='btn btn_next' id='btn_next' onclick='next()'></div>";
                    HTML += "<div class='btn btn_last' id='btn_last' onclick='last()'></div>";
                HTML += "</div>";
            HTML +="</div>"
            HTML += "<div class='left_spacer'></div>";
        HTML +="</div>"
        content.innerHTML = HTML;

        let sheet = document.createElement('style')
        sheet.innerHTML = ".group_table { column-count: " + 4 + ";}";
        document.body.appendChild(sheet);

        //CreateEpisodes(document.getElementById("episodes_"+set_name),150,150, experiment_name, group_name, world_name, set_name);
        updateView();
    });
}

function first(){
    CurrentEpisode.step = 0;
    DrawEpisodeStep();
}

Timer = -1;

function play(){
    if (Timer < 0) {
        document.getElementById("btn_play").className = "btn btn_pause";
        Timer = setInterval(next, 300);
    }else{
        document.getElementById("btn_play").className = "btn btn_play";
        clearInterval(Timer);
        Timer= -1;
    }
}

function last(){
    if (Agent==agents.length)
        CurrentEpisode.step = CurrentEpisode.trajectories[0].length-1;
    else
        CurrentEpisode.step = CurrentEpisode.trajectories[Agent].length-1;
    DrawEpisodeStep();
}

function next(){
    CurrentEpisode.step += 1;
    if (Agent==agents.length) {
        if (CurrentEpisode.step > CurrentEpisode.trajectories[0].length - 1) {
            CurrentEpisode.step = CurrentEpisode.trajectories[0].length - 1;
            play();
        }
    }else {
        if (CurrentEpisode.step > CurrentEpisode.trajectories[Agent].length - 1) {
            CurrentEpisode.step = CurrentEpisode.trajectories[Agent].length - 1;
            play();
        }
    }
    DrawEpisodeStep();
}

function prev(){
    CurrentEpisode.step -= 1;
    if (CurrentEpisode.step<0)
        CurrentEpisode.step=0;
    DrawEpisodeStep();
}

