import cuid from 'cuid';
import {store} from './store';
  
let item = (function(){
  return{
    create: function(title, rating, url, desc) {
      if (!title){
        store.error = 1;
      }else if (url==='http://'){
        store.error = 2;
      }else {
        store.error = null;
      }
      return {
        id: cuid(),
        title: title,
        rating: rating,
        url: url,
        desc: desc,
        expanded: false
      };
    },

    addHttp: function(url){
      if(url.includes('http://') || url.includes('https://')){
        return url;
      }else {
        return `http://${url}`;
      }
    }
  }})();



export {item};