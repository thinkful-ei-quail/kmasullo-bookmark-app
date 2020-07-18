import { post } from 'jquery';

const baseUrl = 'https://thinkful-list-api.herokuapp.com/kameronmasullo/bookmarks';




function createItem(bookmark){
  let newItem = JSON.stringify(bookmark);
  return fetch(`${baseUrl}`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: newItem
  });
}

function getItems(){
  return fetch(`${baseUrl}`);
}

function deleteItem(id) {
  return fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  });
}



export default {
  getItems,
  createItem,
  deleteItem
};