"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

function navUserStories(evt) {
  console.debug("navUserStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
}

$body.on("click", "#nav-user-profile", navUserStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-link").show();
  $('.fa-star').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();

  $loginForm.hide();
  $signupForm.hide();
}

function navSubmitClick(evt) {
  hidePageComponents();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);