var margin = {top: 20, right: 300, bottom: 20, left: 120},
    width = 1000 - margin.right - margin.left,
    height = 900 - margin.top - margin.bottom,
    padding_left = 200;


window.ANIMALS={}

window.RECENT_VALUE={}
/* Draw map and legend to this id on the html page */
var svg = d3.selectAll("#timeline").append('svg').attr("width", width).attr("height", height);

side_panel();
/* Main program */


var x = d3.scaleLinear()
    .domain([1975,2017])
    .range([0, width+200])
    .clamp(true);

data_load();
function data_load()
{	
	d3.json("data.json", function(error, data) {
    
    if (error) throw error;
    
    /* Converting the data into ints, strings accordingly 
       Source: https://stackoverflow.com/questions/21033609/nested-json-array-and-d3js */
    data.forEach(function(d) {                              
        d.name = d.name; 
		ANIMALS[d.name]=5;
		RECENT_VALUE[d.name]="1975";
        d["scientific name"] = d["scientific name"];
        d.status = d.status;
        d.habitat = d.habitat;
        d.population = d.population;
        d.trend = d.trend;
        d.size = +d.size;
		d.init=d.image;
		d.x=d.x;
		d.y=d.y;


		
		
    });
	
	populate(data);
	//console.log(data);
	//var img = svg.selectAll("image").append("svg:image").data(data).attr("x", function(d){console.log(d)});
	
	


    
}); 
}
   
function yearwise_data_load(year)
{	
	d3.json("data.json", function(error, data) {
    
    if (error) throw error;
    var final_data = [];
	
    /* Converting the data into ints, strings accordingly 
       Source: https://stackoverflow.com/questions/21033609/nested-json-array-and-d3js */
    data.forEach(function(d) { 
	
		d.time_year=[];
		d.time_image=[];
		
		for(var i in d.time)
		{
			d.time_image.push(d.time[i].image);
		}
		d.time_image.push(d.image);
		for(var i in d.time)
		
			d.time_year.push(d.time[i].year);
			d.time_year.push("1975");
		if(parseInt(year)<parseInt(RECENT_VALUE[d.name]))
		{
			var data2={};
			var index1=d.time_year.indexOf(RECENT_VALUE[d.name]);
			data2.image=d.time_image[index1+1];
			data2.name=d.name;
			data2.size=d.size;
			data2.x=d.x;
			data2.y=d.y;
			final_data.push(data2);
			
		}
		if(d.time_year.includes(year)==true && year=="1975")
		{
			var data2={};
			var index=d.time_year.indexOf(year);
			data2.image=d.time_image[index];
			data2.name=d.name;
			data2.size=d.size;
			data2.x=d.x;
			data2.y=d.y;
			final_data.push(data2);
			
		}
		else if(d.time_year.includes(year)==true && year!="1975")
		{
			
			var data2={};
			var index=d.time_year.indexOf(year);
			data2.name=d.name;
			data2.image=d.time_image[index];
			data2.size=d.size;
			data2.x=d.x;
			data2.y=d.y;
			RECENT_VALUE[d.name]=year;

			final_data.push(data2);
			
			if(ANIMALS[d.name]>status_map(d.time[i].status ))
			{
				ANIMALS[d.name]=status_map(d.time[i].status );
				}
				else
				{
					var ind=d.time[i].year;
				}
			}
			else
			{
			var data2={};
			var rc=RECENT_VALUE[d.name];
			if(rc=="1975")
			{
				data2.image=d.image;
			}
			var index=d.time_year.indexOf(rc);
		
			data2.name=d.name;
			data2.size=d.size;
			data2.x=d.x;
			data2.y=d.y;
			
			final_data.push(data2);
			}

    });
populate(final_data);

    
}); 
}
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + 450 + ")");

 var pct = Math.round(x.invert(x));

slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(22))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) {return d ; });

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
            .on("start drag", function() {hue(x.invert(d3.event.x)); }));

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

    slider.transition() 
        .duration(750);

function hue(h) {
  handle.attr("cx", x(h));
	//data_load();
	var val=Math.floor(h);
	
	
	yearwise_data_load(String(val));
}
function start(data)
{
	
		var img = svg.selectAll(".imag").data(data).enter().append("svg:image")
    .attr("xlink:href", function(d) {return d.image;})
    .attr("width", function(d) {return (d.size)*20;})
    .attr("height", function(d) {return (d.size)*20;})
    .attr("x",function(d) {return d.x;})
    .attr("y",function(d) {return d.y;});
	
}

function populate(data)
{
	
	
	//console.log(data);
		var images = svg.append("svg").selectAll("svg")
                    .data(data)
                    .enter()
                    .append("image")
                    .attr("class", "images")
    .attr("xlink:href", function(d) {return d.image;})
    .attr("width", function(d) {return (d.size)*30;})
    .attr("height", function(d) {
                        // console.log((1 / d.size) * 700)
                        return (1 / d.size) * 290
                    })
    .attr("x",function(d) {return d.x;})
    .attr("y",function(d) {return d.y;});
	
	
	
}

function dragged(){

			var coordinates = [0, 0];
      coordinates = d3.mouse(this);
      var x1 = coordinates[0];
      x1 = x1 > width ? width :
      	x1 < 0 ? 0 :
      	x1;
		
		var pct = Math.round(x.invert(x1));

		
}
function status_map(value)
{
	var result;
	
	if(value=="Critically Endangered")
		result=1;
	else if(value=="Endangered")
		result=2;
	else if(value=="Vulnerable")
		result=3;
	else if(value=="Near Threatened")
		result=4;
	else if(value=="Extinct in the Wild")
		result=5;
	return result;
}

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
            .append('g')
            .attr("id", "trend")
            .append("p")
                .attr("class", "tren");
                
    /* Appending the word "Population" */
    tren.append('text')
        .style("font-weight", "bold")
        .text("Population");
    
    
    
    tren.append('text')
        .text("Decreasing");
    
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
