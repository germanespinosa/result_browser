Map = function (cells, width, height, color) {
    let cols = cells[0].length;
    let rows = cells.length;
    let max=0;
    for (let c=0;c<cols;c++)for(let r=0;r<rows;r++)if(max<cells[r][c])max=cells[r][c];
    let map= {
        cells: cells,
        rows: rows,
        cols: cols,
        getIndex: function (row,col) {
            return row*cols+col;
        },
        size: rows * cols,
        range: Range(rows * cols),
        row: function (i) {
            return i % cols;
        },
        col: function (i) {
            return Math.floor(i / cols);
        },
        x: d3.scaleBand().range([0, width]).domain(Range(rows)).padding(0.01),
        y: d3.scaleBand().range([0, height]).domain(Range(cols)).padding(0.01),
        colorLinear: d3.scaleLinear().range(["white", color]).domain([0, max]),
        fillColor: function (i) {
            let value = this.cells[this.row(i)][this.col(i)];
            if (value==0) return "none";
            return this.colorLinear(value);
        }
    }
    return map
}

GetSource = function (experiment,group,world,set,winner,agent){
    if (set == null)
        return img_folder + group + "/" + world + "_" + winner + "_" + agent + ".json";
    else
        return img_folder + group + "/" + world + "/" + set + "_" + winner + "_" + agent + ".json";
}

Render = function () {
    let divMaps = d3.selectAll(".map")
        .each(function () {
            this.innerHTML = "";
            CreateHeatmap (this, Winner, this.style.width.replace("px",""), this.style.height.replace("px",""));
        });
    let divEpisodes = d3.selectAll(".episodes")
        .each(function () {
            this.innerHTML = "";
            CreateEpisodes (this, Winner,
                200,
                200,
                this.attributes.experiment.value,
                this.attributes.group.value,
                this.attributes.world.value,
                this.attributes.set.value);
        });
}

CreateHeatmap = function (DOMdiv, winner, width, height){
    let div = d3.select(DOMdiv);

    let experiment = div.attr("experiment");
    let group = div.attr("group");
    let world = div.attr("world");
    let set = div.attr("set");

    for (let agent=0;agent<agents.length;agent++) {
        let source = GetSource(experiment, group, world, set, winner, agent);

        let svg = div.append("svg")
            .style("position","absolute")
            .style("top","0px")
            .style("left","0px")
            .attr("class","heat_map_" + agent)
            .attr("width", width )
            .attr("height", height )
            .append("g");


        d3.json(source, function (data) { DrawMap(data.cells, data.occlusions, data.spawn_locations, svg, agent, width, height) });
    }
}

var CurrentEpisode;


function DrawEpisodeStep(){
    let width = 450;
    let height = 450;
    document.getElementById("current_episode").innerHTML="";
    for (let agent_ind = 0;agent_ind < agents.length;agent_ind++) {

        let cells=[]
        for(let y = CurrentEpisode.coordinates[0][1];y <= CurrentEpisode.coordinates[1][1];y++) {
            let row = [];
            for(let x = CurrentEpisode.coordinates[0][0];x <= CurrentEpisode.coordinates[1][0];x++) {
                row.push(0);
            }
            cells.push(row);
        }

        let max = 0;
        let last_x=0,last_y=0;
        for (let step=0; step<CurrentEpisode.step || ( step == CurrentEpisode.step && agent_ind <= CurrentEpisode.agent);step++){
            let position = CurrentEpisode.trajectories[agent_ind][step];
            let x = position[0] - CurrentEpisode.coordinates[0][0];
            let y = position[1] - CurrentEpisode.coordinates[0][1];
            cells[y][x] += 1;
            if (max<cells[y][x]) max = cells[y][x];
            last_x=x;
            last_y=y;
        }
        cells[last_y][last_x]= max + 3;

        let svg = d3.select("#current_episode").append("svg")
            .style("position", "absolute")
            .style("top", "0px")
            .style("left", "0px")
            .attr("class", "heat_map_" + agent_ind)
            .attr("width", width)
            .attr("height", height)
            .append("g");

        DrawMap(cells, CurrentEpisode.occlusions, CurrentEpisode.spawn_locations, svg, agent_ind, width, height);

    }
}

function SetCurrentEpisode(div, index, coordinates, episode, occlusions, spawn_locations){
    CurrentEpisode = episode;

    CurrentEpisode.max_value = 0;
    for (let i=0; i<CurrentEpisode.values.length;i++)
        for (let j=0; j<CurrentEpisode.values[i].length;j++)
            if (CurrentEpisode.values[i][j] > CurrentEpisode.max_value) CurrentEpisode.max_value=CurrentEpisode.values[i][j];
    CurrentEpisode.container = div;
    CurrentEpisode.coordinates = coordinates;
    CurrentEpisode.occlusions = occlusions;
    CurrentEpisode.spawn_locations = spawn_locations;
    CurrentEpisode.step = 0;
    CurrentEpisode.agent = agents.length - 1;
    DrawEpisodeStep();
    d3.selectAll(".episode_box").style("border","0");
    div.style.border = "2px solid #FF0000";
    location.hash = index;
    pause();
    play();
}

