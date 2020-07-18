import $ from 'jquery';
import 'normalize.css';
import './index.css';

import bookmarks from './bookmarks.js';
import api from './api.js';
import store from './store.js';



function main() {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarks.render();
    });
  bookmarks.bindEventListeners();
  bookmarks.render();
  
}

$(main);