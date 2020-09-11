'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container-fluid");

// Don't touch this function please
const autorun = async (event, param = 'now_playing') => {
  const movies = await fetchMovies(param);
  const genres = await fetchGenres();
  renderGenres(genres.genres, movies.results);
  renderMovies(movies);  
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};


// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCast = await fetchCast(movie.id);
  const movieTrailer = await fetchTrailer(movie.id);
  const relatedMovie = await fetchSimilar(movie.id);
  
  renderMovie(movieRes);
  renderCast(movieCast);
  renderTrailer(movieTrailer);
  renderSimilar(relatedMovie);
  
};

const actorDetail = async (actor) => {
  const actorMovies = actor.known_for;
  const actorResponse = await fetchActor(actor.id);
  renderActor(actorResponse, actorMovies);
}


//---------- Search field ------------//

//1. Prevent form dafualt behaviour
function stopSending(event) {
  event.preventDefault();
  return false;
}

//2. Fetch search results 
const fetchSearchMovie = async (word) => {
  
  const url = constructUrl(`search/movie`);
  const searchUrl = `${url}&query=${word}`
  //console.log(searchUrl)
  const res = await fetch(searchUrl);
  return res.json();
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async (property) => {
  const url = constructUrl(`movie/${property}`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchCast = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

const fetchSimilar = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
}

const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
}

const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  
  addSortByDropdown();
  getMoviesBy();

  CONTAINER.innerHTML += `<header id="page-header">

  <div class="title">
    <h2 class="custom-heading text-center display-4 text-white">Movie Searcher</h2>
    <p class="custom-paragraph text-center text-white">Millions of movies, TV shows and people to discover. Explore now.
    </p>
  </div>
  <div class="col-auto ml-5 mr-0">
  <form id="search-form" class="form-inline my-2 my-lg-0" onsubmit="stopSending(event)">
    
    <input class="form-control mr-sm-2" id="start-search" type="search" placeholder="Search" aria-label="Search">
    <button class="btn custom-serach-btn btn-outline-success my-2 my-sm-0" onclick="renderSearchMovies()" type="submit">GO</button>
    </div>
  </form>
</header>`

  const movieRow = document.createElement("div")
  movieRow.className = "row";

  if (Array.isArray(movies.results)) {
    movies.results.map((movie) => {
      
      const movieDiv = document.createElement("div");
      movieDiv.classList = "col-md-4"
      movieDiv.innerHTML = `<div class = "custom-card mt-4 mr-2">
          <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
        movie.title
        } poster" class = "main-poster-img" width = 100%>
          <h3 class = "movie-title">${movie.title}</h3></div>`;
      movieDiv.addEventListener("click", () => {
        movieDetails(movie);
      });
      movieRow.appendChild(movieDiv)
      CONTAINER.appendChild(movieRow)
    });
  } else {
    const movieDiv = document.createElement("div");
    movieDiv.classList = "col-md-4"
    movieDiv.innerHTML = `
          <img src="${BACKDROP_BASE_URL + movies.backdrop_path}" alt="${
      movies.title
      } poster" class = "main-poster-img" width = 100%>
          <h3>${movies.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieRow.appendChild(movieDiv)
    CONTAINER.appendChild(movieRow)
  }
};
  


const renderSearchMovies = async () => {
  const searchField = document.getElementById("start-search");
  const word = searchField.value;
  //console.log(word)
  const data = await fetchSearchMovie(word);
  if (word === "") {
    console.log("I need query")
  }else {
    clearMovies();
    renderMovies(data.results);
    return renderMovies(data);
  }
  
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
  <div class = "info-card" style="background-image: linear-gradient(to right, 
    rgba(53, 38, 76, 0.8),
    rgba(86, 62, 124, 0.85)
),
url(${BACKDROP_BASE_URL + movie.backdrop_path}); background-position: 50% 50%;
background-size: cover">
    <div class="row">
        <div class="col-md-4">
             <img id="movie-poster-path" src=${
    BACKDROP_BASE_URL + movie.poster_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="h2-title">${movie.title}</h2>
            <div class = "row">
            <div class = "col-md-6">
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            </div>
            <div class = "col-md-6">
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            </div>
            </div>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <div class = "row mb-3">
            <div class = "col-md-6">
            <h5 id = "director">Director: </h5></div>
            <div class = "col-md-6"><h5>Language: ${movie.original_language}</h5></div>

            </div>
            
            <div class = "row mb-3">
            <div class = "col-md-6"><h5>Rating: ${movie.vote_average}</h5></div>
            <div class = "col-md-6"><h5>Votes: ${movie.vote_count}</h5></div>
            </div>

            <div class = "row mt-5">
            <div class = "col-md-6 d-flex align-items-center"><h5>Production Company: ${movie.production_companies[0]["name"]}</h5></div>
            <div class = "col-md-6 d-flex align-items-center
            "><img class ="company-logo" src="${BACKDROP_BASE_URL + movie.production_companies[0]["logo_path"]}" alt="${movie.production_companies[0]["name"]} logo" width = 100px></div>
            </div>

        </div>
        </div>
        </div>
            <div class = "row page-padding">
            <div class = "col-10">
            <h3>Actors:</h3>
            
            <ul id="actors" class="list-unstyled"></ul>
            </div>
            </div>
            
            <div class = "row page-padding flex-column">
            <h3 id = "trailer">Trailer: </h3>
            <div id = "video-container"></div>
            </div>
            <div class = "row page-padding flex-column">
            <h3>Related Movies:</h3>
            <ul id="related" class="list-unstyled"></ul>
            </div>
            
    </div>`;


};

const renderCast = (movie) => {
  
  //console.log(movie.cast[20]);
  const actors = document.getElementById("actors");
  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement("li")
    const actorName = document.createTextNode(movie.cast[i]["name"])
    const actorImg = document.createElement("img")
    actorImg.setAttribute("src", `${BACKDROP_BASE_URL + movie.cast[i]["profile_path"]}`)
    actorImg.className = "actors-li"
    actorLi.className = "inline-list small-card"
    actorLi.appendChild(actorImg);
    actorLi.appendChild(actorName);
    actors.appendChild(actorLi);
  }



  for (let i = 0; i < movie.crew.length; i++) {
    if (movie.crew[i]["job"] === "Director") {
      //console.log(movie.crew[i]["name"])
      const direName = movie.crew[i]["name"];
      //console.log(direName)
      //console.log("textNode", directorName)

      const directorHeading = document.getElementById("director")
      const directorName = document.createTextNode(direName);
      directorHeading.appendChild(directorName)
    }
  }
}

