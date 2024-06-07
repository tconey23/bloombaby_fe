import styled from "styled-components";

export const StyledFlowers = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: space-evenly; */
    border-radius: 40px;
    height: 40vw;
    color: white;
    font-weight: bold;
    position: relative;
    

    .flower-container {
        width: 10vh;
        // height: 50vh;    
        background-color: black;
    }

    .plant-details {
        position: absolute;
        z-index: 3;
        color: black;
        top: 0;
    }

    p {
        margin: 0;
    }
`