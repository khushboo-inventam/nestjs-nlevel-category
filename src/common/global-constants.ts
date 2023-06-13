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
