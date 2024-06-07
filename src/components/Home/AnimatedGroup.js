import Text from "./Text";
import Text2 from "./Text2";
import TextButton from "./TextButton";
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';

export default function AnimatedGroup({ goToSeedSelector }) {
    const textGroupRef = useRef();
    const progress = useRef(0);
  
    const easeOutCubic = (t) => (--t) * t * t + 1;
  
    useEffect(() => {
      if (textGroupRef.current) {
        textGroupRef.current.position.y = 10;
      }
    }, []);
  
    useFrame(() => {   
      progress.current += .005
      if (progress.current > 1) { progress.current = 1};
  
      const easedProgress = easeOutCubic(progress.current);
  
      if (textGroupRef.current) {
        const newPosition = lerp(10, 0, easedProgress);
        textGroupRef.current.position.y = newPosition;
      }
    });
  
    return (
      <group ref={textGroupRef}>
        <mesh rotation={[0, ((-Math.PI / 2) - (-Math.PI / 2) * 0.02), 0]} position={[4, 4, 4]}>
          <Text />
        </mesh>
        <mesh rotation={[0, ((-Math.PI / 2) * 0.02), 0]} position={[-4, 4, -4]}>
          <Text2 />
        </mesh>
        <TextButton goToSeedSelector={goToSeedSelector} />
      </group>
    );
  };