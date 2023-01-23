//This function is used to pluralize a string.
//For example, if you pass in 'name' and count as 1, it will return 'name'.
//If you pass in 'name' and count as 2, it will return 'names'.
export function pluralize(name, count) {
  //Check if count is equal to 1
  if (count === 1) {
    //If count is 1, return the name as is
    return name;
  }
  //If count is not 1, return the name plus an 's'
  return name + 's';
}

//This function is used to perform CRUD operations on an indexedDB
export function idbPromise(storeName, method, object) {
  //Return a promise
  return new Promise((resolve, reject) => {
    //Create a request for opening the indexedDB
    const request = window.indexedDB.open('shop-shop', 1);
    let db, tx, store;
    //Attach an onupgradeneeded function to the request, which will create 3 object stores 
    request.onupgradeneeded = function(e) {
      const db = request.result;
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };
    //Attach an onerror function to the request, which will console log an error
    request.onerror = function(e) {
      console.log('There was an error');
    };
    //Attach an onsuccess function to the request, which will define the db, tx and store variables
    request.onsuccess = function(e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);
      //Attach an onerror function to the db which will console log an error
      db.onerror = function(e) {
        console.log('error', e);
      };
      //Check which method is passed in and perform the correct operation
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          //Attach an onsuccess function to the all variable, which will resolve the promise with the result
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }
      //Attach an oncomplete function to the tx which will close the db
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}