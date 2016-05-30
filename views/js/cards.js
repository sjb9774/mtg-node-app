var Card = function(cardName, setCode) {
  this.name = cardName;
  this.setCode = setCode;
  this.cardView = $('#card-image');
}

Card.prototype.populate = function() {
  var self = this;
  $.get({
    'url': '/api/card?name=' + this.name + (this.setCode ? '&set=' + this.setCode : ''),
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
  this.cardDisplay = $('#card-display');
  this.infoWrapper = $('#card-info-wrapper');
}

CardView.prototype.name = function(title) {
  this.infoWrapper.find('#card-name').text(title);
}

CardView.prototype.cardSet = function(set) {
  this.infoWrapper.find('#card-set').text(set);
}

CardView.prototype.rulesText = function(text) {
  this.infoWrapper.find('#rules-text').text(text);
}

CardView.prototype.setCard = function(c) {
  this.currentCard = c;
}

CardView.prototype.changeColor = function(color) {
  this.cardDisplay.removeClass(function () {
    return $(this).attr('class').split(' ').filter(function(cls) {
      if (cls.startsWith('background-')) {
        return cls
      }
    }).join(' ');
  });

  this.cardDisplay.addClass('background-' + color);
}

CardView.prototype.show = function() {
  this.cardView.attr('src', this.currentCard.imageUrl);
  this.name(this.currentCard.name);
  this.cardSet(this.currentCard.setCode);
  this.rulesText(this.currentCard.rulesText);
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
