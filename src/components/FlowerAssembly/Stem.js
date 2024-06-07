import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useSphere, useCylinder, useBox, usePointToPointConstraint, useLockConstraint, useDistanceConstraint, useSpring, useConeTwistConstraint } from '@react-three/cannon';
import { Noise } from 'noisejs';
import {MeshWobbleMaterial} from '@react-three/drei'

const lerp = (start, end, t) => start + (end - start) * t;

const interpolatePath = (startPath, endPath, t) => {
  const interpolatedPathArray = [];
  for (let i = 0; i < startPath.length; i++) {
    interpolatedPathArray.push(lerp(startPath[i], endPath[i], t));
  }
  return interpolatedPathArray;
};

const Stem = ({ stage, flower, nextStage, stageDurations }) => {

  const springRestLength = 1;
  const springStiffness = 100;
  const springDamping = 10;


  const GROUP1 = 1 << 0
  const GROUP2 = 1 << 1


  const tubeRef = useRef();
  const colliderRef = useRef();
  const transitionProgressRef = useRef(0);
  const elapsedTimeRef = useRef(0);
  const targetDuration = stageDurations;
  const [topPoint, setTopPoint] = useState([0, 0, 0]);
  const [currentPath, setCurrentPath] = useState(flower.path.flat());
  const [startPath, setStartPath] = useState(flower.path.flat());
  const [currentFlower, setCurrentFlower] = useState(flower);
  const [startFlower, setStartFlower] = useState(flower);
  const [petalRadius, setPetalRadius] = useState(0.4)
  const [petalHeight, setPetalHeight] = useState(0.1)



  const noise = useMemo(() => new Noise(123456), []);

  const [recPoint, recPointApi] = useBox(() => ({
    args: [1, 0.5, 0.5],
    type: 'Static',
    position: topPoint,
    mass: 0,
  }), [topPoint])

  const [stemColl1, stemCollApi1] = useSphere(() => ({
    args: [0.15, 32,64],
    type: 'Dynamic',
    mass: 0,
  }));

  const [petals, petalApi] = useCylinder(() => ({
    args: [petalRadius, petalRadius, petalHeight * 2.5, 100],
    mass: 0.1,
    position: topPoint,
    type: 'Dynamic',
    material: {
      friction: 0.5,
      restitution: 0, // Reduce restitution to prevent bouncing
    },
    angularDamping: 0.8, // Add angular damping
  }), [topPoint, petalRadius]);

  useDistanceConstraint(petals, stemColl1, {
    distance: 0, 
    stiffness: 0,
    damping: 100,
  })

  useDistanceConstraint(stemColl1, recPoint, {
    distance: 0, 
    stiffness: 0,
    damping: 100,
  }, [topPoint])

  // useConeTwistConstraint(petals,stemColl1, {
  //   pivotA: [0, 0, 0],
  //   pivotB: [0, 0, 0],
  //   axisA: [0, 1, 0],
  //   axisB: [0, 1, 0],
  //   angle: Math.PI / 4,
  //   twistAngle: Math.PI / 2,
  // })

  // useLockConstraint( stemColl1, recPoint, {
  //   pivotA: [0, 0, 0],
  //   pivotB: [0, 0, 0],
  //   axisA: [1, 0, 0],
  //   axisB: [1, 0, 0],
  // })

  // useConeTwistConstraint(stemColl1,recPoint, {
  //   pivotA: [0, 0, 0],
  //   pivotB: [0, 0, 0],
  //   axisA: [0, 1, 0],
  //   axisB: [0, 1, 0],
  //   angle: Math.PI / 4,
  //   twistAngle: Math.PI / 2,
  // })


  useEffect(() => {
    if (nextStage) { 
      setStartPath(currentPath);
      transitionProgressRef.current = 0;
      elapsedTimeRef.current = 0;
      setStartFlower(currentFlower);
    }
  }, [nextStage, currentPath, currentFlower]);

  useEffect(() => {
    const pointsArray = flower.path.map(point => new Vector3(point[0], point[1], point[2]));
    const pathCurve = new CatmullRomCurve3(pointsArray);
    const tubularSegments = 100;
    const radius = 0.14;
    const radialSegments = 8;
    const closed = false;
    const tubeGeometry = new TubeGeometry(pathCurve, tubularSegments, radius, radialSegments, closed);
    if (tubeRef.current) {
      tubeRef.current.geometry.dispose();
      tubeRef.current.geometry = tubeGeometry;
      tubeRef.current.visible = true;
    }
  }, [flower.path]);

  useFrame((state, delta) => {
    if (nextStage && transitionProgressRef.current < 1) {
      elapsedTimeRef.current += delta * 1000;
      transitionProgressRef.current = Math.min(elapsedTimeRef.current / targetDuration, 1);

      const interpolatedPath = interpolatePath(startPath, nextStage.path.flat(), transitionProgressRef.current);
      setCurrentPath(interpolatedPath);

      const pointsArray = [];
      for (let i = 0; i < interpolatedPath.length; i += 3) {
        pointsArray.push(new Vector3(interpolatedPath[i], interpolatedPath[i + 1], interpolatedPath[i + 2]));
      }
      const pathCurve = new CatmullRomCurve3(pointsArray);
      const tubularSegments = 100;
      const radius = 0.14;
      const radialSegments = 8;
      const closed = false;
      const tubeGeometry = new TubeGeometry(pathCurve, tubularSegments, radius, radialSegments, closed);

      if (stemCollApi1) {
        let pathNum = 8;
        stemCollApi1.position.set(
          pathCurve.points[pathNum].x,
          pathCurve.points[pathNum].y,
          pathCurve.points[pathNum].z
        );
      }
      

      // if (stemCollApi2) {
      //   let pathNum = 7;
      //   stemCollApi2.position.set(
      //     pathCurve.points[pathNum].x,
      //     pathCurve.points[pathNum].y,
      //     pathCurve.points[pathNum].z
      //   );
      // }

      // if (stemCollApi3) {
      //   let pathNum = 6;
      //   stemCollApi3.position.set(
      //     pathCurve.points[pathNum].x,
      //     pathCurve.points[pathNum].y,
      //     pathCurve.points[pathNum].z
      //   );
      // }

      let rotation = pathCurve.points[6].normalize()

      stemCollApi1.position.subscribe((p) =>{
        setTopPoint(p)
        petalApi.position.set(topPoint);
        recPointApi.position.set(topPoint)
      })


      if (tubeRef.current) {
        tubeRef.current.geometry.dispose();
        tubeRef.current.geometry = tubeGeometry;
      }

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

      const receptacleGeometry = new THREE.SphereGeometry(
        interpolatedFlower.recRadius
      )

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

      if (petals.current) {
        petals.current.geometry.dispose();
        petals.current.geometry = cylinderGeometry;
        petals.current.position.set(...topPoint);
        setPetalRadius(petals.current.geometry.parameters.radiusTop)
      }

      if(stemColl1){
        stemColl1.current.geometry = receptacleGeometry
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

    const receptacleGeometry = new THREE.SphereGeometry(
      flower.recRadius
    )

    if (petals.current) {
      petals.current.geometry.dispose();
      petals.current.geometry = cylinderGeometry;
      petals.current.position.set(...topPoint);
      setPetalRadius(petals.current.geometry.parameters.radiusTop)
    }

    if(stemColl1){
      stemColl1.current.geometry = receptacleGeometry
    }
    
    petalApi.angularVelocity.set(0, 0, 0);
    setPetalRadius(petals.current.geometry.parameters.radiusTop)
    setPetalHeight(petals.current.geometry.parameters.height)
  }, [flower, noise, petalApi.angularVelocity, petals, stemColl1, topPoint]);

  return (
    <group>
      <mesh ref={tubeRef} rotation={[0, 0, 0]}>
        <MeshWobbleMaterial color={'green'} />
      </mesh>
      <mesh visible={true} ref={petals}>
        <MeshWobbleMaterial color={'blue'} />
      </mesh>
      <mesh visible={true} ref={stemColl1}>
          <MeshWobbleMaterial color={'yellow'}/>
      </mesh>
    </group>
  );
};

export default Stem;
