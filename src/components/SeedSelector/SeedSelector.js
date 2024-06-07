// import { StyledSeedSelector } from "./SeedSelector.styled";
import NewPlantForm from "../NewPlantForm/NewPlantForm";
import Text3 from "../Text3";
import { useState, useRef, useEffect } from "react";
import Seedling from "../Seedling/Seedling";
import { Billboard } from "@react-three/drei";

export default function SeedSelector({ seedlings, pickSeed }) {



    // const seedlingComponents = seedlings.map((seedling, index) => {
    //     return (
    //         <Seedling key={seedling.id} seedlingIndex={index} numSeedlings={seedlings.length} seedling={seedling} flower={null} pickSeed={pickSeed} />
    //     )
    // })


    return (
        <>
            <Text3 onPointerDown={() => {console.log('I got clicked')}}/>
            {/* {seedlingComponents} */}
            <Seedling key={Date.now()} seedlingIndex={1} numSeedlings={1} seedling={seedlings[0]} flower={null} pickSeed={pickSeed} />
            {/* <NewPlantForm plantFlower={plantFlower} /> */}
        </>
    )
}