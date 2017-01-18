define((require) => {

  return {
    home: require('tpl!templates/home.html'),
    header: require('tpl!templates/common/header.html'),
    sidebar: require('tpl!templates/common/sidebar.html'),
    layout: require('tpl!templates/common/layout.html'),
    record: require('tpl!templates/records/record.html'),
    category: require('tpl!templates/categories/category.html'),
    browseCategories: require('tpl!templates/categories/browse-categories.html'),
    browseRecords: require('tpl!templates/records/browse-records.html'),
    categoryItemView: require('tpl!templates/categories/category-listitem.html'),
    recordsLayout: require('tpl!templates/records/records.html'),
    categoriesLayout: require('tpl!templates/categories/categories-layout.html'),
    recordItemView: require('tpl!templates/records/record-listitem.html'),
    categoriesSelect: require('tpl!templates/categories/categories-select.html'),
    categoryOption: require('tpl!templates/categories/category-option.html'),
    detailsRecord: require('tpl!templates/records/details-record.html'),
    detailsCategory: require('tpl!templates/categories/details-category.html'),
    login: require('tpl!templates/login.html'),
    register: require('tpl!templates/register.html'),
    filtersView: require('tpl!templates/records/filters-view.html'),
    totalsView: require('tpl!templates/records/totals-view.html'),
    pagination: require('tpl!views/components/pagination/pagination.html'),
    paginationItemView: require('tpl!views/components/pagination/pagination-item.html'),
  }

});
