var URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMpMJUwb0tp1KYel2iu5vQQsvACrgfP7FdAAiFxEUlqk5tkX-HEBI5xcLyocnd5JSemCxMM82Sz1pW/pub?output=csv';

$.get(URL, function (textString) {

    console.log("data loaded");
    data = d3.csvParseRows(textString);
    console.log(data);

    data_full = []
    data.forEach(function (line, ind) {
        if (ind > 0) {
            o = {
                'name': line[0],
                'url': line[8],
                data: [
                    {axis: 'Humour', 'value': +line[1].replace(",", ".")},
                    {axis: 'Réflexion', 'value': +line[2].replace(",", ".")},
                    {axis: 'Originalité', 'value': +line[3].replace(",", ".")},
                    {axis: 'Durée moyenne', 'value': +line[4].replace(",", ".")},
                    {axis: 'Abonnés', 'value': +line[5].replace(",", ".")},
                    {axis: 'Fréquence', 'value': +line[6].replace(",", ".")},
                ]
            }
            data_full.push(o);
        }
    });
    console.log(data_full);
    //Call function to draw the Radar chart
    data_full.forEach(function(d){
        RadarChart("#small_multiple", d.data, d.name, radarChartOptions);
    });
    RadarChart("#CYN", data_slider, "Nugget Builder", customRadarChartOptions);
});