import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Debug, Physics, useCylinder, usePlane, useSphere, useSpring, usePointToPointConstraint, useLockConstraint } from '@react-three/cannon';
// import { Sky } from '@react-three/drei'
import skyScene from '../assets/3d/sky.glb'

const Skybox = () => {
  const sky = useGLTF(skyScene)
  const [lightPos, setLightPos] = useState([10,30,0])
  const [isIncrementing, setIsIncrementing] = useState(true);

  const r = Math.PI /180
  const skyRef = useRef()
  const lightRef = useRef()
  const prog = useRef(10)
  const prog2 = useRef(0)
  const lightProg = useRef(0)

  // const textures = useTexture({
  //   map: '/grass/Grass_COLOR.jpg',
  //   normalMap: '/grass/Grass_NORM.jpg',
  //   roughnessMap: '/grass/Grass_ROUGH.jpg',
  //   aoMap: '/grass/Grass_OCC.jpg',
  //   displacementMap: '/grass/Grass_DISP.png'
  // });

  // Object.values(textures).forEach((texture) => {
  //   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set(4,4);
  //   texture.offset.set(0, 0); 
  //   texture.anisotropy = 16;
  // });

  const [ground] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 0, 0],
    rotation: [-90 * r, 0, 0],
  }));

  const [ceiling] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 10, 0],
    rotation: [90 * r, 0, 0],
  }));

  const [wall1] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [5, 5, 0],
    rotation: [0, -90 * r, 0],
  }));

  const [wall2] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [-5, 5, 0],
    rotation: [0, 90 * r, 0],
  }));

  const [wall3] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 5, -5],
    rotation: [0, 0, 0],
  }));

  const [wall4] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 5, 5],
    rotation: [r * 180, 0, 0],
  }));

  function handleAnimate() {
      setAnimate(true);
    }



  return (
    
            <primitive object={sky.scene} scale={0.035} ref={skyRef}/>

  )
}

export default Skybox