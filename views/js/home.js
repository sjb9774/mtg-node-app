$(function() {
  $(document).ready(function() {
    $('#overlay').css('height', $('#card-display').css('height'));

    var cardView = new CardView();
    cardView.init();
    $(cardView).on('populateStart', function(evt) {
    }).on('populateEnd populateFail', function(evt) {
      fadeOut('#card-spinner');
      $('#card-info-wrapper').removeClass('hidden');
    });

    $('#start-button').on('click', function(evt) {
      fadeIn('#card-spinner');
      var randomCard = new Card();
      cardView.setCard(randomCard);
      randomCard.random(function(card) {
        cardView.switchCard(card);
      });
      $(evt.target).addClass('hidden');
      $('#overlay').one('transitionend', function(evt) {
        $(evt.target).removeClass('fade-out').addClass('hidden');
      });
      $('#overlay').addClass('fade-out');
    });
  });
});


var fadeIn = function(selector) {
  if ($(selector).hasClass('fade-out')) {
    $(selector).removeClass('fade-out');
  }
  $(selector).removeClass('hidden')
             .one('transitionend', function(evt) {
               $(selector).removeClass('fade-in');
             }).addClass('fade-in');
}

var fadeOut = function(selector) {
  if ($(selector).hasClass('fade-in')) {
    $(selector).removeClass('fade-in');
  }
  $(selector).one('transitionend', function(evt) {
    $(selector).removeClass('fade-out').addClass('hidden');
  }).addClass('fade-out');
}
