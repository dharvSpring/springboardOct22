"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

const searchEndPoint = 'http://api.tvmaze.com/search/shows';
const episodesEndPoint = 'http://api.tvmaze.com/shows/SHOW_ID/episodes';

const emptyImgSrc = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png';
const emptyImgSrc2 = 'https://tinyurl.com/tv-missing';

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const {data} = await axios.get(searchEndPoint, {params: {q: term}});
  const showData = [];
  for (let {show} of data) {
    let {id, name, summary, image} = show;
    if (image === undefined || image === null || image.medium.length < 1) {
      image = emptyImgSrc2;
    } else {
      image = image.medium;
    }
    showData.push({id, name, summary, image});
  }

  return showData;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
          <div class="media">
            <img 
                src="${show.image}" 
                alt="${show.name}" 
                class="w-25 mr-3">
            <div class="media-body">
              <h5 class="text-primary">${show.name}</h5>
              <div><small>${show.summary}</small></div>
              <button class="btn btn-outline-info btn-sm Show-getEpisodes">
                Episodes
              </button>
            </div>
          </div>  
        </div>
        `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  if (!term) {
    return;
  }
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

async function fetchEpisodesAndDisplay(target) {
  const {showId} = $(target).closest('.Show').data();
  const episodes = await getEpisodesOfShow(showId);

  $episodesArea.show();
  populateEpisodes(episodes);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on('click', '.Show-getEpisodes', async function (evt) {
  await fetchEpisodesAndDisplay(evt.target);
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  const {data} = await axios.get(episodesEndPoint.replace('SHOW_ID', id));

  const epData = [];
  for (let ep of data) {
    const {id, name, season, number} = ep;
    epData.push({id, name, season, number});
  }

  return epData;
}

/** Given a list of episodes, create markup for each and to DOM */
function populateEpisodes(episodes) {
  $episodesArea.empty();
  for (let episode of episodes) {
    const $episode = $(`<li data-episode-id="${episode.id}">${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesArea.append($episode);
  }
}
