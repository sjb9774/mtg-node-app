$(document).ready(function() {
  $('#overlay').css('height', $('#card-display').css('height'));
  $('#start-button').on('click', function(evt) {
    $(evt.target).addClass('hidden');
    $('#overlay').addClass('hidden');
  });

  var cardView = new CardView();
  cardView.init();
});
