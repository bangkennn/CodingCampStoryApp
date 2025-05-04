import PengelolaStory from './presenters/StoryPresenter.js';
import PengelolaTambahCerita from './presenters/AddStoryPresenter.js';
import PengelolaHome from './presenters/HomePresenter.js';
import PengelolaLogin from './presenters/LoginPresenter.js';
import PengelolaRegister from './presenters/RegisterPresenter.js';
import DataCerita from './models/StoryModel.js';

class App {
    constructor() {
        this._data = new DataCerita();
        this._setupNavigation();
        this._setupRouting();
    }

    _setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navigationDrawer = document.getElementById('navigationDrawer');

        hamburger.addEventListener('click', () => {
            navigationDrawer.classList.toggle('open');
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (event) => {
            if (!navigationDrawer.contains(event.target) && event.target !== hamburger) {
                navigationDrawer.classList.remove('open');
            }
        });

        this._renderNavLinks();
    }

    _renderNavLinks() {
        const navigationDrawer = document.getElementById('navigationDrawer');
        const ul = navigationDrawer.querySelector('ul');
        ul.innerHTML = `
            <li><a href="#/home">Home</a></li>
            <li><a href="#/stories">Stories</a></li>
            <li><a href="#/add">Add Story</a></li>
            ${this._data.isLoggedIn() ? '<li><a href="#/logout" id="logoutLink">Logout</a></li>' : '<li><a href="#/login">Login</a></li><li><a href="#/register">Register</a></li>'}
        `;
        // Logout event
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this._data.logout();
                window.location.hash = '#/login';
                this._renderNavLinks();
            });
        }
    }

    _setupRouting() {
        const routes = {
            '/home': () => {
                const homePresenter = new PengelolaHome();
                homePresenter.tampilkan();
            },
            '/stories': () => {
                const storyPresenter = new PengelolaStory();
                storyPresenter.tampilkan();
            },
            '/add': () => {
                const addStoryPresenter = new PengelolaTambahCerita();
                addStoryPresenter.tampilkan();
            },
            '/login': () => {
                const loginPresenter = new PengelolaLogin();
                loginPresenter.tampilkan();
            },
            '/register': () => {
                const registerPresenter = new PengelolaRegister();
                registerPresenter.tampilkan();
            },
            '/logout': () => {
                this._data.logout();
                this._renderNavLinks();
                window.location.hash = '#/login';
            }
        };

        const defaultRoute = '/home';

        const router = () => {
            // Matikan kamera jika ada instance AddStoryView
            if (window._addStoryView && typeof window._addStoryView.stopCamera === 'function') {
                window._addStoryView.stopCamera();
                window._addStoryView = null;
            }
            this._renderNavLinks();
            const path = window.location.hash.slice(1) || defaultRoute;
            const route = routes[path] || routes[defaultRoute];
            
            // Start view transition
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    route();
                });
            } else {
                route();
            }
        };

        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);
    }
}

// Initialize the app
const app = new App(); 