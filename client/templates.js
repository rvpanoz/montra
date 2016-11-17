define((require) => {

  return {
    home: require('tpl!templates/home.html'),
    header: require('tpl!templates/header.html'),
    layout: require('tpl!templates/layout.html'),
    newRecord: require('tpl!templates/new-record.html'),
    newCategory: require('tpl!templates/new-category.html'),
    browseCategories: require('tpl!templates/browse-categories.html'),
    categoryItemView: require('tpl!templates/view-categoryItem.html'),
    categoryDetailView: require('tpl!templates/detail-categoryItem.html')
  }

});
