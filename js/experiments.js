window.onload = function () {
    loadfile('https://raw.githubusercontent.com/germanespinosa/results/master/index.json', function(data) {
        var tag = document.getElementById("content")
        var arrayLength = data.length;
        for (var i = 0; i < arrayLength; i++) {
            tag.innerHTML += "<h2><a href='experiment.html?experiment=" + data[i] + "'>" + data[i] + "</a></h2>";
        }
    });
};