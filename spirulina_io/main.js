/*  Smart Spirulina System  */



var camera, scene, renderer;
var controls;
var data;

var objects = [];
var targets = { table: [], sphere: []};


function pulsate() {
	$(".pulse").animate({ opacity: 0.2 }, 1200, 'linear')
		.animate({ opacity: 1 }, 1200, 'linear', pulsate)
        .click(function() {
        $(this).animate({ opacity: 1 }, 1200, 'linear');
        $(this).stop();
        });
};

function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;

	scene = new THREE.Scene();

	var today = 4;

	// table
	for (var i=0; i<data[today]['Plants'].length; i++) {
		console.log(data[today]['Plants'].length);

		var plantCard = document.createElement( 'div' );
		plantCard.id = ''+i;

		//define the "G" in the "RGB" to be less than 40
		if (data[today]['Plants'][i]["RGB"][1] < 75) {
			// console.log(data[today]['Plants'][i]["RGB"][0]);
			plantCard.className = 'plantCard pulse';
		}
		else {
			///////THIS IS THE COLOR OF THE CARD
			plantCard.className = 'plantCard';
		}

		plantCard.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
			

		var plantId = document.createElement( 'div' );
		plantId.className = 'symbol';
		plantId.textContent = data[today]['Plants'][i]["id"];
		plantCard.appendChild( plantId );

		var plantRgb = document.createElement( 'div' );
		plantRgb.className = 'details';
		plantRgb.innerHTML = "RGB: "+data[today]['Plants'][i]["RGB"];
		plantCard.appendChild( plantRgb );

		var object = new THREE.CSS3DObject( plantCard );
		object.position.x = Math.random() * 4000 - 2000 ;
		object.position.y = Math.random() * 4000 - 2000 ;
		object.position.z = Math.random() * 4000 - 2000 ;
		scene.add( object );

		objects.push( object );

		//

		plantCard.addEventListener( 'click', function ( event ) {
			var idx = event.srcElement.id;
			//$('#sideBar').html("here is data for "+data[idx]["id"]+" "+data[idx]["RGB"]+" "+data[idx]["Temp"]);	
			$('#sideBar').html('<div id="chart"></div>');	
				
			makeChart(idx);


		}, false );

		var object = new THREE.Object3D();
		//table view x and y position
		object.position.x = ( data[today]['Plants'][i]["Col"] * 140 ) - 500;
		object.position.y = - ( data[today]['Plants'][i]["Row"] * 180 ) + 500;

		targets.table.push( object );

	}



	var radius = 800;
	var worldGeometry = new THREE.OctahedronGeometry(radius, 2);
	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();

		object.position.x = worldGeometry.vertices[i %  worldGeometry.vertices.length ].x;
		object.position.y = worldGeometry.vertices[i %  worldGeometry.vertices.length ].y;
		object.position.z = worldGeometry.vertices[i %  worldGeometry.vertices.length ].z;
		//object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
		//object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
		//object.position.z = 800 * Math.cos( phi );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}

	//

	renderer = new THREE.CSS3DRenderer();
	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( window.innerWidth - 400, window.innerHeight );
	renderer.domElement.style.position = 'fixed';
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	//

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener( 'change', render );

	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.table, 2000 );

	}, false );

	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.sphere, 2000 );

	}, false );



	transform( targets.sphere, 2000 );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	
}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth - 400, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {

	renderer.render( scene, camera );

}


