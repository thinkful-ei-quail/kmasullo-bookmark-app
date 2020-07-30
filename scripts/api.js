import { post } from 'jquery';

const baseUrl = 'https://thinkful-list-api.herokuapp.com/kameronmasullo/bookmarks';


let api = (function(){
  return {
    createItem: function(bookmark){
      let newItem = JSON.stringify(bookmark);
      return fetch(`${baseUrl}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: newItem
      });
    },

    getItems: function(){
      return fetch(`${baseUrl}`);
    },

    deleteItem: function(id) {
      return fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
      });
    }
  }
})();


export {api};