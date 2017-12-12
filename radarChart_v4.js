/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id_sm, data, name, url, options) {
    var cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 3,				//How many levels or inner circles should there be drawn
        maxValue: 1, 			//What is the value that the biggest circle will represent
        labelFactor: 1.01, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.05, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        showAxisText: false,    //If true show the axis label
        enableDrag: false,     // If true enable draggable sliders
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
            }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) {
        return d3.max(i.map(function (o) {
            return o.value;
        }))
    }));

    var allAxis = (data[0].map(function (i, j) {
            return i.axis
        })),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, 1]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    var id = "#radar_" + sm_ids;

    var title;
    if (url) {
        title = "<a class='sm_title' target='_blank' href=\"" + url + "\">" + name + "</a>";
    } else {
        title = name;
    }

    $(id_sm).append('<div class="radar_chat col-lg-2 col-md-3 col-sm-4 grid-item" id="radar_' + sm_ids + '" data-value="' + name + '" data-dist="0"><p class="small_multiple">' + title + '</p></div>');
    sm_ids = sm_ids + 1;

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);
    //Append a g element
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d, i) {
            return radius / cfg.levels * d;
        })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("stroke-width", "0.3")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    if (cfg.showAxisText) {

        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 2)
            .attr("y", function (d) {
                return -d * radius / cfg.levels;
            })
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(function (d, i) {
                return Format(1 * d / cfg.levels);
            }); // Replace 1 by maxValue to get back to defaults
    }
    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) {
            return rScale(1) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y2", function (d, i) {
            return rScale(1) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .attr("class", "line ")
        .style("stroke", "white")
        .style("stroke-width", "2px");


    //Append the labels at each axis
    if (cfg.showLabel) {
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "14px")
            .attr("text-anchor", function (d, i) {
                if (i == 0 || i == 3) {
                    return "middle";
                } else if (i == 1 || i == 2) {
                    return "start"
                } else {
                    return "end"
                }
            })
            .attr("dy", "0.35em")
            .attr("x", function (d, i) {
                return rScale(1.10 * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("y", function (d, i) {
                return rScale(1.10 * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .text(function (d) {
                return d
            })
            .call(wrap, cfg.wrapWidth);
    }
    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////


    //The radial line function
    var radarLine = d3.lineRadial()
        .radius(function (d) {
            return rScale(d.value);
        })
        .angle(function (d, i) {
            return i * angleSlice;
        })
        .curve(d3.curveLinear);

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // Draw initial shape
    update_path(blobWrapper);


    var drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", move)
        .on("end", dragend);

    function dragstarted() {
        d3.select(this).raise().classed("active", true);
    }

    function dragend() {
        d3.select(".updatevalue.skill")
            .style("display", "block")
            .style("text-align", "center")
            .style("margin-top", "13px")
            .style("font-size", "14px")
            .transition().duration(500)
            .text("Drag a Point to Edit");
        d3.select(".updatevalue.value").style("visibility", "hidden");
    }


    function move(dobj, i) {
        this.parentNode.appendChild(this);
        var dragTarget = d3.select(this);
        var oldData = dragTarget.data()[0];
        var oldX = parseFloat(dragTarget.attr("cx"));
        var oldY = parseFloat(dragTarget.attr("cy"));

        //Bug for vector @ 270deg -Infinity/Infinity slope
        oldX = (Math.abs(oldX) < 0.0000001) ? 0 : oldX;
        oldY = (Math.abs(oldY) < 0.0000001) ? 0 : oldY;

        var newY = 0, newX = 0, newValue = 0;
        var maxX = cfg.w / 2;
        var maxY = cfg.h / 2;

        if (oldX === 0) {

            newY = oldY + d3.event.dy;

            if (Math.abs(newY) > Math.abs(maxY)) {
                newY = maxY;
            }
            //newValue = ((newY / oldY) * oldData.value).toFixed(2);
            newValue = Math.abs(newY / radius).toFixed(2);
        }
        else {
            var slope = oldY / oldX;

            newX = d3.event.dx + oldX;

            if (Math.abs(newX) > Math.abs(maxX)) {
                newX = maxX;
            }
            newY = newX * slope;

            var ratio = newX / oldX;
            //newValue = (ratio * oldData.value).toFixed(2);
            newValue = Math.sqrt(newX * newX + newY * newY) / radius;
        }

        //newX = d3.event.dx + parseFloat(dragTarget.attr("cx"));
        //newY = d3.event.dy + parseFloat(dragTarget.attr("cy"));

        console.log(oldX, oldY, oldData.value, newX, newY, newValue);
        //Bound the drag behavior to the max and min of the axis, not by pixels but by value calc (easier)
        if (newValue >= 0 && newValue <= 1) {

            dragTarget
                .attr("cx", function () {
                    return newX;
                })
                .attr("cy", function () {
                    return newY;
                });

            //Updating the data set with the new value
            (dragTarget.data()[0]).value = newValue;
            //center display for value
            d3.select(".updatevalue.skill").text((dragTarget.data()[0]).axis)
                .style("display", "block")
                .style("font-size", "12px")
                .style("text-align", "center")
                .style("margin", "20px 0 5px 0");


            d3.select(".updatevalue.value").text(newValue)
                .style("display", "block")
                .style("text-align", "center")
                .style("visibility", "visible");


            data_slider[0].forEach(function (d, index) {
                if (d.axis == oldData.axis) {
                    data_slider[0][index].value = newValue;
                    console.log("oui", data_slider[0][index].value)
                }
            });
            data[0].forEach(function (d, index) {
                if (d.axis == oldData.axis) {
                    data_slider[0][index].value = newValue;
                    console.log("oui2", data_slider[0][index].value)
                }
            });
            update_path(blobWrapper);
            update();
            whowins();
            console.log("1", data_slider);
            //reCalculatePoints();
            //drawPoly();'
            //updatePoly();


        }

        //Release the drag listener on the node if you hit the min/max values
        //https://github.com/mbostock/d3/wiki/Drag-Behavior
        else {
            if (newValue <= 0) {
                newValue = 0;
            }
            else if (newValue >= 1.0) {
                newValue = 1.0;
            }
            dragTarget.on("drag", null);
        }
    }

    //Append the circles
    var circles = blobWrapper.selectAll(".radarCircle")
        .data(function (d, i) {
            return d;
        })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", function (d, i, j) {
            return cfg.color(j);
        })
        .style("fill-opacity", 0.8);

    if (cfg.enableDrag) {
        circles.call(drag);
    }

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    circles.on("mouseover", function () {
        var sel = d3.select(this);
        sel.moveToFront();
    });


    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    /*
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function (d, i) {
            return d;
        })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", function (d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function (d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (d, i) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function () {
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });*/

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    // Update the shape the the radar (needed
    function update_path(blobWrapper) {
        g.selectAll(".radarArea").remove();
        g.selectAll(".radarStroke").remove();

        //Create a wrapper for the blobs

        //Append the backgrounds
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("id", "radarArea" + sm_ids)
            .attr("d", function (d, i) {
                return radarLine(d);
            })
            .style("fill", function (d, i) {
                return cfg.color(i);
            })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                //d3.selectAll(".radarArea")
                //    .transition().duration(200)
                //    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7)
                    .style("cursor", "pointer");
            })
            .on('mouseout', function () {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            })
            .on('click', function () {
                console.log("oui");
                console.log(name);
                console.log(data);
                data_slider[0][0]["value"] = data[0][0]["value"];
                data_slider[0][1]["value"] = data[0][1]["value"];
                data_slider[0][2]["value"] = data[0][2]["value"];
                data_slider[0][3]["value"] = data[0][3]["value"];
                data_slider[0][4]["value"] = data[0][4]["value"];
                data_slider[0][5]["value"] = data[0][5]["value"];
                console.log(data_slider);
                whowins();
                update();
                $('#CYN').html('');
                RadarChart("#CYN", data_slider, "", null, customRadarChartOptions);
                /*data_slider = [
                    [
                        {axis: "Humour", value: 0.5},
                        {axis: "Durée", value: 0.5},
                        {axis: "Abonnés", value: 0.5},
                        {axis: "Fréquence", value: 0.5},
                        {axis: "Réflexion", value: 0.5},
                        {axis: "Originalité", value: 0.5}
                    ]
                ];*/

            });

        //Create the outlines
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) {
                return radarLine(d);
            })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function (d, i) {
                return cfg.color(i);
            })
            .style("fill", "none")
            .style("filter", "url(#glow)");

    }

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap

}//RadarChart