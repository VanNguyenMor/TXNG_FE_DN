import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { MAP_KEY } from "../../services/Common";

import '../../assets/css/control/google_autocomplete_input.css';
import { useState } from "react";

const GoogleAutoCompleteInput = props => {
    let timeOut = null;

    const [isShowPopup, setShowPopup] = useState(false);

    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading
    } = usePlacesService({
        apiKey: MAP_KEY,
    });

    function onChange(e) {
        clearTimeout(timeOut);

        timeOut = null;

        timeOut = setTimeout(() => {
            const value = e.target.value;

            getPlacePredictions({ input: value });

            if (props.onChange) {
                props.onChange(e);
            }

            setShowPopup(true);
        }, 300);
    }

    function onSelect(item) {
        return () => {
            if (placePredictions.length > 0 && item.place_id && placesService) {
                placesService.getDetails(
                    {
                        placeId: item.place_id,
                    },
                    (placeDetails) => {
                        const { lat, lng } = placeDetails.geometry.location;

                        if (props.onSelect) {
                            props.onSelect({ latitude: lat(), longitude: lng() });
                        }

                        setShowPopup(false);
                    }
                );
            }
        }
    }

    function onClick(e) {
        setShowPopup(true);

        if (props.onClick) {
            props.onClick(e);
        }
    }

    function onBlur(e) {
        let timeOut = setTimeout(() => {
            setShowPopup(false);

            if (props.onBlur) {
                props.onBlur(e);
            }

            setTimeout(timeOut);

            timeOut = null;
        }, 300);
    }

    return <div className={props.classNameContainer}>
        <input {...props} placeholder={props.placeholder || "Tìm kiếm địa chỉ..."} onChange={onChange} onClick={onClick} onBlur={onBlur} />
        {isShowPopup && <ul className="google-autocomplete-input-list">
            {placePredictions.map(item => {
                return (
                    <li key={item.place_id} className="google-autocomplete-input-list-item">
                        <button onClick={onSelect(item)} type='button' className="google-autocomplete-input-list-item-button">
                            <p className="google-autocomplete-input-list-item-button-text">{item.description}</p>
                        </button>
                    </li>
                )
            })}
        </ul>}
    </div>
}

export default GoogleAutoCompleteInput;