const renderTrailer = (movie) => {
  const urlId = movie.results[0]["key"]
  const urlFirstSection = "https://www.youtube-nocookie.com/embed/"
  const videoContainer = document.querySelector("#video-container");
  const trailerFrame = `<iframe width="80%" height="500" src= "${urlFirstSection + urlId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

  videoContainer.innerHTML = trailerFrame;

}


const renderSimilar = (movie) => {
  const relatedContainer = document.querySelector("#related");
  for (let i = 0; i < 5; i++) {
    const similarLi = document.createElement("li")
    similarLi.className = "inline-list small-card"
    const similarTitle = document.createTextNode(movie.results[i]["title"])
    const similarPosterImg = document.createElement("img")
    similarPosterImg.setAttribute("src", `${BACKDROP_BASE_URL + movie.results[i]["poster_path"]}`)
    similarPosterImg.setAttribute("class", "related-poster")
    similarLi.appendChild(similarPosterImg)
    similarLi.appendChild(similarTitle)
    relatedContainer.appendChild(similarLi);
  }
}



const renderGenres = (genres, movies) => {
  renderMenuList(genres, movies);
}

const renderMenuList = (genres, movies) => {
  const dropdownMenu = document.querySelector('#genre-menu');
  genres.forEach(genre => {
    const aTag = document.createElement('a');
    aTag.addEventListener('click', function (e) {
      renderMoviesByGenre(parseInt(e.target.id), movies);
    })
    aTag.classList.add('dropdown-item');
    aTag.setAttribute('href', '#');
    aTag.setAttribute('id', genre.id);
    aTag.innerHTML = genre.name;
    dropdownMenu.appendChild(aTag);
  });
};

const renderMoviesByGenre = (genreId, movies) => {
  clearMovies();
  const movieRow = document.createElement("div")
  movieRow.className = "row page-padding";
  const filteredMovies = movies.filter(movie => {
    return movie.genre_ids.includes(genreId);
  });
  filteredMovies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList = "col-md-4"
    movieDiv.innerHTML = `<div class = "custom-card mt-4 mr-2">
    <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
  movie.title
  } poster" class = "main-poster-img" width = 100%>
    <h3 class = "movie-title">${movie.title}</h3></div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    movieRow.appendChild(movieDiv)
    CONTAINER.appendChild(movieRow)
  });
};

