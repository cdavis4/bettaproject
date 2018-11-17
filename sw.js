if (typeof idb === "undefined") {
  self.importScripts('js/idb.js');
 }

 if (typeof DBHelper === "undefined") {
  self.importScripts('js/dbhelper.js');
 }


//augmented code to use keyval source: https://github.com/jakearchibald/idb-keyval
 //source: https://james-priest.github.io/mws-restaurant-stage-1/stage2.html
const staticCacheName = 'betta-static'; 

const dbPromise = idb.open('betta_info', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('bettas');
  }
});



// IndexedDB object with get & set methods 
// https://github.com/jakearchibald/idb
const idbKeyVal = {
  get(key) {
    return dbPromise.then(db => {
      return db
        .transaction('bettas')
        .objectStore('bettas')
        .get(key);
    });
  },
  set(key, val) {
    return dbPromise.then(db => {
      const store = db.transaction('bettas', 'readwrite');
      store.objectStore('bettas').put(val, key);
      return store.complete;
    });
  },
  delete(key) {
    return dbPromise.then(db => {
      const tx = db.transaction('bettas', 'readwrite');
      tx.objectStore('bettas').delete(key);
      return tx.complete;
    });
  },
  clear() {
    return dbPromise.then(db => {
      const tx = db.transaction('bettas', 'readwrite');
      tx.objectStore('bettas').clear();
      return tx.complete;
    });
  }
};


// list of assets to cache on install
// cache each fish detail page as well
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll([
          '/',
          '/css/styles.css',
          '/css/bootstrap.min.css',
          '/css/responsive.css',
          '/index.html',
          '/fish.html',
          'js/main.js',
          'js/betta_info.js',
          'js/bootstrap.min.js',
          'js/bootstrap-slider.js',
          'js/docs.min.js',
          'js/jquery-3.2.1.slim.min.js',
          'js/popper.min.js',
          '/registerSW.js',
          '/sw.js',
          'js/idb.js',
          'js/dbhelper.js',
          'js/dbhelper.js',
          '/fish.html?id=1',
          '/fish.html?id=2',
          '/fish.html?id=3',
          '/fish.html?id=4',
          '/fish.html?id=5',
          '/fish.html?id=6',
          '/fish.html?id=7',
          '/fish.html?id=8',
          '/fish.html?id=9',
          '/fish.html?id=10'
        ]).catch(error => {
          console.log('Caches open failed: ' + error);
        });
      })
  );
});

function idbResponse(request) {
  // 2. check idb & return match
  // 3. if no match then clone, save, & return response
  return idbKeyVal.get('bettas') 
  .then(bettas => {
    return (
       bettas || fetch(request)
        .then(response => response.json())
        .then(json => {
          idbKeyVal.set('bettas', json);
          return json;
        }) 
    );
  })
  .then(response => new Response(JSON.stringify(response)))
  .catch(error => {
    return new Response(error, {
      status: 404,
      statusText: 'bad request'
    });
  });
}

  function cacheResponse(request) {
    // match request...
    return caches.match(request).then(response => {
      // return matched response OR if no match then
      // fetch, open cache, cache.put response.clone, return response
      return response || fetch(request).then(fetchResponse => {
        return caches.open(staticCacheName).then(cache => {
          // filter out browser-sync resources otherwise it will err
          if (!fetchResponse.url.includes('browser-sync')) { // prevent err
            cache.put(request, fetchResponse.clone()); // put clone in cache
          }
          return fetchResponse; // send original back to browser
        });
      });
    }).catch(error => {
      return new Response(error, {
        status: 404,
        statusText: 'Not connected to the internet'
      });
    });
  }

/**
 * activate service worker
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith(staticCacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * fetch service worker
 **/

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});
/**
 * fetch service worker

self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  
  // 1. filter Ajax Requests
  if ((requestUrl.port === '8000')) {
    event.respondWith(idbResponse(request));
  }

  if(requestUrl.port !== '8000') {
    event.respondWith(cacheResponse(request));
  }
});
 */
