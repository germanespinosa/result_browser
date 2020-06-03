
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
                    HTML += "<div class='btn btn_play' id='btn_play' onclick='play_pause()'></div>";
                    HTML += "<div class='btn btn_next' id='btn_next' onclick='next()'></div>";
                    HTML += "<div class='btn btn_last' id='btn_last' onclick='last()'></div>";
                HTML += "</div>";
            HTML += "<div class='current_expected_reward' id='current_expected_reward'>";

            HTML +="</div>"
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
    CurrentEpisode.agent = agents.length-1;
    DrawEpisodeStep();
}

Timer = -1;
Limit = -1;

function play() {
    document.getElementById("btn_play").className = "btn btn_pause";
    if (Agent==agents.length)
        Limit= CurrentEpisode.trajectories[0].length-1;
    else
        Limit = CurrentEpisode.trajectories[Agent].length-1;

    Timer = setInterval(next, 700);
}

function pause() {
    if (Timer==-1) return;
    document.getElementById("btn_play").className = "btn btn_play";
    clearInterval(Timer);
    Timer= -1;
}

function play_pause(){
    if (Timer < 0) {
        play();
    }else{
        pause();
    }
}

function last(){
    CurrentEpisode.step = Limit;
    DrawEpisodeStep();
}

function next(){
    if (Agent==agents.length){
        CurrentEpisode.agent += 1;
        if (CurrentEpisode.agent == agents.length){
            CurrentEpisode.agent = 0;
            CurrentEpisode.step += 1;
        }
        if (CurrentEpisode.step > Limit) {
            CurrentEpisode.step = Limit;
            CurrentEpisode.agent = agents.length-1;
            pause();
        }
    } else {
        CurrentEpisode.step += 1;
        if (CurrentEpisode.step > Limit) {
            CurrentEpisode.step = Limit;
            pause();
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

