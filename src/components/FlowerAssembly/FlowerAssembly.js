import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Sky, OrthographicCamera, Billboard, Text } from '@react-three/drei';
import { StyledFlowerAssembly } from './FlowerAssembly.styled';
import Stem from "./Stem";
import { Physics } from '@react-three/cannon';
import { Debug } from '@react-three/cannon';
import { useCylinder, useSpring, useBox, usePointToPointConstraint } from '@react-three/cannon';
import Petals from './Petals';

export default function FlowerAssembly({ flower, seedling }) {

    const lifeMin = 0.5
    const lifeSec = lifeMin * 60000

    const [planted, setPlanted] = useState(Date.now());
    const [lifeCycle, setLifeCycle] = useState(lifeSec);
    const [stage, setStage] = useState('seedling');
    const [nextStage, setNextStage] = useState()
    const [plantAge, setPlantAge] = useState(0);
    const [currentTime, setCurrentTime] = useState(Date.now());

    const stages = useMemo(() => ['seedling', 'blooming', 'thriving', 'wilting', 'dead'], []);
    const stageDurations = useMemo(() => lifeCycle / stages.length, [lifeCycle, stages.length]);
    const showStages = true


    // const getCurrentStage = useCallback(() => {
    //     const timeElapsed = Date.now() - planted;
    //     const stageIndex = Math.floor(timeElapsed / stageDurations);
    //     if (stageIndex >= stages.length) {
    //         setPlanted(Date.now()); 
    //         setPlantAge(0);
    //         return 'seedling';
    //     }
    //     return stages[stageIndex];
    // }, [planted, stageDurations, stages]);

    // useEffect(() => {
    //     if(flower) {
    //         const getNextStage = stages[stages.indexOf(stage)+1]
    //         if(!getNextStage){
    //             setNextStage(flower.phases['seedling'])
                
    //         } else {
    //             setNextStage(flower.phases[getNextStage])
    //         }
    //     }
    // })

    //     if(flower && showStages){
    //         const interval = setInterval(() => {
    //             const timeElapsed = Date.now() - planted;
    //             const stageIndex = Math.floor(timeElapsed / stageDurations);
    //             if (stageIndex < stages.length) {
    //                 setCurrentTime(Date.now());
    //                 setStage(getCurrentStage());
    //             } else {
    //                 setPlanted(Date.now());
    //                 setCurrentTime(Date.now());
    //                 setStage('seedling');
    //                 setPlantAge(0);
    //             }
                
    //         }, stageDurations);
            
    //         return () => clearInterval(interval);
            
    //     }


    // }, [planted, lifeCycle, getCurrentStage, stageDurations, stages.length, currentTime]);

    useEffect(() => {
        if (flower) {
            const interval = setInterval(() => {
                const age = Date.now() - planted;
                setPlantAge(age / 1000);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [flower, planted]);

    return (
        <StyledFlowerAssembly className='styled-flower-assembly'>
            {seedling && <p className="flower-assembly">here's a sEEDbABY:</p>}
                <ambientLight intensity={1} />
                <directionalLight intensity={10} castShadow position={[2, 1, 5]} shadow-mapSize={[1024, 1024]} />
                <OrthographicCamera makeDefault position={[100, 10, 10]} zoom={30} />
                {seedling && <OrthographicCamera makeDefault position={[100, 1000, 0]} zoom={80} />}
                <OrbitControls />
                <Sky
                    distance={1000000}
                    sunPosition={[0, 0.25, 0.50]}
                    inclination={0.49}
                    azimuth={0.25}
                    turbidity={1}
                    rayleigh={0.1}
                    mieCoefficient={0.005}
                    mieDirectionalG={1}
                    />
                        <group position={[0,0,0]}>
                            <Stem stage={stage} flower={flower.phases[stage]} nextStage={nextStage} stageDurations={stageDurations}/>
                        </group>
        </StyledFlowerAssembly>
    );
}
