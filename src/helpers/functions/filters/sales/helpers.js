export const itemsActivates = {
  key: 'multiApply',
  apps: {
    menu: {
      key: 'keysWithFuns',
      levels: {
        menu: {
          key: 'chain',
          selectors: {
            items__sales_items: 'sales_item',
            items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'custom_menu',
        },
        cat: {
          key: 'chain',
          selectors: {
            items__sales_items: 'sales_item',
            // items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'base_sales_cat',
        },
        sales_item: 'sales_item',
        id: 'id',
      },
    },
    cat: {
      key: 'keysWithFuns',
      levels: {
        cat: {
          key: 'chain',
          selectors: {
            items__sales_items: 'sales_item',
            // items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'base_sales_cat',
        },
        sales_item: 'sales_item',
        id: 'id',
      },
    },
    items: {
      key: 'keysWithFuns',
      levels: {
        sales_item: 'sales_item',
        id: 'id',
      },
    },
  },
}

export const itemsSM = {
  key: 'multiApply',
  apps: {
    menu: {
      key: 'keysWithFuns',
      levels: {
        menu: {
          key: 'chain',
          selectors: {
            items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'custom_menu',
        },
        cat: {
          key: 'chain',
          selectors: {
            items__sales_items: 'sales_item',
            // items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'base_sales_cat',
        },
        sales_item: 'sales_item',
        id: 'id',
      },
    },
    cat: {
      key: 'keysWithFuns',
      levels: {
        cat: 'base_sales_cat',
        sales_item: 'sales_item',
        id: 'id',
      },
    },
  },
}

export const itemsActivatesFav = {
  key: 'multiApply',
  apps: {
    menu: {
      key: 'keysWithFuns',
      levels: {
        menu: {
          key: 'chain',
          selectors: {
            items__prices: 'item',
            items__sales_items: 'sales_item',
            items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'custom_menu',
        },
        cat: {
          key: 'chain',
          selectors: {
            items__prices: 'item',
            items__sales_items: 'sales_item',
            // items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'base_sales_cat',
        },
        item: 'item',
        id: 'id',
      },
    },
    cat: {
      key: 'keysWithFuns',
      levels: {
        cat: {
          key: 'chain',
          selectors: {
            items__prices: 'item',
            items__sales_items: 'sales_item',
            // items__base_sales_cat: 'base_sales_cat',
            // items__menu: 'custom_menu'
          },
          display: 'base_sales_cat',
        },
        // items: {
        //     key: 'chain',
        //     selectors: {
        //         items__prices: 'item',
        //     },
        //     display: 'sales_item'
        // },
        item: 'item',
        id: 'id',
      },
    },
    items: {
      key: 'keysWithFuns',
      levels: {
        items: {
          key: 'chain',
          selectors: {
            items__prices: 'item',
          },
          display: 'sales_item',
        },
        item: 'item',
        id: 'id',
      },
    },
  },
}
