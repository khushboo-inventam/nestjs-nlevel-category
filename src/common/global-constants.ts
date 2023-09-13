export const ERROR = {
  INTERNAL_SERVER_ERROR: "Something went wrong, please try again later.",
  UNAUTHORIZED_ERROR: "Please provide access token.",
};

export const ACTIONS = {
  HEALTHCHECK: 'Health check successfully.',
  FETCHED: 'Fetched successfully.',
  UPDATED: 'Updated successfully.',
  CREATED: 'Added successfully.',
  DELETED: 'Deleted successfully.',
  CACHE_CLEAR: 'Cache clear successfully.',
  NOT_FOUND: 'Requested Data not found.',
};

export const CATEGORY = {
  FETCHED: 'Category has been fetched successfully.',
  UPDATED: 'Category last active has been updated successfully.',
  CREATED: 'Category has been added successfully.',
  DELETED: 'Category has been removed  successfully.',
  ALREADY_EXIST_CATEGORY: 'Category already exists .',
  NOT_FOUND: 'Requested Category not found.',
  NOT_DELETE_PARENT_CATEGORY: `Can't delete parent category.`,
};

export const ITEM = {
  FETCHED: 'Item has been fetched successfully.',
  UPDATED: 'Item last active has been updated successfully.',
  CREATED: 'Item has been added successfully.',
  DELETED: 'Item has been removed  successfully.',
  ALREADY_EXIST_ITEM: 'Item already exists .',
  NOT_FOUND: 'Requested Item not found.',
  NOT_DELETE_PARENT_ITEM: `Parent item cannot be deleted.`,
};


export const DYNAMIC_COLUMNS = {
  FETCHED: 'Dynamic-column has been fetched successfully.',
  UPDATED: 'Dynamic-column last active has been updated successfully.',
  CREATED: 'Dynamic-column has been added successfully.',
  DELETED: 'Dynamic-column has been removed  successfully.',
  ALREADY_EXIST_DYNAMIC_COLUMNS: 'Dynamic-column already exists .',
  NOT_FOUND: 'Requested Dynamic-column not found.',
  NOT_DELETE_PARENT_ITEM: `This Dynamic-column cannot be deleted.`,
};

export const ITEM_DETAILS = {
  FETCHED: 'Item-details has been fetched successfully.',
  UPDATED: 'Item-details last active has been updated successfully.',
  CREATED: 'Item-details has been added successfully.',
  DELETED: 'Item-details has been removed  successfully.',
  ALREADY_EXIST_ITEM_DETAILS: 'Item-details already exists .',
  NOT_FOUND: 'Requested Item-details not found.',
 
};

export const HISTORY = {
  FETCHED: 'History has been fetched successfully.',
  UPDATED: 'History last active has been updated successfully.',
  CREATED: 'History has been added successfully.',
  DELETED: 'History has been removed  successfully.',
  ALREADY_EXIST_ITEM_DETAILS: 'History already exists .',
  NOT_FOUND: 'Requested History not found.',
}


export const PLAN = {
  FETCHED: 'Plan has been fetched successfully.',
  UPDATED: 'Plan last active has been updated successfully.',
  CREATED: 'Plan has been added successfully.',
  DELETED: 'Plan has been removed  successfully.',
  ALREADY_EXIST_PLAN: 'Plan already exists.',
  NOT_FOUND: 'Requested Plan not found.',
};

export const PRICE = {
  FETCHED: 'Price has been fetched successfully.',
  UPDATED: 'Price last active has been updated successfully.',
  CREATED: 'Price has been added successfully.',
  DELETED: 'Price has been removed  successfully.',
  ALREADY_EXIST_PRICE: 'Price already exists .',
  NOT_FOUND: 'Requested Price not found.',
};

export const PROMOCODE = {
  CREATED: 'Promo code has been generated successfully.',
  EXPIRED: 'Promo code expired',
  NOT_APPLICABLE: 'Promo code cannot be applied to your purchase',
  NOT_APPLICABLE_ON_PRODUCT: 'Promo code cannot be applied to your subscription.',
  INVALID: 'Invalid promo code',
  ALREADY_APPLIED: 'Promo code already applied',
  AMOUNT_OR_PERCENTAGE: 'The amount or percentage can only be added off at times.',
  USER_MAX_REDEMPTIONS: 'The maximum number of redemptions equals the number of users.',
  APPLIED: 'Promo code has been apply successfully.',
};