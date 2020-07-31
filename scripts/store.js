import {item} from './item.js';


let store = (function(){
  let items = [];
  let adding = false;
  let error = null;
  let filter = 0;

  return {
    errorHandler: function(){
      if(this.error===1){
        throw new TypeError ('Title must not be blank');
      }else if (this.error===2){
        throw new TypeError ('URL must not be blank');
      }else {
        return;
      }
    },

    findById: function(id) {
      return items.find(currentItem => {return currentItem.id === id;});
    },

    filterByHighest: function(){
      return items.sort((a, b) => b.rating - a.rating);
    },

    filterByLowest: function(){
      return items.sort((a, b) => a.rating - b.rating);
    },

    addItem: function(newItem){
      items.push(newItem);
    },


    findAndDelete: function(id){
      items = items.filter(currentItem => currentItem.id !== id);
    }
  }

})();







export {store};