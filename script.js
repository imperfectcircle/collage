import * as THREE from 'three';

// const canvas = document.querySelector('#webgl');

// Definisci il numero di immagini nel collage
const numImages = 14;

// Inizializza la scena, la camera e il renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

// Array per memorizzare le texture delle immagini
const textures = [];

// Variabili per il controllo dello spostamento e dello zoom
let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;

// Funzione per caricare le immagini e creare il collage
function loadImages() {
    const loader = new THREE.TextureLoader();
    for (let i = 0; i < numImages; i++) {
        loader.load(`./images/image_${i}.jpg`, function (texture) {
            textures.push(texture);
            if (textures.length === numImages) {
                createCollage();
            }
        });
    }
}

// Funzione per creare il collage
function createCollage() {
    const spacing = 5; // Spazio tra le immagini
    const maxX = 100; // Massima coordinata x
    const maxY = 100; // Massima coordinata y
    const maxZ = 100; // Massima coordinata z

    for (let i = 0; i < numImages; i++) {
        const x = Math.random() * maxX - maxX / 2; // Posizione casuale sull'asse x
        const y = Math.random() * maxY - maxY / 2; // Posizione casuale sull'asse y
        const z = Math.random() * maxZ - maxZ / 2; // Posizione casuale sull'asse z

        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ map: textures[i], side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, z);
        scene.add(mesh);

        // Aggiungi l'evento di doppio clic per lo zoom e il centratura sull'immagine
        mesh.userData.originalPosition = { x: x, y: y, z: z }; // Salva la posizione originale
        mesh.addEventListener('dblclick', function (event) {
            const clickedMesh = event.target;
            camera.position.copy(clickedMesh.position);
            camera.position.z += 50; // Zoom quasi a schermo intero
        });

        // Aggiungi l'evento di hover per visualizzare l'immagine originale
        mesh.addEventListener('mouseenter', function (event) {
            const hoveredMesh = event.target;
            hoveredMesh.material.map = textures[i]; // Mostra l'immagine originale
        });

        // Aggiungi l'evento di uscita per ripristinare l'immagine del collage
        mesh.addEventListener('mouseleave', function (event) {
            const hoveredMesh = event.target;
            hoveredMesh.material.map = material.map; // Ripristina l'immagine del collage
        });
    }
}

// Funzione per gestire lo zoom
function zoom(event) {
    camera.position.z += event.deltaY * 0.008;
}

// Gestione dello zoom usando l'evento della rotellina del mouse
window.addEventListener('wheel', zoom);

// Gestisci l'evento di clic del mouse
document.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
        // Solo il clic sinistro
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// Gestisci l'evento di rilascio del mouse
document.addEventListener('mouseup', function (event) {
    if (event.button === 0) {
        // Solo il clic sinistro
        mouseDown = false;
    }
});

// Gestisci l'evento di movimento del mouse
document.addEventListener('mousemove', function (event) {
    if (mouseDown) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        // Sposta la camera orizzontalmente e verticalmente in base al movimento del mouse
        camera.position.x -= deltaX * 0.05;
        camera.position.y += deltaY * 0.05; // Inverti la direzione del movimento per la coordinata y (l'origine è in alto a sinistra)

        // Aggiorna le coordinate del mouse
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// Inizializzazione e rendering della scena
loadImages();
camera.position.z = 100;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Ridimensiona la finestra
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// // Definisci il numero di immagini nel collage
// const numImages = 5;

// // Inizializza la scena, la camera e il renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// // Array per memorizzare le texture delle immagini
// const textures = [];

// // Funzione per caricare le immagini e creare il collage
// function loadImages() {
//   const loader = new THREE.TextureLoader();
//   for (let i = 0; i < numImages; i++) {
//     loader.load(`./images/image_${i}.jpg`, function (texture) {
//       textures.push(texture);
//       if (textures.length === numImages) {
//         createCollage();
//       }
//     });
//   }
// }

// // Funzione per creare il collage
// function createCollage() {
//   const spacing = 5; // Spazio tra le immagini
//   const columns = 20; // Numero di colonne
//   const rows = Math.ceil(numImages / columns); // Calcola il numero di righe

//   for (let i = 0; i < numImages; i++) {
//     const x = (i % columns) * spacing;
//     const y = Math.floor(i / columns) * spacing;
//     const z = Math.random() * 100 - 50; // Profondità casuale sull'asse z

//     const geometry = new THREE.PlaneGeometry(1, 1);
//     const material = new THREE.MeshBasicMaterial({ map: textures[i], side: THREE.DoubleSide });
//     const mesh = new THREE.Mesh(geometry, material);

//     mesh.position.set(x, y, z);
//     scene.add(mesh);
//   }
// }

// // Funzione per gestire lo zoom
// function zoom(event) {
//   camera.position.z += event.deltaY * 0.05;
// }

// // Gestione dello zoom usando l'evento della rotellina del mouse
// window.addEventListener('wheel', zoom);

// // Inizializzazione e rendering della scena
// loadImages();
// camera.position.z = 100;
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();

// // Ridimensiona la finestra
// window.addEventListener('resize', function () {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// const cursor = {
//   x: 0,
//   y: 0,
// };

// window.addEventListener('mousemove', (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = event.clientY / sizes.height - 0.5;
// });
// const tick = () => {
//   camera.position.x = cursor.x;
//   camera.position.y = cursor.y;

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };
// tick();
