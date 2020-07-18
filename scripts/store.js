import item from './item.js';



let items = [];
let adding=false;
let error = null;
let filter = 0;

function errorHandler(){
  if(this.error===1){
    throw new TypeError ('Title must not be blank');
  }else if (this.error===2){
    throw new TypeError ('URL must not be blank');
  }else {
    return;
  }
}

function findById(id) {
  return this.items.find(currentItem => {return currentItem.id === id;});
}

function filterByHighest(){
  return this.items.sort((a, b) => b.rating - a.rating);
}

function filterByLowest(){
  return this.items.sort((a, b) => a.rating - b.rating);
}

function addItem(newItem){
  this.items.push(newItem);
}

function findAndDelete(id){
  this.items = this.items.filter(currentItem => currentItem.id !== id);
}









export default {
  items,
  adding,
  filter,
  error,
  filterByHighest,
  filterByLowest,
  findById,
  addItem,
  findAndDelete,
  errorHandler
};