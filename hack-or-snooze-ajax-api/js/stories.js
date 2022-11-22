"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName(story.url);
  const isFavorite = (currentUser !== undefined) ? currentUser.isFavorite(story.storyId) : false;
  return $(`
      <li id="${story.storyId}">
        <i ${currentUser === undefined ? 'style="display: none"' : ''} class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStory(event) {
  event.preventDefault();
  
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  const story = await storyList.addStory(currentUser, {title, author, url});

  navAllStories(event);
}

async function toggleFavorite(event) {
  const $star = $(event.target);
  const $storyLi = $star.closest('li');
  const storyId = $storyLi.attr('id');

  const clickedStory = storyList.stories.find((curStory) => (curStory.storyId === storyId));
  console.log(clickedStory);

  if (currentUser.isFavorite(storyId)) {
    await currentUser.removeFavorite(clickedStory);
    $star.removeClass('fas');
    $star.addClass('far');

  } else {
    await currentUser.addFavorite(clickedStory);
    $star.removeClass('far');
    $star.addClass('fas');
  }
}

$submitForm.on('submit', submitStory);
$allStoriesList.on('click', '.fa-star', toggleFavorite);