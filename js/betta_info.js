
/**
 * POST offline review once online again

window.addEventListener('online', (event)=>{
  console.log('Browser is online again');
  let keys = Object.keys(localStorage);
  i = keys.length;
  for(var i=0; i < localStorage.length; i++)
 { 
 let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
 let review_body = {
  "betta_id": obj.betta_id,
  "name": obj.name,
  "rating": obj.rating,
  "comments": obj.comments
  };
 fetch(DBHelper.REVIEWS_URL, {
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
  }
  localStorage.clear();
}); */
/**
 * set up variables
 */
let betta;

/**
 * Initialize bread crumb as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
 
});

initMap = () => {
  fetchBettaFromURL((error, site) => {
    if (error) { // Got an error!
      console.error(error);
    } 
  });
}  
/**
 * Get current betta from page URL.
 */
fetchBettaFromURL = (callback) => {
  if (self.betta) { // betta already fetched!
    callback(null, self.betta)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No betta id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchBettaById(id, (error, betta) => {
      self.betta = betta;
      if (!betta) {
        console.error(error);
        return;
      }
      fillBreadcrumb();
      fillBettaHTML();
      callback(null, betta)
    });
  }
}
/**
 * Add betta name to the breadcrumb navigation menu
 */
fillBreadcrumb = (betta=self.betta) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = betta.name;
  breadcrumb.appendChild(li);
}



/**
 * Create betta HTML and add it to the webpage
 */
fillBettaHTML = (betta = self.betta) => {

  const title = document.getElementById('title');
  const headerName = document.createElement('h1');
  title.appendChild(headerName);
  headerName.innerHTML = betta.name;

  const image = document.getElementById('betta-img');
  image.className = 'betta-img';

  const fishName = document.getElementById('betta-name');
  fishName.innerHTML = betta.description;


  const colorType = document.getElementById('betta-color');
  colorType.innerHTML = betta.color;


 
 // added alt attribute and srcset

image.alt = "photo from betta " + betta.name;

image.srcset = "/~davicarr/bettaFish/img/blue1.jpg";
//+ betta.id 
//+ "-300_1x.jpg 400w, /img/" 
//+betta.id + "-600_1x.jpg 1000w, /img/" + betta.id  + "-600_2x.jpg 4000w";
 
  const tailType = document.getElementById('betta-tails');
  tailType.innerHTML = betta.tail_type;

  // fill operating hours
  if (betta.parents) {
    fillBettaParentsHTML();
  }
  // fill reviews
  //DBHelper.fetchReviewsById(betta.id,fillReviewsHTML);
  const purchaseForm = document.getElementById("purchase-container");


  //add Add Review Button
  const reviewButton = document.createElement('button');
  reviewButton.innerHTML = 'Add Review';
  reviewButton.setAttribute("id", "reviewBtn");
  reviewButton.setAttribute("role", "button");
  reviewButton.setAttribute("aria-label", "add review");
  purchaseForm.appendChild(reviewButton);

  //This listens if online
  createReviewModal(betta); // create modal with review form


}
  //DBHelper.fetchReviewsById(betta.id, (error, reviews) => {
 // self.betta.reviews = reviews;
  //console.log(reviews);
  // if (!reviews) {
  //    console.error(error);
  //    return;
   // }
   //fillReviewsHTML();
 // callback(null, reviews);
// });
//}

/**
 * Create betta Description HTML table and add it to the webpage.
 */
const fillBettaParentsHTML = (parents = self.betta.parents) => {
  const lineage = document.getElementById('betta-parents');
  for (let key in parents) {
    const row = document.createElement('tr');
    console.log(key);
    console.log(parents[key]);
    const parent = document.createElement('td');
    parent.innerHTML = key;
    row.appendChild(parent);

    const details = document.createElement('td');
    details.innerHTML = parents[key];
    row.appendChild(details);

    lineage.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */


fillFromHTML = (error,reviews) => {
  self.betta.reviews = reviews;
  if (error) {
    console.log('Error retrieving reviews', error);
  }
 
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);
  
//console.log(reviews);
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  const li = document.createElement('li');

  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);

    //add Add Review Button
    const reviewButton = document.createElement('button');
    reviewButton.innerHTML = 'Add Review';
    container.appendChild(reviewButton);
    reviewButton.setAttribute("id", "reviewBtn");
    reviewButton.setAttribute("role", "button");
    reviewButton.setAttribute("aria-label", "add review");
   
    //This listens if online
    createReviewModal(betta); // create modal with review form
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  var date_local = new Date(review.createdAt);
  //date_local.setUTCSeconds(review.createdAt); 
  date.innerHTML = date_local.toLocaleDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute("class", "comments");
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  return li;
}
/**
 * Offline review HTML add to webpage.
 */
