CreateHeatmap = function (DOMdiv, winner, width, height){
    let fill_colors = ["red", "blue"];
    let agent_colors = ["orange", "green"];


    let div = d3.select(DOMdiv);

    let experiment = div.attr("experiment");
    let group = div.attr("group");
    let world = div.attr("world");
    let set = div.attr("set");

    let source = "https://raw.githubusercontent.com/germanespinosa/results/master/" + experiment + "/" + group + "/" + world + "/" + set + "/episodes.json";

    d3.json(source, function (episodes) {

        for (let episode=0;episode<episodes.length;episode++) {
            let svg = div.append("svg")
                .attr("class","episode")
                .attr("width", width )
                .attr("height", height )
                .append("g");

        let map = Map(data.cells, width, height, fill_colors[agent]);

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
        ;

        svg.selectAll()
            .data(data.occlusions)
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

        for (let agent_ind = 0; agent_ind < data.spawn_locations.length; agent_ind++) {
            svg.selectAll()
                .data(data.spawn_locations[agent_ind])
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
                .style("fill-opacity", 0)
                .style("stroke", agent_colors[agent_ind])
                .style("stroke-width", 4);
            }
        }
    })
}
