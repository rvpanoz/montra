define(['moment'], function(moment) {

  return function() {
    return {
      '#input-amount': {
        observe: 'amount'
      },
      '[name="input-payment-method"]': 'payment_method',
      '[name="input-kind"]': 'kind',
      '#input-entry-date': {
        observe: 'entry_date',
        onGet: function(value) {
          var d = new Date(value);
          if(moment(d).isValid()) {
            return moment(d).format('DD/MM/YYYY');
          }
        }
      },
      '#input-category': {
        observe: 'category_id',
        onSet: function() {
          var value = $('#input-category').val();
          return value;
        }
      },
      '#input-notes': 'notes'
    };
  }
});