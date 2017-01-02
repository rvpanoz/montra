define(['moment'], function(moment) {

  return function() {
    return {
      '#input-amount': {
        observe: 'amount'
      },
      '[name="input-payment"]': {
        observe: 'payment_method'
      },
      '[name="input-kind"]': {
        observe: 'kind'
      },
      '#input-entry-date': {
        observe: 'entry_date'
      },
      '#input-category': {
        observe: 'category_id',
        onSet: function(id) {
          return id;
        },
        onGet: function(id) {
          return id;
        }
      },
      '#input-notes': 'notes'
    };
  }
});
