import styled from "styled-components";

export const StyledHome = styled.div`
    position: relative;
    background-color: #fff0;    
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    h1 {
        padding: 0 50px;
        margin: 10px;; 
        color: black;
        background-color: white;
        width: fit-content;
    }

    .background-container{
        z-index: -3;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.4;
    }

    @keyframes glitch {
        0% {
            left: 0px;
            top: 0px;
        }

        100% {
            height: 125%;
            width: 125%;
            left: -21px;
            top: 15px;
        }
    }

`