import React, { useRef, useEffect, useState, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import { useFrame } from '@react-three/fiber';
import { useCylinder, useBox, usePointToPointConstraint } from '@react-three/cannon';

const lerp = (start, end, t) => start + (end - start) * t;

const Petals = forwardRef(({ flower, topPoint, nextStage, stageDurations }, ref) => {
  const transitionProgressRef = useRef(0);
  const elapsedTimeRef = useRef(0);
  const targetDuration = stageDurations;
  const [currentFlower, setCurrentFlower] = useState(flower);
  const [startFlower, setStartFlower] = useState(flower);
  const [attachPoint, setAttachPoint] = useState();

  const petalsRef = useRef();
  const noise = useMemo(() => new Noise(123456), []);

  useEffect(() => {
    if (nextStage) {
      setStartFlower(currentFlower);
      transitionProgressRef.current = 0;
      elapsedTimeRef.current = 0;
    }
  }, [nextStage, currentFlower]);

  useFrame((state, delta) => {
    if (petalsRef.current) {
      setAttachPoint([...topPoint]);

      if (nextStage && transitionProgressRef.current < 1) {
        elapsedTimeRef.current += delta * 1000;
        transitionProgressRef.current = Math.min(elapsedTimeRef.current / targetDuration, 1);

        const interpolatedFlower = {
          ...currentFlower,
          noiseScale: lerp(startFlower.noiseScale, nextStage.noiseScale, transitionProgressRef.current),
          noiseImpactX: lerp(startFlower.noiseImpactX, nextStage.noiseImpactX, transitionProgressRef.current),
          noiseImpactY: lerp(startFlower.noiseImpactY, nextStage.noiseImpactY, transitionProgressRef.current),
          noiseImpactZ: lerp(startFlower.noiseImpactZ, nextStage.noiseImpactZ, transitionProgressRef.current),
          radiusTop: lerp(startFlower.radiusTop, nextStage.radiusTop, transitionProgressRef.current),
          radiusBottom: lerp(startFlower.radiusBottom, nextStage.radiusBottom, transitionProgressRef.current),
          height: lerp(startFlower.height, nextStage.height, transitionProgressRef.current),
          radialSegments: lerp(startFlower.radialSegments, nextStage.radialSegments, transitionProgressRef.current),
          bloomColor: nextStage.bloomColor,
        };
        setCurrentFlower(interpolatedFlower);

        const cylinderGeometry = new THREE.CylinderGeometry(
          interpolatedFlower.radiusTop,
          interpolatedFlower.radiusBottom,
          interpolatedFlower.height,
          interpolatedFlower.radialSegments
        );

        const positions = cylinderGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const displacementX = noise.perlin3(x * interpolatedFlower.noiseScale, y * interpolatedFlower.noiseScale, z * interpolatedFlower.noiseScale) * interpolatedFlower.noiseImpactX;
          const displacementY = noise.perlin3(x * interpolatedFlower.noiseScale, y * interpolatedFlower.noiseScale, z * interpolatedFlower.noiseScale) * interpolatedFlower.noiseImpactY;
          const displacementZ = noise.perlin3(x * interpolatedFlower.noiseScale, y * interpolatedFlower.noiseScale, z * interpolatedFlower.noiseScale) * interpolatedFlower.noiseImpactZ;

          positions[i] += displacementX;
          positions[i + 1] += displacementY;
          positions[i + 2] += displacementZ;
        }

        cylinderGeometry.attributes.position.needsUpdate = true;

        if (petalsRef.current) {
          petalsRef.current.geometry.dispose();
          petalsRef.current.geometry = cylinderGeometry;
          petalsRef.current.position.set(...topPoint);
        }
      }
    }
  });

  useEffect(() => {
    const cylinderGeometry = new THREE.CylinderGeometry(flower.radiusTop, flower.radiusBottom, flower.height, flower.radialSegments);

    const positions = cylinderGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const displacementX = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactX;
      const displacementY = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactY;
      const displacementZ = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactZ;

      positions[i] += displacementX;
      positions[i + 1] += displacementY;
      positions[i + 2] += displacementZ;
    }

    cylinderGeometry.attributes.position.needsUpdate = true;

    if (petalsRef.current) {
      petalsRef.current.geometry.dispose();
      petalsRef.current.geometry = cylinderGeometry;
    }
  }, [flower, noise]);

  const [petals, petalApi] = useCylinder(() => ({
    args: [flower.radiusTop, flower.radiusTop, flower.height, 100],
    mass: 1,
    restitution: 0,
    type: 'Dynamic',
    position: [0, 50, 0],
  }), []);

  const [collider, colliderApi] = useBox(() => ({
    args: [1, 1, 1],
    mass: 1,
    position: [topPoint[0], topPoint[1], topPoint[2]],
    type: 'Static',
  }), []);

  usePointToPointConstraint(petalApi, colliderApi, {
    pivotA: [0, 0, 0],
    pivotB: [0, 0, 0],
  });

  useEffect(() => {
    if (attachPoint) {
      petalApi.position.set(...topPoint);
      colliderApi.position.set(topPoint[0], topPoint[1], topPoint[2]);
    }
  }, [attachPoint, topPoint, petalApi, colliderApi]);

  return (
    <group>
      <mesh ref={petals}>
        <meshLambertMaterial color={'blue'} />
      </mesh>
    </group>
  );
});

export default Petals;
