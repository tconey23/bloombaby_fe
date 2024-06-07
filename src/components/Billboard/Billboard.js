import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

function Billboard({ position, text }) {
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const infoBoxRef = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    if (hovered) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hovered]);

  return (
    <>
      {/* <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh> */}
      {hovered && (
        <Html
          position={[cursorPos.x / window.innerWidth * 2 - 1, -(cursorPos.y / window.innerHeight * 2 - 1), 0]}
          ref={infoBoxRef}
          transform
        >
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: '5px', borderRadius: '3px' }}>
            {text}
          </div>
        </Html>
      )}
    </>
  );
}

function SetBillboard() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Billboard position={[0, 0, 0]} text="Hover Info Box" />
    </Canvas>
  );
}

export default Billboard;
