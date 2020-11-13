import React, { useRef, useEffect } from "react";
import { useFormikContext } from "formik";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSelector } from "react-redux";

export interface Place {
  formatted_address: string;
  latValue: number;
  lngValue: number;
}

interface LocationProps {
  latFieldName: string; // Formik Field Name
  lngFieldName: string;
  formattedAddressFieldName: string;
  formattedAddress: string;
}

const LocationPicker: React.FC<LocationProps> = (props) => {
  const GOOGLE_MAPS_API_KEY = useSelector(
    (state: { auth: { apiKey: string } }) => state.auth!.apiKey
  );
  const ref = useRef();
  // Used with setting date value in formik
  const { setFieldValue } = useFormikContext();

  const locationPicked = (data, details) => {
    setFieldValue(props.formattedAddressFieldName, details?.formatted_address);
    setFieldValue(props.latFieldName, details?.geometry.location.lat);
    setFieldValue(props.lngFieldName, details?.geometry.location.lng);
  };

  useEffect(() => {
    ref.current?.setAddressText(props.formattedAddress);
  }, []);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder="Add Location"
      currentLocation={true}
      fetchDetails={true} // Details in onPress should not be null
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: "en",
      }}
      onPress={locationPicked}
      nearbyPlacesAPI="GooglePlacesSearch"
      styles={{
        textInputContainer: {
          width: "100%",
        },
        description: {
          fontWeight: "bold",
        },
        predefinedPlacesDescription: {
          color: "#1faadb",
        },
      }}
    />
  );
};

export default LocationPicker;
