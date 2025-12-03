import {
  AdditiveBlending,
  AmbientLight,
  Clock,
  Color,
  Group,
  LinearFilter,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  SRGBColorSpace,
  Raycaster,
  Scene,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export type TechSceneOptions = {
  container?: HTMLElement | null;
};

export type TechSceneHandle = {
  dispose: () => void;
};

type TechLogoSpec = {
  name: string;
  svg: string;
  url?: string;
};

const techLogos: TechLogoSpec[] = [
  {
    name: "Vue",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path fill="#33495E" d="M4 6h12L32 34 48 6h12L32 58z"/>
      <path fill="#41B883" d="M14 6L32 37 50 6h-8l-10 17L22 6h-8z"/>
    </svg>`,
    url: "https://vuejs.org",
  },
  {
    name: "TypeScript",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="10" fill="#3178C6"/>
      <text x="12" y="44" fill="#fff" font-size="26" font-family="Inter, Arial, sans-serif" font-weight="700">TS</text>
    </svg>`,
    url: "https://www.typescriptlang.org",
  },
  {
    name: "Vite",
    svg: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="-1.871 -0.4069999999999627 259.721 257.849"><linearGradient id="a" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0" stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="b" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0" stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient><path d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62z" fill="url(#a)"/><path d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113z" fill="url(#b)"/></svg>`,
    url: "https://vitejs.dev",
  },
  {
    name: "Sass",
    svg: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32"><title>file_type_scss</title><path d="M16.171,18.7c-.481.221-1.008.509-2.063,1.088-.4.225-.818.45-1.207.662-.027-.027-.055-.061-.082-.089-2.087-2.23-5.947-3.805-5.783-6.8.061-1.091.436-3.955,7.413-7.433,5.742-2.83,10.311-2.046,11.1-.307C26.683,8.3,23.1,12.913,17.17,13.582a4.469,4.469,0,0,1-3.751-.948c-.314-.341-.361-.361-.477-.293-.191.1-.068.409,0,.586a3.5,3.5,0,0,0,2.141,1.684,11.4,11.4,0,0,0,6.956-.689c3.594-1.391,6.4-5.258,5.578-8.5-.825-3.287-6.281-4.371-11.443-2.537a26,26,0,0,0-8.79,5.047c-2.844,2.66-3.294,4.972-3.11,5.94.662,3.437,5.4,5.674,7.3,7.331-.1.055-.184.1-.259.143-.948.471-4.562,2.36-5.463,4.358-1.023,2.264.164,3.887.948,4.105a5.832,5.832,0,0,0,6.281-2.544,6.3,6.3,0,0,0,.559-5.8,5.03,5.03,0,0,1,.716-.477c.484-.286.945-.568,1.354-.786l0,0a10.475,10.475,0,0,1,4.475-.989c3.246.382,3.887,2.407,3.764,3.26a2.157,2.157,0,0,1-1.03,1.459c-.225.143-.3.191-.28.293.027.15.136.143.327.116a2.535,2.535,0,0,0,1.766-2.257c.1-2-1.807-4.194-5.183-4.174a7.753,7.753,0,0,0-2.946.587q-.225.093-.437.2Zm-4.825,7.839c-1.078,1.173-2.578,1.616-3.226,1.241-.7-.4-.423-2.135.9-3.376a17.18,17.18,0,0,1,2.53-1.889c.157-.1.389-.232.668-.4.048-.027.075-.041.075-.041l.164-.1A4.658,4.658,0,0,1,11.346,26.539Z" style="fill:#cd6799"/></svg>`,
    url: "https://sass-lang.com",
  },
  {
    name: "Node.js",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <path d="M32 4l22 12v24L32 56 10 40V16z" fill="#303030"/>
      <path d="M32 10l16 9v18l-16 9-16-9V19z" fill="#689f63"/>
      <text x="19" y="37" fill="#fff" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="16">JS</text>
    </svg>`,
    url: "https://nodejs.org",
  },
  {
    name: "PostgreSQL",
    svg: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 432.071 445.383" xml:space="preserve">
<g id="orginal" style="fill-rule:nonzero;clip-rule:nonzero;stroke:#000000;stroke-miterlimit:4;">
\t</g>
<g id="Layer_x0020_3" style="fill-rule:nonzero;clip-rule:nonzero;fill:none;stroke:#FFFFFF;stroke-width:12.4651;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;">
<path style="fill:#000000;stroke:#000000;stroke-width:37.3953;stroke-linecap:butt;stroke-linejoin:miter;" d="M323.205,324.227c2.833-23.601,1.984-27.062,19.563-23.239l4.463,0.392c13.517,0.615,31.199-2.174,41.587-7c22.362-10.376,35.622-27.7,13.572-23.148c-50.297,10.376-53.755-6.655-53.755-6.655c53.111-78.803,75.313-178.836,56.149-203.322    C352.514-5.534,262.036,26.049,260.522,26.869l-0.482,0.089c-9.938-2.062-21.06-3.294-33.554-3.496c-22.761-0.374-40.032,5.967-53.133,15.904c0,0-161.408-66.498-153.899,83.628c1.597,31.936,45.777,241.655,98.47,178.31    c19.259-23.163,37.871-42.748,37.871-42.748c9.242,6.14,20.307,9.272,31.912,8.147l0.897-0.765c-0.281,2.876-0.157,5.689,0.359,9.019c-13.572,15.167-9.584,17.83-36.723,23.416c-27.457,5.659-11.326,15.734-0.797,18.367c12.768,3.193,42.305,7.716,62.268-20.224    l-0.795,3.188c5.325,4.26,4.965,30.619,5.72,49.452c0.756,18.834,2.017,36.409,5.856,46.771c3.839,10.36,8.369,37.05,44.036,29.406c29.809-6.388,52.6-15.582,54.677-101.107"/>
<path style="fill:#336791;stroke:none;" d="M402.395,271.23c-50.302,10.376-53.76-6.655-53.76-6.655c53.111-78.808,75.313-178.843,56.153-203.326c-52.27-66.785-142.752-35.2-144.262-34.38l-0.486,0.087c-9.938-2.063-21.06-3.292-33.56-3.496c-22.761-0.373-40.026,5.967-53.127,15.902    c0,0-161.411-66.495-153.904,83.63c1.597,31.938,45.776,241.657,98.471,178.312c19.26-23.163,37.869-42.748,37.869-42.748c9.243,6.14,20.308,9.272,31.908,8.147l0.901-0.765c-0.28,2.876-0.152,5.689,0.361,9.019c-13.575,15.167-9.586,17.83-36.723,23.416    c-27.459,5.659-11.328,15.734-0.796,18.367c12.768,3.193,42.307,7.716,62.266-20.224l-0.796,3.188c5.319,4.26,9.054,27.711,8.428,48.969c-0.626,21.259-1.044,35.854,3.147,47.254c4.191,11.4,8.368,37.05,44.042,29.406c29.809-6.388,45.256-22.942,47.405-50.555    c1.525-19.631,4.976-16.729,5.194-34.28l2.768-8.309c3.192-26.611,0.507-35.196,18.872-31.203l4.463,0.392c13.517,0.615,31.208-2.174,41.591-7c22.358-10.376,35.618-27.7,13.573-23.148z"/>
<path d="M215.866,286.484c-1.385,49.516,0.348,99.377,5.193,111.495c4.848,12.118,15.223,35.688,50.9,28.045c29.806-6.39,40.651-18.756,45.357-46.051c3.466-20.082,10.148-75.854,11.005-87.281"/>
<path d="M173.104,38.256c0,0-161.521-66.016-154.012,84.109c1.597,31.938,45.779,241.664,98.473,178.316c19.256-23.166,36.671-41.335,36.671-41.335"/>
<path d="M260.349,26.207c-5.591,1.753,89.848-34.889,144.087,34.417c19.159,24.484-3.043,124.519-56.153,203.329"/>
<path style="stroke-linejoin:bevel;" d="M348.282,263.953c0,0,3.461,17.036,53.764,6.653c22.04-4.552,8.776,12.774-13.577,23.155c-18.345,8.514-59.474,10.696-60.146-1.069c-1.729-30.355,21.647-21.133,19.96-28.739c-1.525-6.85-11.979-13.573-18.894-30.338    c-6.037-14.633-82.796-126.849,21.287-110.183c3.813-0.789-27.146-99.002-124.553-100.599c-97.385-1.597-94.19,119.762-94.19,119.762"/>
<path d="M188.604,274.334c-13.577,15.166-9.584,17.829-36.723,23.417c-27.459,5.66-11.326,15.733-0.797,18.365c12.768,3.195,42.307,7.718,62.266-20.229c6.078-8.509-0.036-22.086-8.385-25.547c-4.034-1.671-9.428-3.765-16.361,3.994z"/>
<path d="M187.715,274.069c-1.368-8.917,2.93-19.528,7.536-31.942c6.922-18.626,22.893-37.255,10.117-96.339c-9.523-44.029-73.396-9.163-73.436-3.193c-0.039,5.968,2.889,30.26-1.067,58.548c-5.162,36.913,23.488,68.132,56.479,64.938"/>
<path style="fill:#FFFFFF;stroke-width:4.155;stroke-linecap:butt;stroke-linejoin:miter;" d="M172.517,141.7c-0.288,2.039,3.733,7.48,8.976,8.207c5.234,0.73,9.714-3.522,9.998-5.559c0.284-2.039-3.732-4.285-8.977-5.015c-5.237-0.731-9.719,0.333-9.996,2.367z"/>
<path style="fill:#FFFFFF;stroke-width:2.0775;stroke-linecap:butt;stroke-linejoin:miter;" d="M331.941,137.543c0.284,2.039-3.732,7.48-8.976,8.207c-5.238,0.73-9.718-3.522-10.005-5.559c-0.277-2.039,3.74-4.285,8.979-5.015c5.239-0.73,9.718,0.333,10.002,2.368z"/>
<path d="M350.676,123.432c0.863,15.994-3.445,26.888-3.988,43.914c-0.804,24.748,11.799,53.074-7.191,81.435"/>
<path style="stroke-width:3;" d="M0,60.232"/>
</g>
</svg>`,
    url: "https://www.postgresql.org",
  },
];

const getBrandColor = (fallback = "#8b5cf6"): Color => {
  const cssValue = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();
  return new Color(cssValue ? `rgb(${cssValue})` : fallback);
};

const withBase = (path: string): string => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

const createLogoTexture = (loader: TextureLoader, svg: string): Texture => {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);
  const texture = loader.load(objectUrl, () => URL.revokeObjectURL(objectUrl));
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

const loadFont = (): Promise<Font> => {
  const loader = new FontLoader();
  return loader.loadAsync(withBase("/fonts/helvetiker_regular.typeface.json"));
};

export const createTechScene = (
  canvas: HTMLCanvasElement,
  options: TechSceneOptions = {},
): TechSceneHandle => {
  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(new Color("#000000"), 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const brandColor = getBrandColor();
  const camera = new PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.set(0.5, 1.4, 8);
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 11;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;

  const ambientLight = new AmbientLight(0xffffff, 0.6);
  const keyLight = new PointLight(brandColor, 1.6, 30);
  keyLight.position.set(6, 5, 4);
  const rimLight = new PointLight(new Color("#5de0ff"), 0.9, 40);
  rimLight.position.set(-6, -3, 6);
  scene.add(ambientLight, keyLight, rimLight);

  const sizes = { width: 1, height: 1 };
  const targetElement = options.container ?? canvas.parentElement ?? canvas;

  const updateSize = () => {
    const bounds = targetElement.getBoundingClientRect();
    sizes.width = Math.max(320, Math.floor(bounds.width));
    sizes.height = Math.max(320, Math.floor(bounds.height));
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  updateSize();
  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(targetElement);

  const logoGroup = new Group();
  scene.add(logoGroup);

  const loader = new TextureLoader();
  const disposableTextures: Texture[] = [];
  const disposableMeshes: Array<Mesh | Sprite> = [];

  const createLogos = () => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    techLogos.forEach((logo, index) => {
      const texture = createLogoTexture(loader, logo.svg);
      disposableTextures.push(texture);
      const material = new SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      const sprite = new Sprite(material);
      const radius = 4.2 + Math.random() * 1.4;
      const y = 1 - (index / techLogos.length) * 2;
      const theta = goldenAngle * index;
      const phi = Math.acos(MathUtils.clamp(y / radius, -1, 1));
      const position = new Vector3().setFromSphericalCoords(radius, phi, theta);
      sprite.position.copy(position);
      const scale = 0.8 + Math.random() * 0.8;
      sprite.scale.set(scale, scale, scale);
      sprite.userData.url = logo.url;
      logoGroup.add(sprite);
      disposableMeshes.push(sprite);
    });
  };

  createLogos();

  void loadFont()
    .then((font) => {
      const textGeometry = new TextGeometry("StyleEngine", {
        font,
        size: 0.7,
        depth: 0.2,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      textGeometry.center();

      const textMaterial = new MeshStandardMaterial({
        color: brandColor,
        metalness: 0.35,
        roughness: 0.35,
        emissive: brandColor.clone().multiplyScalar(0.4),
      });
      const textMesh = new Mesh(textGeometry, textMaterial);
      textMesh.position.y = 0.2;
      scene.add(textMesh);
      disposableMeshes.push(textMesh);
    })
    .catch(() => undefined);

  const raycaster = new Raycaster();
  const mouse = new Vector2();
  const handleClick = (event: MouseEvent) => {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(logoGroup.children, false);
    const target = intersects[0]?.object;
    const url = target?.userData?.url as string | undefined;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  canvas.addEventListener("click", handleClick);

  const clock = new Clock();
  let frameId: number | null = null;
  const tick = () => {
    const delta = clock.getDelta();
    logoGroup.rotation.y += delta * 0.4;
    logoGroup.rotation.x = MathUtils.lerp(
      logoGroup.rotation.x,
      0.08 * Math.sin(clock.elapsedTime * 0.4),
      0.05,
    );
    controls.update();
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(tick);
  };
  tick();

  const dispose = () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
    canvas.removeEventListener("click", handleClick);
    resizeObserver.disconnect();
    controls.dispose();
    renderer.dispose();
    disposableMeshes.forEach((mesh) => {
      mesh.parent?.remove(mesh);
      if ("geometry" in mesh && mesh.geometry) {
        mesh.geometry.dispose();
      }
      if ("material" in mesh && mesh.material) {
        const material = mesh.material as SpriteMaterial | MeshStandardMaterial;
        material.dispose();
      }
    });
    disposableTextures.forEach((texture) => texture.dispose());
  };

  return { dispose };
};
