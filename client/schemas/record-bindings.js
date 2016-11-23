define(function() {

  return function() {
    return {
      '#input-amount': {
        observe: 'amount'
      },
      '#payment-method-cash': {
        observe: 'payment_method',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#payment-method-card': {
        observe: 'payment_method',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#input-kind': 'kind',
      '#input-entry-date': {
        observe: 'entry_date'
      },
      '#input-category': {
        observe: 'category_id',
        onSet: function() {
          var value = $('#input-category').val();
          return value;
        }
      },
      '#kind-income': {
        observe: 'kind',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#kind-expense': {
        observe: 'kind',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#input-notes': 'notes'
    };
  }
});
