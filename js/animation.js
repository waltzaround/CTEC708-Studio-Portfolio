//http://codepen.io/waltzaround/pen/EggwKN

var renderer, scene, camera;
var pointclouds;
var intersection = null;
var spheres = [];
var spheresIndex = 0;

var threshold = 0.1;
var pointSize = 0.04;
var width = 150;
var length = 150;
var rotateY = new THREE.Matrix4().makeRotationY(0.001);

init();
animate();

function generatePointCloudGeometry(color, width, length) {

	var geometry = new THREE.BufferGeometry();
	var numPoints = width * length;

	var positions = new Float32Array(numPoints * 3);
	var colors = new Float32Array(numPoints * 3);

	var k = 0;

	for (var i = 0; i < width; i++) {

		for (var j = 0; j < length; j++) {

			var u = i / width;
			var v = j / length;
			var x = u - 0.5;
			var y = (Math.cos(u * Math.PI * 8) + Math.sin(v * Math.PI * 8)) / 20;
			var z = v - 0.5;

			positions[3 * k] = x;
			positions[3 * k + 1] = y;
			positions[3 * k + 2] = z;

			var intensity = (y + 0.1) * 5;
			colors[3 * k] = color.r * intensity;
			colors[3 * k + 1] = color.g * intensity;
			colors[3 * k + 2] = color.b * intensity;

			k++;

		}

	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
	geometry.computeBoundingBox();

	return geometry;

}

function generatePointcloud(color, width, length) {

	var geometry = generatePointCloudGeometry(color, width, length);
	var material = new THREE.PointsMaterial({
		size: pointSize,
		vertexColors: THREE.VertexColors
	});
	var pointcloud = new THREE.Points(geometry, material);

	return pointcloud;

}

function init() {

	var container = document.getElementById('container');

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 10));
	camera.applyMatrix(new THREE.Matrix4().makeRotationX(-0.5));

	var light = new THREE.AmbientLight(0xffffff); // soft white light
	scene.add(light);

	//

	var pcBuffer = generatePointcloud(new THREE.Color(1, 1, 1), width, length);
	pcBuffer.scale.set(100, 200, 10); // control scale here
	pcBuffer.position.set(0, 0, 0);
	scene.add(pcBuffer);

	pointclouds = [pcBuffer];

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//

	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = threshold;

	//

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();

}

function render() {

	camera.applyMatrix(rotateY);
	camera.updateMatrixWorld();

	renderer.render(scene, camera);

}