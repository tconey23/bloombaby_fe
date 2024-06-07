import styled from "styled-components";

export const StyledNewPlantForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-weight: bold;
    background-color: white;
    color: black;
    font-size: 1.4em;
    width: 50vw;
    height: 50vh;
    border-radius: 20px;
    
    .plant-form-labels {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 10px;
        color: black;
        font-weight: bold;
    }
    
    label {
        margin: 2px;
    }

    input {
        border: none;
        margin-left: 10px;
        /* background-color: black;
        color: white */
    }

    submit {
        cursor: pointer;
        padding: 15px;
        background-color: white;
        color: black;
        text-decoration: none !important;
    }

    .plant-form-container {
        display: flex;
        align-items: center;
    }
`