import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';
import { meshTransmissionMaterial } from '@react-three/drei';

import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

export default function Text() {
    const groupRef = useRef(null);

    const r = Math.PI / 180

        // eslint-disable-next-line react-hooks/exhaustive-deps
  const textRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const font = new FontLoader().parse(Abril);

  // Adjust pivot to center
  useEffect(() => {
    textRefs.forEach(ref => {
      if (ref.current) {
        const geometry = ref.current.geometry;
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new Vector3();
        boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
      }
    });
  }, [textRefs]);


    // if(groupRef.current) {
    //     groupRef.current.rotation.y = -.6
    // } 

  useFrame(() => {
    

    textRefs.forEach((ref, index) => {
      if (ref.current) {
        const rotationSpeed = 0.01;
       //console.log(ref.current.rotation.y)
        if((ref.current.rotation.y < Math.PI) && (ref.current.rotation.y > -Math.PI)) {
            // groupRef.current.rotation.y += .0001
            ref.current.rotation.y += (index % 2 === 0 ? 1 : -1) * rotationSpeed;
            ref.current.rotation.x += (index % 3 === 0 ? 1 : -1) * rotationSpeed;
            ref.current.rotation.z += (index % 4 === 0 ? 1 : -1) * rotationSpeed;
        }
      }
    });
  });

  const textStrings = ['b', 'L', 'O', 'O', 'M', 'b', 'A', 'B', 'Y'];

  return (
    <group position={[-3,0,-1]} ref={groupRef}>
      {textStrings.map((text, index) => (
        <mesh castShadow receiveShadow
          key={index}
          position={[-4 + index, 0, 0]}
          ref={textRefs[index]}
        >
          <textGeometry args={[text, { font, size: 1, depth: .73 }]} />
          <meshStandardMaterial color='hotpink'/>
        </mesh>
      ))}
    </group>
  );
}
