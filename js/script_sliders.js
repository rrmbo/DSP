// load JSON file

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
readTextFile("../assets/data/expenses.json", function(text) {
    var data = JSON.parse(text);
    console.log(data);
});

var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];

// Step
var sliderStep = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format('.2%'))
    .ticks(5)
    .step(0.005)
    .default(0.015)
    .on('onchange', val => {
        d3.select('p#value-step').text(d3.format('.2%')(val));
    });

var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-step').text(d3.format('.2%')(sliderStep.value()));

// Time
var dataTime = d3.range(0, 10).map(function(d) {
    return new Date(1995 + d, 10, 3);
});

let sliderTimeValue = 0

var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(1998, 10, 3))
    .on('onchange', val => {
        sliderTimeValue = val
        console.log(sliderTimeValue)
        d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

// Range
var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format('.2%'))
    .ticks(5)
    .default([0.015, 0.02])
    .fill('#2196f3')
    .on('onchange', val => {
        d3.select('p#value-range').text(val.map(d3.format('.2%')).join('-'));
    });

var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
    sliderRange
    .value()
    .map(d3.format('.2%'))
    .join('-')
);

// Vertical
var sliderVertical = d3
    .sliderLeft()
    .min(d3.min(data))
    .max(d3.max(data))
    .height(300)
    .tickFormat(d3.format('.2%'))
    .ticks(5)
    .default(0.015)
    .on('onchange', val => {
        d3.select('p#value-vertical').text(d3.format('.2%')(val));
    });

var gVertical = d3
    .select('div#slider-vertical')
    .append('svg')
    .attr('width', 100)
    .attr('height', 400)
    .append('g')
    .attr('transform', 'translate(60,30)');

gVertical.call(sliderVertical);

d3.select('p#value-vertical').text(d3.format('.2%')(sliderVertical.value()));