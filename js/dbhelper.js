
/**
 * Common database helper functions.
 */
class DBHelper {

  /**
 * Common database helper functions.
 */


  /**
   * Database URL.
   * Change this to bettas.json file location on your server.
   */
  static get DATABASE_URL() {
    //const port = 3212 // Change this to your server port
    return 'http://web.engr.oregonstate.edu/~davicarr/bettaFish/data/bettas.json';
  }


  /**
   * Fetch all bettas.
 
  static fetchBettas(callback) {
    fetch(DBHelper.DATABASE_URL)
    .then(response => response.json())
    .then(bettas => callback(null, bettas))
    .catch(error => callback(null,error));
   }
  */
  static fetchBettas(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const bettas = json.bettas;
        callback(null, bettas);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchBettaById(id, callback) {
    // fetch all bettas with proper error handling.
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(null,error);
      } else {
       // fetch(DBHelper.DATABASE_URL)
       // .then(response => response.json())
      //  .then(bettas => {
        const betta = bettas.find(r => r.id == id);
        if (betta) { // Got the location
          console.log(betta);
          //return site;
          callback(null, betta);
        } else { // Location does not exist in the database
          callback('Location does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch bettas by a tail type with proper error handling.
   */
  static fetchBettaByTail(tailType, callback) {
    // Fetch all bettas  with proper error handling
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter bettas to have only given cuisine type
        const results = bettas.filter(r => r.tail_type == tailType);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch bettas by a color with proper error handling.
   */
  static fetchBettaByColor(color, callback) {
    // Fetch all bettas
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter bettas to have only given color
        const results = bettas.filter(r => r.color == color);
        callback(null, results);
      }
    });
  }
  /**
   * Fetch bettas by a cuisine and a neighborhood with proper error handling.
   */
  static fetchBettaByTailAndColor(tailType, color, callback) {
    // Fetch all bettas
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(error, null);
      } else {
        let results = bettas
        if (tailType != 'all') { // filter by cuisine
          results = results.filter(r => r.tail_type == tailType);
        }
        if (color != 'all') { // filter by neighborhood
          results = results.filter(r => r.color == color);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchColors(callback) {
    // Fetch all bettas
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all colors from all bettas
        const colors = bettas.map((v, i) => bettas[i].color)
        // Remove duplicates from neighborhoods
        const uniqueColors = colors.filter((v, i) => colors.indexOf(v) == i)
        callback(null, uniqueColors);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchTails(callback) {
    // Fetch all bettas
    DBHelper.fetchBettas((error, bettas) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all bettas
        const tailTypes = bettas.map((v, i) => bettas[i].tail_type)
        // Remove duplicates from cuisines
        const uniqueTails = tailTypes.filter((v, i) => tailTypes.indexOf(v) == i)
        callback(null, uniqueTails);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForBetta(betta) {
    return (`./fish.html?id=${betta.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForBetta(betta) {
    return (`/img/${betta.photograph}`);
  }
  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForBetta(betta, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([betta.latlng.lat, betta.latlng.lng],
      {title: betta.name,
      alt: betta.name,
      url: DBHelper.urlForBetta(betta)})
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */




  //postData = () => {
  static postData(){
    // Default options are marked with *
    //created from example from mozillia dev pages
    // credit offline, offline code and form submit idea from Project 3 Live Webinar MWS Stage 3 | Elisa & Lorenzo
    event.preventDefault();
    
    let betta_id = getParameterByName('id');  
    let reviewer_name = document.getElementById('name').value;
    let rating = document.querySelector('#rating option:checked').value;
    let comment_text = document.getElementById('comments').value;
    
    let review_body = {
      "betta_id": restaurant_id,
      "name": reviewer_name,
      "rating": rating,
      "comments": comment_text
      };
      if(!navigator.onLine)
      {
        console.log("Request is offline");
        let request = JSON.stringify(review_body);
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        //idbReviewLocal(request); 
      //  idbOfflineKeyVal.set('id', request);
      localStorage.setItem(betta_id,request);
      alert("Review will be stored offline");
      }
   
      const myPost = fetch(DBHelper.REVIEWS_URL, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, same-origin, *omit
          headers: {
              "Content-Type": "application/json; charset=utf-8",
             // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(review_body), // body data type must match "Content-Type" header
      }).then(response => response.json()); // parses response to JSO
     console.log(myPost);
     let modal = document.getElementById("myModal");
      modal.style.display = "none";
     return myPost;
    }
    static postData(){
      // Default options are marked with *
      //created from example from mozillia dev pages
      // credit offline, offline code and form submit idea from Project 3 Live Webinar MWS Stage 3 | Elisa & Lorenzo
      event.preventDefault();
      
      let betta_id = getParameterByName('id');  
      let reviewer_name = document.getElementById('name').value;
      let rating = document.querySelector('#rating option:checked').value;
      let comment_text = document.getElementById('comments').value;
      
      let review_body = {
        "betta_id": restaurant_id,
        "name": reviewer_name,
        "rating": rating,
        "comments": comment_text
        };
        if(!navigator.onLine)
        {
          console.log("Request is offline");
          let request = JSON.stringify(review_body);
          let modal = document.getElementById("myModal");
          modal.style.display = "none";
          //idbReviewLocal(request); 
        //  idbOfflineKeyVal.set('id', request);
        localStorage.setItem(betta_id,request);
        alert("Review will be stored offline");
        }
     
        const myPost = fetch(DBHelper.REVIEWS_URL, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
               // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(review_body), // body data type must match "Content-Type" header
        }).then(response => response.json()); // parses response to JSO
       console.log(myPost);
       let modal = document.getElementById("myModal");
        modal.style.display = "none";
       return myPost;
      }
  
  /**
   * Restaurant image URL.
   */
  static imageUrlForBetta(betta) {
  //  return (`/img/${restaurant.photograph}'-600_2x.jpg'`);
  return (`/~davicarr/bettaFish/img/${betta.photograph}-300_2x.jpg`);
  }

  static sendContactInfo(){
    return 'http://web.engr.oregonstate.edu/~zhangluy/tools/class-content/form_tests/check_request.php';
  }


  static postContact(){
    event.preventDefault();
    let email_info = document.getElementById('email').value;
   
    let contact_text = document.getElementById('message').value;
      
    let review_body = {
        "email_address": email_info,
        "message": contact_text,
        };
        if(!navigator.onLine)
        {
        console.log("You are offline");
        }
    const myPost = fetch(DBHelper.sendContactInfo, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          mode: "cors", // include cross origin access because not using my own server
          headers: {
              "Content-Type": "application/json; charset=utf-8",
               // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(review_body), // body data type must match "Content-Type" header
      }); // parses response to JSO
      console.log(myPost);
      let modal = document.getElementById("myModal");
      modal.style.display = "none";
      return myPost;
  }

}

