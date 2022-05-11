import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_TOILETS } from '../utils/queries';

// import { Link } from 'react-router-dom';

const DisplayReview = () => {
    const { loading, error, data } = useQuery(QUERY_ALL_TOILETS);
    console.log('test');

    const toilets = data?.toilets || [];

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

            {toilets.map(toilet => {
                return (
                    <div>
                        <h3>Address: {toilet.address}</h3>
                         
                        <h5>Coordinates: {toilet.coordinates}</h5>

                        <h5>Zipcode: {toilet.zipcode}</h5>
                        

                        {/* <h2>Address: {toilet.address}</h2>
                        <p>zipcode: {toilet.zipcode}</p> */}
                    </div>
                );
            })}

            {/* <pre>
                {JSON.stringify(toilets, null, 2)}
            </pre> */}
            
        </div>
    )
}

export default DisplayReview;