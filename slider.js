
// SLIDER FUNCTIONS //

// Draw the Sliders previously used when you couldn't slide directly in the Builder
function drawSlider(element) {
    var svg = d3.select(element),
        margin = {right: 10, left: 10},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height");
    var selector = element;
    var key = $(selector).attr("data-slider");

    data_slider[0].forEach(function (d, index) {
        if (d.axis == key) {
            sliderValue = data_slider[0][index].value;
        }
    });

    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {
                sliderData(x.invert(d3.event.x));
            }));

//        slider.insert("g", ".track-overlay")
//            .attr("class", "ticks")
//            .attr("transform", "translate(0," + 30 + ")")
//            .selectAll("text")
//            .data(x.ticks(10))
//            .enter().append("text")
//            .attr("x", x)
//            .attr("text-anchor", "middle")
//            .text(function (d) {
//                return d;
//            });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("cx", x(sliderValue))
        .attr("r", 10);

    // Get the data from the slider and insert it into the data_slider array
    function sliderData(h) {
        handle.attr("cx", x(h));
        sliderValue = Math.round(x.invert(d3.event.x) * 100) / 100; // Calculate the value and transform it into "0,xx"
        $('#sliderData1').html(sliderValue);

        data_slider[0].forEach(function (d, index) {
            if (d.axis == key) {
                data_slider[0][index].value = sliderValue;
            }
        });
        $("#CYN").html(""); // Kill the builder
        RadarChart("#CYN", data_slider, "", "", customRadarChartOptions); // Redraw
        whowins(); // Calculate distances
        update(); // Update isotope and reorder small multiples
    }
}

$(".slider_svg").each(function (e) {
    drawSlider("#" + $(this).attr('id')); // Draw each slider
});