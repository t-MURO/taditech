const DEV_BACKEND_URL = 'https://taditech-backend-dev.herokuapp.com/login';
const PROD_BACKEND_URL = 'https://taditech-backend.herokuapp.com/login';

export default {
    AUTH_URL: process.env.NODE_ENV === 'production' ? PROD_BACKEND_URL : DEV_BACKEND_URL,
    FOLLOWED_ARTISTS_URL: 'https://api.spotify.com/v1/me/following',
    ARTISTS_URL: 'https://api.spotify.com/v1/artists/'
}