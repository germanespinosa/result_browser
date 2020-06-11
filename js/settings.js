if (typeof parameters.Winner == "undefined" ) {
    Winner = agents.length;

} else {
    Winner = parameters.Winner;
}
if (typeof parameters.Agent == "undefined" ) {
    Agent = agents.length;
} else {
    Agent = parameters.Agent;
}

function updateWinner(){
    Winner = document.getElementById("winner_select").value;
    let sheet = document.createElement('style')
    let HTML = ""
    for (let r=0;r<=agents.length;r++){
        if (r ==  Winner) {
            HTML += ".winner_" + r + " {  visibility: visible;}";
        }else{
            HTML += ".winner_" + r + " {  visibility: hidden;}";
        }
    }
    sheet.innerHTML = HTML;
    document.body.appendChild(sheet);
    Render();
}

function updateAgent(){
    Agent = document.getElementById("agent_select").value;
    let divMaps = d3.selectAll(".multivalue")
        .each(function () {
            this.innerHTML = this.attributes["agent-values"].value.split(";")[Agent];
        });
    {
        let sheet = document.createElement('style')
        let HTML = ""
        if (agent_select.value == agents.length) {
            //HTML += ".heat_map_0 {  opacity: 1;}";
            for (let r=0;r<=agents.length;r++){
                HTML += ".heat_map_"+r+" {  opacity: " + (1/agents.length) + ";}";
            }
        } else {
            for (let r=0;r<=agents.length;r++){
                if (r == agent_select.value) {
                    HTML += ".heat_map_" + r + " {  opacity: 1;}";
                }else{
                    HTML += ".heat_map_" + r + " {  opacity: 0;}";
                }
            }
        }
        sheet.innerHTML = HTML;
        document.body.appendChild(sheet);
    }
}

function updateView(){
    updateWinner();
    updateAgent();
}

function loadSettings() {
    let settings = document.getElementById("settings");
    let HTML = ""
    //results
    HTML += "<div class='setting_box'><label for='winner_select'>Result: </label><select id='winner_select'>"
    for (let r=0;r<agents.length;r++){
        HTML += "<option value='" + r + "'" + ( r==Winner?" selected='selected'" :"") + ">"+ results[r] + "</option>"
    }
    HTML += "<option value='" + agents.length + "'" + ( agents.length==Winner?" selected='selected'" :"") + ">all</option>"
    HTML += "</select></div>"
    //agents
    HTML += "<div class='setting_box'><label for='agent_select'>Agent: </label><select id='agent_select'>"
    for (let r=0;r<agents.length;r++){
        HTML += "<option value='" + r + "'" + ( r==Agent?" selected='selected'" :"") + ">"+ agents[r] + "</option>"
    }
    HTML += "<option value='" + agents.length + "'" + ( agents.length==Agent?" selected='selected'" :"") + ">both</option>"
    HTML += "</select></div>"
    HTML += "<div class='download' onclick='download_csv()'><div>"
    settings.innerHTML = HTML;
    Winner = agents.length; //al
    Agent = agents.length; //all
    let winner_select = document.getElementById("winner_select");
    winner_select.onchange = updateWinner;
    let agent_select = document.getElementById("agent_select");
    agent_select.onchange = updateAgent;
}
