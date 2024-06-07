import { useState, useRef, useEffect} from "react"
import FlowerAssembly from "../FlowerAssembly/FlowerAssembly"
import Flower1 from '../../models/Flower1'
import { useFrame } from "@react-three/fiber"
import { Html, Text } from "@react-three/drei"

const Seedling = ({ seedlingIndex, numSeedlings, seedling, flower, pickSeed }) => {
    const [leafGlow, setLeafGlow] = useState(false)
    const [stage, setStage] = useState('seedling')
    const hover = useRef()

        const spacing = 2
        const startPoint = ((0 - spacing) * numSeedlings / 2)
        const xPosition = startPoint + seedlingIndex * spacing

    return (
        // <FlowerAssembly key={seedling.id} seedling={seedling} flower={null} onPointerDown={(e) => setLeafGlow(true)}
        //     onPointerOut={(e) => { if(leafGlow) {setLeafGlow(false)}}} position={!leafGlow ? [xPosition, 0, 0] : [xPosition, 0.2, 0]}
        // />
    <group>
    <mesh 
    visible={false} 
    scale={[0.25,1,0.5]}
    onPointerOver={(e) => setLeafGlow(true)}
    onPointerOut={(e) => { if(leafGlow) {setLeafGlow(false)}}}
    onPointerDown={(e) => pickSeed(seedling.type)}
    rotation={[0,Math.PI / 2, 0]}
    >
        <boxGeometry args={[2,2,2]}/>
        <meshBasicMaterial />
    </mesh>
    <mesh
    position={!leafGlow ? [0, 0, 0] : [0, 0.5, 0]}
    >
        {leafGlow && 
            <Html ref={hover} position={[0,1.5,0]}>
                PLANT ME!
            </Html>
        }
                    <Flower1
                    canDelete={false}
                    stage={stage}
                    flower={seedling.phases[stage]}
                    nextStage={null}
                    stageDurations={null}
                    usePhysics={false}
                    />
    </mesh>
    </group>
    )
}

export default Seedling