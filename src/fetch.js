export async function fetchImages(query, currentPage) {
    const axios = require('axios');
    let response = axios.get(`https://pixabay.com/api/`, {
        params: {
            key: `24969283-4f94e97e03339c4eb5ce6e732`,
            q: `${query}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: currentPage,
            per_page: 40,
        }
    });
    return response;
}