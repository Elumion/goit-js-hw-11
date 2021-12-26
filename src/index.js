import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

const inputSearch = document.querySelector("#image__input-id");
const searchImgBtn = document.querySelector("#search__image-btn");
const loadMoreBtn = document.querySelector(".load-more");
let container = document.querySelector(".gallery");

loadMoreBtn.style.display = "none";

let lightbox = new SimpleLightbox('.gallery a', {});
let page = 1;

const refreshElem = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const renderImgs = (obj) => {
    obj.hits.forEach(element => {
        const linkElement = `
        <div class="photo-card">
            <a href="${element.largeImageURL}">
                <img class="gallery__img"  src="${element.webformatURL}" width="350" alt="${element.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes </b><span>${element.likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b> <span>${element.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments </b><span>${element.comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads </b><span>${element.downloads}</span>
                </p>
            </div>
        </div>
        `
        container.innerHTML += linkElement;
    });
    lightbox.refresh();
}

const fetchImg = async (isLoadMore, currentPage, e) => {
    e.preventDefault();
    loadMoreBtn.style.display = "none";
    if (isLoadMore) {
        page++;
        currentPage = page;
    }
    else {
        page = 1;
        refreshElem(container);
    }

    const axios = require('axios');

    let response = await axios.get(`https://pixabay.com/api/`, {
        params: {
            key: `24969283-4f94e97e03339c4eb5ce6e732`,
            q: `${inputSearch.value.replace(" ", "+")}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: currentPage,
            per_page: 40,
        }
    })
        .then(res => {
            if ((inputSearch.value === "" && !isLoadMore) || res.data.totalHits === 0) {
                throw new Error(res.statusText);
            }
            if (res.data.totalHits - currentPage * 40 <= 0) {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`,
                    {
                        timeout: 3000,
                    });
                loadMoreBtn.style.display = "none";
            }
            else {
                loadMoreBtn.style.display = "block";
            }
            if (!isLoadMore) {
                Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`,
                    {
                        timeout: 3000,
                    });
            }
            renderImgs(res.data);
        })
        .catch(err => Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`,
            {
                timeout: 3000,
            }));
}

searchImgBtn.addEventListener("click", fetchImg.bind(this, false, 1));
loadMoreBtn.addEventListener("click", fetchImg.bind(this, true, page));
