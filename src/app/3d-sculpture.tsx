"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const DynamicSculptureGenerator = () => {
  // Add a style section directly in the component
  const StyleSection = () => (
    <style jsx global>{`
      /* Enhanced slider appearance */
      input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 5px;
        border-radius: 5px;
        background: linear-gradient(to right, #4f46e5, #9333ea);
        outline: none;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        border: 2px solid rgba(79, 70, 229, 0.6);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .dark input[type="range"] {
        background: linear-gradient(to right, #6366f1, #a855f7);
      }

      .dark input[type="range"]::-webkit-slider-thumb {
        background: #e5e7eb;
        border: 2px solid rgba(99, 102, 241, 0.6);
      }

      input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        border: 2px solid rgba(79, 70, 229, 0.6);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .dark input[type="range"]::-moz-range-thumb {
        background: #e5e7eb;
        border: 2px solid rgba(99, 102, 241, 0.6);
      }

      /* Control card styling */
      .control-card {
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }

      .dark .control-card {
        background-color: rgba(55, 65, 81, 0.4);
      }

      .control-card:hover {
        transform: translateY(-2px);
        box-shadow:
          0 10px 15px -3px rgba(0, 0, 0, 0.1),
          0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      /* Environment button styling */
      .env-button {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        text-align: left;
      }

      .env-button:not(.env-button-active) {
        background-color: rgba(255, 255, 255, 0.5);
      }

      .dark .env-button:not(.env-button-active) {
        background-color: rgba(75, 85, 99, 0.5);
      }

      .env-button-active {
        background-color: #4f46e5;
        color: white;
        box-shadow:
          0 4px 6px -1px rgba(79, 70, 229, 0.5),
          0 2px 4px -1px rgba(79, 70, 229, 0.4);
      }

      .dark .env-button-active {
        background-color: #6366f1;
      }

      .env-button:hover:not(.env-button-active) {
        background-color: rgba(243, 244, 246, 0.8);
      }

      .dark .env-button:hover:not(.env-button-active) {
        background-color: rgba(107, 114, 128, 0.8);
      }

      /* Control value display */
      .control-value {
        display: inline-block;
        padding: 0.125rem 0.5rem;
        background-color: rgba(243, 244, 246, 0.8);
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-family: monospace;
      }

      .dark .control-value {
        background-color: rgba(55, 65, 81, 0.8);
      }

      /* Action buttons */
      .primary-button {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        font-weight: bold;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.75rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .primary-button-gradient {
        background: linear-gradient(to right, #4f46e5, #7c3aed);
        color: white;
      }

      .primary-button-gradient:hover {
        background: linear-gradient(to right, #4338ca, #6d28d9);
        transform: translateY(-2px);
        box-shadow:
          0 10px 15px -3px rgba(0, 0, 0, 0.2),
          0 4px 6px -2px rgba(0, 0, 0, 0.1);
      }

      .primary-button-gradient:active {
        transform: translateY(1px);
      }

      .secondary-button {
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 0.75rem;
        font-weight: 500;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.8);
        color: #1f2937;
        border: 1px solid rgba(209, 213, 219, 0.8);
      }

      .dark .secondary-button {
        background-color: rgba(55, 65, 81, 0.8);
        color: #e5e7eb;
        border: 1px solid rgba(75, 85, 99, 0.8);
      }

      .secondary-button:hover {
        background-color: rgba(243, 244, 246, 1);
      }

      .dark .secondary-button:hover {
        background-color: rgba(75, 85, 99, 1);
      }

      /* Value adjustment buttons */
      .value-adjust-button {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(243, 244, 246, 0.8);
        border-radius: 0.375rem;
      }

      .dark .value-adjust-button {
        background-color: rgba(75, 85, 99, 0.8);
      }

      .value-adjust-button:hover {
        background-color: rgba(229, 231, 235, 1);
      }

      .dark .value-adjust-button:hover {
        background-color: rgba(107, 114, 128, 1);
      }
    `}</style>
  );

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  // Define control groups for better organization
  const controlGroups = [
    {
      name: "Shape",
      controls: [
        {
          name: "Frequency",
          key: "frequency",
          min: 0.1,
          max: 10,
          step: 0.1,
          format: (val: number) => val.toFixed(1),
        },
        {
          name: "Amplitude",
          key: "amplitude",
          min: 0.01,
          max: 0.5,
          step: 0.01,
          format: (val: number) => val.toFixed(2),
        },
        {
          name: "Complexity",
          key: "complexity",
          min: 1,
          max: 10,
          step: 1,
          format: (val: number) => val.toFixed(0),
        },
        {
          name: "Smoothness",
          key: "smoothness",
          min: 0.1,
          max: 1,
          step: 0.1,
          format: (val: number) => val.toFixed(1),
        },
      ],
    },
    {
      name: "Material",
      controls: [
        {
          name: "Metalness",
          key: "metalness",
          min: 0,
          max: 1,
          step: 0.1,
          format: (val: number) => val.toFixed(1),
        },
        {
          name: "Roughness",
          key: "roughness",
          min: 0,
          max: 1,
          step: 0.1,
          format: (val: number) => val.toFixed(1),
        },
      ],
    },
  ];

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [controlsPanelVisible, setControlsPanelVisible] = useState(true);

  // Helper function to get environment indicator color
  const getEnvironmentColorDot = (environment: string) => {
    switch (environment) {
      case "Midnight Jazz Club":
        return "#66ccff";
      case "Neon Graffiti":
        return "#ff3300";
      case "Forest Cathedral":
        return "#33cc33";
      case "Hidden Disco":
        return "#ff66cc";
      case "Studio":
      default:
        return "#8888ff";
    }
  };

  // Environment settings
  const studioEnvironment = {
    ambientColor: 0xffffff,
    ambientIntensity: 0.5,
    directionalColor: 0xffffff,
    directionalIntensity: 0.8,
    directionalPosition: new THREE.Vector3(1, 1, 1),
    fogColor: 0xffffff,
    fogNear: 1,
    fogFar: 30,
    background: new THREE.Color(0xffffff),
  };

  const midnightJazzClubEnvironment = {
    ambientColor: 0x2c3e50,
    ambientIntensity: 0.3,
    directionalColor: 0x3498db,
    directionalIntensity: 0.7,
    directionalPosition: new THREE.Vector3(1, 2, 0),
    fogColor: 0x2c3e50,
    fogNear: 2,
    fogFar: 15,
    background: new THREE.Color(0x2c3e50),
  };

  const neonGraffitiEnvironment = {
    ambientColor: 0x222222,
    ambientIntensity: 0.2,
    directionalColor: 0xff00ff,
    directionalIntensity: 0.9,
    directionalPosition: new THREE.Vector3(-1, 1, 1),
    fogColor: 0x222222,
    fogNear: 2,
    fogFar: 20,
    background: new THREE.Color(0x222222),
  };

  const forestCathedralEnvironment = {
    ambientColor: 0x4a5568,
    ambientIntensity: 0.4,
    directionalColor: 0xf6e05e,
    directionalIntensity: 0.6,
    directionalPosition: new THREE.Vector3(0, 1, 0.5),
    fogColor: 0x4a5568,
    fogNear: 5,
    fogFar: 25,
    background: new THREE.Color(0x4a5568),
  };

  const hiddenDiscoEnvironment = {
    ambientColor: 0x000000,
    ambientIntensity: 0.1,
    directionalColor: 0xff00ff,
    directionalIntensity: 1.0,
    directionalPosition: new THREE.Vector3(0, -1, 0),
    fogColor: 0x000000,
    fogNear: 1,
    fogFar: 10,
    background: new THREE.Color(0x000000),
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
    if (!sceneRef.current) return;

    if (shapeRef.current) {
      sceneRef.current.remove(shapeRef.current);
    }

    const {
      frequency,
      amplitude,
      complexity,
      smoothness,
      metalness,
      roughness,
    } = config;

    // Create geometry with detail based on complexity
    const geometry = new THREE.SphereGeometry(
      1,
      Math.floor((32 * complexity) / 4),
      Math.floor((16 * complexity) / 4),
    );

    // Store original positions for animation
    const positionAttribute = geometry.getAttribute("position");
    const originalPositions = new Float32Array(positionAttribute.array.length);
    for (let i = 0; i < positionAttribute.array.length; i++) {
      originalPositions[i] = positionAttribute.array[i];
    }

    // Add metadata for animations
    geometry.userData = {
      originalPositions,
      frequency,
      amplitude,
      complexity,
      smoothness,
      lastUpdateTime: performance.now() / 1000,
      animationProgress: 0,
    };

    // Get color based on environment and theme
    const materialColor = getMaterialColor(config.environment, theme);

    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: materialColor,
      metalness: metalness,
      roughness: roughness,
      wireframe: false,
    });

    // Create mesh
    const shape = new THREE.Mesh(geometry, material);
    shapeRef.current = shape;
    sceneRef.current.add(shape);

    updateShape(config, true);
  };

  // Helper function to get material color based on environment and theme
  const getMaterialColor = (environment: string, currentTheme: string) => {
    const isDark = currentTheme === "dark";

    switch (environment) {
      case "Midnight Jazz Club":
        return isDark ? 0x5ab0dd : 0x4499cc;
      case "Neon Graffiti":
        return isDark ? 0xff6644 : 0xff5533;
      case "Forest Cathedral":
        return isDark ? 0x66cc66 : 0x55bb55;
      case "Hidden Disco":
        return isDark ? 0xff88ee : 0xff77dd;
      case "Studio":
      default:
        return isDark ? 0x9999ff : 0x8888ff;
    }
  };

  const updateShape = (config = uiConfig, forceUpdate = false) => {
    if (!shapeRef.current) return;

    const now = performance.now() / 1000;
    const mesh = shapeRef.current;
    const geometry = mesh.geometry;
    const positionAttribute = geometry.getAttribute("position");
    const material = mesh.material as THREE.MeshStandardMaterial;

    // Update material properties immediately
    material.metalness = config.metalness;
    material.roughness = config.roughness;
    material.needsUpdate = true;

    // Get the stored original positions
    const originalPositions = geometry.userData.originalPositions;

    // Only update if it's been a while or forcing an update
    if (forceUpdate || now - geometry.userData.lastUpdateTime > 0.05) {
      // More frequent updates
      geometry.userData.lastUpdateTime = now;

      // Update animation properties
      geometry.userData.frequency = config.frequency;
      geometry.userData.amplitude = config.amplitude;
      geometry.userData.smoothness = config.smoothness;

      // Perform the noise deformation
      for (let i = 0; i < positionAttribute.count; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);
        const noiseValue =
          Math.sin(x * config.frequency + now) *
          Math.cos(y * config.frequency + now) *
          Math.sin(z * config.frequency + now);

        const smoothedNoise =
          noiseValue * config.smoothness + (1 - config.smoothness) * distance;

        const deformation = config.amplitude * smoothedNoise;

        positionAttribute.array[i3] = x * (1 + deformation);
        positionAttribute.array[i3 + 1] = y * (1 + deformation);
        positionAttribute.array[i3 + 2] = z * (1 + deformation);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  };

  const handleControlChange = (key: string, value: number) => {
    // Update the UI config
    setUiConfig((prev) => ({ ...prev, [key]: value }));

    // Apply the change immediately to the shape
    if (shapeRef.current && sceneRef.current) {
      const newConfig = { ...uiConfig, [key]: value };

      // Recreate the shape if complexity changes
      if (
        key === "complexity" &&
        shapeRef.current.geometry.userData.complexity !== value
      ) {
        createShape(newConfig);
      } else {
        // Otherwise just update the existing shape
        updateShape(newConfig, true);
      }
    }
  };

  const updateLighting = (environmentName: string) => {
    if (!sceneRef.current) return;

    // Remove existing lights
    const lightsToRemove = sceneRef.current.children.filter(
      (child) => child instanceof THREE.Light,
    );

    lightsToRemove.forEach((light) => {
      sceneRef.current!.remove(light);
    });

    // Get environment settings
    const env = getEnvironmentSettings(environmentName);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      env.ambientColor,
      env.ambientIntensity,
    );
    sceneRef.current.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(
      env.directionalColor,
      env.directionalIntensity,
    );
    directionalLight.position.copy(env.directionalPosition);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(directionalLight);

    // Add accent lights
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 10);
    pointLight.position.set(-1, 1, -1);
    sceneRef.current.add(pointLight);

    const secondPointLight = new THREE.PointLight(0xffffff, 0.4, 10);
    secondPointLight.position.set(1, -1, 1);
    sceneRef.current.add(secondPointLight);

    // Update material color based on environment and theme
    if (shapeRef.current) {
      const material = shapeRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(getMaterialColor(environmentName, theme));
    }
  };

  const animate = () => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !controlsRef.current
    ) {
      return;
    }

    // Request next frame first to ensure smooth animation
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Update shape deformation
    updateShape();

    // Update controls
    controlsRef.current.update();

    // Render the scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (
      !mouseRef.current ||
      !raycasterRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;

    // Update mouse position for raycaster
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // If dragging, update shape
    if (
      isDraggingRef.current &&
      shapeRef.current &&
      dragStartPointRef.current &&
      dragStartShapeRef.current
    ) {
      // Implement drag behavior here if needed
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    // Implement mouse down behavior here if needed
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    // Reset dragging state
    isDraggingRef.current = false;
  };

  const handleTouchStart = (event: TouchEvent) => {
    // Convert touch to mouse-like event
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      handleMouseDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    // Convert touch to mouse-like event
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const setupScene = () => {
    if (!canvasRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      dimensions.width / dimensions.height,
      0.1,
      1000,
    );
    cameraRef.current = camera;
    camera.position.z = isMobile ? 4.5 : 3;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set renderer clear color based on current theme
    renderer.setClearColor(theme === "dark" ? 0x111111 : 0xffffff, 0);

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create raycaster for interaction
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;
    const mouse = new THREE.Vector2();
    mouseRef.current = mouse;

    // Create a cursor indicator
    const cursorGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursorRef.current = cursor;
    cursor.visible = false; // Hide by default
    scene.add(cursor);

    // Create clock for animations
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Set background to transparent
    scene.background = null;

    // Create initial shape
    createShape();

    // Set up lighting
    updateLighting(uiConfig.environment);

    // Add event listeners
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Start animation loop
    animate();
  };

  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    // Update dimensions
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setDimensions(newDimensions);

    // Update camera
    cameraRef.current.aspect = newDimensions.width / newDimensions.height;
    cameraRef.current.updateProjectionMatrix();

    // Update renderer
    rendererRef.current.setSize(newDimensions.width, newDimensions.height);
  };

  // Toggle gallery mode
  const toggleGalleryMode = () => {
    setUiConfig((prev) => ({ ...prev, galleryMode: !prev.galleryMode }));
  };

  // Toggle controls panel
  const toggleControlsPanel = () => {
    setControlsPanelVisible((prev) => !prev);
  };

  // Handle environment change
  const handleEnvironmentChange = (newEnvironment: string) => {
    if (!sceneRef.current) return;

    setUiConfig((prev) => ({ ...prev, environment: newEnvironment }));
    updateLighting(newEnvironment);
  };

  // Theme management
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update DOM
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save preference
    localStorage.setItem("theme", newTheme);

    // Update renderer if initialized
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.setClearColor(
        newTheme === "dark" ? 0x111111 : 0xffffff,
        0,
      );
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // Update material color based on new theme
    if (shapeRef.current) {
      const material = shapeRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(getMaterialColor(uiConfig.environment, newTheme));
      material.needsUpdate = true;
    }
  };

  // Add ThemeToggle component
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-3 bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-full shadow-lg transition-colors duration-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );

  // Check mobile status
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

  // Initialize Three.js scene
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

  // Handle gallery mode overflow
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

  // Break down dependency tracking for better performance
  useEffect(() => {
    if (shapeRef.current && sceneRef.current) {
      // Force update on complexity change
      createShape();
    }
  }, [uiConfig.complexity]);

  // Update shape for other parameter changes
  useEffect(() => {
    if (shapeRef.current && sceneRef.current) {
      updateShape(uiConfig, true);
    }
  }, [uiConfig.frequency, uiConfig.amplitude, uiConfig.smoothness]);

  // Update material properties
  useEffect(() => {
    if (shapeRef.current) {
      const material = shapeRef.current.material as THREE.MeshStandardMaterial;
      material.metalness = uiConfig.metalness;
      material.roughness = uiConfig.roughness;
      material.needsUpdate = true;
    }
  }, [uiConfig.metalness, uiConfig.roughness]);

  // Apply theme change to Three.js elements
  useEffect(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.setClearColor(
        theme === "dark" ? 0x111111 : 0xffffff,
        0,
      );

      // Update material color based on theme
      if (shapeRef.current) {
        const material = shapeRef.current
          .material as THREE.MeshStandardMaterial;
        material.color.set(getMaterialColor(uiConfig.environment, theme));
        material.needsUpdate = true;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [theme]);

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 ${
        uiConfig.galleryMode ? "overflow-hidden" : ""
      }`}
    >
      {/* Include our custom styles */}
      <StyleSection />

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
        <>
          <div className="md:hidden absolute top-4 right-4 z-50 flex space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleControlsPanel}
              className="p-3 bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-full shadow-lg"
            >
              {controlsPanelVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 018 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden md:block absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <div
            className={`absolute top-0 left-0 w-full h-screen flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 transition-transform duration-300 ${
              !controlsPanelVisible &&
              "transform -translate-y-full md:translate-y-0 md:-translate-x-full"
            }`}
          >
            <div className="w-full md:w-80 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 md:bg-opacity-80 md:dark:bg-opacity-80 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-30 flex flex-col gap-6 max-h-[80vh] md:max-h-none overflow-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Sculpture Controls</h2>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden mr-2">
                    Swipe for more
                  </span>
                  <button
                    onClick={toggleControlsPanel}
                    className="md:hidden p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Environment selector card */}
              <div className="control-card">
                <h3 className="text-md font-semibold mb-3">Environment</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Studio",
                    "Midnight Jazz Club",
                    "Neon Graffiti",
                    "Forest Cathedral",
                    "Hidden Disco",
                  ].map((env) => (
                    <button
                      key={env}
                      onClick={() => handleEnvironmentChange(env)}
                      className={`env-button ${uiConfig.environment === env ? "env-button-active" : ""}`}
                    >
                      <div
                        style={{
                          backgroundColor: getEnvironmentColorDot(env),
                          width: "0.75rem",
                          height: "0.75rem",
                          borderRadius: "50%",
                          marginRight: "0.5rem",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      ></div>
                      <span>{env}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control groups */}
              {controlGroups.map((group) => (
                <div key={group.name} className="control-card">
                  <h3 className="text-md font-semibold mb-3">
                    {group.name} Controls
                  </h3>
                  <div className="space-y-4">
                    {group.controls.map((control) => (
                      <div key={control.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">
                            {control.name}
                          </label>
                          <span className="control-value">
                            {control.format(
                              uiConfig[
                                control.key as keyof typeof uiConfig
                              ] as number,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              const newValue = Math.max(
                                control.min,
                                (uiConfig[
                                  control.key as keyof typeof uiConfig
                                ] as number) - control.step,
                              );
                              handleControlChange(control.key, newValue);
                            }}
                            className="value-adjust-button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={
                              uiConfig[
                                control.key as keyof typeof uiConfig
                              ] as number
                            }
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              handleControlChange(control.key, value);
                            }}
                            className="flex-grow mx-2"
                          />
                          <button
                            onClick={() => {
                              const newValue = Math.min(
                                control.max,
                                (uiConfig[
                                  control.key as keyof typeof uiConfig
                                ] as number) + control.step,
                              );
                              handleControlChange(control.key, newValue);
                            }}
                            className="value-adjust-button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={toggleGalleryMode}
                  className="primary-button primary-button-gradient"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Enter Gallery Mode
                </button>

                <button
                  onClick={() => {
                    // Reset to default values and immediately apply
                    const defaultValues = {
                      frequency: 3.0,
                      amplitude: 0.2,
                      complexity: 4.0,
                      smoothness: 0.7,
                      metalness: 0.5,
                      roughness: 0.5,
                    };

                    setUiConfig((prev) => ({
                      ...prev,
                      ...defaultValues,
                    }));

                    // Force recreate the shape with default values
                    if (shapeRef.current && sceneRef.current) {
                      createShape({
                        ...uiConfig,
                        ...defaultValues,
                      });
                    }
                  }}
                  className="secondary-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset to Defaults
                </button>
              </div>
            </div>

            <div className="flex-1"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicSculptureGenerator;
