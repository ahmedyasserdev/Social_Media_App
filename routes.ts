/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/new-verification",

]

/**
 * An array of routes that are used for autthentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/login",
    "/sign-up",
    "/error",
    "/reset",
    "/new-password"
]

/**
 * The prefix for API authentication routes
 * Routes that start with prefix are used for API authentication purposes
 * @type {string}
 */
export const apiPrefix = "/api/path:*";





/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";