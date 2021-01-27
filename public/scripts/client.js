/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* eslint-env jquery */
/* eslint-env browser */


// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(() => {

  const tweetData = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "createdAt": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd"
      },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "createdAt": 1611685701267
    }
  ];

  const renderTweets = function(tweets) {
    $.each(tweets, (i, v) => {
      $('#tweets-container').prepend(createTweetElement(v));
    });
    
  };

  const createTweetElement = function(tweet) {
    let $tweet = $(`
      <article class="tweet">
        <header>
          <img src=${tweet.user.avatars} alt="user photo">
          <span class="username">${tweet.user.name}</span>
          <span class="user-handle">${tweet.user.handle}</span>
        </header>
        <p>${tweet.content.text}</p>
        <footer>
          <span class="time-since-post">${tweet.createdAt}</span>
          <div class="icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4056A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4056A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-repeat"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4056A1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  renderTweets(tweetData);

  $('.new-tweet form').on('submit', function(event) {
    
    event.preventDefault();

    console.log($(this).serialize());

    $.ajax('../tweets', {
      method: 'POST',
      data: $(this).serialize()
    }).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.log(err);
    });

  });

});