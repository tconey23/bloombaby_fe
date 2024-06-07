import { Sphere } from "@react-three/drei";
import Petals from "./Petals";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

const Receptacle = ({ flower, topPoint, bloomAngle }) => {
    const [receptRadius, setReceptRadius] = useState();
    const [flowerPetals, setFlowerPetals] = useState();
    const [attachPoint, setAttachPoint] = useState();
    const [scale, setScale] = useState();
    const materialRef = useRef();


    useEffect(() => {
        if (topPoint) {
            setAttachPoint(topPoint);
        }
    }, [topPoint]);

    const generatePetals = useCallback(() => {
        if (flower) {
            const petalArray = [];
            const colorArray = ['blue'];
            let c = 0;

            for (let i = 0; i < flower.petalCount; i += 1) {
                petalArray.push(
                    <Petals
                        key={i}
                        positionX={0}
                        positionY={0}
                        positionZ={0}
                        rotationX={0}
                        rotationY={i + 10}
                        rotationZ={0}
                        color={colorArray[c]}
                        flower={flower}
                    />
                );
                c = (c + 1) % colorArray.length;
            }

            setFlowerPetals(petalArray);
            setReceptRadius(flower.recRadius);
        }
        setScale(1);
    }, [flower]);
    
    useEffect(() => {
        generatePetals();
    }, [flower, generatePetals]);
    
    if (materialRef.current) {
        materialRef.current.uniforms.uColor.value.set('yellow');
    }
    return (
        <>
            <group scale={scale} position={attachPoint} rotation={[bloomAngle, 0, 0]}>
                {flowerPetals && flowerPetals}
                {attachPoint && (
                    <Sphere position={[0, 0, 0]} args={[receptRadius+0.1]}>
                        {/* <meshStandardMaterial color="yellow" /> */}
                        <meshLambertMaterial color={'yellow'}/>
                    </Sphere>
                )}
            </group>
        </>
    );
};

export default Receptacle;
