import {store} from './store.js';
import {item} from './item.js';
import {api} from './api.js';



let bookmarks = (function(){

  return {
    formString: function(){
      return `<div class="all-new-bookmark-page">
            <div class="new-bookmark-section">
              <h2>New Bookmark:</h2>
              <form id="new-bookmark">
                <label for="stars-drop">Rating:</label>
                  <select name="new-bookmark" id="stars-drop">
                      <option value=5>&#9733 &#9733 &#9733 &#9733 &#9733</option>
                      <option value=4>&#9733 &#9733 &#9733 &#9733</option>
                      <option value=3>&#9733 &#9733 &#9733</option>
                      <option value=2>&#9733 &#9733</option>
                      <option value=1>&#9733</option>
                  </select><br>
                <label for="new-url">URL:</label>
                <input type="text" id="new-url" required><br>
                <label for="new-title">Title:</label>
                <input type="text" id="new-title" required><br>
                <label id="textarea-label" for="new-description">Info:</label>
                <textarea id="new-description" ></textarea><br>
                <button type="submit" value="submit">Submit</button>
                <button type="button" id="cancel-button">Cancel</button>
              </form>
            </div>`;
      },

    createStarRating: function(rating){
      let starRating = '';
      if (rating>0)
        for(let i=0; i<rating; i++){
          starRating+='&#9733 ';
        } else return 'This was horrible, I don\'t know why I\'m saving it.';
      return starRating;
    },

    generateHtmlElement: function(bookmark){
      if (bookmark.expanded===true){
        return `<div class="bookmark-item column" data-item-id="${bookmark.id}">
                  <div class="space-between">
                      <button id=${bookmark.id} class="row">${bookmark.title}</button>
                      <div id=${bookmark.id} class="star row">${this.createStarRating(bookmark.rating)}</div>
                  </div>

            <div class="descriptionDiv">
                <hr>
                <p>
                    ${bookmark.desc}
                </p>
                <p><a href=${bookmark.url} target="_blank">Visit ${bookmark.url}</a></p>
                
                <button id="delete-button">Delete</button>
            </div>
            </div>`;
      }else {
        return `<div class="bookmark-item column" data-item-id="${bookmark.id}">
                  <div class="space-between">
                      <button id=${bookmark.id} class="row">${bookmark.title}</button>
                      <div id=${bookmark.id} class="star row">${this.createStarRating(bookmark.rating)}</div>
                  </div></div>`;
      }
    },

    generateHtmlString: function(bookmarks){
      let list = bookmarks.map((bookmark) => this.generateHtmlElement(bookmark));
      return ` <section class="bookmark-section">
          <h3>Bookmarks:</h3>
          <div class="bookmark-list">${list.join('')}</div>
      </section>`;
    },
    

    buttonSection: function(){
      return ` <section class="button-section">
          <div class="button"><button id="add-button">Add</button></div>
          <div class="button">
              <label for="filter-drop" id="filter-btn">Filter By:</label> 
              <select id="filter-drop">
                  <option>Select:</option>
                  <option value="highest" id="highest">Highest</option>
                  <option value="lowest" id="lowest">Lowest</option>
              </select>
          </div>
      </section>`;
    },






    currentBookmarkString: function(){
      let bookmarks = null;
      if(store.filter === 0){
        bookmarks = [...store.items];
      }else if(store.filter === 1){
        bookmarks = [...store.filterByHighest()];
      }else {
        bookmarks = [...store.filterByLowest()];
      }
      return this.generateHtmlString(bookmarks);
    },

    eventAddPage: function(){
      $('main').on('click', '#add-button', event =>{
        store.adding = true;
        this.render();
      });
    },

    eventCancelAdd: function(){
      $('main').on('click', '#cancel-button', event =>{
        store.adding = false;
        this.render();
      });
    },



    toggleExpanded: function(){
      $('main').on('click', '.bookmark-item', event =>{
        let id = String($(event.currentTarget).data('item-id'));
        let currentBookmark = store.findById(id);
        currentBookmark.expanded = !currentBookmark.expanded;
        this.render();    
      });
    },

    eventDeleteItem: function(){
      $('main').on('click', '#delete-button', event =>{
        let id = String($(event.currentTarget).closest('.bookmark-item').data('item-id'));
        api.deleteItem(id)
          .then(res => res.json())
          .then(() => {
            store.findAndDelete(id);
            this.render();
          });
      });
    },
    
    eventFilter: function(){
      $('main').on('change', '#filter-drop', event => {
        let selectedVal = $('#filter-drop').find(':selected').val();
        if (selectedVal==='lowest'){
          store.filter = 2;
        } else if (selectedVal==='highest'){
          store.filter = 1;
        } 
        this.render();
      });
    },

    createBookmark: function(){
      $('.whole').on('submit', 'form', event =>{
        event.preventDefault();

        let title = $('#new-title').val();
        let rating = parseInt($('#stars-drop').val());
        let url = item.addHttp($('#new-url').val());
        let desc = $('#new-description').val();
        let newItemOb = item.create(title, rating, url, desc);

        try{
          store.errorHandler();
          api.createItem(newItemOb)
            .then(res => res.json())
            .then((newItem) => {
              store.addItem(newItem);
              store.adding=false;
              this.render();
            });
        }catch (error) {
          this.render(error.message);
        }
        
      });
    },

    bindEventListeners: function(){
      this.toggleExpanded();
      this.eventAddPage();
      this.eventFilter();
      this.createBookmark();
      this.eventDeleteItem();
      this.eventCancelAdd();
    },

    render: function(e){
      let html = '';
      if (e){
        html = `${e}`;
      }
      if (store.adding){
        html=this.formString();
      }else {
        html=this.buttonSection();
        html+=this.currentBookmarkString();
      }
      $('main').html(html);
    }

}})();


export {bookmarks};




