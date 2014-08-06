console.log("global loaded");

//draw svg canvas
var w = 100, h = 100;
var svg;
var deltaX = 0;
var deltaY = 0;
var dataSet1 =[];

var cursor = {
        "x": 10,
        "y": 10,
        "width": 20,
        "height": 20,
        "size" : 20,
        "rgbfill": '#ff3311',
        "rgbstroke": '#000000'
    }

$(function(){
    //init buttons
    $('#button').click(function(){
        console.log("clickedy");
        $.post( '/buttondata', 100)
    });

	// listen to socket
	svg = d3.select("#svgcontainer").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr('class','foreground')
    .style("pointer-events", "all");

    $("#svgcontainer").css("transform", "scale(1.0)")
    // drawrect(rect);

    $('#input').on('keydown', function(e) {
	if (e.which == 13) {
		console.log("entered");
		parseCommand();
		e.preventDefault();
	}

});

});


function drawrect(data){
	console.log("drawinfg rect");
	console.log(data.x);
    svg.append("rect")
        .attr({
            x: data.x ,
            y: data.y ,
            width: data.width ,
            height: data.height
            })
        .style("fill", data.rgbfill)


}

function drawcircle(data){
	    svg.append("circle")
          .attr("cx", cursor.x)
          .attr("cy", cursor.y)
          .attr("r", cursor.size)
          .style("fill", cursor.rgbfill);
}


function consoletext(text){
	$('#consoletext').append(text+'<br>')
}


function parseCommand(){
	var command = $('#input').val()
	consoletext(command);
	command = command.split(' ');
	console.log(command);
	$('#input').val('');
	while (command.length > 0) {
		curcommand = command.shift();
		if (curcommand == 'help') {
			console.log(command[0])
			if (command[0] == 'r'){
				consoletext("type 'r' to add a rectangle at the current cursor postion, size and color<br>")
				return;
			} else if (command[0] == 'c'){
				consoletext("type 'c' to add a circle at the current cursor postion, size and color<br>")
				return;
			} else if (command[0] == 'x'){
				consoletext("type 'x 10' to set the cursor at x position 10<br>type 'x +10' to add 10 to the cursor x position")
				return;
			} else if (command[0] == 'y'){
				consoletext("type 'y 10' to set the cursor at y position 10<br>type 'y +10' to add 10 to the cursor y position")
				return;
			} else if (command[0] == '#f'){
				consoletext("type '#f ff3355' to set the cursor rgb fill color at RGB #ff3355<br>")
				return;
			} else if (command[0] == '#s'){
				consoletext("type '#s ff3355' to set the cursor rgb stroke color at RGB #ff3355<br>")
			} else {
				consoletext("type 'help command' for more info. available commands are:<br> r, c, x, y, #f, #s" )
			}
		}
		if (curcommand == 'r') {
			// consoletext("type 'r' to add rectangle")
			drawrect(cursor);
		}
		if (curcommand == 'c') {
			// consoletext("type 'r' to add rectangle")
			drawcircle(cursor);
		}
		if (curcommand == 'x') {
			x = command.shift();
			if (x.substring(0, 1) == "+") {
				x = x.split("+");
				// console.log("about to parse x +xx");
				// console.log(cursor.x);
				cursor.x = cursor.x + parseInt(x[1],10);
				// console.log(cursor.x);
			} else if (x.substring(0, 1) == "-") {
				x =x.split("-");
				cursor.x = cursor.x - parseInt(x[1],10);

			} else {
			cursor.x = x;
			}
		}
		if (curcommand == 'y') {
			cursor.y = command.shift();
		}
		if (curcommand == '#f') {
			cursor.rgbfill = command.shift();
		}
		if (curcommand == '#s') {
			cursor.rgbstroke = command.shift();
		}
		if (curcommand == '*') {
			consoletext("repeat not yet implemented");
		}


	}
}