default_winner = 1;
function GetWinner(values){
    let max = default_winner;
    for (let i=0; i<values.length ; i++){
        if (values[i][values[i].length-1]==100) max = i;
    }
    return max;
}

CreateEpisodes = function (DOMdiv, winner, width, height, experiment, group, world, set){
    let div = d3.select(DOMdiv);

    let source = GetSource(experiment, group, world, set, 0, 0);

    let selected_episode = -1;
    if (location.hash != "") selected_episode = location.hash.replace("#","");
    d3.json(source, function (data) {
        let occlusions = data.occlusions;
        let cells = data.cells;
        d3.json("https://raw.githubusercontent.com/germanespinosa/results/master/"+ experiment + "/" + group + "/"+ world + "/" + set + "/episodes.json", function (episodes) {
            for (let episode_ind = 0; episode_ind < episodes.length; episode_ind++) {
                let episode = episodes[episode_ind];
                episode.winner = GetWinner(episode.values);
                if (winner != agents.length && winner != episode.winner) continue;
                let container = div.append("div")
                    .style("cursor","pointer")
                    .attr("id","episode_" + episode_ind)
                    .attr("class","episode_box")
                    .attr("onClick","SetCurrentEpisode(this, " + episode_ind + "," +
                                                                 JSON.stringify(data.coordinates) + "," +
                                                                 JSON.stringify(episode) + "," +
                                                                 JSON.stringify(occlusions) + "," +
                                                                 JSON.stringify(data.spawn_locations) + ")");
                if (selected_episode == episode_ind || selected_episode == -1) {
                    selected_episode = episode_ind;
                    SetCurrentEpisode( container.node(), episode_ind, data.coordinates, episode, occlusions, data.spawn_locations);
                }
                for (let agent_ind=0;agent_ind<episode.trajectories.length;agent_ind++) {
                    let trajectory =  episode.trajectories[agent_ind];

                    for(let y = 0;y < cells.length;y++) for(let x = 0;x < cells[0].length;x++) cells[y][x] = 0;
                    for (let step=0;step<trajectory.length;step++){
                        let position = trajectory[step];
                        let x = position[0] - data.coordinates[0][0];
                        let y = position[1] - data.coordinates[0][1];
                        cells[y][x] += 1;
                    }

                    let svg = container.append("svg")
                        .style("position", "absolute")
                        .style("top", "0px")
                        .style("left", "0px")
                        .attr("class", "heat_map_" + agent_ind)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g");

                    DrawMap(data.cells, occlusions, data.spawn_locations, svg, agent_ind, width, height)
                }
            }

            DOMdiv.scrollTo(0,document.getElementById("episode_" + selected_episode).offsetTop - 200);
        });
    });
}

function DrawMap(cells, occlusions, spawn_locations, svg, agent, width, height){

    let map = Map(cells, width, height,  fill_colors[agent]);

    svg.selectAll()
        .data(map.range)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return map.x(map.col(d))
        })
        .attr("y", function (d) {
            return map.y(map.row(d))
        })
        .attr("width", map.y.bandwidth())
        .attr("height", map.x.bandwidth())
        .style("fill", function (d) {
            return map.fillColor(d)
        })
        .style("stroke", "grey")
        .style("stroke-width", .5)
    ;

    svg.selectAll()
        .data(occlusions)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return map.x(d[0])
        })
        .attr("y", function (d) {
            return map.x(d[1])
        })
        .attr("width", map.y.bandwidth())
        .attr("height", map.x.bandwidth())
        .style("fill", function (d) {
            return "black"
        })
        .style("stroke", "grey")
    ;

    for (let agent_ind = 0; agent_ind < spawn_locations.length; agent_ind++) {
        svg.selectAll()
            .data(spawn_locations[agent_ind])
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return map.x(d[0]);
            })
            .attr("y", function (d) {
                return map.y(d[1]);
            })
            .attr("width", map.y.bandwidth()-2)
            .attr("height", map.x.bandwidth()-2)
            .style("fill-opacity", 0)
            .style("stroke", agent_colors[agent_ind])
            .style("stroke-width", 6)
        ;
    }
}

function AddMap(width, height, container, experiment, group, world, set_,link){
    let HTML = "";
    if (typeof link == "undefined") link = "";
    if (typeof set_ == "undefined") set_ = "";
    if (typeof winner == "undefined") winner = "";
    if (typeof agent == "undefined") agent = "";

    let onclick = "";
    if (link != ""){
        container.style.cursor = "pointer"
        onclick = "onclick=\"NavigateTo('" + link + "')\" ";
    }

    let set_s = "";
    if (set_ != "") {
        set_s = "set='" + set_ + "' ";
    }

    if (winner=="") winner = agents.length;
    if (agent=="") agent = 0;

    HTML+="<div class='map_box' " + onclick + " style='height: " + height + "px;width: " + width + "px'>";
    HTML+="<div class='map' experiment='" + experiment + "' group='" + group + "' world='" + world + "' " + set_s + "' style='height: " + height + "px;width: " + width + "px'>";
    HTML+="</div>";
    HTML+="</div>";
    container.innerHTML += HTML;
}