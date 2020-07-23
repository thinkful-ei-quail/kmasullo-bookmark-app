import store from './store.js';
import item from './item.js';
import api from './api.js';

function formString(){
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
                    </select>
                <label for="new-url"></label>
            <input type="text" id="new-url" placeholder="Enter URL Here">
            <label for="new-title"></label>
            <input type="text" id="new-title" placeholder="Title">
            <label for="new-description"></label>
            <textarea id="new-description" rows="14" cols="10" wrap="soft" maxlength="500" style="overflow:hidden"; resize:none; placeholder="Enter description here"></textarea>
            <input type="submit" value="submit"></input>
        </form>          
        </div>`;
}

function createStarRating(rating){
  let starRating = '';
  if (rating>0)
    for(let i=0; i<rating; i++){
      starRating+='&#9733 ';
    } else return 'This was horrible, I don\'t know why I\'m saving it.';
  return starRating;
}

function generateHtmlElement(bookmark){
  if (bookmark.expanded===true){
    return `<div class="bookmark-item column" data-item-id="${bookmark.id}">
              <div class="space-between">
                  <button id=${bookmark.title} class="row">${bookmark.title}</button>
                  <div id=${bookmark.title} class="star row">${createStarRating(bookmark.rating)}</div>
              </div>

        <div class="descriptionDiv">
            <hr>
            <p>
                ${bookmark.desc}
            </p>
            <p><a href=${bookmark.url} target="_blank">Visit ${bookmark.title}</a></p>
            
            <button id="delete-button">Delete</button>
        </div>
        </div>`;
  }else {
    return `<div class="bookmark-item column" data-item-id="${bookmark.id}">
              <div class="space-between">
                  <button id=${bookmark.title} class="row">${bookmark.title}</button>
                  <div id=${bookmark.title} class="star row">${createStarRating(bookmark.rating)}</div>
              </div></div>`;
  }
}

function generateHtmlString(bookmarks){
  let list = bookmarks.map((bookmark) => generateHtmlElement(bookmark));
  return list.join('');
}
  
function currentBookmarkString(){
  let bookmarks = null;
  if(store.filter === 0){
    bookmarks = [...store.items];
  }else if(store.filter === 1){
    bookmarks = [...store.filterByHighest()];
  }else {
    bookmarks = [...store.filterByLowest()];
  }
  return generateHtmlString(bookmarks);
}

function eventAddPage(){
  $('#add-button').on('click', event =>{
    store.adding = !store.adding;
    render();
  });
}



function toggleExpanded(){
  $('.bookmark-list').on('click', '.bookmark-item', event =>{
    let id = String($(event.currentTarget).data('item-id'));
    let item = store.findById(id);
    item.expanded = !item.expanded;
    render();    
  });
}

function eventDeleteItem(){
  $('.bookmark-list').on('click', '#delete-button', event =>{
    let id = String($(event.currentTarget).closest('.bookmark-item').data('item-id'));
    api.deleteItem(id)
      .then(res => res.json())
      .then(() => {
        store.findAndDelete(id);
        render();
      });
  });
}

function filterToggle(){
  $('#filter-btn').on('click', event =>{
    $('#filter-div').toggleClass('filter-hide');
  });
}

function eventFilterByHighest(){
  $('#filter-div').on('click', '#highest', event => {
    store.filter = 1;
    render();
  });
}
  
function eventFilterByLowest(){
  $('#filter-div').on('click', '#lowest', event => {
    store.filter = 2;
    render();
  });
}

function createBookmark(){
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
          render();
        });
    }catch (error) {
      render(error.message);
    }
    
  });
}











function bindEventListeners(){
  toggleExpanded();
  eventAddPage();
  filterToggle();
  eventFilterByLowest();
  eventFilterByHighest();
  createBookmark();
  eventDeleteItem();
}








function render(e){
  let html = '';
  if (e){
    html = `${e}`;
  }
  if (store.adding){
    html+=formString();
  }
  html+=currentBookmarkString();
  $('.bookmark-list').html(html);
}



export default {
  render,
  bindEventListeners
};




