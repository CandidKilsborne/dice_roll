var scene = new THREE.Scene();

var degreesToRadians = function(degrees) {
	return degrees * (Math.PI / 180);
}

var dicePositions = {
	1: {
		x: 0,
		y: degreesToRadians(270),
		z: 0
	},
	2: {
		x: 0,
		y: degreesToRadians(90),
		z: 0
	},
	3: {
		x: degreesToRadians(90),
		y: 0,
		z: 0
	},
	4: {
		x: degreesToRadians(270),
		y: 0,
		z: 0
	},
	5: {
		x: 0,
		y: 0,
		z: 0
	},
	6: {
		x: degreesToRadians(180),
		y: 0,
		z: 0
	}
}
	
var createCamera = function() {
	var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight,1 , 1000);
	camera.position.z = 100;
	
	return camera;
}

var createRenderer = function() {
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.querySelector('#container').appendChild(renderer.domElement);
	
	return renderer;
}

var createLight = function() {
	light = new THREE.PointLight(0xffffff, 1);
	light.position.set(0, 0, 50);
	
	return light;
}

var createCube = function() {
	var textureLoader = new THREE.TextureLoader(),
		texture1 = textureLoader.load('textures/1.jpg'),
		texture2 = textureLoader.load('textures/2.jpg'),
		texture3 = textureLoader.load('textures/3.jpg'),
		texture4 = textureLoader.load('textures/4.jpg'),
		texture5 = textureLoader.load('textures/5.jpg'),
		texture6 = textureLoader.load('textures/6.jpg');
		
	var materials = [
		new THREE.MeshLambertMaterial({map: texture1}),
		new THREE.MeshLambertMaterial({map: texture2}),
		new THREE.MeshLambertMaterial({map: texture3}),
		new THREE.MeshLambertMaterial({map: texture4}),
		new THREE.MeshLambertMaterial({map: texture5}),
		new THREE.MeshLambertMaterial({map: texture6})
	];
	
	var geometry = new THREE.BoxGeometry(20, 20, 20),
		material = new THREE.MultiMaterial(materials),
		mesh = new THREE.Mesh(geometry, material);
		
	return mesh;
}

var generateResult = function() {
	return Math.floor((Math.random() * 6) + 1);
}

var draw = function(scene, camera, cube) {
	window.requestAnimationFrame(function() {
		TWEEN.update();
		renderer.render(scene, camera);
		draw(scene, camera, cube);
	});
}

var camera = createCamera(),
	renderer = createRenderer(),
	light = createLight(),
	cube = createCube();
	
scene.add(light);
scene.add(camera);
scene.add(cube);

var rollDice = function() {
	var result = generateResult(),
		tweens = [];
		
	var myTween = new TWEEN.Tween(cube.rotation).to({
		x: dicePositions[result].x,
		y: dicePositions[result].y,
		z: dicePositions[result].z
	}, 100);
	
	for(var i = 0; i < 10; i++) {
		tweens.push(myTween = new TWEEN.Tween(cube.rotation).to({
			x: generateResult(),
			y: generateResult(),
			z: generateResult()
		}, 100));
		if(i > 0) {
			tweens[i -1].chain(tweens[i]);
		}
	}
	tweens[9].chain(myTween);
	tweens[0].start();
}

document.addEventListener('click', rollDice);

draw(scene, camera, cube);
