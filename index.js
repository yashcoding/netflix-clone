//const
const apikey ="12890b5ffa65162aa8f7af36e552f4eb";
const apiEndpoint = "https://api.themoviedb.org/3";
const searchapikey ="AIzaSyBqoG95FkL1UV4Vqs1YrhSr_XNIeQxhJ4c";
const searchapiEndpoint = "https://www.googleapis.com/youtube/v3";
const imgPaths = "https://image.tmdb.org/t/p/original"
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `${searchapiEndpoint}/search?part=snippet&q=${query}&key=${searchapikey}`,

}

function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

// Dynamic banner---
function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending,'Trending in India')
    .then(list =>{
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex])
    }).catch(err=>{
        console.error(err);
    });
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage =`url('${imgPaths}${movie.backdrop_path}') `;

    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">#Trending movie | Released -${movie.release_date}</p>
    <p class="banner_overview"> ${movie.overview && movie.overview.length>200?movie.overview.slice(0,200).trim()+'...':movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-buttons"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: msFilter"><path d="M7 6v12l10-6z"></path></svg>&nbsp;&nbsp;Play</button>
        <button class="action-buttons"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgb(255, 254, 254);transform: msFilter"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path></svg>&nbsp;&nbsp;More Info</button>
    </div>`

    div.className="banner-content container";
    bannerCont.append(div);
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndbuildMovieSection(
                    apiPaths.fetchMoviesList(category.id), 
                    category.name
                    );
            });
        }
        // console.table(movies);
    })
    .catch(err=>console.error(err));
}


function fetchAndbuildMovieSection(fetchUrl,categoryName){
   console.log(fetchUrl,categoryName);
   return fetch(fetchUrl)
   .then(res => res.json())
   .then(res => {
    console.table(res.results);
    const movies = res.results;
    if (Array.isArray(movies) && movies.length){
        buildMoviesSection(movies,categoryName);
    }
     return movies;
    })
   .catch(err => console.error(err))
}

function buildMoviesSection(list,categoryName){
    console.log(list,categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHtml = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">

          <img class="movie-item-img"  src="${imgPaths}${item.backdrop_path}" alt="${item.title}" />
          <iframe width="245" height="150" src="" id='yt${item.id}'></iframe>
        </div>
        `;
    }).join('');

    const moviesSectionHTML =`
         <h2 class="movie-section-heading">${categoryName}<span class ="explore-nudge">Explore All</span></h2>
         <div class="movies-row">
         ${moviesListHtml}
         </div>
    `

    const div = document.createElement('div')
    div.className= "movies-section"
    div.innerHTML = moviesSectionHTML

    // append HTML into movies Container
    moviesCont.append(div);
}

// trailer fetching
function searchMovieTrailer(movieName, iframeId){
    console.log( document.getElementById(iframeId),iframeId);
    if(!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        console.log(youtubeUrl);
        const elements = document.getElementById(iframeId);
        elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&mute=1`;
    })
    .catch(err => console.log(err));
}


window.addEventListener('load',function(){
    init();
    this.window.addEventListener('scroll',function(){
        // header ui update
        const header = this.document.getElementById('header');
        if(this.window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})