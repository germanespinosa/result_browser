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


let DisplayStep;
let DisplayValue;

function load_set(experiment_name, group_name, world_name, set_name){
    loadfile(project_folder + '/stats.json', function(experiment) {
        let content = document.getElementById("content");
        let world = get_item_by_name(get_item_by_name(experiment.groups,group_name).worlds,world_name);
        let sets = world.sets;
        let HTML = "";
        HTML += "<div class='set_layout' >";
            HTML += "<div class='left_spacer'></div>";
            HTML += "<div class='left_pane' id='" + set_name + "'>";
                HTML += "<div class='title' id='title_" + set_name + "'>" + set_name + "</div>";
                HTML += "<div class='episodes' id='episodes_" + set_name + "' experiment='" + experiment_name + "' group='" + group_name + "' world='" + world_name + "' set='" + set_name + "'></div>";
            HTML += "</div>";
            HTML += "<div class='right_pane' id='replay'>";
                HTML += "<div class='current_episode' id='current_episode'></div>";
                HTML += "<div class='control_box' id='control_box'>";
                    HTML += "<div class='display display_step' id='step'></div>";
                    HTML += "<div class='btn btn_first' id='btn_first' onclick='first()'></div>";
                    HTML += "<div class='btn btn_prev' id='btn_prev' onclick='prev()'></div>";
                    HTML += "<div class='btn btn_play' id='btn_play' onclick='play_pause()'></div>";
                    HTML += "<div class='btn btn_next' id='btn_next' onclick='next()'></div>";
                    HTML += "<div class='btn btn_last' id='btn_last' onclick='last()'></div>";
                    HTML += "<div class='display display_value' id='value'></div>";
                HTML +="</div>"
                HTML += "<div class='current_expected_rewards' id='current_expected_rewards'>";
                HTML += "</div>";
            HTML +="</div>"
            HTML += "<div class='left_spacer'></div>";
        HTML +="</div>"
        content.innerHTML = HTML;
        DisplayStep = document.getElementById("step");
        DisplayValue = document.getElementById("value");
        let sheet = document.createElement('style')
        sheet.innerHTML = ".group_table { column-count: " + 4 + ";}";
        document.body.appendChild(sheet);
        updateView();
    });

}

function first(){
    CurrentEpisode.step = 0;
    CurrentEpisode.agent = agents.length-1;
    DrawEpisodeStep();
    UpdateRewardsProgression();
}

Timer = -1;
Limit = -1;

function play() {
    document.getElementById("btn_play").className = "btn btn_pause";
    if (Agent==agents.length)
        Limit= CurrentEpisode.trajectories[0].length-1;
    else
        Limit = CurrentEpisode.trajectories[Agent].length-1;

    Timer = setInterval(next, 300);
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
    UpdateRewardsProgression();
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
    UpdateRewardsProgression();
}

function prev(){
    if (CurrentEpisode.agent == 0) {
        CurrentEpisode.step -= 1;
        CurrentEpisode.agent = agents.length - 1;
    } else {
        CurrentEpisode.agent -= 1;
    }
    if (CurrentEpisode.step<0)
        CurrentEpisode.step=0;
    DrawEpisodeStep();
    UpdateRewardsProgression();
}

function SeesOthers(step, agent){
    agent += 1;
    if (agent == agents.length) agent = 0;
    let agent_locations = GetLocations(step, agent);
    let visibility = GetVisibleCells(agent_locations[agent]);
    for (let i = 0; i<agent_locations.length;i++) if (agent !=i && contains(visibility,agent_locations[i])) return true;
    return false;
}

function UpdateRewardsProgression( ){
    let margin = {top: 10, right: 20, bottom: 10, left: 30}
        , width = 400 // Use the window's width
        , height = 175; // Use the window's height

    let n = CurrentEpisode.values[0].length;
    let xScale = d3.scaleLinear()
        .domain([0, n]) // input
        .range([0, width]); // output

    let yScale = d3.scaleLinear()
        .domain([0, CurrentEpisode.max_value]) // input
        .range([height, 0]); // output

    let div = d3.select("#current_expected_rewards");
    div.node().innerHTML = "";

    let svg = div.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    let agent_count = CurrentEpisode.values.length;
    for (let agent_ind=0;agent_ind<agent_count;agent_ind++) {

        let dataset = d3.range(n).map(function (d) {
            return {"y": CurrentEpisode.values[agent_ind][d]}
        })

        let line = d3.line()
            .x(function(d, i) { return xScale(i + agent_ind / agent_count) + 5 ; }) // set the x values for the line generator
            .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        svg.append("path")
            .datum(dataset) // 10. Binds data to the line
            .attr("class", "heat_map_" + agent_ind) // Assign a class for styling
            .attr("d", line) // 11. Calls the line generator
            .style("fill", "none")
            .style("stroke", fill_colors[agent_ind])
            .style("stroke-width", "3");

        svg.selectAll()
            .data(dataset)
            .enter().append("circle") // Uses the enter().append() method
            .attr("cx", function(d, i) { return xScale(i + agent_ind / agent_count) + 5 })
            .attr("cy", function(d) { return yScale(d.y) })
            .attr("r", function(d,i) {
                let last_step = CurrentEpisode.agent < agent_ind ? CurrentEpisode.step - 1 : CurrentEpisode.step;
                if (i>last_step) return 3;
                if (i == last_step) {
                    DisplayStep.innerText = "step: " + i + "/" + CurrentEpisode.values[CurrentEpisode.agent].length;
                    DisplayValue.innerText = "value: " + round(CurrentEpisode.values[CurrentEpisode.agent][i]);
                    return 6;
                }
                return 3; })
            .style("fill", function(d,i) {
                if (SeesOthers(i,agent_ind)){
                    return "yellow";
                }
                return fill_colors[agent_ind];
            })
            .on("click", function(d, i, c) {
                CurrentEpisode.step = i;
                CurrentEpisode.agent = agent_ind;
                next();
                DisplayStep.innerText = "step: " + i + "/" + CurrentEpisode.values[agent_ind].length;
                DisplayValue.innerText = "value: " + round(CurrentEpisode.values[agent_ind][i]);
            })
            .on("mouseover", function(d , i) {
                d3.select(this)
                    .style("r",10);
                DisplayStep.innerText = "step: " + i + "/" + CurrentEpisode.values[agent_ind].length;
                DisplayValue.innerText = "value: " + round(CurrentEpisode.values[agent_ind][i]);
            })
            .on("mouseout", function(d, i) {
                let last_step = CurrentEpisode.agent < agent_ind ? CurrentEpisode.step - 1 : CurrentEpisode.step;
                if (i == last_step) {
                    d3.select(this)
                        .style("r",6);
                } else {
                    d3.select(this)
                        .style("r",3);
                }
                DisplayStep.innerText = "step: " + CurrentEpisode.step + "/" + CurrentEpisode.values[agent_ind].length;
                DisplayValue.innerText = "value: " + round(CurrentEpisode.values[agent_ind][CurrentEpisode.step]);
            })
            .style("cursor", "pointer");

    }
}