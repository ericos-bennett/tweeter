/* eslint-env jquery  */
/* eslint-env browser */

$(document).ready(()=> {
  
  $('#tweet-text').on('keydown', function() {

    const textLength = $(this).val().length;
    const counter = $(this).siblings('div').children('.counter');

    counter.html(140 - textLength);

    if (textLength > 140) {
      counter.css('color', 'red');
    } else {
      counter.css('color', 'unset');
    }
    
  });

});