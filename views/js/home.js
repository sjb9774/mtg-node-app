var Card = function(cardName, setCode) {
  this.name = cardName;
  this.setCode = setCode;
  this.cardView = $('#card-iamge');
}

Card.prototype.populate = function() {
  var self = this;
  $.get({
    'url': '/api/card?name=' + this.name + '&set=' + this.setCode,
    'success': function(resp) {
      if (resp) {
        var cardData = resp['cards'][0];
        self.name = cardData.name;
        self.setCode = cardData.set;
        self.cmc = cardData.cmc;
        self.multiverseId = cardData.multiverseId;
        self.rulesText = cardData.rulesText;
        self.types = cardData.types;
        self.colors = cardData.colors;
        self.manaCost = cardData.manaCost;
        self.imageUrl = cardData.imageUrl;
        self.populated = true;
        $(self).trigger('populated');
      }
      else {
        $(self).trigger('populateFail');
      }
    }
  });
}

var CardView = function() {
  this.currentCard;
  this.cardView;
  this.infoWrapper;
}

CardView.prototype.init = function(card) {
  this.currentCard = card;
  this.cardView = $('#card-image');
  this.infoWrapper = $('#card-info-wrapper');
}

CardView.prototype.setCard = function(c) {
  this.currentCard = c;
}

CardView.prototype.show = function() {
  this.cardView.attr('src', this.currentCard.imageUrl);
}

CardView.prototype.switchCard = function(card) {
  var self = this;
  if (!card.populated) {
    $(card).on('populated', function(evt) {
      self.setCard(card);
      self.show();
    });
    card.populate();
  } else {
    self.setCard(card);
    self.show();
  }
}

$(document).ready(function() {
  var cardView = new CardView();
  cardView.init();
  var c = new Card('Divination', 'BNG');
  cardView.switchCard(c);
});
