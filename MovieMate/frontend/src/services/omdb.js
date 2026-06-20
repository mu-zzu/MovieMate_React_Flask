import axios from "axios";

const API_KEY = "6af06243";

export const fetchMovieDetails = async (title) => {
    try {
        const response = await axios.get(
            `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
        );

        return response.data;

    } catch (error) {
        console.error("OMDb Error:", error);
        return null;
    }
};