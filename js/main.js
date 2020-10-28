import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/DragControls.js";
import { TransformControls } from "https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/controls/TransformControls.js";
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/OBJLoader.js';

let scene, camera, renderer, 
    cubeMesh, coneMesh, 
    planeMesh, 
    seaMesh, 
    groundMesh, 
    groupContainer,
    shipMesh, containerMesh,
    orbitControls,dragControls, transformControls,
    container,
    directionalLight;

let objects = [];
let a = [];

async function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    // Create renderer
    renderer = new THREE.WebGLRenderer(
        // {antialias : true}
        );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Render to canvas element
    container = document.getElementById('content');
    container.appendChild(renderer.domElement);

    // Create light
    createLight(scene);
    
    // Create Mesh
    // createPlaneMesh(scene);
    creatSeaMesh(scene);
    creatGroundMesh(scene);
    createCubeMesh(scene);
    await createShipMesh(scene);

    groupContainer = new THREE.Group();
    for(let i = 0; i < 40; i++) {
        let containerObj = await createContainMesh();
        if(i < 10) {
            containerObj.position.x = -120 ;
            containerObj.position.y = 5;
            containerObj.position.z = -10 + i*12 ;
        } else if(i >= 10 && i < 20){
            containerObj.position.x = -120 ;
            containerObj.position.y = 17;
            containerObj.position.z = -130 + i*12 ;
        } else if(i >= 20 && i < 30) {
            containerObj.position.x = -70 ;
            containerObj.position.y = 5;
            containerObj.position.z = -250 + i*12 ;
        } else if(i >= 30 && i < 40) {
            containerObj.position.x = -20 ;
            containerObj.position.y = 5;
            containerObj.position.z = -370 + i*12 ;
        }
        groupContainer.add(containerObj);
        a.push(containerObj);
    }

    scene.add(groupContainer);

    // End create Mesh

    // Add controls
    // Orbit control
    orbitControls = new OrbitControls( camera, renderer.domElement );

    // Drag control
    // objects.push(shipMesh);
    objects.push(groupContainer);
    dragControls = new DragControls( [ ...objects ], camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function () { 
        orbitControls.enabled = false;
    });
    dragControls.addEventListener( 'dragend', function () {
         orbitControls.enabled = true;
    });

    // Transform control
    transformControls = new TransformControls( camera, renderer.domElement );
    transformControls.attach(cubeMesh);
    transformControls.setMode('rotate');
    scene.add(transformControls);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value;
        dragControls.enabled = !event.value;
    })

    window.addEventListener('keydown', function (event) {
        switch(event.key) {
            case 'g':
                transformControls.setMode('translate');
                break;
            case 'r':
                transformControls.setMode('rotate');
                break;
            case 's':
                transformControls.setMode('scale');
                break;
            default: break;
        }
    })
    
    // End add control

    // Set camera position to view object
    camera.position.z = 300;
}


function animate() {
    requestAnimationFrame(animate);

    // // Rotation
    // planeMesh.rotation.x = -70 * Math.PI / 180;
    // planeMesh.rotation.y = 4 * Math.PI / 180;
    // planeMesh.rotation.z = 0 * Math.PI / 180;

    // planeMesh.rotation.x = -70 * Math.PI / 180;
    // planeMesh.rotation.y = 0 * Math.PI / 180;
    // planeMesh.rotation.z = 1 * Math.PI / 180;

    seaMesh.rotation.x = -70 * Math.PI / 180;
    seaMesh.rotation.y = 0 * Math.PI / 180;
    seaMesh.rotation.z = 1 * Math.PI / 180;

    groundMesh.rotation.x = -70 * Math.PI / 180;
    groundMesh.rotation.y = 0 * Math.PI / 180;
    groundMesh.rotation.z = 1 * Math.PI / 180;

    // containerMesh.rotation.x = -70 * Math.PI / 180;
    // containerMesh.rotation.y = 0 * Math.PI / 180;
    // containerMesh.rotation.z = 1 * Math.PI / 180;

    // cubeMesh.rotation.x = -70 * Math.PI / 180;
    // cubeMesh.rotation.y = 5 * Math.PI / 180;
    // cubeMesh.rotation.z = 1 * Math.PI / 180;

    shipMesh.rotation.x = 20 * Math.PI / 180;
    shipMesh.rotation.y = 90 * Math.PI / 180;
    shipMesh.rotation.z = 0 * Math.PI / 180;

    groupContainer.rotation.x = 20 * Math.PI / 180;
    groupContainer.rotation.y = 90 * Math.PI / 180;
    groupContainer.rotation.z = 0 * Math.PI / 180;

    // shipMesh.rotation.x = 20 * Math.PI / 180;
    // shipMesh.rotation.y = 0 * Math.PI / 180;
    // shipMesh.rotation.z = -2 * Math.PI / 180;

    // if(cubeMesh.position.y < planeMesh.position.y + 5) {
    //     cubeMesh.position.y = planeMesh.position.y + 5;
    // }

    // if(shipMesh.position.y < planeMesh.position.y) {
    //     shipMesh.position.y = planeMesh.position.y;
    // }

    // coneMesh.rotation.x = 20 * Math.PI / 180;
    // coneMesh.rotation.y = 5 * Math.PI / 180;
    // coneMesh.rotation.z = 1 * Math.PI / 180;

    render();
}

