define((require) => {

  return {
    home: require('tpl!templates/home.html'),
    header: require('tpl!templates/header.html'),
    sidebar: require('tpl!templates/sidebar.html'),
    layout: require('tpl!templates/layout.html'),
    record: require('tpl!templates/record.html'),
    category: require('tpl!templates/category.html'),
    browseCategories: require('tpl!templates/browse-categories.html'),
    browseRecords: require('tpl!templates/browse-records.html'),
    categoryItemView: require('tpl!templates/category-listitem.html'),
    recordsLayout: require('tpl!templates/records-layout.html'),
    categoriesLayout: require('tpl!templates/categories-layout.html'),
    recordsStats: require('tpl!templates/records-stats.html'),
    recordItemView: require('tpl!templates/record-listitem.html'),
    categoriesSelect: require('tpl!templates/microtemplates/categories-select.html'),
    categoryOption: require('tpl!templates/microtemplates/category-option.html'),
    userForms: require('tpl!templates/login.html')
  }

});
