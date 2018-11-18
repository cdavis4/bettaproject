let bettas,
  colors,
  tailTypes

/**
 * Fetch colors and tails as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchColors();
  fetchTails();
});

/**
 * Fetch all colors and set their HTML.
 */
fetchColors = () => {
  DBHelper.fetchColors((error, colors) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.colors = colors;
      fillColorsHTML();
    }
  });
}

/**
 * Set colors HTML.
 */
fillColorsHTML = (colors = self.colors) => {
  const select = document.getElementById('colors-select');
  colors.forEach(color => {
    const option = document.createElement('option');
    option.innerHTML = color;
    option.value = color;
    select.append(option);
  });
}

/**
 * Fetch all tail types and set their HTML.
 */
fetchTails = () => {
  DBHelper.fetchTails((error, tailTypes) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.tailTypes = tailTypes;
      fillTailHTML();
    }
  });
}

/**
 * Set tail types HTML.
 */
fillTailHTML = (tailTypes= self.tailTypes) => {
  const select = document.getElementById('tails-select');

  tailTypes.forEach(tailType => {
    const option = document.createElement('option');
    option.innerHTML = tailType;
    option.value = tailType;
    select.append(option);
  });
}

/**
 * Initialize update for bettas data
 */
initMap = () => {

  updateBettas();
  createContactModal();
}

/**
 * Update page and map for current bettas.
 */
updateBettas = () => {
  const cSelect = document.getElementById('tails-select');
  const nSelect = document.getElementById('colors-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const tailType = cSelect[cIndex].value;
  const color = nSelect[nIndex].value;

  DBHelper.fetchBettaByTailAndColor(tailType, color, (error, bettas) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetBettas(bettas);
      fillBettasHTML();
    }
  })
}

/**
 * Clear current bettas, their HTML and remove their map markers.
 */
resetBettas = (bettas) => {
  // Remove all bettas
  self.bettas = [];
  const ul = document.getElementById('bettas-list');
  ul.innerHTML = '';
  self.bettas = bettas;
}

/**
 * Create all bettas HTML and add them to the webpage.
 */
fillBettasHTML = (bettas = self.bettas) => {
  const ul = document.getElementById('bettas-list');
bettas.forEach(betta => {
  ul.appendChild(createBettaHTML(betta));
  });
}

/**
 * Create betta HTML.
 */
createBettaHTML = (betta) => {
  console.log(betta.name);
  console.log(betta.id);
  const li = document.createElement('li');
  li.setAttribute("class","list-group-item");

  const image = document.createElement('img');
  image.className = 'betta-img';
  image.src = DBHelper.imageUrlForBetta(betta);
  /**
 * add alt and srcset
 */
 // added alt attribute and srcset

 image.alt = "photo from betta " + betta.name;

 image.srcset = "img/blue1.jpg";
 //"/img/"+ betta.id + ".jpg 400w, /img/" 
 //+betta.id + "-600_1x.jpg 1000w, /img/" + betta.id  + "-600_2x.jpg 4000w";

  li.append(image);

  //create div to keep name and div so star can be right of name
  const div = document.createElement('div');
  div.setAttribute("id","betta-div");
  li.append(div);

  //name
  const name = document.createElement('h3');
  name.innerHTML = betta.name;
 li.append(name);


  const star = document.createElement('span');
  star.setAttribute("role", "button");
  star.setAttribute("class", "favorite-star-character");
  star.setAttribute("data-tooltip", "Favorite");
  star.setAttribute("data-tooltip-position", "right");
  star.innerHTML = "&#x2605;";
  li.append(star);

  if (betta.is_favorite === 'true') {
    star.classList.add('active');
    star.setAttribute('aria-pressed', 'true');
  } else {
    star.setAttribute('aria-pressed', 'false');
  }
  star.addEventListener('click', () => {
    if (star.classList.contains('active')) {
      star.setAttribute('aria-pressed', 'false');
      DBHelper.unMarkFavorite(betta.id);
    } else {
      star.setAttribute('aria-pressed', 'true');
      DBHelper.markFavorite(betta.id);
    }
    star.classList.toggle('active');
  });
 
  const description = document.createElement('p');
  description.innerHTML = betta.description;
  li.append(description);

  const birth = document.createElement('p');
  birth.innerHTML = "Born: "+betta.date_birth;
  li.append(birth);

  const sale = document.createElement('p');
  const highlightSale = document.createElement('mark');
  const more = document.createElement('button');

  if(betta.sale == "for sale" || betta.sale == "available soon"){
  
  sale.appendChild(highlightSale);
  highlightSale.innerHTML =betta.sale;
  more.innerHTML = 'Purchase';
  }
  else{ 
    sale.innerHTML = betta.sale;
    more.innerHTML = 'Unavailable';
    }
  li.append(sale);
  more.addEventListener ("click", function() {
    const url = DBHelper.urlForBetta(betta);
    window.location.replace(url);
  });

  /**
 * Add attributes for View Details button
 */
  more.setAttribute("class", "button");
  more.setAttribute("role", "button");
  more.setAttribute("aria-label", "Purchase options for "+betta.name);
  li.append(more);

  return li
}

