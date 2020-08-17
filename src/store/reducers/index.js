import { combineReducers } from 'redux'

import buildReducers from './main';

export const stores = [
  "show",
  "total_order",
  "hq_location",
  "guns",
  "apps",
  'days',
  "pos_modules",
  "bo_moduels",
  "delivery_service",
  "dropdowns__delivery_group",
  "pos_functions",
  "syncing",
  "lang",
  'items__item_printers', "settings__printer", "settings__printer_group", 'settings__display_types',
  'dropdowns__doneness',
  'dropdowns__reasons',
  "dropdowns__complaint_categories",
  "dropdowns__complaints",
  "dropdowns__compaign_rates",
  'form_actions',
  'licensing__chain',
  'licensing__location',
  'licensing__store',
  'licensing__station', 'main',
  "settings__mode", "settings__sub_mode",
  "items__department", "items__custom_menu", "items__base_sales_cat", 'items__sales_items', 'items__prices',
  "items__modifier_group", "items__modifier_items", "items__assign_modifier_items",
  "parties__customer",
  "orders__main",
  "dinin__zones", "dinin__floors", "dinin__tables",
  "orders__details",
  'dropdowns__units_of_measure',
  'popup',
  "sync__sync",
  "sync__synced_location",
  "orders__business_days",
  "orders__shifts",
  "orders__receipt",
  "orders__receipt_items",
  "orders__receipt_seats",
  "orders__payment",
  "orders__compaign",
  'discount__main',
  'discount__campaigns',
  'financials__service',
  'financials__taxes',
  "financials__cash_settlement",
  "payment__types",
  "payment__credit_groups",
  "parties__title",
  'parties__address',
  "parties__contact_type",
  'parties__customer_contacts',
  'parties__customer_group',
  "parties__family_members",
  "parties__event_checkin",
  "items__combo",
  "items__combo_alters",
  'parties__reservation',
  "parties__event_deposit",
  "parties__tab_details",
  "parties__event_tab",
  'parties__reservation_notes',
  "parties__customer_orders",
  "parties__suggestions",
  'dropdowns__occasions',
  'dropdowns__special_requests',
  "geographies__city",
  "geographies__district",
  "geographies__country",
  "geographies__street",
  "geographies__state",
  "geographies__area",
  "stock__menus",
  "stock__categories",
  "dropdowns__delivery_service",
  "stock__items",
  "stock__item_variants",
  "stock__return_order",
  "stock__return_order_details",
  "users",
  'auths__user', 'auths__roles', 'auths__pos_functions',
  'actions', "dropdowns__currencies", 'dropdowns__currencies_conversions',
  "parties__relationships", 'items__favorite', 'dropdowns__courses', 'page', 'Printing', "pay__category", "pay__item", "pay__pay", "pay__type",
  "orders__orders_discount", "orders__item_seats", "items__item_color", "settings__filter", "employee__employee", "employee__employee_contacts", "reasons",
  'orders__order_seats',
  "functions",
  'modules',
  "form",
  'filters',
  "syncs",
  'application_settings',
  'financials__minimum_charge',
  'bottom_sheet',
  "dropdowns__delivery_service_mode",
  "stock__purchase_orders",
  "stock__purchase_orders_detail",
  "stock__transaction_tr",
  "stock__transaction_tr_detail",
  "stock__transaction_ro",
  "stock__transaction_ro_detail",
  "stock__balance",
  "stock__weight_price",
  "stock__balance_trans",
  'settings__chain_customer_receipt',
  'settings__customer_receipt',
  'dropdowns__lang',
  'report',
  'items__recipe',
  'orders__recipe_removals',
  'items__recipe_alter',
  'req_line',
  'items__custom_mix',
  'items__custom_mix_group',
  "employee__employee_locations",
  'items__sorting',
  'financials__reserv_table',
  'licensing__location_type',
  'notification_apps',
  'redux_notifications',
  'show',
  'cart',
  'items__ssb_group',
  'items__ssb_subgroup',
  'items__ssb_items',



]
const gReduce = stores.map(d => buildReducers(d)).reduce((o, k) => ({ ...o, ...k }), 0);
export default combineReducers({
  ...gReduce
})