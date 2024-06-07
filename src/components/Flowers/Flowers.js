import FlowerAssembly from "../FlowerAssembly/FlowerAssembly"
import { StyledFlowers } from "./Flowers.styled";

export default function Flowers({myFlowers}) {



    const flowers = myFlowers.map((flower) => {
        return (
            <>
                <FlowerAssembly key={flower.id} flower={flower} />
            </>
        )
    })

    return (
        <StyledFlowers className="styled-flowers">
          {flowers}
        </StyledFlowers>
    )
}
