/**
 * CDR Logo 3D — Three.js module
 * Renderiza a logo CDR com material metalico, HDRI e rotacao continua
 * Geometria extraida de cdrgroup.com.br (webhub-clone)
 */
export async function initCDRLogo3D(containerId = 'logo3d') {
  const THREE = await import('https://esm.sh/three@0.170.0');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
  camera.position.z = 4;

  // Lights — exact same as cdrgroup.com.br
  scene.add(new THREE.AmbientLight('white', 1.5));
  const dirLight = new THREE.DirectionalLight('white', 2);
  dirLight.position.set(5, 5, 5);
  const backLight = new THREE.DirectionalLight('#BEFF0A', 0.8);
  backLight.position.set(-3, -2, -5);
  const neonGlow = new THREE.PointLight('#BEFF0A', 3, 10);
  neonGlow.position.set(0, 0, 2);
  scene.add(dirLight, backLight, neonGlow);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(120, 120);
  renderer.setPixelRatio(2);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  document.getElementById(containerId).appendChild(renderer.domElement);

  // HDRI
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('hdri.webp', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(texture).texture;
    texture.dispose();
    pmrem.dispose();
  });

  // Geometry helpers
  const S = 1 / 260;
  const tx = (px) => (px - 257) * S;
  const ty = (py) => (280 - py) * S;

  // L-shape
  const lShape = new THREE.Shape();
  lShape.moveTo(tx(12), ty(0));
  lShape.lineTo(tx(502), ty(0));
  lShape.quadraticCurveTo(tx(514), ty(0), tx(514), ty(12));
  lShape.lineTo(tx(514), ty(547));
  lShape.quadraticCurveTo(tx(514), ty(559), tx(502), ty(559));
  lShape.lineTo(tx(347), ty(559));
  lShape.quadraticCurveTo(tx(334), ty(559), tx(334), ty(547));
  lShape.lineTo(tx(334), ty(243));
  lShape.quadraticCurveTo(tx(334), ty(225), tx(257), ty(225));
  lShape.lineTo(tx(12), ty(225));
  lShape.quadraticCurveTo(tx(0), ty(225), tx(0), ty(213));
  lShape.lineTo(tx(0), ty(12));
  lShape.quadraticCurveTo(tx(0), ty(0), tx(12), ty(0));
  lShape.closePath();

  // Arrow
  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(tx(285), ty(255));
  arrowShape.lineTo(tx(166), ty(549));
  arrowShape.quadraticCurveTo(tx(166), ty(559), tx(155), ty(559));
  arrowShape.lineTo(tx(13), ty(559));
  arrowShape.quadraticCurveTo(tx(0), ty(559), tx(0), ty(549));
  arrowShape.lineTo(tx(0), ty(404));
  arrowShape.lineTo(tx(285), ty(255));
  arrowShape.closePath();

  const extrudeSettings = { depth: 0.35, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 };

  const material = new THREE.MeshStandardMaterial({
    color: 0xBEFF0A, metalness: 0.75, roughness: 0.15,
    emissive: 0x2a3500, emissiveIntensity: 0.4, envMapIntensity: 1.8,
  });

  const logo = new THREE.Group();
  logo.add(
    new THREE.Mesh(new THREE.ExtrudeGeometry(lShape, extrudeSettings), material),
    new THREE.Mesh(new THREE.ExtrudeGeometry(arrowShape, extrudeSettings), material),
  );

  const box = new THREE.Box3().setFromObject(logo);
  logo.position.sub(box.getCenter(new THREE.Vector3()));

  const wrapper = new THREE.Group();
  wrapper.add(logo);
  scene.add(wrapper);

  // Animate
  (function animate() {
    requestAnimationFrame(animate);
    wrapper.rotation.y += 0.012;
    wrapper.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
    renderer.render(scene, camera);
  })();
}
