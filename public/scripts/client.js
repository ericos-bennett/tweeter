/* eslint-env jquery */
/* eslint-env browser */

$(document).ready(() => {

  // Initialize constants for the signed in user
  const user = {
    name: 'Eric Bennett',
    handle: '@ericos',
    avatars: 'https://i.imgur.com/DVpDmdR.png'
  };

  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

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
  
  const renderTweets = function(tweets) {
    $.each(tweets, (i, v) => {
      $('#tweets-container').prepend(createTweetElement(v));
    });
  };
  
  const loadTweets = () => {

    $.ajax('../tweets', {
      method: 'GET'
    }).then(result => {
      renderTweets(result);
    }).catch(err => {
      console.log(err);
    });

  };

  // Tweet submission handler
  $('.new-tweet form').on('submit', function(event) {
    
    event.preventDefault();
    
    // Form validation and AJAX POST request if correct length
    if ($('#tweet-text').val().trim() === '' || $('#tweet-text').val() === null) {
      alert('Please enter a message for your tweet!');
    } else if ($('#tweet-text').val().length > 140) {
      alert('Your tweet is too long (max 140 characters).');
    } else {

      const serializedText = $(this).serialize();
      const serializedName = `name=${encodeURIComponent(user.name)}`;
      const serializedHandle = `handle=${user.handle}`;
      const serializedAvatars = `avatars=${user.avatars}`;

      const serializedData = `${serializedText}&${serializedName}&${serializedHandle}&${serializedAvatars}`;

      $.ajax('../tweets', {
        method: 'POST',
        data: serializedData
      }).then((result) => {
        renderTweets([result]);
        $('#tweet-text').val('');
      }).catch(err => {
        console.log(err);
      });

    }

  });

  // Load tweets on document ready
  loadTweets();

  // Add the user's name and image to the header
  $('#header-username').html(`${user.name}`);
  $('body > header div:first-child').append(`<img src=${user.avatars} alt="User Profile Image" id="header-profile-photo">`);

});