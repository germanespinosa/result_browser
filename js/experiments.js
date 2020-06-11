window.onload = function () {
    let experiment_name = parameters.experiment;
    let group_name = parameters.group;
    let wold_name = parameters.world;
    let set_name = parameters.set;
    let title = document.getElementById("title");
    title.innerHTML = parameters.world;
    loadSettings();
    load_experiments();
};


function load_experiments(){
    loadfile(results_folder + '/experiments.json', function(experiments) {

    });
}