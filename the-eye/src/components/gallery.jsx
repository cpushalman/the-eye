import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import "./gallery.css";

const SPHERE_RADIUS = 5;
const IMAGE_WIDTH = 2;
const IMAGE_HEIGHT = 1.5;
const IMAGE_REPEAT = 2;
const AUTO_ROTATE = true;
const AUTO_ROTATE_SPEED = 1.0;
const CURVE_AMOUNT = 0.25;

function getRandomImageIndices(totalImages, count) {
  const indices = [];
  const available = Array.from({ length: totalImages }, (_, i) => i);
  
  while (indices.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedIndex = available.splice(randomIndex, 1)[0];
    indices.push(selectedIndex);
  }
  
  return indices;
}

function CurvedImagePlane({ index, totalImages, imagePath, onSelectImage }) {
  const meshRef = useRef();
  const segmentsX = 12;
  const segmentsY = 4; 
  
  const {centerPosition } = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / totalImages);
    const theta = Math.sqrt(totalImages * Math.PI) * phi;
    
    const centerPosition = [
      SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi),
      SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi),
      SPHERE_RADIUS * Math.cos(phi)
    ];
    
    return { phi, theta, centerPosition };
  }, [index, totalImages]);
  
  const texture = useTexture(imagePath);
  
  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      
      const imageRatio = texture.image?.width / texture.image?.height || 1;
      const planeRatio = IMAGE_WIDTH / IMAGE_HEIGHT;
      
      if (imageRatio > planeRatio) {
        const scale = planeRatio / imageRatio;
        texture.repeat.set(scale, 1);
        texture.offset.set((1 - scale) / 2, 0);
      } else {
        const scale = imageRatio / planeRatio;
        texture.repeat.set(1, scale);
        texture.offset.set(0, (1 - scale) / 2);
      }
      
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4; 
    }
  }, [texture]);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(IMAGE_WIDTH, IMAGE_HEIGHT, segmentsX, segmentsY);
    const positionAttribute = geo.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      const distanceFromCenter = Math.sqrt(x * x + y * y);
      const curveFactor = distanceFromCenter * CURVE_AMOUNT;
      
      const offsetZ = -curveFactor * curveFactor;
      
      positionAttribute.setZ(i, offsetZ);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);
  
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.rotateY(Math.PI);
      
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.05, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.05, 0.1);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={centerPosition}
      onClick={(e) => { e.stopPropagation(); onSelectImage(imagePath); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        map={texture} 
        side={THREE.DoubleSide}
        shadowSide={THREE.FrontSide}
        toneMapped={false}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
}

function GlobeGallery({ onSelectImage, images }) {
  const totalItems = Math.floor(images.length * IMAGE_REPEAT);
  
  const allImages = [];
  const fullRepeat = Math.floor(IMAGE_REPEAT);
  const partialLength = Math.floor((IMAGE_REPEAT % 1) * images.length);

  for (let i = 0; i < fullRepeat; i++) {
    allImages.push(...images);
  }
  
  allImages.push(...images.slice(0, partialLength));
  const displayImages = allImages.slice(0, totalItems);
  
  return (
    <>
      <ambientLight intensity={1 } />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.5} 
        color="#aaa"
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <Stars 
        radius={30}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
        renderOrder={-900}
      />
      
      {/* Inner shadow-receiving sphere */}
      <mesh receiveShadow>
        <sphereGeometry args={[SPHERE_RADIUS - 0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#333" 
          transparent 
          opacity={0.3}
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>
      
      {/* Shadow-casting outer wireframe sphere */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS + 0.05, 32, 32]} />
        <meshBasicMaterial 
          color="#444"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      
      <group>
        {displayImages.map((imagePath, index) => (
          <CurvedImagePlane
            key={index}
            index={index}
            totalImages={totalItems}
            imagePath={imagePath}
            onSelectImage={onSelectImage}
          />
        ))}
      </group>
      
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={1.2}
        enableZoom={false}
        enablePan={false}
        autoRotate={AUTO_ROTATE}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
      />
    </>
  );
}

export default function Gallery() {
  const galleryRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayedImages, setDisplayedImages] = useState([]);
  
  const allImages = React.useMemo(() => [
    '/img_1.jpg',
    '/img_2.jpg',
    '/img_3.jpg',
    '/img_4.jpg',
    '/img_5.jpg',
  ], []);
  
  // Choose random images to display - optimized to run only once
  useEffect(() => {
    const displayCount = Math.min(5, allImages.length);
    const randomIndices = getRandomImageIndices(allImages.length, displayCount);
    const selectedImages = randomIndices.map(index => allImages[index]);
    setDisplayedImages(selectedImages);
  }, [allImages]);
  
  
  const handleSelectImage = (imagePath) => {
    setSelectedImage(imagePath);
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.classList.add('active');
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.classList.remove('active');
  };
  
  return (
    <div className="gallery" ref={galleryRef} style={{ height: '130vh' }}>
      <h1>Gallery</h1>
      <Canvas 
        ref={canvasRef}
        style={{ 
          width: '100%',
          height: '90vh',
          marginBlock:''
        }}
        camera={{ 
          position: [10, 4, 9.5],  fov: 75,
          near: 0.1, far: 1000
        }}
        shadows={{
          enabled: true,
          type: THREE.PCFShadowMap,
          autoUpdate: false,
          needsUpdate: true 
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)} 
        frameloop="demand" 
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          precision: "mediump",
          depth: true,
          stencil: false
        }}
      >
        <GlobeGallery 
          onSelectImage={handleSelectImage}
          images={displayedImages.length > 0 ? displayedImages : allImages.slice(0, 5)}
        />
      </Canvas>
      
      {selectedImage && (
        <div className="gallery-overlay active" id="gallery-overlay" onClick={handleCloseModal}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Gallery" className="gallery-modal-image" />
            <button className="gallery-modal-close" onClick={handleCloseModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}