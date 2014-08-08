// console.log("global loaded");
var AlgoDraw = function (options){
	var svg;
	var cursor = {
        "x": 400,
        "y": 400,
        "width": 20,
        "height": 20,
        "size" : 20,
        "rgbfill": '#ff3311',
        "rgbstroke": '#000000'
    }
	var init = function(){
		//draw svg canvas
		var w = 100, h = 100;

		var deltaX = 0;
		var deltaY = 0;
		var dataSet1 =[];

	 	w = $(window).width();
	 	h = $(window).height();
		svg = d3.select("#svgcontainer").append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .attr('class','foreground')
	    .style("pointer-events", "all");

	    $('#input').on('keydown', function(e) {
			if (e.which == 13) {
				console.log("entered");
				parseCommand();
				e.preventDefault();
			}
		});
	    //from http://jsfiddle.net/christopheviau/YPAYz/
	    d3.helper = {};
		d3.helper.angleGeom = function module(_cx, _cy, _r, _a){
		    var x = _cx + Math.cos(_a) * _r,
		    y = _cy + Math.sin(-_a) * _r;
		    var exports = {};
		    exports.line = {x1: _cx, y1: _cy, x2: x, y2: y};
		    exports.circle = {r: _r, cx: _cx, cy: _cy};
		    exports.point = {r: 5, cx: x, cy: y};
		    // exports.nextpoint = {x: x, }
		    return exports;
		}



	};

	///drawfunctions
	var drawLogo = function(){
		var radius = 10;
		var svg = d3.select('svg');
		var angle = Math.PI/3 * 4;
		var cx = cursor.x;
		var cy = cursor.y;
		for (i = 0; i < 16; i++) {
			angle = Math.PI/3 * 2 * (i +2)
			var angleGeom = d3.helper.angleGeom(cx, cy, radius, angle);
			// var anglex = cx + Math.cos(angle) * radius;
			// var angley = cy + Math.sin(-angle) * radius;
		    svg.append("line")
			  .attr(angleGeom.line)
			  .style({
			    stroke: cursor.rgbstroke,
			    "stroke-width": "3px"
		  	  })
			// svg.append("circle")
			//   .attr(angleGeom.point)
			//   .style({
			//     stroke: "#0000" + i + i,
			//     fill: "none"
			//   });

		  	radius += cursor.size
		  	cx = angleGeom.line.x2
		  	cy = angleGeom.line.y2
		  	console.log(angle, radius, cx, cy, angleGeom)

		}


		// //our outter circle
		// svg.append("circle")
		//   .attr(angleGeom.circle)
		//   .style({
		//     stroke: "#000000",
		//     fill: "none"
		//   })


		// //our point

		// svg.append("circle")
		//   .attr(angleGeom.point)
		//   .style({
		//     stroke: "#000000",
		//     fill: "none"
		//   });


		// svg.append("line")
		//   .attr(angleGeom.line)
		//   .style({
		//     stroke: "#000000",
		//     "stroke-width": "5px"
		//   })

	}

	var drawrect = function(data){
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

	var drawcircle = function(data){
		    svg.append("circle")
	          .attr("cx", cursor.x)
	          .attr("cy", cursor.y)
	          .attr("r", cursor.size)
	          .style("fill", cursor.rgbfill);
	}


	var consoletext = function(text){
		$('#consoletext').append(text+'<br>')
	}


	var parseCommand = function(){
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
			if (curcommand == 'X') {
				// d3.selectAll(svg.childNodes).remove();  //deleting currently not working
				drawLogo();
			}
			if (curcommand == 'l') {
				// consoletext("type 'r' to add rectangle")
				drawVertline(cursor);
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
				cursor.rgbfill = '#' + command.shift();
			}
			if (curcommand == '#s') {
				cursor.rgbstroke = '#' + command.shift();
			}
			if (curcommand == '*') {
				consoletext("repeat not yet implemented");
			}
		} //end whileloop
	}

	return {
		init: init,
		cursor: cursor
	};

}

$(function(){
	var app = new AlgoDraw();
	app.init();
});

