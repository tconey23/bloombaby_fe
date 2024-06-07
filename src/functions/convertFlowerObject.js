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

const convertFlowerObject = (flower, id) => {
    const newFlower = { 
        ...flower,
        id: id,
        phases: {
            seedling: {
                ...getComponentData(flower, 'bloom', 0),
                ...getComponentData(flower, 'stem', 0),
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
    // console.log(flower)
    return newFlower
}


export { getComponentData, convertFlowerObject }