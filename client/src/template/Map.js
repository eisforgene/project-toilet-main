import React, { useState, useEffect } from 'react';
import env from 'react-dotenv';
import mapStyles from '../mapStyles';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from '@react-google-maps/api'
import { Link } from 'react-router-dom';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    getZipCode
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";
import {  useQuery } from '@apollo/client';
import { QUERY_TOILETS } from '../utils/queries';
import '@reach/combobox/styles.css'


const libraries = ['places']
const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const center = {
    lat: 34.0522,
    lng: -118.2437
}



const Map = ({zipcode, setZipcode, selected, setSelected}) => {

    // const [zipcode, setZipcode] = useState('90027')
    // const [selected, setSelected] = useState(null)
    const [markers, setMarkers] = useState([]);
    

    const {loading, data, refetch} = useQuery(QUERY_TOILETS, {variables: {zipcode}})

    useEffect(() => {
        
   
        if (data) {
            setMarkers([])
            const {toiletsByZip} = data
            console.log(toiletsByZip)
            toiletsByZip.map((datum) => {
              const lng = parseFloat(datum.lng)
                const lat = parseFloat(datum.lat)
                setMarkers((current) => [
                    ...current,
                    {
                    lng,
                    lat,
                    address: datum.address
                }
                ])
            })
        } 
    }, [data, loading])
 

    const { isLoaded, loadError } = useLoadScript({
        id: process.env.GOOGLE_MAPS_ID || env.GOOGLE_MAPS_ID,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || env.GOOGLE_MAPS_API_KEY,
        libraries
    });
    
    // const updateZipcode = (zip) => {
    //     setZipcode(zip)
    //     refetch({zip})
    // }

    // const onMapClick = React.useCallback((event) => {
    //     setMarkers((current) => [
    //         ...current,
    //         {
    //             lat: event.latLng.lat(),
    //             lng: event.latLng.lng(),
    //         }
    //     ])
    // },
    //     [])

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(12);
        
    }, [])


    if (loadError) return 'Error Loading maps';
    if (!isLoaded) return "Loading Maps";

    return (
        <div>
            <Search panTo={panTo} />
            <Locate panTo={panTo}/>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} options={options} onLoad={onMapLoad}>

                {markers.map((marker) => (
                    <Marker
                        key={marker.address}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={
                            {
                                url: "/toilet.svg",
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15)
                            }
                        }
                        onClick={() => {
                            setSelected(marker)
                        }}
                    />
                ))}

                {selected ? (<InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => { setSelected(null) }}>
                    <div>
                        <h2>Toilet</h2>
                        <h3>{selected.address}</h3>
                        <div>
                        <Link to="/specificReviews">View Reviews!</Link>
                        </div>
                        <div>
                        <Link to="/add">Leave A Review!</Link>
                        </div>
                    </div>
                </InfoWindow>) : null}
            </GoogleMap>
        </div>
    )

    function Locate({ panTo }) {
        return <button className="locate" onClick={() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {

               
                
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${env.GOOGLE_MAPS_API_KEY}`).then((response) => {
                    
                if (response.ok) {
                    response.json().then((data) => {
                        const zip = data.results[0].address_components[6].long_name
                        setZipcode(zip);
                        refetch({zipcode: zip})
                    });

                    panTo({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                }
                
                
                })
            }, () => null)
        }} 
        >
            <img src="/arrow.svg" alt="compass - locate me"/>
        </button>
        
    }
    function Search({ panTo }) {
        // hook gives back is the script ready to go, current value as user is typing in the search box, suggestions of places and data, a setValue function and a clearSuggestions function
        const { ready, 
                value, 
                suggestions: { status, data }, 
                setValue, 
                clearSuggestions 
            } = usePlacesAutocomplete({
            requestOptions: {
                // uses locations close to user, will subsitute hardcoded lat and long with users lat and long
                location: {
                    lat: () => 34.0522,
                    lng: () => -118.2437
                },
                radius: 200 * 1000,
            },
        });

        return (
        
        <Combobox onSelect={async (address) => {
            // false means that you should not fetch data from google API because we will do that with get Geocode
           
            setValue(address, false)

            // remove suggestion boxes
            clearSuggestions();

            try {
                const results = await getGeocode({address});
                const zip = await getZipCode(results[0], false)
                if (zip) {
             
                setZipcode(zip)
                refetch({zipcode: zip})
                const { lat, lng } = await getLatLng(results[0])
               
                panTo({lat, lng})
                }

               
            } catch(error) {
                console.log('error!')
            }

            }}>
            <ComboboxInput 
                value={value} 
                className="form-control form-control-lg"
                onChange={(e) => {
                    setValue(e.target.value)
                    }}
                disabled={!ready}
                placeholder="Enter an address"
            >

            </ComboboxInput>
            <ComboboxPopover>
                <ComboboxList>
                {status === "OK" && data.map(({id, description}) => 
                <ComboboxOption key={id} value={description}/> )}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    
        )
    }

}

export default Map;