import { StyledHome } from "./OldHome.styled";
import Flowers from '../Flowers/Flowers';
import SeedSelector from '../SeedSelector/SeedSelector';
import userFlowers from "../../userFlowers-dummy";
import { useState, useEffect } from 'react'

export default function OldHome() {
    const [ myFlowers, setMyFlowers ] = useState()

    function plantFlower() {

    }

    function getComponentData(flower, component, index) {
        const componentKeys = Object.keys(flower.phases[component])
        const componentValues = componentKeys.map((property) => {
          return flower.phases[component][property][index]
        })
    
        const componentData = {}
          componentKeys.forEach((componentKey, i) => {
            componentData[componentKey] = componentValues[i]
        })
    
        return componentData
      }

    const convertFlowerObject = (flower) => {  
        const newFlower = {
          ...flower,
          phases: {
            seedling: {
              ...getComponentData(flower, 'bloom', 0),
              ...getComponentData(flower, 'stem', 0)
            },
            blooming: {
              ...getComponentData(flower, 'bloom', 1),
              ...getComponentData(flower, 'stem', 1)
            },
            thriving: {
              ...getComponentData(flower, 'bloom', 2),
              ...getComponentData(flower, 'stem', 2)
            },
            wilting: {
              ...getComponentData(flower, 'bloom', 3),
              ...getComponentData(flower, 'stem', 3)
            },
            dead: {
              ...getComponentData(flower, 'bloom', 4),
              ...getComponentData(flower, 'stem', 4)
            }
          }
        }
        
        return newFlower
    }

    function cleanFlowers(flowers) {
        return flowers.map((flower) => {
            return convertFlowerObject(flower)
        })
    }

    function getAllFlowers() {
        // getFlowers().then()
        const cleanedFlowers = cleanFlowers(userFlowers)
        setMyFlowers(cleanedFlowers)
    }

    useEffect(() => {
        getAllFlowers()
    }, [])

    console.log('myFlowers', myFlowers)

    return (
        <main>
            <StyledHome>
                <h1>bLOOMbABY</h1>  
                {myFlowers &&
                    <>
                        <Flowers myFlowers={myFlowers}/>
                        <SeedSelector plantFlower={plantFlower} myFlowers={myFlowers} />
                    </>
                }
            </StyledHome>
        </main>
    )
}