function makeChart(idxPlant) {
	colors = ["#00FF00","#00EA00", "#00CD00","#00BF00", "#009900", "#007100","#007A00", "#005800","#005F00", "#004600"],
	plant_id_label = ["Progress"];
	
	var margin = { top: 50, right: 0, bottom: 100, left: 130 },
	width = 400 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom,
	gridSize = Math.floor(width / 6),
	legendElementWidth =  Math.floor((width-50) / colors.length ),
	buckets = 9;


	day_labels = []; 
	var data2 = [];
	var day_ = 1;
	for (var i=0; i<data.length; i++) {
		console.log(i);
		console.log(data[i]['Plants'][idxPlant]['RGB']);
		data2.push({day:day_, id:1, rgb:data[i]['Plants'][idxPlant]['RGB'], value:data[i]['Plants'][idxPlant]['RGB'][1]});
		day_labels.push(data[i]['Day']);
		day_++;
		
	}

	//adding card to the sidebar	
	var htmlSideBar;
	htmlSideBar = '<div id="card">';
    htmlSideBar += '<h1>'+data[4]['Plants'][idxPlant]['id']+'</h1>';
    htmlSideBar += '<p>pH: '+data[4]['Plants'][idxPlant]['pH']+'</p>';
    htmlSideBar += '<p>RGB: '+data[4]['Plants'][idxPlant]['RGB']+' </p>';
    htmlSideBar += '<p>Temperature: '+data[4]['Plants'][idxPlant]['Temp']+"&deg"+"C"+'</p>';
    htmlSideBar += '<p>Humidity: '+data[4]['Plants'][idxPlant]['Humidity']*100+"%"+'</p>';
    htmlSideBar += '</div>';
    htmlSideBar += '<div id="icons">';
    htmlSideBar += '<div id="ph"><img src="images/ph.png" height="80" width="80"></div>';
    htmlSideBar += '<div id="rgb"><img src="images/rgb.png" height="80" width="80"></div>';
	htmlSideBar += '<div id="temp"><img src="images/temp.png" height="80" width="80"></div>';
	htmlSideBar += '<div id="hum"><img src="images/hum.png" height="80" width="80"></div>';
	htmlSideBar += '</div>';
    
	$("#chart").append(htmlSideBar);


	var colorScale = d3.scale.quantile()
	  .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
	  .range(colors);

	var svg = d3.select("#chart").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dayLabels = svg.selectAll(".dayLabel")
	  .data(plant_id_label)
	  .enter().append("text")
	    .text(function (d) { return d; })
	    .attr("x", 0)
	    .attr("y", function (d, i) { return i * gridSize; })
	    .style("text-anchor", "end")
	    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
	    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

	var timeLabels = svg.selectAll(".timeLabel")
	  .data(day_labels)
	  .enter().append("text")
	    .text(function(d) { return d; })
	    .attr("x", function(d, i) { return i * gridSize; })
	    .attr("y", 0)
	    .style("text-anchor", "middle")
	    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
	    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

	
	var heatMap = svg.selectAll(".hour")
	  .data(data2)
	  .enter().append("rect")
	  .attr("x", function(d) { return (d.day - 1) * gridSize; })
	  .attr("y", function(d) { return (d.id - 1) * gridSize; })
	  .attr("rx", 4)
	  .attr("ry", 4)
	  .attr("class", "hour bordered")
	  .attr("width", gridSize)
	  .attr("height", gridSize)
	  .style("fill", colors[0]);

	heatMap.transition().duration(1000)
	  .style("fill", function(d) { return d3.rgb( d.rgb[0], d.rgb[1], d.rgb[2]).toString(); });

	heatMap.append("title").text(function(d) { return d.value; });
	  
	var legend = svg.selectAll(".legend")
	  .data([0].concat(colorScale.quantiles()), function(d) { return d; })
	  .enter().append("g")
	  .attr("class", "legend");

	legend.append("rect")
	.attr("x", function(d, i) { return legendElementWidth * i; })
	.attr("y", height-20)
	.attr("width", legendElementWidth)
	.attr("height", gridSize / 2)
	.style("fill", function(d, i) { return colors[i]; });

	legend.append("text")
	.attr("class", "legend mono")
	.text(function(d, i) { 
		//return "≥ " + Math.round(d); 
		//return (i==0) ? "start" : "";
		if (i==0) return "Start";
		else if (i==buckets) return "Ready";
		else return "";

	})
	.attr("x", function(d, i) { return legendElementWidth * i; })
	.attr("y", height-20 + gridSize);
	
}





console.log("try to get data");
$.getJSON('data_spec.json', function(data_) {
	data = data_;
	console.log(data.length);
	init();
	animate();
	pulsate();
});
