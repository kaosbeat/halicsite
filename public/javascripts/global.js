// console.log("global loaded");
var AlgoDraw = function (options){
	var svg;
	var svgtimeline;
	var cursor = {
        "x": 0.5,
        "y": 0.5,
        "width": 20,
        "height": 20,
        "size" : 20,
        "rgbfill": '#ff3311',
        "rgbstroke": '#000000'
    }
	var init = function(){
		// var io;
			//realtime stuff
		io = io.connect()
		addHandlers();
		addTooltip();
		//draw svg canvas
		var w = 100, h = 100;

		var deltaX = 0;
		var deltaY = 0;
		var dataSet1 =[];

	 	w = $(window).width();
	 	h = $(window).height() / 2;
		svg = d3.select("#svgcontainer").append("svg")
	    .attr("width", w)
	    .attr("height", h)
	    .attr('class','flyer')
	    .style("pointer-events", "all");

	    svgtimeline = d3.select("#timeline").append("svg")
	    	.attr("width", 500)
	    	.attr("height", 100);


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
		    var x = Math.round((_cx + Math.cos(_a) * _r)*100)/100;
		    var y = Math.round((_cy + Math.sin(-_a) * _r)*100)/100;
		    var exports = {};
		    exports.line = {x1: _cx, y1: _cy, x2: x, y2: y};
		    exports.circle = {r: _r, cx: _cx, cy: _cy};
		    exports.point = {r: 5, cx: x, cy: y};
		    // exports.nextpoint = {x: x, }
		    return exports;
		}
		getLocalPastTweets();
		var scale = h/100
		// $(".flyer").css("-webkit-transform", "scale("+ scale +")");


	};

	var addTooltip = function () {
		var tooltip = d3.select("#svgcontainer")
		    .append("div")
		    .style("position", "absolute")
		    .style("z-index", "10")
		    .style("visibility", "hidden")
		    .style("class", "tooltiptest")
		    .text("a simple tooltip");
		tooltip
			.on("mouseover", function(){return tooltip.style("visibility", "visible");})
			.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

	}


	var addTweetToTimeline = function(tweets){
		var deltaX = 0
		svgtimeline.selectAll("circle")
	        .data(tweets)
	        .enter()
	        .append("circle")
	        .attr({
	            cx: function(d,i){
	            	// console.log("d =")
	            	// console.log(d);
	                deltaX = deltaX + 20
	                return deltaX;
	            },
	            // cy: function(d){return deltaY + d.data[2];},
	            cy: 50,
	            r: 10,
	        })
	        .style("stroke", '#000000')
	        .style("fill", function(d){return d.user.profile_background_color})
	        .attr("fill-opacity", 1)
	        .attr("stroke-opacity", 0)
	        // .on("mouseover", this.cy+10)

	        .on("mouseover", function(d){
	        					d3.select(this)
							      .transition()
							      .duration(250)
							      // .attr("cy", d3.select(this).attr("cy") +10);
							      .attr("cy", 60 )
						      })
			// .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
			.on("mouseout", function(d){
	        					d3.select(this)
							      .transition()
							      .duration(250)
							      .attr("cy", 50)
							    // console.log(d3.select(this))
						      })
			.on("click", function(d){
				// console.log(d.text);
				renderTweet(d);
			})
	    // .transition()
	    //     .duration(params.duration*5)
	    //     .style("stroke", '#000000')
	    //     .attr("fill-opacity", 0)
	    //     .attr("stroke-opacity", 1);
	        // .remove();


	}

	var getPastTweets = function(){
		// get all tweets from database
		$.getJSON( '/db/backlog', function( data ) {
			addTweetToTimeline(data);
			// data.forEach(function (tweet){
			// 	console.log(tweet);
			// });
		});

	};

	var getLocalPastTweets = function(){
		//get all tweets from database
		$.getJSON( '/backlog.json', function( data ) {
			addTweetToTimeline(data);

		});

	};


	var clearCanvas = function() {

	}

	var renderTweet = function(tweet){
		// clearCanvas();
		location.hash = tweet.id;
		parseCommand(tweet.text);
		// console.log(tweet.id);
	}

	var addHandlers = function(){
		io.on('command', function(data) {
    		console.log(data);
    		parseCommand(data.message)
		});
		$('#getCommand').click(function(){
			io.emit('command:get', {a:1});
		});
	}

	///drawfunctions
	var drawLogo = function(){
		var radius = 10;
		var svg = d3.select('svg');
		var angle = Math.PI/3 * 4;
		var cx = cursor.x;
		var cy = cursor.y;
		for (i = 0; i < 16; i++) {
			angle = Math.PI/3 * 2 * (i +2)
			// console.log(cursor);
			var angleGeom = d3.helper.angleGeom(cx, cy, radius, angle);
			// console.log(angleGeom);
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
		  	// console.log(angle, radius, cx, cy, angleGeom)

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


	var i = 0;
	var particle = function() {
		  svg.insert("circle", "rect")
		      .attr("cx", cursor.x)
		      .attr("cy", cursor.y)
		      .attr("r", 1e-6)
		      .style("fill", "none")
		      .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
		      .style("stroke-opacity", 1)
		    .transition()
		      .duration(500)
		      .ease(Math.sqrt)
		      .attr("r", cursor.size)
		      .style("stroke-opacity", 1e-6)
		      .remove();

		  d3.event.preventDefault();
		}
	var vGradient = function (endColor) {

	}

	var parseCommand = function(command){
		if (!command) {
			var command = $('#input').val()
			io.emit('command:get', command);
		};
		consoletext(command);
		command = command.split(' ');
		// console.log(command);
		$('#input').val('');
		while (command.length > 0) {
			d3.timer(getNextCommand(command), 500);
		} //end whileloop
	}

	var getNextCommand =  function(command){

			curcommand = command.shift();
			console.log("command length = " + curcommand.length);
			console.log(curcommand)
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
					console.log(cursor.x);
				} else if (x.substring(0, 1) == "-") {
					x =x.split("-");
					cursor.x = cursor.x - parseInt(x[1],10);

				} else {
				cursor.x = parseInt(x, 10);
				}
			}
			if (curcommand == 'y') {
				// cursor.y = command.shift();
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

			if (curcommand == 'p') {
				consoletext("particles");
				particle();

			}

			if (curcommand == 'vg') {
				consoletext("vertical gradient");
				vGradient(command.shift());

			}
			else {
				// console.log("gdsgd")
				drawLogo();
				command = [];
				console.log("about to return true 1")
				return true;
			}
		console.log("about to return true 2")
		return true;
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

