window.onload = function () {
    let title = document.getElementById("title");
    title.innerHTML = "experiments";
    load_experiments();
};


function load_experiments(){
    loadfile(results_folder + '/experiments.json', function(experiments) {
        let content = document.getElementById("content");
        let HTML = '<div>';
        for (let i=0; i<experiments.length; i++) {
            HTML += "<div>";
            HTML += "<div><a href='experiment.html?experiment=" + experiments[i].experiment_name + "'>" + experiments[i].experiment_name + "</a></div>";
            HTML += "</div>";
        }
        HTML += "</div>";
        content.innerHTML = HTML;
    });
}