function creatSeaMesh(scene) {
    let geometry  = new THREE.PlaneGeometry( 200, 300 );
    var material = new THREE.MeshBasicMaterial({
        color: 0x53c3e6,
        // wireframe : true
    });
    seaMesh = new THREE.Mesh( geometry, material );
    
    seaMesh.position.x = -150;
    seaMesh.position.y = 0;
    seaMesh.position.z = 0;

    seaMesh.receiveShadow = true;

    // Add Mesh to Scene
    scene.add( seaMesh );
}

function creatGroundMesh(scene) {
    let geometry  = new THREE.PlaneGeometry( 300, 300 );
    var material = new THREE.MeshBasicMaterial({
        color: 0x8c5529,
        // wireframe : true
    });
    groundMesh = new THREE.Mesh( geometry, material );
    
    groundMesh.position.x = 100;
    groundMesh.position.y = 0;
    groundMesh.position.z = 0;

    groundMesh.receiveShadow = true;

    // Add Mesh to Scene
    scene.add( groundMesh );
}

function createLight(scene) {
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1, 100);
    directionalLight.position.set(10,10,15);
    directionalLight.castShadow = true;  

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 50;    // default
    directionalLight.shadow.camera.far = 500;  
    // Add Mesh to Scene
    scene.add( directionalLight );
}

function createPlaneMesh(scene) {
    let geometry  = new THREE.PlaneGeometry( 300, 300 );
    var material = new THREE.MeshBasicMaterial({
        color: 0x53c3e6,
        // wireframe : true
    });
    planeMesh = new THREE.Mesh( geometry, material );
    
    planeMesh.position.x = 0;
    planeMesh.position.y = 0;
    planeMesh.position.z = 0;

    planeMesh.receiveShadow = true;

    // Add Mesh to Scene
    scene.add( planeMesh );
}

function createShipMesh(scene) {
    return new Promise((resolve) => {
        let mtlLoader = new MTLLoader();
        mtlLoader.setPath("obj/ship/");
        mtlLoader.load('0021GGC.mtl', function( materials ) {
    
            materials.preload();
            let objLoader = new OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( "obj/ship/" );
            objLoader.load( '0021GGC.obj', function ( object ) {
    
            shipMesh = object;
    
            shipMesh.position.x = -75;
            shipMesh.position.y = -19;
            shipMesh.position.z = 50;
    
            shipMesh.scale.x = 2;
            shipMesh.scale.y = 2;
            shipMesh.scale.z = 2;
    
            // Add Mesh to Scene
            scene.add(shipMesh);
            resolve(shipMesh);
            });
        });
      });
}

function createContainMesh() {
    let container;
    return new Promise((resolve) => {
        let mtlLoader = new MTLLoader();
        mtlLoader.setPath("obj/container/");
        mtlLoader.load('container.mtl', function( materials ) {
    
            materials.preload();
            let objLoader = new OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( "obj/container/" );
            objLoader.load( 'container.obj', function ( object ) {
    
            container = object;

            container.scale.x = 0.04;
            container.scale.y = 0.04;
            container.scale.z = 0.04;

            container.castShadow = true;
            container.receiveShadow = false
    
            container.rotation.x = 0 * Math.PI / 180;
            container.rotation.y = 0 * Math.PI / 180;
            container.rotation.z = 180 * Math.PI / 180;
    
            // return mesh
            resolve(container);
            });
        });
      });
}

function createCubeMesh(scene) {
    // Define geometry to show
    const geometry = new THREE.BoxGeometry(10,20,10);

    // Use textures
    const material = 
    [
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // right
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // left
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // top
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // bottom
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // front
        new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'textures/wood.gif' ) } ), // back
    ];

    cubeMesh = new THREE.Mesh(geometry, material);
    cubeMesh.position.x = 100;
    cubeMesh.position.y = 20;
    cubeMesh.position.z = 0;


    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = false
    // Add Mesh to Scene
    scene.add(cubeMesh)
}

function createConeMesh(scene) {
    // Define geometry to show
    const geometry = new THREE.ConeBufferGeometry(25, 25, 30);

    // Use textures
    var texture = new THREE.TextureLoader().load( 'textures/wall.jpg' );

    // Create material of geometry
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        // wireframe: true
    });

    coneMesh = new THREE.Mesh(geometry, material);
    coneMesh.position.x = 50;
    coneMesh.position.y = 8;
    coneMesh.position.z = 0;

    // Add Mesh to Scene
    scene.add(coneMesh)
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

init();
animate();

