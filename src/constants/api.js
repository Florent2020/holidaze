export const WP_ROOT =
  process.env.REACT_APP_WP_ROOT || "https://florent-hajdari.com/store/wp-json";

export const BASE_URL = process.env.REACT_APP_BASE_URL || `${WP_ROOT}/wp/v2`;

export const ACCOMMODATIONS = "/accommodation";

export const TOKEN_PATH = `${WP_ROOT}/jwt-auth/v1/token`;

export const ENQUIRIES = "/enquiries";
export const MESSAGES = "/message";

export const CONTACT_ENDPOINT =
  "https://florent-hajdari.com/store/wp-json/holidaze/v1/contact";
