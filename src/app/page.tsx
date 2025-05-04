"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {gsap} from "gsap";

const DynamicSculptureGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shapeRef = useRef<THREE.Mesh | null>(null);
  const cursorRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartPointRef = useRef<THREE.Vector3 | null>(null);
  const dragStartShapeRef = useRef<THREE.Vector3[] | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [uiConfig, setUiConfig] = useState({
    frequency: 3.0,
    amplitude: 0.2,
    complexity: 4.0,
    smoothness: 0.7,
    metalness: 0.5,
    roughness: 0.5,
    environment: "Studio" as
        | "Studio"
        | "Midnight Jazz Club"
        | "Neon Graffiti"
        | "Forest Cathedral"
        | "Hidden Disco",
    galleryMode: false,
  });

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const [isMobile, setIsMobile] = useState(false);

  const environments = {
    Studio: { color: 0xffffff, intensity: 1.0 },
    "Midnight Jazz Club": { color: 0x66ccff, intensity: 0.8 },
    "Neon Graffiti": { color: 0xff3300, intensity: 1.2 },
    "Forest Cathedral": { color: 0x33cc33, intensity: 0.7 },
    "Hidden Disco": { color: 0xff66cc, intensity: 1.5 },
  };

  const studioEnvironment = {
    ambientColor: 0x404040,
    ambientIntensity: 0.7,
    directionalColor: 0xffffff,
    directionalIntensity: 1.0,
    directionalPosition: new THREE.Vector3(1, 1, 1),
  };

  const midnightJazzClubEnvironment = {
    ambientColor: 0x2a2a72,
    ambientIntensity: 0.6,
    directionalColor: 0x66ccff,
    directionalIntensity: 0.9,
    directionalPosition: new THREE.Vector3(-1, 0.5, 0.5),
  };

  const neonGraffitiEnvironment = {
    ambientColor: 0x2b2b2b,
    ambientIntensity: 0.5,
    directionalColor: 0xff3300,
    directionalIntensity: 1.1,
    directionalPosition: new THREE.Vector3(0.5, 1, 0.5),
  };

  const forestCathedralEnvironment = {
    ambientColor: 0x1a472a,
    ambientIntensity: 0.4,
    directionalColor: 0x33cc33,
    directionalIntensity: 0.8,
    directionalPosition: new THREE.Vector3(-0.5, 1, 0.5),
  };

  const hiddenDiscoEnvironment = {
    ambientColor: 0x5d001e,
    ambientIntensity: 0.3,
    directionalColor: 0xff66cc,
    directionalIntensity: 1.3,
    directionalPosition: new THREE.Vector3(0.5, 0.5, 1),
  };

  const getEnvironmentSettings = (environmentName: string) => {
    switch (environmentName) {
      case "Midnight Jazz Club":
        return midnightJazzClubEnvironment;
      case "Neon Graffiti":
        return neonGraffitiEnvironment;
      case "Forest Cathedral":
        return forestCathedralEnvironment;
      case "Hidden Disco":
        return hiddenDiscoEnvironment;
      case "Studio":
      default:
        return studioEnvironment;
    }
  };

  const createShape = (config = uiConfig) => {
    if (!sceneRef.current || !rendererRef.current) return;

    if (shapeRef.current) {
      sceneRef.current.remove(shapeRef.current);
    }

    const { frequency, amplitude, complexity, smoothness } = config;

    const geometry = new THREE.SphereGeometry(
        1,
        Math.floor(32 * complexity),
        Math.floor(16 * complexity)
    );

    const positionAttribute = geometry.getAttribute("position");

    const originalPositions = new Float32Array(positionAttribute.array.length);
    for (let i = 0; i < positionAttribute.array.length; i++) {
      originalPositions[i] = positionAttribute.array[i];
    }

    geometry.userData = {
      originalPositions,
      frequency,
      amplitude,
      complexity,
      smoothness,
      lastUpdateTime: 0,
      animationProgress: 0,
    };

    const material = new THREE.MeshStandardMaterial({
      color: 0x8888ff,
      metalness: config.metalness,
      roughness: config.roughness,
      wireframe: false,
    });

    const shape = new THREE.Mesh(geometry, material);
    shapeRef.current = shape;

    sceneRef.current.add(shape);

    updateShape(config, true);
  };

  const updateShape = (config = uiConfig, forceUpdate = false) => {
    if (!shapeRef.current || !sceneRef.current || !rendererRef.current) return;

    const { frequency, amplitude, complexity, smoothness } = config;

    const geometry = shapeRef.current.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position");

    const {
      originalPositions,
      lastUpdateTime,
      animationProgress: prevProgress,
    } = geometry.userData;

    const now = performance.now() / 1000;
    const deltaTime = Math.min(now - lastUpdateTime, 0.1);

    const animationProgress =
        prevProgress + deltaTime * frequency * (0.5 + 0.5 * complexity);

    geometry.userData = {
      ...geometry.userData,
      frequency,
      amplitude,
      complexity,
      smoothness,
      lastUpdateTime: now,
      animationProgress,
    };

    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3;

      const x = originalPositions[i3];
      const y = originalPositions[i3 + 1];
      const z = originalPositions[i3 + 2];

      const vertexPosition = new THREE.Vector3(x, y, z);
      const normal = vertexPosition.clone().normalize();

      const noiseA =
          Math.sin(x * frequency + animationProgress * 0.5) * 0.5 + 0.5;
      const noiseB =
          Math.sin(y * frequency + animationProgress * 0.7) * 0.5 + 0.5;
      const noiseC =
          Math.sin(z * frequency + animationProgress * 0.3) * 0.5 + 0.5;

      const noiseValue = (noiseA + noiseB + noiseC) / 3;

      const displacement =
          Math.sin(animationProgress + i * 0.1) * amplitude * noiseValue;

      const newPosition = vertexPosition
          .clone()
          .add(normal.multiplyScalar(displacement));

      positionAttribute.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
    }

    positionAttribute.needsUpdate = true;

    geometry.computeVertexNormals();

    shapeRef.current.material.metalness = config.metalness;
    shapeRef.current.material.roughness = config.roughness;

    if (forceUpdate && rendererRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current!);
    }
  };

  const setupScene = () => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
        75,
        dimensions.width / dimensions.height,
        0.1,
        1000
    );
    cameraRef.current = camera;
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;
    const mouse = new THREE.Vector2();
    mouseRef.current = mouse;

    const cursorGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursorRef.current = cursor;
    scene.add(cursor);

    const clock = new THREE.Clock();
    clockRef.current = clock;

    scene.background = null;

    createShape();

    updateLighting(uiConfig.environment);

    window.addEventListener("resize", handleResize);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    animate();
  };

  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    setDimensions({ width, height });

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!mouseRef.current || !raycasterRef.current || !cursorRef.current) return;

    const rect = rendererRef.current!.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);

    if (!uiConfig.galleryMode) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

      const intersects = raycasterRef.current.intersectObject(shapeRef.current!);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        cursorRef.current.position.copy(point);
        cursorRef.current.visible = true;
      } else {
        cursorRef.current.visible = false;
      }
    } else {
      cursorRef.current.visible = false;
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (!mouseRef.current || !raycasterRef.current || !shapeRef.current) return;

    const rect = rendererRef.current!.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

    const intersects = raycasterRef.current.intersectObject(shapeRef.current);

    if (intersects.length > 0) {
      isDraggingRef.current = true;
      dragStartPointRef.current = intersects[0].point.clone();
      dragStartShapeRef.current = Array.from(
          shapeRef.current.geometry.attributes.position.array
      ) as number[];
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragStartPointRef.current = null;
    dragStartShapeRef.current = null;
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (!mouseRef.current || !raycasterRef.current || !shapeRef.current) return;

    const rect = rendererRef.current!.domElement.getBoundingClientRect();
    const x =
        ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y =
        -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

    const intersects = raycasterRef.current.intersectObject(shapeRef.current);

    if (intersects.length > 0) {
      isDraggingRef.current = true;
      dragStartPointRef.current = intersects[0].point.clone();
      dragStartShapeRef.current = Array.from(
          shapeRef.current.geometry.attributes.position.array
      ) as number[];
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (
        !isDraggingRef.current ||
        !mouseRef.current ||
        !raycasterRef.current ||
        !shapeRef.current ||
        !dragStartPointRef.current ||
        !dragStartShapeRef.current
    )
      return;

    event.preventDefault();

    const rect = rendererRef.current!.domElement.getBoundingClientRect();
    const x =
        ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
    const y =
        -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);

    const plane = new THREE.Plane(
        new THREE.Vector3(0, 0, 1),
        -dragStartPointRef.current.z
    );
    const newPoint = new THREE.Vector3();
    raycasterRef.current.ray.intersectPlane(plane, newPoint);

    const dragVector = newPoint.sub(dragStartPointRef.current);

    const geometry = shapeRef.current.geometry;
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3;

      const vertexPos = new THREE.Vector3(
          dragStartShapeRef.current[i3],
          dragStartShapeRef.current[i3 + 1],
          dragStartShapeRef.current[i3 + 2]
      );

      const normal = vertexPos.clone().normalize();

      const projection = normal.dot(dragVector);

      const newPos = vertexPos.add(normal.multiplyScalar(projection));

      positionAttribute.setXYZ(i, newPos.x, newPos.y, newPos.z);
    }

    positionAttribute.needsUpdate = true;

    geometry.computeVertexNormals();

    updateShape();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    dragStartPointRef.current = null;
    dragStartShapeRef.current = null;
  };

  const updateLighting = (environmentName: string) => {
    if (!sceneRef.current) return;

    // Remove all existing lights from the scene
    const lightsToRemove = sceneRef.current.children.filter(
      child => child instanceof THREE.Light
    );
    
    lightsToRemove.forEach(light => {
      sceneRef.current!.remove(light);
    });

    const env = getEnvironmentSettings(environmentName);

    const ambientLight = new THREE.AmbientLight(env.ambientColor, env.ambientIntensity);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
        env.directionalColor,
        env.directionalIntensity
    );
    directionalLight.position.copy(env.directionalPosition);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 10);
    pointLight.position.set(-1, 1, -1);
    sceneRef.current.add(pointLight);

    const secondPointLight = new THREE.PointLight(0xffffff, 0.4, 10);
    secondPointLight.position.set(1, -1, 1);
    sceneRef.current.add(secondPointLight);
    
    // Update the material color based on the environment
    if (shapeRef.current) {
      const material = shapeRef.current.material as THREE.MeshStandardMaterial;
      
      // Set material color based on environment
      switch(environmentName) {
        case "Midnight Jazz Club":
          material.color.set(0x4499cc);
          break;
        case "Neon Graffiti":
          material.color.set(0xff5533);
          break;
        case "Forest Cathedral":
          material.color.set(0x55bb55);
          break;
        case "Hidden Disco":
          material.color.set(0xff77dd);
          break;
        case "Studio":
        default:
          material.color.set(0x8888ff);
          break;
      }
    }
  };

  const animate = () => {
    animationFrameIdRef.current = requestAnimationFrame(animate);

    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const delta = clockRef.current!.getDelta();

    if (shapeRef.current && !uiConfig.galleryMode) {
      const time = performance.now() / 1000;
      const geometry = shapeRef.current.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.getAttribute("position");

      const {
        originalPositions,
        frequency,
        amplitude,
        complexity,
        smoothness,
        animationProgress: prevProgress,
      } = geometry.userData;

      const animationProgress =
          prevProgress + delta * frequency * (0.5 + 0.5 * complexity);

      geometry.userData.animationProgress = animationProgress;

      for (let i = 0; i < positionAttribute.count; i++) {
        const i3 = i * 3;

        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        const vertexPosition = new THREE.Vector3(x, y, z);
        const normal = vertexPosition.clone().normalize();

        const noiseA =
            Math.sin(x * frequency + animationProgress * 0.5) * 0.5 + 0.5;
        const noiseB =
            Math.sin(y * frequency + animationProgress * 0.7) * 0.5 + 0.5;
        const noiseC =
            Math.sin(z * frequency + animationProgress * 0.3) * 0.5 + 0.5;

        const noiseValue = (noiseA + noiseB + noiseC) / 3;

        const displacement =
            Math.sin(animationProgress + i * 0.1) * amplitude * noiseValue;

        const newPosition = vertexPosition
            .clone()
            .add(normal.multiplyScalar(displacement));

        positionAttribute.setXYZ(
            i,
            newPosition.x,
            newPosition.y,
            newPosition.z
        );
      }

      positionAttribute.needsUpdate = true;

      geometry.computeVertexNormals();

      shapeRef.current.material.metalness = uiConfig.metalness;
      shapeRef.current.material.roughness = uiConfig.roughness;
    }

    if (controlsRef.current && !uiConfig.galleryMode) {
      controlsRef.current.update();
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const toggleGalleryMode = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const newGalleryMode = !uiConfig.galleryMode;
    setUiConfig((prev) => ({ ...prev, galleryMode: newGalleryMode }));

    if (newGalleryMode) {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 0,
        z: 3.5,
        duration: 1,
        ease: "power1.inOut",
      });

      gsap.to(controlsRef.current!, {
        enableDamping: false,
        enableZoom: false,
        enablePan: false,
        duration: 1,
        ease: "power1.inOut",
      });

      sceneRef.current.background = new THREE.Color(0x111111);

      const env = getEnvironmentSettings(uiConfig.environment);
      const directionalLight = sceneRef.current.children.find(
          (light) =>
              light instanceof THREE.DirectionalLight &&
              light.color.getHex() === env.directionalColor
      ) as THREE.DirectionalLight;

      if (directionalLight) {
        gsap.to(directionalLight, {
          intensity: env.directionalIntensity * 1.2,
          duration: 1,
          ease: "power1.inOut",
        });
      }

      const pointLights = sceneRef.current.children.filter(
          (light) => light instanceof THREE.PointLight
      ) as THREE.PointLight[];

      pointLights.forEach((light) => {
        gsap.to(light, {
          intensity: 0,
          duration: 1,
          ease: "power1.inOut",
        });
      });

      const ambientLight = sceneRef.current.children.find(
          (light) =>
              light instanceof THREE.AmbientLight &&
              light.color.getHex() === env.ambientColor
      ) as THREE.AmbientLight;

      if (ambientLight) {
        gsap.to(ambientLight, {
          intensity: env.ambientIntensity * 0.8,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    } else {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 1.5,
        z: 2.5,
        duration: 1,
        ease: "power1.inOut",
      });

      gsap.to(controlsRef.current!, {
        enableDamping: true,
        enableZoom: true,
        enablePan: true,
        duration: 1,
        ease: "power1.inOut",
      });

      sceneRef.current.background = null;

      const env = getEnvironmentSettings(uiConfig.environment);
      const directionalLight = sceneRef.current.children.find(
          (light) =>
              light instanceof THREE.DirectionalLight &&
              light.color.getHex() === env.directionalColor
      ) as THREE.DirectionalLight;

      if (directionalLight) {
        gsap.to(directionalLight, {
          intensity: env.directionalIntensity,
          duration: 1,
          ease: "power1.inOut",
        });
      }

      const pointLights = sceneRef.current.children.filter(
          (light) => light instanceof THREE.PointLight
      ) as THREE.PointLight[];

      pointLights.forEach((light) => {
        gsap.to(light, {
          intensity: 0.8,
          duration: 1,
          ease: "power1.inOut",
        });
      });

      const ambientLight = sceneRef.current.children.find(
          (light) =>
              light instanceof THREE.AmbientLight &&
              light.color.getHex() === env.ambientColor
      ) as THREE.AmbientLight;

      if (ambientLight) {
        gsap.to(ambientLight, {
          intensity: env.ambientIntensity,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setupScene();
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (uiConfig.galleryMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [uiConfig.galleryMode]);

  useEffect(() => {
    updateShape();
  }, [uiConfig]);

  const handleEnvironmentChange = (newEnvironment: string) => {
    if (!sceneRef.current) return;

    // Update the lights directly using our updateLighting function
    updateLighting(newEnvironment);

    // Update the UI state
    setUiConfig((prev) => ({ ...prev, environment: newEnvironment }));
  };

  return (
      <div
          className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 ${
              uiConfig.galleryMode ? "overflow-hidden" : ""
          }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
          {uiConfig.galleryMode && (
              <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md flex flex-col justify-center items-center p-4">
                <div className="max-w-4xl w-full bg-white dark:bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                  <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                      Digital Sculpture Exhibition
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                      Interactive 3D art that responds to your presence
                    </p>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white bg-opacity-10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                      >
                        <path
                            d="M12 3V21M21 12H3M10 7L16 12L10 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <button
                        onClick={toggleGalleryMode}
                        className="bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Exit Gallery Mode
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>

        {!uiConfig.galleryMode && (
            <div className="absolute top-0 left-0 w-full h-screen flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6">
              <div className="w-full md:w-72 bg-white dark:bg-gray-800 bg-opacity-10 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white border-opacity-20 flex flex-col gap-4">
                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Frequency
                  </label>
                  <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={uiConfig.frequency}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            frequency: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Amplitude
                  </label>
                  <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={uiConfig.amplitude}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            amplitude: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Complexity
                  </label>
                  <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={uiConfig.complexity}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            complexity: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Smoothness
                  </label>
                  <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={uiConfig.smoothness}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            smoothness: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Metalness
                  </label>
                  <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={uiConfig.metalness}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            metalness: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Roughness
                  </label>
                  <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={uiConfig.roughness}
                      onChange={(e) =>
                          setUiConfig((prev) => ({
                            ...prev,
                            roughness: parseFloat(e.target.value),
                          }))
                      }
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-medium mb-2">
                    Environment
                  </label>
                  <select
                      value={uiConfig.environment}
                      onChange={(e) =>
                          handleEnvironmentChange(
                              e.target.value as
                                  | "Studio"
                                  | "Midnight Jazz Club"
                                  | "Neon Graffiti"
                                  | "Forest Cathedral"
                                  | "Hidden Disco"
                          )
                      }
                      className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-xl border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 text-base md:text-lg cursor-pointer"
                  >
                    <option value="Studio">Studio</option>
                    <option value="Midnight Jazz Club">Midnight Jazz Club</option>
                    <option value="Neon Graffiti">Neon Graffiti</option>
                    <option value="Forest Cathedral">Forest Cathedral</option>
                    <option value="Hidden Disco">Hidden Disco</option>
                  </select>
                </div>

                <button
                    onClick={toggleGalleryMode}
                    className="w-full bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-4 py-3 rounded-xl font-bold text-base md:text-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mt-2 md:mt-4 cursor-pointer"
                >
                  Enter Gallery Mode
                </button>
              </div>

              <div className="flex-1"></div>
            </div>
        )}
      </div>
  );
};

export default DynamicSculptureGenerator;
