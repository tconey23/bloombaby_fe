import { StyledNewPlantForm } from './NewPlantForm.styled'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function NewPlantForm({ plantFlower }) {
    const [ formData, setFormData ] = useState({name: '', description: ''})

    function handleChange(event) {
        // const newData = event.target.value
        setFormData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleClick(event) {
        // event.preventDefault()
        plantFlower(formData)
    }

    return (
        <StyledNewPlantForm className="styled-new-plant-form">
            <p>you have no flowers yet. get one in the ground!</p>
            <div className="plant-form-container">
                <div className="plant-form-labels">
                    <label>Name yer plant
                        <input type="text" name="name" onChange={event => handleChange(event)} value={formData.name}/>
                    </label>
                    <label>Describe yer plant
                        <input type="text" name="description" onChange={event => handleChange(event)} value={formData.description}/>
                    </label>
                </div>
                <Link to="/home">
                    <button type="submit" onClick={event => handleClick(event)}>pLANTfLOWER</button>
                </Link>
            </div>
        </StyledNewPlantForm>
    )
}