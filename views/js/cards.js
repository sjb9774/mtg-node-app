/* Model that encapsulates card data */
var Card = function(cardName, setCode) {
  this.name = cardName;
  this.setCode = setCode;
  this.cardImage = $('#card-image');
}

Card.prototype.populate = function() {
  var self = this;
  $.get({
    'url': '/api/card?name=' + this.name + (this.setCode ? '&set=' + this.setCode : ''),
    'success': function(resp) {
      if (resp) {
        var cardData = resp['cards'][0];
        self._populate(cardData);
        $(self).trigger('populateEnd');
      }
      else {
        $(self).trigger('populateFail');
      }
    },
    'error': function(resp) {
      $(self).trigger('populateFail');
    }
  });
  $(self).trigger('populateStart');
};

Card.prototype._populate = function(cardData) {
  var self = this;
  self.name = cardData.name;
  self.allSets = cardData.allSets;
  self.setCode = cardData.set;
  self.cmc = cardData.cmc || 0;
  self.multiverseId = cardData.multiverseId;
  self.rulesText = cardData.rulesText || '';
  self.types = cardData.types;
  self.colors = cardData.colors;
  self.manaCost = cardData.manaCost;
  self.imageUrl = cardData.imageUrl;
  self.populated = true;
  self.otherArts = cardData.otherArts || [];
};

Card.prototype.random = function(callback) {
  var self = this;
  $(self).trigger('populateStart');
  $.get({
    'url': '/api/card/random',
    'success': function(resp) {
      if (resp) {
        var cardData = resp['cards'][0];
        self._populate(cardData);
        $(self).trigger('populateEnd');
        callback(self);
      }
    },
    'error': function(resp) {
      $(self).trigger('populateFail');
    }
  });
}


/* Handles the screen that shows the cards */
var CardView = function() {
  this.currentCard;
  this.cardImage;
  this.infoWrapper;
}

CardView.prototype.init = function() {
  var self = $(this);
  this.cardImage = $('#card-image');
  this.cardDisplay = $('#card-display');
  this.infoWrapper = $('#card-info-wrapper');
}

CardView.prototype.bindEvents = function() {
  var self = $(this);
  $(this.currentCard).on('populateStart populateEnd populateFail', function(evt) {
    self.trigger(evt.type);
  });
}

CardView.prototype.unbindEvents = function() {
  if ($(this.currentCard)) {
    $(this.currentCard).off('populateStart populateEnd');
  }
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

CardView.prototype.setCard = function(card) {
  this.unbindEvents();
  this.currentCard = card;
  this.bindEvents();
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
  var self = this;
  this.cardImage.attr('src', this.currentCard.imageUrl);
  this.name(this.currentCard.name);
  this.cardSet(this.currentCard.setCode);
  this.rulesText(this.currentCard.rulesText);

  if (this.currentCard.allSets) {
    $('#all-sets').empty().removeClass('hidden');
    var setList = $('<ul/>', {class: 'set-list'});
    this.currentCard.allSets.forEach(function(set) {
      var setEl = $('<li/>', {text: set, class: 'card-set'});
      if (set === self.currentCard.setCode) {
        setEl.addClass('current-set');
      }
      setList.append(setEl);
    });
    $('#all-sets').append(setList);
  }

  if (this.currentCard.otherArts && this.currentCard.otherArts.length > 0) {
    $("#all-arts").empty().removeClass("hidden");
    var artList = $('<ul/>', {class: "art-list"});
    var allArts = [{multiverseId: this.currentCard.multiverseId}].concat(this.currentCard.otherArts);
    allArts.sort(function(x, y){ return x["multiverseId"] <= y["multiverseId"] ? -1 : 1; });
    allArts.forEach(function(art, i) {
      var artLink = $("<a/>", {class: "art-link", text: i, href: "/card?multiverse_id=" + art["multiverseId"]});
      var artEl = $("<li/>", {class: "art"});
      artEl.append(artLink);
      artList.append(artEl);
    });
    $('#all-arts').append(artList);
  }

  this.cardImage.one('load', function(evt) {
    var colorMap = {
      'g': 'green',
      'b': 'black',
      'u': 'blue',
      'r': 'red',
      'w': 'white',
    }

    if (self.currentCard.colors) {
      if (self.currentCard.colors.length === 1) {
        if (colorMap[self.currentCard.colors]) {
          self.changeColor(colorMap[self.currentCard.colors]);
        }
      } else {
        self.changeColor('gold');
      }
    } else {
      self.changeColor('brown');
    }
  });
};

CardView.prototype.switchCard = function(card) {
  var self = this;
  if (!card.populated) {
    $(card).on('populateEnd', function(evt) {
      self.setCard(card);
      self.show();
    });
    card.populate();
  } else {
    self.setCard(card);
    self.show();
  }
};

CardView.prototype.showRandom = function() {
  var self = this;
  var randomCard = new Card();
  self.setCard(randomCard);
  randomCard.random(function(card) {
    self.switchCard(card);
  });
};
