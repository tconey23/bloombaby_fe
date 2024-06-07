import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import { useSphere, useCylinder, useBox, usePointToPointConstraint, useLockConstraint, useDistanceConstraint, useSpring, useConeTwistConstraint } from '@react-three/cannon';
import { TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

function Flower2({ rotationX = 0, rotationY = 0, rotationZ = 0, scale = [0.05, 0.05, 0.05], flower, stageDurations, nextStage, stage}) {
  // const groupRef = useRef(null);
    // const tubeRef = useRef();

    // const transitionProgressRef = useRef(0);
    // const elapsedTimeRef = useRef(0);
    // const targetDuration = stageDurations;
    // const [topPoint, setTopPoint] = useState([0, 0, 0]);
    // const [currentPath, setCurrentPath] = useState(null);
    // const [currentFlower, setCurrentFlower] = useState(flower);
    // const [startFlower, setStartFlower] = useState(flower);
    // const [petalRadius, setPetalRadius] = useState(0.4)
    // const [petalHeight, setPetalHeight] = useState(0.1)

    // const leafShapes = Array.from({ length: flower.d13 }, () => new THREE.Shape());
  
    // useEffect(() => {
    //   if(!stage) {
    //     const currentStage = Math.floor((Date.now() - flower.planted) / targetDuration)
    //     setCurrentFlower(flower.phases[currentStage])
    //     setNextStage(flower.phases[currentStage + 1])
    //     setCurrentPath(flower.phases[currentStage].path.flat())
    //   }
    // }, [])


    // let xRotInc = flower.d9
    // let yRotInc = Math.PI / (leafShapes.length / 2) + flower.d11
    // let zRotInc = flower.d10
  
    // for(var i = 0; i < flower.d13; i++) {
    //   if(i%2 === 0) {
    //       const controlPointX = flower.d1;
    //       const controlPointY = flower.d2;
    //       const endPointX = flower.d3;
    //       const endPointY = flower.d4;
  
    //       const curve = new THREE.QuadraticBezierCurve(
    //           new THREE.Vector2(0, 0),
    //           new THREE.Vector2(controlPointX, controlPointY),
    //           new THREE.Vector2(endPointX, endPointY)
    //       );
  
    //       const points = curve.getPoints(100);
    //       leafShapes[i] = new THREE.Shape().setFromPoints(points);
    //   } else {
    //     leafShapes[i].quadraticCurveTo(0-flower.d1, flower.d2, flower.d3, flower.d4)
    //   }
    // }
  
  
    // const leafGeometry1 = new THREE.ExtrudeGeometry(leafShapes[0], {
    //     steps: 35,
    //     depth: flower.d12,
    //     bevelEnabled: true,
    //     bevelSize: 0.5,
    //     bevelOffset: 0.5,
    //     // bevelSegments: 5,
    //     // bevelThickness: 5
    //   })  
  
    // const noise = useMemo(() => new Noise());
    // const positions = leafGeometry1.getAttribute('position');
  
    // let noiseScale = flower.d5
    // let xNoise = flower.d6
    // let yNoise = flower.d7
    // let zNoise = flower.d8
  
    // for (let i = 0; i < positions.count; i++) {
    //     const vertex = new THREE.Vector3();
    //     vertex.fromBufferAttribute(positions, i);
  
    //     const noiseValue = noise.simplex3(vertex.x * 0.1, vertex.y * 0.1, vertex.z * 0.1);
    //     // const noiseValue = worleyNoise3D(vertex.x * 0.1, vertex.y * 0.1, vertex.z * 0.1, 10);
    //     vertex.x += noiseValue * xNoise * noiseScale; // Adjust the amplitude of the noise here
    //     vertex.y += noiseValue * yNoise * noiseScale;
    //     vertex.z += noiseValue * zNoise * noiseScale;
  
    //     positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    // }
  
    // positions.needsUpdate = true;

    // const [recPoint, recPointApi] = useBox(() => ({
    //   args: [1, 0.5, 0.5],
    //   type: 'Static',
    //   position: topPoint,
    //   mass: 0,
    // }), [topPoint])

    // const [stemColl1, stemCollApi1] = useSphere(() => ({
    //   args: [0.15, 32,64],
    //   type: 'Dynamic',
    //   mass: 0,
    // }));

    // const [bloom, bloomApi] = useSphere(() =>({
    //   args: [0.5, 32,64],
    //   type: 'Dynamic',
    //   mass: 0,
    // }))

    // useDistanceConstraint(stemColl1, recPoint, {
    //   distance: 0, 
    //   stiffness: 0,
    //   damping: 100,
    // }, [topPoint])

    // useEffect(() => {
    //   if (nextStage) { 
    //     transitionProgressRef.current = 0;
    //     elapsedTimeRef.current = 0;
    //     setStartFlower(currentFlower);
    //   }
    // }, [nextStage, currentPath, currentFlower]);

    // useEffect(() => {
    //   const pointsArray = flower.path.map(point => new Vector3(point[0], point[1], point[2]));
    //   const pathCurve = new CatmullRomCurve3(pointsArray);
    //   const tubularSegments = 100;
    //   const radius = 0.14;
    //   const radialSegments = 8;
    //   const closed = false;
    //   const tubeGeometry = new TubeGeometry(pathCurve, tubularSegments, radius, radialSegments, closed);
    //   if (tubeRef.current) {
    //     tubeRef.current.geometry.dispose();
    //     tubeRef.current.geometry = tubeGeometry;
    //     tubeRef.current.visible = true;
    //   }
    // }, [flower.path]);

    // useEffect(() => {
    //   const cylinderGeometry = new THREE.CylinderGeometry(flower.radiusTop, flower.radiusBottom, flower.height, flower.radialSegments);
  
    //   const positions = cylinderGeometry.attributes.position.array;
    //   for (let i = 0; i < positions.length; i += 3) {
    //     const x = positions[i];
    //     const y = positions[i + 1];
    //     const z = positions[i + 2];
  
    //     const displacementX = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactX;
    //     const displacementY = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactY;
    //     const displacementZ = noise.perlin3(x * flower.noiseScale, y * flower.noiseScale, z * flower.noiseScale) * flower.noiseImpactZ;
  
    //     positions[i] += displacementX;
    //     positions[i + 1] += displacementY; 
    //     positions[i + 2] += displacementZ;
    //   }
  
    //   cylinderGeometry.attributes.position.needsUpdate = true;
  
    //   const receptacleGeometry = new THREE.SphereGeometry(
    //     flower.recRadius
    //   )
  
    //   if(stemColl1){
    //     stemColl1.current.geometry = receptacleGeometry
    //   }

    // }, [flower, noise]);


    // useFrame(() => {
    //   stemCollApi1.position.subscribe((p) =>{
    //     setTopPoint(p)
    //     console.log(p)
    //   })
    //   bloomApi.position.set(...topPoint)
    // })
  
    return (
      <>
        {/* <group ref={groupRef}>
          {Array.from({ length: flower.d13 }, (_, index) => (
            <mesh ref={bloom}>
              <mesh
                key={index}
                rotation={[rotationX + index * xRotInc, rotationY + index * yRotInc, rotationZ + index * zRotInc]}
                scale={scale}
                castShadow
                >
                <bufferGeometry attach="geometry" {...leafGeometry1} />
                <meshNormalMaterial
                  color={index%2 === 0 ? "orange" : "blue"}
                  roughness='0.9'
                  />
              </mesh>
            </mesh>
          ))}
            <mesh castShadow ref={tubeRef} rotation={[0, 0, 0]}>
              <meshLambertMaterial color={'green'} />
            </mesh>
        </group> */}
      </>
    );
  }
  
  export default Flower2;