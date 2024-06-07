export default function reverseConvertPlantObj(plant) {
    const phases = ['seedling', 'blooming', 'thriving', 'wilting', 'dead'];
    const newPhases = {
      stem: {
        stemColor: [],
        stemWidth: [],
        path: []
      },
      bloom: {
        bloomColor: [],
        petalCount: [],
        recRadius: [],
        radiusTop: [],
        radiusBottom: [],
        noiseScale: [],
        noiseImpactX: [],
        noiseImpactY: [],
        noiseImpactZ: [],
        height: [],
        radialSegments: [],
        rotation: []
      }
    };
  
    phases.forEach(phase => {
      const phaseData = plant.phases[phase];
  
      newPhases.stem.stemColor.push(phaseData.stemColor);
      newPhases.stem.stemWidth.push(phaseData.stemWidth);
      newPhases.stem.path.push(phaseData.path);
  
      newPhases.bloom.bloomColor.push(phaseData.bloomColor);
      newPhases.bloom.petalCount.push(1); // Assuming petalCount is always 1
      newPhases.bloom.recRadius.push(phaseData.recRadius);
      newPhases.bloom.radiusTop.push(phaseData.radiusTop);
      newPhases.bloom.radiusBottom.push(phaseData.radiusBottom);
      newPhases.bloom.noiseScale.push(phaseData.noiseScale);
      newPhases.bloom.noiseImpactX.push(phaseData.noiseImpactX);
      newPhases.bloom.noiseImpactY.push(phaseData.noiseImpactY);
      newPhases.bloom.noiseImpactZ.push(phaseData.noiseImpactZ);
      newPhases.bloom.height.push(phaseData.shape_Height);
      newPhases.bloom.radialSegments.push(phaseData.radialSegments);
      newPhases.bloom.rotation.push([
        phaseData.bloomRotationX,
        phaseData.bloomRotationY,
        phaseData.bloomRotationZ
      ]);
    });
  
    return {
      name: plant.name,
      id: plant.id,
      description: plant.description,
      phases: newPhases
    };
  }