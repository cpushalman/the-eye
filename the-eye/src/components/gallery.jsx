

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import "./gallery.css";
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gallery.css';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 6;
const HEIGHT = 20;
const SEGMENTS = 30;
const NUM_VERTICAL_SECTIONS = 12;
const BLOCKS_PER_SECTION = 4;
const VERTICAL_SPACING = 3.25;
const BASE_ROTATION_SPEED = 0.001;

const getRandomImage = () => Math.floor(Math.random() * 3) + 1;

const createCurvedPlane = (width, height, radius, segments) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const uvs = [];

  const segmentsX = segments * 4;
  const segmentsY = Math.floor(height * 12);
  const theta = width / radius;

  for (let y = 0; y <= segmentsY; y++) {
    const ypos = (y / segmentsY - 0.5) * height;
    for (let x = 0; x <= segmentsX; x++) {
      const xAngle = (x / segmentsX - 0.5) * theta;
      const xPos = Math.sin(xAngle) * radius;
      const zPos = Math.cos(xAngle) * radius;
      vertices.push(xPos, ypos, zPos);
      
      uvs.push((x / segmentsX) * 0.8 + 0.1, y / segmentsY);
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

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

function Block({ baseY, yOffset, blockIndex, onSelectImage }) {
  const meshRef = useRef();
  const geometry = useMemo(() => createCurvedPlane(5, 3, RADIUS, 10), []);
  const imageNumber = useMemo(() => getRandomImage(), []);
  
  const [imagePath, setImagePath] = useState(`/src/assets/img_${imageNumber}.jpg`);
  const texture = useTexture(imagePath, (texture) => {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
  });

  const sectionAngle = (Math.PI * 2) / BLOCKS_PER_SECTION;
  const maxRandomAngle = sectionAngle * 0.3;
  const baseAngle = sectionAngle * blockIndex;
  const randomAngleOffset = useMemo(() => (Math.random() * 2 - 1) * maxRandomAngle, []);
  const finalAngle = baseAngle + randomAngleOffset;
  
  const handleClick = (event) => {
    event.stopPropagation();
    onSelectImage(imagePath);
  };
  
  return (
    <group rotation={[0, finalAngle, 0]}>
      <mesh 
        ref={meshRef}
        position={[0, baseY + yOffset, 0]} 
        geometry={geometry}
        onClick={handleClick}
      >
        <meshPhongMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GalleryScene({ onSelectImage }) {
  const galleryGroup = useRef();
  const [blocks, setBlocks] = useState([]);
  const { camera } = useThree();
  const rotatingSpeed = useRef(0);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  
  useEffect(() => {
    camera.position.z = 12;
    camera.position.y = 0;
    
    const totalBlockHeight = NUM_VERTICAL_SECTIONS * VERTICAL_SPACING;
    const heightBuffer = (HEIGHT - totalBlockHeight) / 2;
    const startY = -HEIGHT / 2 + heightBuffer + VERTICAL_SPACING;
    
    const newBlocks = [];
    for (let section = 0; section < NUM_VERTICAL_SECTIONS; section++) {
      const baseY = startY + section * VERTICAL_SPACING;
      for (let i = 0; i < BLOCKS_PER_SECTION; i++) {
        const yOffset = Math.random() * 0.2 - 0.1;
        newBlocks.push({
          id: `${section}-${i}`,
          baseY,
          yOffset,
          blockIndex: i
        });
      }
    }
    setBlocks(newBlocks);
  }, [camera]);
  
  useFrame(() => {
    const galleryElement = document.querySelector('.gallery');
    if (!galleryElement) return;
    
    const rect = galleryElement.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      const galleryTop = rect.top + window.scrollY;
      const galleryHeight = rect.height;
      const scrollPosition = window.scrollY - galleryTop;
      const scrollFraction = Math.max(0, Math.min(1, scrollPosition / (galleryHeight - window.innerHeight)));
      
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScrollY.current;
      scrollVelocity.current = scrollDelta * 0.005;
      lastScrollY.current = currentScroll;
      
      rotatingSpeed.current = THREE.MathUtils.lerp(
        rotatingSpeed.current,
        scrollVelocity.current,
        0.05
      );

      const targetY = scrollFraction * HEIGHT - HEIGHT / 2;
      camera.position.y = -targetY;
      
      if (galleryGroup.current) {
        // Always rotate (even when image is selected)
        galleryGroup.current.rotation.y += BASE_ROTATION_SPEED + Math.abs(rotatingSpeed.current) * 0.8;
        galleryGroup.current.rotation.y += Math.sin(scrollFraction * Math.PI) * 0.002;
      }
    }
  });
  
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <group ref={galleryGroup}>
        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, SEGMENTS, 1, true]} />
          <meshPhongMaterial color={0xffffff} transparent={true} opacity={0} side={THREE.DoubleSide} />
        </mesh>
        
        {blocks.map((block) => (
          <Block 
            key={block.id} 
            blockId={block.id}
            baseY={block.baseY} 
            yOffset={block.yOffset} 
            blockIndex={block.blockIndex}
            onSelectImage={onSelectImage}
          />
        ))}
      </group>
    </>
  );
}


export default function Gallery() {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    if (!galleryRef.current) return;
    
    const lenis = new Lenis({
      wrapper: window,
      content: document.documentElement, 
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothWheel: true,
      smoothTouch: false
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: galleryRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    });
    
    return () => {
      lenis.destroy();
      scrollTrigger.kill();
    };
  }, []);
  
  const handleSelectImage = (imagePath) => {
    setSelectedImage(imagePath);
    // Show the overlay by adding active class
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.classList.add('active');
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
    // Hide the overlay by removing active class
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.classList.remove('active');
  };
  
  return (
    <div className="gallery" ref={galleryRef} style={{ height: '200vh', background: '#0e0e0e' }}>
      <h1>Gallery</h1>
      <Canvas 
        style={{ 
          top: 0,
          left: 0,
          width: '55%',
          marginInline: 'auto',
          height: '100%'
        }}
        camera={{ position: [0, 0, 25], fov: 75 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene onSelectImage={handleSelectImage} />
      </Canvas>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="gallery-overlay active" 
          id="gallery-overlay"
          onClick={handleCloseModal}
        >
          <div 
            className="gallery-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Gallery" 
              className="gallery-modal-image" 
            />
            <button 
              className="gallery-modal-close"
              onClick={handleCloseModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );

}