const getMoviesBy = () => {
  const sortByList = document.querySelectorAll('#sort-list a');
  sortByList.forEach(item => {
    console.log('Nodename',item.nodeName)
    console.log('Id',item.id)
    item.addEventListener("click", function (event) {
      console.log('Click!!')
      autorun(event, event.target.id);
    });
  });
}

const addSortByDropdown = () => {
  CONTAINER.innerHTML = `
  <div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Sort By
    </button>
    <div id="sort-list" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a id="now_playing" class="dropdown-item" href="#">Now Playing</a>
      <a id="latest" class="dropdown-item" href="#">Latest</a>
      <a id="popular" class="dropdown-item" href="#">Popular</a>
      <a id="top_rated" class="dropdown-item" href="#">Top Rated</a>
      <a id="upcoming" class="dropdown-item" href="#">Upcoming</a>
    </div>
  </div>`;
};

const renderActors = async () => {
  clearMovies();
  const actors = await fetchActors();
  const actorRow = document.createElement("div");
  actorRow.classList = 'row page-padding';
  actors.results.map(actor => {
    const actorDiv = document.createElement("div");
    actorDiv.classList.add('col-md-4')
  
    actorDiv.innerHTML = `<div class = "custom-card mt-4 mb-2">
        <img class = "main-poster-img" width = "100%" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
      actor.name
      } poster">
        <h3>${actor.name}</h3></div>`;
    actorDiv.addEventListener("click", () => {
      actorDetail(actor);
    });
    actorRow.appendChild(actorDiv);
  });
  CONTAINER.appendChild(actorRow);
};

const renderActor = (actor, actorMovies) => {
  let gender;
  if(actor.gender === 1) gender = 'Female';
  if(actor.gender === 2) gender = 'Male';
  
  CONTAINER.innerHTML = `
    <div class="container">
  <div class="row">
    <div class="col-md-4">
      <img src=${BACKDROP_BASE_URL + actor.profile_path} class="card-img custom-card-img" alt="..."/>
    </div>
    <div class="col-md-8">
      <div class="row">
        <div class="col-12">
          <h2 class="card-title actor-card-h2">${actor.name}</h2>
        </div>
        <div class="col-4">
          <p>Gender: ${gender}</p>
        </div>
        <div class="col-4">
          <p>Birthday: ${actor.birthday}</p>
        </div>
        <div class="col-4">
          <p>Deathday: ${actor.deathday ? actor.deathday : '-'}</p>
        </div>
        <div class="col-12">
          <h3 class = "actor-card-h3">Biography</h3>
          <p class = "actor-card-p">${actor.biography}</p>
          
        </div>
        <div class="col-12">
        <h3 class="mb-3 actor-card-h3">${actor.name}'s most popular movies</h3>
          ${actorMovies.map(movie => {
          return ` <div class="card mb-3">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src=${BACKDROP_BASE_URL + movie.backdrop_path} class="card-img" alt="..."/>
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Name: ${movie.title ? movie.title : movie.name}</h5>
        <div class="row">
        <div class="col-6">
       <p class="card-text"><small class="text-muted">Vote Average: ${movie.vote_average}</small></p>
        </div>
        <div class="col-6">
        <p class="card-text"><small class="text-muted">Vote Count: ${movie.vote_count}</small></p>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>` }).join('')}
        </div>
      </div>
    </div>
  </div>
</div>`;
}


const clearMovies = () => {
  CONTAINER.innerHTML = '';
};

document.addEventListener("DOMContentLoaded", autorun);