createOfflineHTML = (id)=> {
  li.setAttribute("class","offline");
  let li = document.getElementsByClassName("offline");
  let id =  '1';
  let obj = localStorage.getItem(id);
  if(obj.betta_id === id)
  {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = json.name;
  li.appendChild(name);

  const date = document.createElement('p');
  var date_local = new Date(json.createdAt);
  //date_local.setUTCSeconds(review.createdAt); 
  date.innerHTML = date_local.toLocaleDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${json.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute("class", "comments");
  comments.innerHTML = json.comments;
  li.appendChild(comments);
  const ul = document.getElementById('reviews-list');
  ul.appendChild(li);
  }
}

/**
 * Create review modal HTML and add it to the webpage.
*/ 
createReviewModal = (betta) =>{
  const main = document.getElementById('maincontent');
  const div = document.createElement('div');
  div.setAttribute("id", "myModal");
  div.setAttribute("class", "modal");
  main.appendChild(div);
  const divContent = document.createElement('div');
  divContent.setAttribute("class", "modal-content");
  div.appendChild(divContent);
  const span = document.createElement('span');
  span.setAttribute("class", "close");
  span.innerHTML = "&times";
  divContent.appendChild(span);
  
  divContent.appendChild(createForm(betta));

  // Get the modal button, close button and modal
  const modal = document.getElementById("myModal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const btn = document.getElementById('reviewBtn');
  btn.addEventListener ("click", function() {
    modal.style.display = "block";
    modal.querySelector('input').focus();
  });

  closeBtn.addEventListener("click",function() {
    modal.style.display = "none";
  });
  window.addEventListener("click",function(){
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
/**
* update browser when online and review is added
*/
  const submitButton = document.getElementById("submit_button");
  submitButton.addEventListener("click",function(){
    let reload = function() {
      const url = self.location;
      window.location.replace(url);
      //window.location.reload(true);
      }
    if (navigator.onLine)
      {
        setTimeout(reload, 1000);
      }
  });
}

/**
 * create html for reviews form
 */

createForm = (betta=self.betta) => {
  const form = document.createElement('form');
  form.setAttribute("id","review_form");

 const h3 = document.createElement('h3');
 h3.innerHTML = "Add Review";

 //create betta id
 const bettaID = document.createElement("input");
 bettaID.setAttribute("type", "hidden");
 bettaID.setAttribute("id", "betta_id");
 bettaID.setAttribute("name", "betta_id");
 bettaID.setAttribute("value", betta.id);
  //create name div
  const div_name = document.createElement('div');
  div_name.setAttribute("class", "form_div");
  const label_name = document.createElement('label');
  label_name.setAttribute("for","name");
  label_name.innerHTML="Name:";
  const input_name = document.createElement('input');
  input_name.setAttribute("id","name");
  input_name.setAttribute("name","name");
  input_name.setAttribute("type","text");
  div_name.appendChild(label_name);
  div_name.appendChild(input_name);

  //create rating div

  const div_rating = document.createElement('div');
  div_rating.setAttribute("class", "form_div");
  const select_rating = document.createElement('select');
  select_rating.setAttribute('id', "rating");
  const label_rating = document.createElement('label');
  label_rating.setAttribute("for","rating");
  label_rating.innerHTML="Rating:";
  select_rating.setAttribute("name","rating");
  const option1 = document.createElement('option');
  option1.setAttribute("value","5");
  option1.innerHTML="5";
  const option2 = document.createElement('option');
  option2.setAttribute("value","4");
  option2.innerHTML="4";
  const option3 = document.createElement('option');
  option3.setAttribute("value","3");
  option3.innerHTML="3";
  const option4 = document.createElement('option');
  option4.setAttribute("value","2");
  option4.innerHTML="2";
  const option5 = document.createElement('option');
  option5.setAttribute("value","1");
  option5.innerHTML="1";
  select_rating.setAttribute("id","rating");
  select_rating.appendChild(option1);
  select_rating.appendChild(option2);
  select_rating.appendChild(option3);
  select_rating.appendChild(option4);
  select_rating.appendChild(option5);
  div_rating.appendChild(label_rating);
  div_rating.appendChild(select_rating);

  const div_comments = document.createElement('div');
  div_comments.setAttribute("class", "form_div");
  const label_comments = document.createElement('label');
  label_comments.setAttribute("for","comments");
  label_comments.innerHTML="Review:";
  const text_comments = document.createElement('textarea');
  text_comments.setAttribute("name","comments");
  text_comments.setAttribute("id","comments");
  text_comments.setAttribute("form", "review_form");
  div_comments.appendChild(label_comments);
  div_comments.appendChild(text_comments);

  const div_button = document.createElement('div');
  div_button.setAttribute("class", "form_div");
  const input_button = document.createElement('button');
  input_button.setAttribute("onclick","DBHelper.postData()")
  input_button.setAttribute("id","submit_button");
  input_button.innerHTML ="Submit Review";
  div_button.appendChild(input_button);
  //add to form

  form.appendChild(bettaID);
  form.appendChild(div_name);
  form.appendChild(div_rating);
  form.appendChild(div_comments);
  form.appendChild(div_button);
  form.setAttribute("action",DBHelper.DATABASE_URL);
  form.setAttribute("method", "post");
  return form;
}


/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



 