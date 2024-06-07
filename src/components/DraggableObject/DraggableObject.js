import { OrbitControls, Float, Plane, DragControls, Html, Billboard, useTexture } from '@react-three/drei';
import Flower1 from '../../models/Flower1'
import React, { useRef, useState, useMemo, useEffect } from 'react';
import {useCylinder} from '@react-three/cannon'
import { useFrame } from '@react-three/fiber';
import { seedlingsData } from '../../models/seedlings';
import { convertFlowerObject } from '../../functions/convertFlowerObject';
import * as THREE from 'three'
import './DraggableObject.css';



const DraggableObject = ({ flower, seedType, plantNodes, pos, plantSeed }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [draggedPos, setDraggedPos] = useState([0, 5, 0]);
    const [attachNode, setAttachNode] = useState()
    const [hovered, setHovered] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const infoBoxRef = useRef();
    const [thisSeedling, setThisSeedling] = useState()
    const [thisFlower, setThisFlower] = useState()
    const rotateProg = useRef(0)

    let r = Math.PI / 180

    const [ref, refApi] = useCylinder(() => ({
      mass: 1,
      args: [0.50, 0.50, 0.25],
      type: 'Static',
      position: [0, 1, 0],
      material: {
        restitution: 10,
        friction: 0,
      },
    }));

    const availableNode = useMemo(() => {
      if (plantNodes.length === 0) return null;
      plantNodes.forEach(node => {
        if(node.ref.current && !node.ref.current.isAttached){
          const position = [node.ref.current.position.x, 0, node.ref.current.position.z]
          return position
        } else {
          return null
        }
      });
    }, [plantNodes]);

    const closestNode = useMemo(() => {
      if (plantNodes.length === 0) return null;
      let closestDistance = Infinity;
      let closestNode = null;
      plantNodes.forEach(node => {
        if(node.ref.current){
          node.ref.current.visible = false
        }
        const distance = Math.sqrt(
          Math.pow(node.props.pos[0] - draggedPos[0], 2) +
          Math.pow(node.props.pos[1] - draggedPos[1], 2) +
          Math.pow(node.props.pos[2] - draggedPos[2], 2)
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNode = node;
        }
      });
      return closestNode;
    }, [draggedPos, plantNodes]);


    useFrame(() => {
      ref.current.rotation.set(0, 0, 0);
      refApi.rotation.set(0, 0, 0);
      if (isDragging) {
        setHovered(false)
        ref.current.isAttached=false
        ref.current.attachedNode = null
        const position = new THREE.Vector3().setFromMatrixPosition(ref.current.matrixWorld);
        setDraggedPos([position.x, position.y, position.z]);
        refApi.position.set(position.x, position.y, position.z)
        refApi.mass.set(0);
        if(closestNode){
          closestNode.ref.current.visible = true
          setAttachNode([...closestNode.props.pos])
        } else {
          closestNode.ref.current.visible = false
        }
      } else {
        rotateProg.current += .01
        refApi.rotation.set(0,rotateProg.current,0)
        if(attachNode && closestNode.ref.current){
          refApi.position.set(attachNode[0],1.51,attachNode[2])
          ref.current.position.set(...attachNode)
          ref.current.isAttached = true
          ref.current.attachedNode = closestNode.ref.current
          closestNode.ref.current.isAttached = true
        }
        ref.current.mass = 1;
        ref.current.type = 'Dynamic'
        refApi.mass.set(1);   
      }
    });

    const dragStart = () => {
      setIsDragging(true)
      refApi.wakeUp()
    }

    const dragEnd = () => {
      setIsDragging(false)
      refApi.sleep()
    }
    return (
      <DragControls castShadow onPointerOut={() => setHovered(false)} onPointerOver={() => setHovered(true)} axisLock='y' ref={ref} onDragStart={() => dragStart()} onDragEnd={() => dragEnd()}>
        {!hovered && !attachNode && (
          <Html
            position={[0,2.2,0]}  
            ref={infoBoxRef}     
          >
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '5px', borderRadius: '3px' }}>
              Find my new home!
            </div>
          </Html>
        )}
        {!hovered && !isDragging && attachNode && (
          <Html
            position={[0,2.2,0]}  
            ref={infoBoxRef}
          >
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '5px', borderRadius: '3px' }}>
              <button onClick={(e) => plantSeed(seedType, attachNode)} className='plant-here-button'>Plant Here?</button>
            </div>
          </Html>
        )}
        {seedType === 'flower1' &&
                <Flower1
                usePhysics={false}
                pos={[-10,0,-5]}
                  stage={'seedling'}
                  flower={convertFlowerObject(seedlingsData[0].attributes).phases.seedling}
                />
        }       
      </DragControls> 
    );
  };

  export default DraggableObject