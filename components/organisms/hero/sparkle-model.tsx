"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function createStarShape(innerRadius = 0.4, outerRadius = 1.0, points = 5) {
  const shape = new THREE.Shape();
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i <= points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * angleStep) / 2;
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  return shape;
}

export function SparkleModel({
  position,
  rotationOffset = 0,
  mousePosition = { x: 0, y: 0 },
  scrollPosition = 0,
  scale = 0.4,
}: {
  position: [number, number, number];
  rotationOffset: number;
  mousePosition: { x: number; y: number };
  scrollPosition: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const starShape = createStarShape();
  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  // Create a denser star field pattern
  const starPositions = [
    [0, 0, 0], // Center
    ...Array(50)
      .fill(0)
      .map(() => [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.5,
      ]),
  ];

  useFrame((state) => {
    if (!meshRef.current) return;

    // Idle floating animation with unique patterns for each star
    const time = state.clock.elapsedTime;
    const idleSpeed = 0.5 + rotationOffset * 0.1; // Different speed for each star

    // Smooth floating motion
    const verticalFloat = Math.sin(time * idleSpeed) * 0.1;
    const horizontalFloat = Math.cos(time * idleSpeed * 0.5) * 0.05;

    // Base position with floating
    meshRef.current.position.y = position[1] + verticalFloat;
    meshRef.current.position.x = position[0] + horizontalFloat;

    // Scroll-based rotation (more pronounced)
    const scrollRotation = (scrollPosition / 500) * (1 + rotationOffset * 0.2);

    // Mouse effect (now using x position for horizontal rotation)
    const mouseEffect = mousePosition.x * 0.3 * (1 + rotationOffset * 0.05);

    // Apply rotation to Y axis for left-right rotation
    meshRef.current.rotation.y = scrollRotation + mouseEffect;

    // Keep X and Z rotation fixed
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.z = 0;
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Main star shape */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Bright particles */}
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(starPositions.flat()), 3]}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffffff"
          toneMapped={false}
        />
      </Points>
    </group>
  );
}
