/*  Set the demensions and margins of the diagram */
var margin = {top: 20, right: 300, bottom: 20, left: 120},
    width = 1000 - margin.right - margin.left,
    height = 900 - margin.top - margin.bottom,
    padding_left = 200;

/* Draw map and legend to this id on the html page */
var svg = d3.selectAll("#timeline").append('svg').attr("width", width).attr("height", height);

/* Main program */
side_panel();

var x = d3.scaleLinear()
    .domain([1975, 2020])
    .range([0, width+200])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + 450 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { hue(x.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d ; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

    slider.transition() // Gratuitous intro!
        .duration(750)
        .tween("hue", function() {
          var i = d3.interpolate(0, 70);
          return function(t) { hue(i(t)); };
        });

function hue(h) {
  handle.attr("cx", x(h));
}

/* Getting data from the json file */
d3.json("data.json", function(error, data) {
    
    if (error) throw error;
    
    /* Converting the data into ints, strings accordingly 
       Source: https://stackoverflow.com/questions/21033609/nested-json-array-and-d3js */
    data.forEach(function(d) {                              
        d.name = d.name;                          
        d["scientific name"] = d["scientific name"];
        d.status = d.status;
        d.habitat = d.habitat;
        d.population = d.population;
        d.trend = d.trend;
        d.size = +d.size;
        d.image = d.image;
        // not sure about time, see reference
    });
    
    /* Define tool tip */
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return d.name + "<br/> Scientific Name: " + d["scientific name"] + " <br/> Population: " + d.population + " <br/> Habitat: " + d.habitat;
        });
    
    /* Adding images to canvas */
    var images = svg.append("svg").selectAll("svg")
                    .data(data)
                    .enter()
                    .append("image")
                    .attr("class", "images")
                    .attr("height", function(d) {
                        // console.log((1 / d.size) * 700)
                        return (1 / d.size) * 290
                    })
                    .attr("x", function(d) {
                        return d.x
                    })
                    .attr("y", function(d) {
                        return d.y
                    })
                    .attr("xlink:href", function(d) {
                        return d.image
                    });
    
    /* Calling the tool tip for the animals */
    images.call(tip);
    images.on("mouseover", tip.show);
    images.on("mouseout", tip.hide);
    
}); // End bracket for d3.json


/* All of the function calls for the side panel */
function side_panel() {
    spacing();
    habitat();
    spacing();
    legend();
    spacing();
    trend();
}

/* Function for the habitat dropdown menu */
function habitat() {
    
    /* Pairing the value and text for the dropdown menu*/
    var habit = [{value: "Tropical Forests" , text: "Tropical Forests"}, 
                 {value: "Forests", text: "Forests"}, 
                 {value: "Oceans", text: "Oceans"}, 
                 {value: "Moist, Dry forests", text: "Moist, Dry forests"}, 
                 {value: "Temperate Forests", text: "Temperate Forests"}, 
                 {value: "Grasslands", text:"Grasslands" }, 
                 {value: "Low Rocky Ridges", text: "Low Rocky Ridges"} ];

    
    /* Selecting the #key id from the HTML file and appending the dropdown
       Taking the array from above and placing it into the dropdown menu
    */
    var hab = d3.select("#key")
                .append('select')
                .selectAll('select')
                .data(habit)
                .enter()
                .append("option")
                .attr("value", function(habit) { return habit.value; })
                .text(function(habit) { return habit.text; });
}

/* Function for the legend - critically endangered, endangered, etc */
function legend() {
    
    /* Pair lengend labal with appropriate colors */
    var color = d3.scaleOrdinal()
                    .domain(["Critically Endangered", "Endangered", "Vulnerable", "Near Threatened", "Extinct"])
                    .range(["#e80003", "#fe7504", "#ffb500", "#adc9a2", "#dfbe9f"]);
    
    /* Spacing for the rectangles and text for the legend */
    var legendRectSize = 15;
    var legendSpacing = 10;
    
    /* Selecting the #key id from the HTML file and appending the legend */        
    var leg = d3.select("#key")
            .append('svg')
            .attr("id", "legend")
            .selectAll("g")
            .data(color.domain())
            .enter()
            .append('g')
                .attr("class", "key")
                .style("margin-bottom", 2)
                .attr('transform', function(d, i) {
                     return "translate(0," + i * 25 + ")";
                });

    /* Appending the rectangle for the legend */
    leg.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)
        .style('padding-bottom', 2);

    /* Appending the text with the corresponding color form above */
    leg.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('dy', '.8em')
        .attr('line-height', '2em')
        .text(function(d) { return d; })
        .style('padding-bottom', 2);
    
}

/* Function for the animal trends - increasing or decreasing */
function trend() {
    
    /* Selecting the #key id from the HTML file and appending the trend legend */
    var tren = d3.select("#key")
            .append('svg')
            .attr("id", "trend")
            .append("g")
            .attr("class", "tren");
                
    /* Appending the word "Population" */
    tren.append('text')
        .style("font-weight", "bold")
        .text("Population")
        .attr('y', 10);
    
    tren.append('text')
        .text("\n"+"Increasing"+"\n")
        .attr('y', 25);
    
    tren.append('image')
        .attr("xlink:href","img/inc.png")
        .attr("height", 70)
        .attr("width", 70)
        .attr('x', 70);
    
    tren.append('text')
        .text("\n"+"Decreasing")
        .attr('y', 105);
    
    tren.append('image')
        .attr("xlink:href","img/dec.png")
        .attr("height", 70)
        .attr("width", 70)
        .attr('x', 70)
        .attr('y', 70);
    
}

/* Function for spacing between the different functionality on the side panel */
function spacing() {
    
    /* Selecting the #key id from the HTML file 
       Refer to index.css where the height is modified
       for the .space class
    */
    var space = d3.select("#key")
                .append('p')
                .attr("class", "space");
}
