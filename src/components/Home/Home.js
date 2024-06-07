import { StyledHome } from "./Home.styled";
import SeedSelector from "../SeedSelector/SeedSelector";
import Flowers from "../Flowers/Flowers";
import { Stats, Float, Plane, DragControls, Html, Billboard, useTexture } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as flowerConverter from '../../functions/convertFlowerObject';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Debug, Physics, useCylinder, usePlane, useSphere, useSpring, usePointToPointConstraint, useLockConstraint } from '@react-three/cannon';
import { seedlingsData } from '../../models/seedlings'
import { postFlower, getFlowers } from "../../apiCalls";
import Skybox from '../../models/Sky'
import Environment from '../Environment/Environment'
import DraggableObject from '../DraggableObject/DraggableObject'
import { OrbitControls, MeshWobbleMaterial } from "@react-three/drei";
import getRandomNameCombo from "../../functions/getRandomNameCombo";
import getRandomDescription from "../../functions/getRandomDescription";
import Flower1 from "../../models/Flower1";
import AnimatedGroup from "../AnimatedGroup";
import { deleteFlower } from "../../apiCalls";

function CameraAnimation() {    
  const { camera } = useThree();
  const targetPosition = useRef([-90, 55, 100]);
  const targetZoom = useRef(80);
  const progress = useRef(0);

  useFrame(() => {
    if (progress.current < 1) {
      progress.current += 0.0005;
      camera.position.lerp({ x: targetPosition.current[0], y: targetPosition.current[1], z: targetPosition.current[2] }, progress.current);
      camera.zoom = camera.zoom + (targetZoom.current - camera.zoom) * 0.01;
      camera.lookAt(0, 2, 0);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function ReverseAnimation() {
  const { camera } = useThree();
  const targetPosition = useRef([0, 20, 100]);
  const targetZoom = useRef(80);
  const progress = useRef(0);

  useFrame(() => {
    if (progress.current < 1) {
      progress.current += 0.0005;
      camera.position.lerp({ x: targetPosition.current[0], y: targetPosition.current[1], z: targetPosition.current[2] }, progress.current);
      camera.zoom = camera.zoom + (targetZoom.current - camera.zoom) * 0.01;
      camera.lookAt(0, 2, 0);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

const PlantNode = React.forwardRef(({ pos }, ref) => {
  const [node, nodeApi] = useSphere(() => ({
    type: 'Static',
    mass: 0,
    args: [0.1],
    position: pos,
  }));

  useEffect(() => {
    if (ref) {
      ref.current = node.current;
      ref.current.isAttached = false
    }
  }, [node, ref]);

  return (
    <mesh visible={false} position={pos} ref={node}>
      <sphereGeometry args={[0.15]} />
      <meshLambertMaterial />
    </mesh>
  );
});

const Ground = () => {

  let r = Math.PI / 180;

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


  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow ref={ground}>
        <planeGeometry args={[10, 10, 256, 256]} />
        <meshLambertMaterial
          color={'lightgreen'}
        />
      </mesh>
    </group>
  )
}

const SceneTraversal = () => {
  const { scene } = useThree();

  useEffect(() => {
    // scene.traverse((object) => {
    //   console.log(object);
    // });
  }, [scene]);

  return null;
};


export default function Home({ seedlings }) {
  const [myFlowers, setMyFlowers] = useState([])
  const [mySeedlings, setMySeedlings] = useState()
  const [background, setBackground] = useState('1')
  const [leafDimensions, setLeafDimensions] = useState({ d1: 9, d2: 18, d3: 0, d4: 9, d5: 0, d6: 0, d7: 0, d8: 0, d9: 0, d10: 0, d11: 0, d12: 0, d13: 2, d14: 0.25, d15: 0.25, d16: 0.25 });
  const [numStored, setNumStored] = useState(1)
  const [storedFlowers, setStoredFlowers] = useState([])
  const [animate, setAnimate] = useState(false)
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0])
  const [newSeedType, setNewSeedType] = useState(null)
  const lookAtTarget = useRef([0, 0, 0])
  const lightRef = useRef()
  const [showSelector, setShowSelector] = useState(false)
  const [startPosition, setStartPosition] = useState()
  const startNode = useRef()
  

  let r = Math.PI / 180;

 

  useEffect(() => {
    if (myFlowers.length > 0) {
      setShowSelector(false)
      setAnimate(true)
    }
  }, [myFlowers])

  function plantSeed(seedType, position) {
    setAnimate(true)
    const plantName = getRandomNameCombo()
    const plantDescription = getRandomDescription()
    const newFlower = {
      "name": plantName,
      "description": `${plantDescription}`,
      "position": position.join(),
      "type": seedType,
    };

    postFlower(newFlower)
      .then(data => {
        const cleanedNewFlower = flowerConverter.convertFlowerObject(data.data.attributes)

        setMyFlowers(prev => [...prev, cleanedNewFlower])
        setNewSeedType(null)
        // setShowSelector(false)
      })
  }

  function cleanFlowers(flowers) {
    return flowers.map((flower) => {
      return flowerConverter.convertFlowerObject(flower.attributes, flower.id)
    })
  }

  const getAllSeedlings = () => {
    const cleanedSeedlings = cleanFlowers(seedlingsData)
    setMySeedlings(cleanedSeedlings)
  }

  const getAllFlowers = () => {
    console.log('here')
    getFlowers()
      .then(data => {
        const cleanedFlowers = cleanFlowers(data.data)
        setMyFlowers(cleanedFlowers)
      })
  }

// eslint-disable-next-line
  useEffect(() => {
    getAllSeedlings()
    getAllFlowers()
    setBackground('1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function storeFlower() {
    setStoredFlowers(prev => [...prev, { [`flower${numStored}`]: leafDimensions }]);
    setNumStored(prev => prev + 1);
  }

  function handleChange(event) {
    setLeafDimensions(prev => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  }

  function pickSeed(seedType) {
    setAnimate(true);
    setShowSelector(false)
    setNewSeedType(seedType)
  }

  const plantNodes = useMemo(() => {
    const positions = [];
    const frows = 5;
    const fcolumns = 5;
    const fspacing = 2;
    const frowOffset = (frows - 1) / 2;
    const fcolOffset = (fcolumns - 1) / 2;
    const nodes = [];
    for (let row = -frowOffset; row <= frowOffset; row++) {
      for (let col = -fcolOffset; col <= fcolOffset; col++) {
        const pos = [col * fspacing, -0.1, row * fspacing];
        const nodeRef = React.createRef();
        nodes.push({ id: `${row}${col}`, position: pos, ref: nodeRef });
        positions.push(<PlantNode key={`${row}${col}`} pos={pos} ref={nodeRef} />);
      }
    }
    return positions;
  }, []);

  // const [nodePositions, setNodePositions] = useState(plantNodes)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  const chooseFlower = (flower) => {
    switch(flower.plant_type) {
      case 'flower1': return <Flower1 key={Date.now()} renderOrder={50} usePhysics={true} deleteThisFlower={deleteThisFlower} stage={null} flower={flower} pos={flower.position.split(',')}/>
      case 'flower2': return <Flower1 key={Date.now()} renderOrder={50} usePhysics={true} deleteThisFlower={deleteThisFlower} stage={null} flower={flower} pos={flower.position.split(',')}/>
      default: <Flower1 key={Date.now()} renderOrder={50} usePhysics={true} deleteThisFlower={deleteThisFlower} stage={null} flower={flower} pos={flower.position.split(',')}/>
    }
  }

  const deleteThisFlower = async (id) => {
    await deleteFlower(id)
    getAllFlowers()
  }

  const flowerObjects = useMemo(() => {
    const flowerArray = []
      myFlowers.forEach((flower) => {
          flowerArray.push(chooseFlower(flower)) 
    })

    return flowerArray
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myFlowers, chooseFlower])

  if(startNode.current){
    setStartPosition(startNode.current.position) 
  }

  useEffect(() => {
    if(!myFlowers.length){
      setShowSelector(true)
    } else {
      setShowSelector(false)
    }
  }, [myFlowers.length])

  function goToSeedSelector() {
    setAnimate(false)
    setShowSelector(true)
  }

  return (
    <StyledHome className={`home ${background}`}>
      <Canvas id="canvas" style={{ background: 'skyblue' }} shadows orthographic camera={{ zoom: 80, position: [0, 20, 100] }}>
      <SceneTraversal />
        {/* {/* <Stats showPanel={0} className="stats" /> */}
        <Physics onClick={(e) => { console.log('clicked physics', e.target) }} gravity={[0, -0.8, 0]}>
          <ambientLight intensity={1} position={[0, 2, 0]} />
          <pointLight position={[-2, 20, 10]} intensity={30} />
          <directionalLight castShadow ref={lightRef} position={[-2, 20, 10]} intensity={1} />
          <Skybox />
          <Ground />
          {animate ? <CameraAnimation /> : <ReverseAnimation />}
          
          {
            showSelector ?
              <SeedSelector className="seed-selector" seedlings={mySeedlings} pickSeed={pickSeed} />
              :
              <>
              <Float
                speed={10}
                rotationIntensity={.04}
                floatIntensity={.06} 
                >
                <AnimatedGroup goToSeedSelector={goToSeedSelector}/>
              </Float>
                {plantNodes}
                {flowerObjects}
                {newSeedType &&
                  <>
                    <DraggableObject plantSeed={plantSeed} pos={[-10,0,-5]} seedType={newSeedType} plantNodes={plantNodes}/>
                  </>
                }
              </>
          }
          <Debug>
          </Debug>
          {/* <OrbitControls /> */}
        </Physics>
      </Canvas>
    </StyledHome>
  );
}