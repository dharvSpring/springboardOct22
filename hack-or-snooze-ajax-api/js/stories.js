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
  const isMine = (currentUser !== undefined) ? currentUser.isMyStory(story.storyId) : false;
  return $(`
      <li id="${story.storyId}">
        <i class="${isFavorite ? 'fas' : 'far'} fa-star ${currentUser === undefined ? 'hidden' : ''}"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${isMine ? '<small><i class="fas fa-times delete"></i></small>' : ''}
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

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favStoriesList.append('<h3>You have no favorites =(</h3>');
  } else {
    // loop through all favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStoriesList.append($story);
    }
  }

  $favStoriesList.show();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $userStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $favStoriesList.append('<h3>You have no stories =(</h3>');
  } else {
    // loop through all own stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $userStoriesList.append($story);
    }
  }

  $userStoriesList.show();
}

async function submitStory(event) {
  event.preventDefault();
  
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  const story = await storyList.addStory(currentUser, {title, author, url});
  currentUser.ownStories.push(story);

  $submitForm.trigger("reset");
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

  if ($favStoriesList.is(':visible')) {
    putFavoritesOnPage();
  }
}

async function deleteStory(event) {
  const $storyLi = $(event.target).closest('li');
  const storyId = $storyLi.attr('id');
  console.log(storyId);

  await storyList.deleteStory(currentUser, storyId);
  $storyLi.remove();
}

$submitForm.on('submit', submitStory);
$('#all-stories').on('click', '.fa-star', toggleFavorite);
$('#all-stories').on('click', '.delete', deleteStory);