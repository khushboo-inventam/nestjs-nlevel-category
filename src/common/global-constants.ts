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

export const PAYMENT = {
  CREATED: 'Payment has been done successfully.',
  FETCHED: 'Payment detail has been fetched successfully.',
  USER_CARD_LIMITS: 'There is a limit of three cards that can be added.',
  PAYMENT_INTENT_CREATED: 'Payment intent has been done successfully.',
  DELETED: 'Payment method has been deleted successfully.',
  NOT_FOUND: 'Requested payment method not found.',
  ALREADY_USE_IN_ACTIVE_SUBSCRIPTION: `Payment method already use in active subscription you can't delete it .`,
};

export const LOGIN = {
  INVALID_CRED: 'Invalid login credentials.',
  USER_NOT_FOUND: 'User not found with given credentials.',
  REFRESH_TOKEN_MALFORMED: 'Refresh token malformed.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found.',
  REFRESH_TOKEN_REVOKED:
    'We noticed a new sign-in to your account in another device so your session has been expired.',
  REFRESH_TOKEN_EXPIRED: 'Your session has been expired.',
  SUCCESS: 'Welcome to Photographer Portal!',
  LOGOUT: "You've been logged out, fare thee well.",
  MULTIPLE_NOT_ALLOWED:
    'Sorry dopplegangers, only one login per account at a time.',
  USER_NOT_CONNECT_WITH_BB:
    'You are not connected to BattleBards, which is why you are unable to sync your data',
  USER_NOT_IN_BB: 'User not found in battelbards.com.',
  RESET_PASSWORD: 'Please reset your password.',
};

export const REGISTER = {
  SUCCESS: 'Registration critical success, welcome!',
  USER_EXIST:
    'Account already exists with the given email, please provide another email.',
  USER_NOT_REGISTERED: 'No user registered with these credentials found.',
  EMAIL_FAIL: 'We fumbled; email send failed, please try again later.',
  EMAIL_SENDED_RECENTLY: 'Email just sent, please try again later.',
  EMAIL_UNVERIFIED: 'Email not verified. Please verify email to continue.',
  EMAIL_SENT_SUCCESS: 'Please check your inbox to get activation link.',
  INVALID_VERIFICATION_LINK: 'Invalid activation link.',
  EMAIL_VERIFICATION_SUCCESS: "Success!  You've verified your account.",
  EMAIL_VERIFICATION_EXPIRED:
    'Account activation link expired. Please resend activation email.',
  EMAIL_ALREADY_VERIFIED: 'Email has already been verified.',
  DEMO_LINK_EXPIRED: 'Link expired.',
  TRIAL_INVITATION_SENT_SUCCESS:
    'Invitations for the trial has been sent to the users successfully',
  TRIAL_INVITATION_ASSIGN_USER_SUCCESSFULLY:
    'Invitations for the trial has been assign to the users successfully',
  TRIAL_INVALID_CRED: 'Invalid credentials.',
  ALREADY_USE_TRIAL_PLAN: 'Account already use trial plan. ',
};

export const RESET_PASSWORD = {
  INVALID_LINK: 'Invalid reset password link.',
  LINK_EXPIRED: 'Reset Password link expired.',
  SUCCESS: 'Your password has been reset.',
  EMAIL_SENT_SUCCESS: 'Password reset link sent, please check your inbox.',
};


export const CHANGE_PASSWORD = {
  PASSWORD_VALIDATION:
    'Password must be a combination of number, lowercase and uppercase and special character.',
  NEW_PASSWORD_VALIDATION:
    'New password must be a combination of number, lowercase and uppercase and special character.',
  PASSWORD_NOT_MATCH: 'Current password do not match.',
  NEW_PASSWORD_MATCH_CURRENT:
    'Please choose a password that is different from your current password.',
  SUCCESS: 'Your password has been changed successfully.',
};

export const CONFIG_CONNECTION_OPTIONS = 'CONFIG_CONNECTION_OPTIONS';
export const PASSWORD_SALT_ROUNDS = 10;




export const SUBSCRIPTIONS = {
  CANCEL_PLAN: 'Subscription cancelled successfully.',
  NOT_CANCEL_FREE_PLAN: 'The free plan is not cancellable.',
  FETCHED: 'Subscription`s detail has been fetched successfully.',
  CREATED: 'Subscribe has been a successfully.',
  WEBHOOK_BAD_REQUEST: 'Webhook not initialize  properly.',
  UPDATED: 'Subscription has been update successfully.',
  NOT_FOUND: 'Requested subscription not found.',
};