/**
 * Contact Modal
 */
createContactModal = (betta) =>{
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
  
  divContent.appendChild(createForm());

  // Get the modal button, close button and modal
  const modal = document.getElementById("myModal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const btn = document.getElementById('contactBtn');
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
}
/**
 * create html for reviews form
 */

createForm = () => {
  const form = document.createElement('form');
  form.setAttribute("id","contact_form");
  const div_email = document.createElement('div');
  div_email.setAttribute("class", "form-group");
  const h3 = document.createElement('h3');
  h3.innerHTML = "Contact Information";

  //email info
  const label_email = document.createElement('label');
  label_email.setAttribute("for","email");
  label_email.innerHTML="Email Address:";
  const email_input = document.createElement("input");
  email_input.setAttribute("type", "email_info");
  email_input.setAttribute("id","email");
  email_input.setAttribute("class", "form-control");
  email_input.setAttribute("aria-describedby","emailHelp");
  email_input.setAttribute("emailHelp","Enter email");
  const small_tip = document.createElement("caption");
  small_tip.setAttribute("class","form-text text-muted");
  small_tip.innerHTML="We'll never share your email with anyone else.";

  //add to div

  div_email.appendChild(label_email);
  div_email.appendChild(email_input);
  div_email.appendChild(small_tip);

  //add message to send
  const div_message = document.createElement('div');
  div_message.setAttribute("class", "form-control");
  const label_message = document.createElement('label');
  label_message.setAttribute("for","message");
  const message_input = document.createElement('textarea');
  message_input.setAttribute("name","message");
  message_input.setAttribute("id","message");
  message_input.setAttribute("placeholder","Please provide your name, inquiry. Provide specifics on order questions. We will contact you by email as soon as possible. Provide phone number if you would like us to contact you by phone. Thank you.");
  message_input.setAttribute("aria-describedby","contact_interests");
  const small_tip2 = document.createElement("small");
  small_tip2.setAttribute("class","form-text text-muted");
  small_tip2.innerHTML="Specify specifics about your interests and we will contact you as soon as possible.";

  //add to div
  div_message.appendChild(label_message);
  div_message.appendChild(message_input);
  div_email.appendChild(small_tip2);

  const div_button = document.createElement('div');
  div_button.setAttribute("class", "form_control");
  const input_button = document.createElement('button');
  input_button.setAttribute("onclick","DBHelper.postContact()");
  input_button.setAttribute("id","submit_button");
  input_button.innerHTML ="Submit";
  div_button.appendChild(input_button);
  
  //add to form
  form.appendChild(div_email);
  form.appendChild(div_message);
  form.appendChild(div_button);
  //form.setAttribute("action",DBHelper.sendContactInfo());
  //form.setAttribute("method", "post");
  return form;
}