var dataset;


var formatDateIntoDay = d3.timeFormat("%d");
var formatDate = d3.timeFormat("%a %d");
var parseDate = d3.timeParse("%d/%m/%y/%H:%M");
// var parseTime = d3.timeParse("%H:%M");


var startDate = new Date("2022-03-31"),
    endDate = new Date("2022-05-03");
var getExpenseValue = function(d) {
    return Math.sqrt(d.expense) * 3
}
var getExpenseValueZoom = function(d) {
    return Math.sqrt(d.expense) * 4
}
var zIndexExpense = function(d) {
    return 999 - (Math.round(d.expense / 3))
}

var margin = {
        top: 200,
        right: 50,
        bottom: 200,
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

var y = (hour) => (halfHeight * hour / 24) + halfHeight / 2
    // var y = (hour) => halfHeight + hour * height / 24

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
        }))

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(34))
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


d3.csv("/assets/data/expenses_max.csv", prepare, function(data) {
    dataset = data;
    drawPlot(dataset);
})

function prepare(d) {
    d.id = d.id;
    d.date = parseDate(d.date);
    d.expense = d.expense;
    d.type = d.type
        // d.timestamp = Date.parse(d.date);
    return d;
}

function drawPlot(data) {
    var locations = plot.selectAll(".location")
        .data(data);
    var hotDog = plot.selectAll(".hot-dog")
        .data(data);

    // Colors

    let black = "#000000",
        red = "#ff3333",
        rose = "#ffcccc",
        violet = "#663399",
        navy = "#000066";

    var colors = {
        "bills": black,
        "items": rose,
        "food": red,
        "clothes": violet,
        "travel": navy,
    }

    //var colors = [black, red, rose, violet, navy];

    // if filtered dataset has more circles than already existing, transition new ones in

    locations.enter()
        .append("svg")
        .attr("class", "location")
        // .attr("transform", function(d) {
        //     return x(d.date);
        // }, (d) => y(d.date.getHours()))
        .attr("transform", "translate (" + Math.random() * width + "," + Math.random() * fullHeight + 200 + ") rotate(" + Math.random() * 360 + ")")
        // .style("z-index", zIndexExpense)
        .attr("width", getExpenseValue)
        .attr("height", getExpenseValue)
        // .transition()
        // .duration(400);
        .append("g")
        .attr("class", "hot-dog")
        .html('<circle r="16" fill="red"></circle>');

    // if filtered dataset has less circles than already existing, remove excess
    locations.exit()
        .remove();
}

d3.select("#opa").on("change", update);
update();

function update(h) {
    // change transparency for the data circles
    if (d3.select("#opa").property("checked")) {
        d3.selectAll(".location").style("opacity", 0.5);
    } else {
        d3.selectAll(".location").style("opacity", 1);
    }
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
        .attr("x", x(h))
        .text(formatDate(h));

    // filter data set and redraw plot
    var newData = dataset.filter(function(d) {
            return d.date < h;
        })
        // var newData = dataset.filter(function(d) {
        //     return d.timestamp < Date.parse(h)
        // })
    drawPlot(newData);
}