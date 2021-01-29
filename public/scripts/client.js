/* eslint-env jquery */
/* eslint-env browser */

$(document).ready(() => {
  
  // Initialize constants for the current user
  const user = {
    name: 'Søren Kierkegaard',
    handle: '@eitheror',
    avatars: 'https://i.imgur.com/DVpDmdR.png'
  };
  
  // Add the user's name and image to the header
  $('#header-username').html(`${user.name}`);
  $('body > header div:first-child').append(`<img src=${user.avatars} alt="User Profile Image" id="header-profile-photo">`);
  
  // Escape potentially dangerous user input before generating HTML from it
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Template function to return appendable HTML from a tweet object
  const createTweetElement = function(tweet) {
    let $tweet = $(`
      <article class="tweet">
        <header>
          <img src=${tweet.user.avatars} alt="user photo">
          <span class="username">${tweet.user.name}</span>
          <span class="user-handle">${tweet.user.handle}</span>
        </header>
        <p>${escape(tweet.content.text)}</p>
        <footer>
          <span class="time-since-post">${dayjs().to(dayjs(tweet.createdAt))}</span>
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
  
  // Loop through each input tweet and prepend to the container element
  const renderTweets = function(tweets) {
    $.each(tweets, (i, v) => {
      $('#tweets-container').prepend(createTweetElement(v));
    });
  };
  
  // Load tweets on document ready
  const loadTweets = () => {
    $.ajax('../tweets', {
      method: 'GET'
    }).then(result => {
      renderTweets(result);
    }).catch(err => {
      console.log(err);
    });
  };
  loadTweets();

  // Add a tweet submission error box or replace its message
  const showErrorBox = (errorMsg) => {
    if ($('#error-box').length) {
      $('#error-box').html(`<p>❗ ${errorMsg} ❗</p>`);
    } else {
      $(`<div id="error-box"><p>❗ ${errorMsg} ❗</p></div>`).hide().prependTo('.new-tweet').slideDown();
    }
  };

  // Handler for the new tweet dropdown
  $('#tweet-dropdown').on('click', () => {
    $('.new-tweet').slideToggle();
    $('#tweet-text').focus();
  });

  // Refresh the draft tweet's character counter
  const refreshCharCounter = () => {
    
    const textLength = $('#tweet-text').val().length;
    const counter = $('#tweet-text').siblings('div').children('.counter');

    counter.html(140 - textLength);

    if (textLength > 140) {
      counter.css('color', 'red');
    } else {
      counter.css('color', 'unset');
    }

  };

  // Handler for draft tweet input
  $('#tweet-text').on('input', function() {
    refreshCharCounter();
  });

  // Handler for tweet submission
  $('.new-tweet form').on('submit', function(event) {
    
    event.preventDefault();

    // Prevent potential duplicate submissions with double clicks
    $(this).css('pointer-events','none');

    // Form validation, AJAX POST request if input is valid
    if ($('#tweet-text').val().trim() === '' || $('#tweet-text').val() === null) {
      showErrorBox('Please enter a message for your tweet');
      $('.new-tweet form').css('pointer-events','');
    } else if ($('#tweet-text').val().length > 140) {
      showErrorBox('Your tweet is too long (max 140 chars)');
      $('.new-tweet form').css('pointer-events','');
    } else {

      // If there was an error box from a previous attempt, remove it
      $('#error-box').slideUp(function() {
        this.remove();
      });

      // URL encode the user data and tweet content
      const serializedText = $(this).serialize();
      const serializedName = `name=${encodeURIComponent(user.name)}`;
      const serializedHandle = `handle=${user.handle}`;
      const serializedAvatars = `avatars=${user.avatars}`;

      const serializedData = `${serializedText}&${serializedName}&${serializedHandle}&${serializedAvatars}`;

      $.ajax('../tweets', {
        method: 'POST',
        data: serializedData
      }).then((result) => {
        // Return the new tweet to prepended it without reloading others
        createTweetElement(result).hide().prependTo('#tweets-container').slideDown();
        $('#tweet-text').val('');
        refreshCharCounter();
        $('.new-tweet form').css('pointer-events','');
      }).catch(err => {
        console.log(err);
      });

    }

  });

});