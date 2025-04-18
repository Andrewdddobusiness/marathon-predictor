"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { StravaActivity } from "@/lib/strava";

interface RunnerAvatarProps {
  className?: string;
  activities?: StravaActivity[];
}

export default function RunnerAvatar({ className }: RunnerAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    // Position camera directly to the side
    camera.position.set(3, 1, 0);
    camera.lookAt(0, 0.8, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.bias = 0.0001;
    dirLight.intensity = 0.8;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

    // // Create a textureLoader for loading road textures
    // const textureLoader = new THREE.TextureLoader();

    // // Create road surface instead of plain ground
    // const roadWidth = 6;
    // const roadLength = 20;

    // // Road base (asphalt)
    // const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    // const roadMaterial = new THREE.MeshStandardMaterial({
    //   color: 0x333333, // Dark gray for asphalt
    //   roughness: 0.8,
    //   metalness: 0.1,
    // });
    // const road = new THREE.Mesh(roadGeometry, roadMaterial);
    // road.rotation.x = -Math.PI / 2;
    // road.position.y = 0;
    // road.receiveShadow = true;
    // scene.add(road);

    // // Create road markings (center line)
    // const lineGeometry = new THREE.PlaneGeometry(0.15, roadLength);
    // const lineMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xffffff,
    //   roughness: 0.5,
    //   emissive: 0xffffff,
    //   emissiveIntensity: 0.2,
    // });
    // const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
    // centerLine.rotation.x = -Math.PI / 2;
    // centerLine.position.y = 0.01; // Slightly above the road to prevent z-fighting
    // centerLine.receiveShadow = false;
    // scene.add(centerLine);

    // Create a textureLoader for loading grass textures
    // const textureLoader = new THREE.TextureLoader();

    // // Create grass ground
    // const groundGeometry = new THREE.PlaneGeometry(20, 20);

    // // Create procedural grass material
    // const grassMaterial = new THREE.MeshStandardMaterial({
    //   color: 0x4caf50, // Medium green
    //   roughness: 0.9, // Grass has high roughness
    //   metalness: 0.0, // No metalness for grass
    // });

    // // Create the grass ground
    // const grass = new THREE.Mesh(groundGeometry, grassMaterial);
    // grass.rotation.x = -Math.PI / 2;
    // grass.position.y = 0;
    // grass.receiveShadow = true;
    // scene.add(grass);

    // // Add grass detail with small random green lines (optional - for more visual interest)
    // const grassDetailGroup = new THREE.Group();

    // // Only add a reasonable number of grass blades for performance
    // const bladeCount = 200;
    // const maxRadius = 8; // How far from center grass blades can appear

    // for (let i = 0; i < bladeCount; i++) {
    //   // Random position within the visible area
    //   const x = (Math.random() - 0.5) * maxRadius;
    //   const z = (Math.random() - 0.5) * maxRadius;

    //   // Skip grass blades in the immediate path of the runner
    //   if (Math.abs(x) < 0.5) continue;

    //   // Random height between 0.05 and 0.15
    //   const height = 0.05 + Math.random() * 0.1;

    //   // Random blade width
    //   const width = 0.02 + Math.random() * 0.03;

    //   // Create blade geometry
    //   const bladeGeometry = new THREE.PlaneGeometry(width, height);

    //   // Vary the grass color slightly for realism
    //   const hue = 0.33 + (Math.random() - 0.5) * 0.05; // Green hue with variation
    //   const saturation = 0.6 + Math.random() * 0.4; // Medium to high saturation
    //   const lightness = 0.3 + Math.random() * 0.3; // Vary lightness

    //   const bladeColor = new THREE.Color().setHSL(hue, saturation, lightness);

    //   const bladeMaterial = new THREE.MeshStandardMaterial({
    //     color: bladeColor,
    //     side: THREE.DoubleSide,
    //     roughness: 0.8,
    //   });

    //   const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);

    //   // Position at ground level
    //   blade.position.set(x, height / 2, z);

    //   // Random rotation for variety
    //   blade.rotation.y = Math.random() * Math.PI;

    //   // Slight bend to the grass blade
    //   blade.rotation.x = Math.random() * 0.2;

    //   grassDetailGroup.add(blade);
    // }

    // scene.add(grassDetailGroup);

    // Controls - but disable them for fixed side view
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;

    // Disable controls for fixed side view
    controls.enabled = false;

    // Load the model
    const loader = new GLTFLoader();
    loader.load(
      "/models/Xbot.glb",
      (gltf) => {
        const model = gltf.scene;

        // Make the model run along the Z-axis (for side view from X-axis)
        model.rotation.y = 3; // Face forward (Z-axis)

        // Enable shadows
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        // Add model to scene
        scene.add(model);

        // Setup animation
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;

        // Find and play the 'run' animation
        const runClip = THREE.AnimationClip.findByName(gltf.animations, "run");
        if (runClip) {
          const action = mixer.clipAction(runClip);
          action.play();
        }

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y = 0;

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setError("Failed to load 3D model");
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-[500px] rounded-xl overflow-hidden ${className || ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="text-gray-600">Loading avatar...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="text-red-600">{error}</div>
        </div>
      )}
    </div>
  );
}
