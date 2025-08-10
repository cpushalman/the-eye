import React, { useEffect } from "react";
import "./gallery.css";
import * as THREE from "three";

export default function Gallery() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.querySelector(".gallery").appendChild(renderer.domElement);
    camera.position.z = 12;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);
    const radius = 6;
    const height = 30;
    const segments = 30;

    const cylinderGeometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      segments,
      1,
      true
    );
    const cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    galleryGroup.add(cylinder);

    const textureLoader = new THREE.TextureLoader();
    let sharedTexture = null;
    let sharedGeometry = null;

    // Load texture once and reuse
    async function loadImageTexture() {
      if (sharedTexture) return sharedTexture;

      return new Promise((resolve, reject) => {
        const texture = textureLoader.load(
          `/src/assets/bg2.jpg`,
          (loadedTexture) => {
            loadedTexture.generateMipmaps = true;
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.RepeatWrapping;
            loadedTexture.anisotropy = Math.min(
              4,
              renderer.capabilities.getMaxAnisotropy()
            );
            sharedTexture = loadedTexture;
            resolve(loadedTexture);
          },
          undefined,
          (error) => {
            console.error(`Failed to load texture: bg2.jpg`, error);
            reject(error);
          }
        );
      });
    }

    function createCurvedPlane(width, height, radius, segments) {
      if (sharedGeometry) return sharedGeometry.clone();

      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const indices = [];
      const uvs = [];

      // Optimized segments for better performance
      const segmentsX = 16;
      const segmentsY = 12;
      const theta = width / radius;

      for (let y = 0; y <= segmentsY; y++) {
        const yPos = (y / segmentsY - 0.5) * height;
        for (let x = 0; x <= segmentsX; x++) {
          const xAngle = (x / segmentsX - 0.5) * theta;
          const xPos = Math.sin(xAngle) * radius;
          const zPos = Math.cos(xAngle) * radius;
          vertices.push(xPos, yPos, zPos);
          // Better UV mapping for clearer images
          uvs.push(x / segmentsX, 1 - y / segmentsY);
        }
      }

      for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
          const a = x + (segmentsX + 1) * y;
          const b = x + (segmentsX + 1) * (y + 1);
          const c = x + 1 + (segmentsX + 1) * (y + 1);
          const d = x + 1 + (segmentsX + 1) * y;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      sharedGeometry = geometry;
      return geometry;
    }

    const numVerticalSections = 12;
    const blocksPerSection = 4;
    const verticalSpacing = 3.25;
    const blocks = [];

    const totalBlockHeight = numVerticalSections * verticalSpacing;
    const heightBuffer = (height - totalBlockHeight) / 2;
    const startY = -height / 2 + heightBuffer + verticalSpacing;

    const sectionAngle = (Math.PI * 2) / blocksPerSection;
    const maxRandomAngle = sectionAngle * 0.3;

    async function createBlock(baseY, yOffset, sectionIndex, blockIndex) {
      const blockGeometry = createCurvedPlane(5, 3, radius, 10);
      const texture = await loadImageTexture();

      const blockMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide, // Only render front side for better performance
        transparent: false,
      });

      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.y = baseY + yOffset;

      // Optimize by setting frustum culling
      block.frustumCulled = true;

      const blockContainer = new THREE.Group();
      const baseAngle = sectionAngle * blockIndex;
      const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
      const finalAngle = baseAngle + randomAngleOffset;
      blockContainer.rotation.y = finalAngle;
      blockContainer.add(block);

      return blockContainer;
    }
    // Scroll and rotation variables
    let currentScroll = 0;
    let totalScroll = document.body.scrollHeight - window.innerHeight;
    let baseRotationSpeed = 0.005;
    let rotationSpeed = 0;

    // Update scroll values on window resize
    function updateScrollValues() {
      totalScroll = document.body.scrollHeight - window.innerHeight;
    }

    // Handle scroll events
    function handleScroll() {
      currentScroll = window.pageYOffset;
      rotationSpeed += 0.02;
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollValues);

    async function initializeBlock() {
      for (let section = 0; section < numVerticalSections; section++) {
        const baseY = startY + section * verticalSpacing;
        for (let i = 0; i < blocksPerSection; i++) {
          const yOffset = Math.random() * 0.2 - 0.1;
          const blockContainer = await createBlock(baseY, yOffset, section, i);
          blocks.push(blockContainer);
          galleryGroup.add(blockContainer);
        }
      }
    }

    // Optimized animation with reduced rotation frequency
    let isAnimating = true;

    function animate() {
      if (!isAnimating) return;

      requestAnimationFrame(animate);

      const scrollFraction = totalScroll > 0 ? currentScroll / totalScroll : 0;
      const targetY = scrollFraction * height - height / 2;
      camera.position.y = -targetY;

      // Reduce rotation frequency for better performance
      galleryGroup.rotation.y += baseRotationSpeed + rotationSpeed * 0.1;
      rotationSpeed *= 0.98;

      renderer.render(scene, camera);
    }

    initializeBlock();
    animate();

    // Cleanup function
    return () => {
      isAnimating = false;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollValues);

      // Proper cleanup
      blocks.forEach((block) => {
        if (block.children[0]) {
          block.children[0].geometry.dispose();
          block.children[0].material.dispose();
        }
      });

      if (sharedTexture) {
        sharedTexture.dispose();
      }

      if (sharedGeometry) {
        sharedGeometry.dispose();
      }

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  return <div className="gallery"></div>;
}
