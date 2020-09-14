import classes from './style.less'
export const cuurentLoc = (location)=>({
  key: 'ListInsideEach',
  compare: {
    location: location,
    active: true,
  },
  select: {
    location: 'location',
    active: 'active',
  },
  selectors: {
    geographies__street: 'street',
    // geographies__area: 'area',
    area_loc: {
      path: `settings__location_by_area.groups.area_loc.:area.${location}`,
    },
  },
})

export const extraButton = (data, cb, bk)=>({
  add_new: {
    class: classes.addnew,
    text: {
      text: 'Add New Address',
    },
    icon: {
      icon: 'plus',
      class: classes.icon,
    },
    action: {
      key: 'openPopup',
      params: {
        type: 'AddNewAddress',
        childProps: {
          customer: data.customer,
          cb,
          data,
          bk,
        },
      },
    },
  },
})
