define((require) => {

  return {
    home: require('tpl!templates/home.html'),
    header: require('tpl!templates/header.html'),
    layout: require('tpl!templates/layout.html'),
    newRecord: require('tpl!templates/new-record.html')
  }

});
