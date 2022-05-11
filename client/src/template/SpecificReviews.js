import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_TOILET_ADDRESS } from '../utils/queries';

// import { Link } from 'react-router-dom';

const SpecificReviews = ({selected}) => {


    console.log(selected.address)
    const { loading, error, data } = useQuery(QUERY_TOILET_ADDRESS, {variables: {address: selected.address}});
    console.log('test');

    console.log(data)

    const toilet = data?.toiletByAddress || [];

    if (error) {
        console.log(error);
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return(
        <div>
            <h1>
                Toilet Reviews
            </h1>
                    <div>
                        <h3>Address: {toilet.address}</h3>
                         
                        <h5>Coordinates: {toilet.coordinates}</h5>

                        <h5>Zipcode: {toilet.zipcode}</h5>
                        

                        {/* <h2>Address: {toilet.address}</h2>
                        <p>zipcode: {toilet.zipcode}</p> */}
                    </div>

            {/* <pre>
                {JSON.stringify(toilets, null, 2)}
            </pre> */}
            
        </div>
    )
}

export default SpecificReviews;