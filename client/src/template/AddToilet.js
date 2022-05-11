import React, { useState } from 'react';
import {  Form, FormGroup, Label, Input, Button} from 'reactstrap'
import { ADD_TOILET } from '../utils/mutations'
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Auth from '../utils/auth';
import env from 'react-dotenv';

const AddToilet = ({setZipcode, zipcode}) => {

const [createNewToilet, {error}] = useMutation(ADD_TOILET)

const [address, setAddress] = useState('')

const history = useHistory();

    const [formState, setFormState] = useState({ overallRating: '3', genderNeutral: 'No', cleanliness: '3',  changingTable: 'No', handicapAccessible: '3', toiletPaper: 'Yes', keys: 'No', comment: '' });

// update state based on form input changes
        const handleChange = event => {
            const { name, value } = event.target;
            
            setFormState({
                ...formState,
                [name]: value
            });
        };
     

    const handleFormSubmit = async event => {

        event.preventDefault();

        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

    navigator.geolocation.getCurrentPosition(position => {
        
            const { latitude, longitude } = position.coords
            const lng = longitude + '0'
            const lat = latitude + '0'
             const coordinates = latitude + 'X' + longitude 
             console.log(lng,lat)
             fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.GOOGLE_MAPS_API_KEY}`).then((response) => {
                 
                    response.json().then((data) => {
                        const zipcode = data.results[0].address_components[6].long_name
                     
                        console.log(data.results[0].formatted_address)
                        const address = data.results[0].formatted_address
                        try {
                            createNewToilet({
                                    variables: { lat, lng, address, zipcode, coordinates: coordinates, ...formState}
                                })
                                return history.push('/')
                            } catch (e) {
                                console.error(e)
                                console.log(error)
                            }
                    });
    
                   
                })
              
        })



    }


    return (
        <>
        {/* {!Auth.loggedIn && <Redirect to='/' /> } */}
        {/* {Auth.loggedIn && !selected && <Redirect to='/' />} */}
        {/* {Auth.loggedIn() && selected && ( */}
        <>
        <h1>Form</h1>
        <Form onSubmit={handleFormSubmit}>
            <FormGroup>
                <Label for="overallRating">Overall Score?</Label>
                <Input onChange={handleChange} defaultValue={'3'} type="select" name="overallRating" id="overallRating">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="genderNeutral">Gender Neutral?</Label>
                <Input onChange={handleChange} defaultValue={'No'} type="select" name="genderNeutral" id="genderNeutral">
                    <option>Yes</option>
                    <option>No</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="cleanliness">Clean?</Label>
                <Input onChange={handleChange} defaultValue={'3'} type="select" name="cleanliness" id="cleanliness">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="changingTable">Changing Table?</Label>
                <Input onChange={handleChange} defaultValue={'No'} type="select" name="changingTable" id="changingTable">
                    <option>Yes</option>
                    <option>No</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="handicapAccessible">Handicap Accessible?</Label>
                <Input onChange={handleChange} defaultValue={'3'} type="select" name="handicapAccessible" id="handicapAccessible">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="toiletPaper">Toilet Paper?</Label>
                <Input onChange={handleChange} defaultValue={'No'}type="select" name="toiletPaper" id="toiletPaper">
                    <option>Yes</option>
                    <option>No</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="keys">Key Required?</Label>
                <Input onChange={handleChange} defaultValue={'No'} type="select" name="keys" id="keys">
                    <option>Yes</option>
                    <option>No</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="comment">comment</Label>
                <Input onChange={handleChange} type="textarea" id="comment" name="comment" placeholder="Enter a comment"></Input>
            </FormGroup>
           <Button>Submit</Button>
        </Form> 
        </>
        </>
    )
}

export default AddToilet;