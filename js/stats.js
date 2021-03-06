function LoadStats(div, data, width){
    let HTML = "";
    let data_point_count = 0;
    for (let winner=0; winner< data.stats.length; winner++){
        var data_points = Object.keys(data.stats[winner]);
        data_point_count = data_points.length;
        HTML += "<div class='stat_box winner_" + winner + "' style='height: " + (data_point_count * 25) + "px;width: " + width + "px' >";
        for (let data_point_ind = 0; data_point_ind < data_points.length; data_point_ind++) {
            let data_point_name = data_points[data_point_ind];
            let data_point = data.stats[winner][data_point_name];
            HTML += "<div class='data_point'><div class='data_point_label'>" + data_point_name + ": </div>";
            if ( typeof data_point == "number" ){
                HTML += "<div class='data_point_value'>" + round(data_point) + "</div>";

            } else {
                let values = "";
                let last_value = "";
                for (let agent_ind = 0; agent_ind < data_point.length; agent_ind++) {
                    values += round(data_point[agent_ind]) + ";";
                    last_value= round(data_point[agent_ind]);
                }
                HTML += "<div class='data_point_value multivalue' agent-values='" + values + "'>" + last_value + "</div>"
            }
            HTML +="</div>"
        }
        HTML += "</div>";
    }
    div.innerHTML += HTML;
    div.style.height = "" + (data_point_count * 25) + "px";
    div.style.width = "" + width + "px";
}

function get_data(data_list){
    let titles = "";
    let lines = "";
    for (let dn=0;dn<data_list.length;dn++) {
        let data = data_list[dn];
        let name = data.name;
        lines += name;
        let data_point_count = 0;
        let data_points = Object.keys(data.stats[Winner]);
        data_point_count = data_points.length;
        for (let data_point_ind = 0; data_point_ind < data_points.length; data_point_ind++) {
            let data_point_name = data_points[data_point_ind];
            let data_point = data.stats[Winner][data_point_name];
            if (dn == 0) titles += "," + data_point_name;

            if (typeof data_point == "number") {
                lines += "," + round(data_point);
            } else {
                lines += "," + data_point[Agent];
            }
        }
        lines += "\n";
    }
    return titles + "\n" + lines;
}