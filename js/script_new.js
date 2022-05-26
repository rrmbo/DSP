var dataset;

var formatDateIntoDay = d3.timeFormat("%d");
var formatDate = d3.timeFormat("%a %d");
var parseDate = d3.timeParse("%d/%m/%y");

var startDate = new Date("2022-04-01"),
    endDate = new Date("2022-04-30");

var margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 50
    },
    width = window.innerWidth - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    fullHeight = window.innerHeight - height,
    halfWidth = window.innerWidth / 2,
    halfHeight = window.innerHeight / 2;

////////// slider //////////

var svgSlider = d3.select("#slider")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 200);

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

var slider = svgSlider.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            update(x.invert(d3.event.x));
        }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
        return formatDateIntoDay(d);
    });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

////////// plot //////////

var svgPlot = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height);

var plot = svgPlot.append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("/assets/data/expenses_min.csv", prepare, function(data) {
    dataset = data;
    drawPlot(dataset);
})

function prepare(d) {
    d.id = d.id;
    d.date = parseDate(d.date);
    d.expense = d.expense;

    // console.log(d.expense)

    return d;
}

function drawPlot(data) {
    var locations = plot.selectAll(".location")
        .data(data);

    var plotMarginX = 200,
        plotMarginy = 200,
        maxPlotHeight = fullHeight - plotMarginy * 5 / 4,
        maxPlotWidth = width - 2 * plotMarginX;

    // Colors

    let black = "#000000",
        red = "#ff3333",
        rose = "#ffcccc",
        violet = "#663399",
        navy = "#000066";

    var colors = [black, red, rose, violet, navy];

    // if filtered dataset has more circles than already existing, transition new ones in

    // console.log(data)

    locations.enter()
        .append("circle")
        .attr("class", "location")
        .attr("cx", (Math.random() * maxPlotWidth) + plotMarginX)
        // .attr("cx", function(d) {
        //     return x(d.date);
        // })
        .attr("cy", (Math.random() * maxPlotHeight) + plotMarginy)
        .style("fill", colors[Math.floor(Math.random() * colors.length)])
        // .style("opacity", 0.5)
        // .attr("r", Math.sqrt(Math.random()))
        .attr("r", function(d) {

            console.log(d.expense)

            return d.expense;
        })
        .transition()
        .duration(400)
        .attr("r", function(d) {
            return d.expense;
        })
        .transition()
        // .attr("r", data.expense);

    // if filtered dataset has less circles than already existing, remove excess
    locations.exit()
        .remove();
}

function update(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
        .attr("x", x(h))
        .text(formatDate(h));

    // filter data set and redraw plot
    var newData = dataset.filter(function(d) {
        return d.date < h;


    })
    drawPlot(newData);
}