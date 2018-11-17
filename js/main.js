let bettas,
  colors,
  tailTypes
var newMap
var markers = []


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
  sale.innerHTML = betta.sale;
  li.append(sale);

  const more = document.createElement('button');
  if(betta.sale == "for sale" || betta.sale == "available soon"){
  more.innerHTML = 'Purchase';
  }
  else{ more.innerHTML = 'Unavailable';}
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

