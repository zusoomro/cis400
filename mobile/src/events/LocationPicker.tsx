import React from "react";
import { useField, useFormikContext } from "formik";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GOOGLE_MAPS_API_KEY, KEY } from "@env";

export interface Place {
    formatted_address: string,
    latValue: number,
    lngValue: number,
};

interface LocationProps {
    latFieldName: string; // Formik Field Name
    lngFieldName: string;
    formattedAddress: string;
}

const LocationPicker: React.FC<LocationProps> = (props) => {
    // Used with setting date value in formik 
    const { setFieldValue } = useFormikContext();
    const [latField] = useField(props.latFieldName);
    const [lngField] = useField(props.lngFieldName);
    const [formattedAddress] = useField(props.formattedAddress);

    const locationPicked = (data, details) => {
        console.log("Selected Location")
        setFieldValue(props.formattedAddress, details?.formatted_address);
        setFieldValue(props.latFieldName, details?.geometry.location.lat);
        setFieldValue(props.lngFieldName, details?.geometry.location.lng);
    }

    return (
        <GooglePlacesAutocomplete
            placeholder='Add Location'
            currentLocation={true}
            fetchDetails={true} // Details in onPress should not be null
            query={{
                key: GOOGLE_MAPS_API_KEY, 
                language: 'en'
            }}
            onPress={locationPicked}
            nearbyPlacesAPI='GooglePlacesSearch'
            styles={{
                textInputContainer: {
                    width: '100%'
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                }
            }}
        />
    );
};

export default LocationPicker;