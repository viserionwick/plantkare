// Essentials
import axios from "axios";

const fetchGeocode = async (searchQuery: string) => {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=70862715309240028e32981209e8f146`);
    const data = await response.data;
    const { lat, lng } = data.results[0].geometry;

    return {
        latitude: lat,
        longitude: lng
    };
}

export default fetchGeocode;