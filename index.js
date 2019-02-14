"use strict";

const MARVEL_SEARCH_URL = "https://manoj-marvel-api.herokuapp.com/api/by-id/";

const EBAY_SEARCH_URL =
  "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.13.0&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=2&";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search?";

const CORS = "https://cors-anywhere.herokuapp.com/";

let searchCharacter = null;

let heroIdNum = null;

let vidNumber = 0;

let itemNumber = 0;

function getDataFromMarvelApi(heroIdNum, callback) {
  // Use the heroIdNum to retrieve data on the
  // relevant character
  const paramsObject = {
    url: MARVEL_SEARCH_URL + heroIdNum,
    success: callback,
    error: function(error) {
      console.log("Marvel api error:", error);
    }
  };
  $.getJSON(paramsObject);

  console.log("Marvel params object:", paramsObject);
}

function getDataFromYouTubeApi(inputText, callback) {
  // Take the value passed from handleSubmit and use
  // it to find the data for the videos related to
  // the value
  const paramsObject = {
    url: YOUTUBE_SEARCH_URL,
    data: {
      part: "snippet",
      q: inputText + "origin,history,",
      maxResults: 4,
      key: "AIzaSyAw1hPcxvy1hwfZ8fTP-zOHaPzxVuqKFDI",
      type: "video"
    },
    success: callback,
    error: function(error) {
      console.log(error);
    }
  };

  $.getJSON(paramsObject);
}

function getDataFromEbay(searchItem) {
  // Take the value passed from handleSubmit and use
  // it to retrieve the data for the shopping items related to
  // the character
  $(".js-shopping-page").prop("hidden", false);
  $(".js-shopping-page").html('<img src="img/giphy.gif"/>');
  let url = CORS + "https://svcs.ebay.com/services/search/FindingService/v1";
  url += "?OPERATION-NAME=findItemsByKeywords";
  url += "&SERVICE-VERSION=1.0.0";
  url += "&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744";
  url += "&GLOBAL-ID=EBAY-US";
  url += "&RESPONSE-DATA-FORMAT=JSON";
  url += "&REST-PAYLOAD";
  url += `&keywords=${searchItem}%20figurine%20comics`;
  url += "&paginationInput.entriesPerPage=6";
  console.log(url);
  console.log(`getDataFromEbay 'ran'`);
  const paramsObject = {
    url: url,
    data: {},
    success: displayShoppingResultsPage,
    error: function(error) {
      console.log(error, "ebay api error");
    }
  };

  $.getJSON(paramsObject);
}

function renderHeroBio(item) {
  // Return template string with hero/villain pic
  // with some biography text
  console.log(`'renderHeroBio' ran`);
  return `
		<div class="bioContainer">
	  	<h1 class="js-bio-name">Name : ${item.name}</h1>
		  <img src="${item.image}" alt="${item.name}">
		  <h1 class="js-bio-history">history</h1>
			<h2 class="bioText">${item.description}</h2>
			<br>
			<br>
			<h2 aria-label="string">If there is no history information present or you would like to
			know more about this character, please select a video from below.</h2>
		</div>	`;
}

function renderShoppingSearchResults(item) {
  // Return the template string with
  // all thumbnails and title ready to
  // inject into the results page div
  console.log(`'renderShoppingSearchResults' ran`);
  return `<a class="shoppingLink" href="${item.viewItemURL[0]}" target="_blank">
					 <div class="shoppingContainer">
			       <img class="shoppingImage" src=${item.galleryURL[0]} alt="${
    item.title[0]
  }">
			       <h3>${item.title[0]}</h3>
		       </div>
				 </a>`;
}

function renderVideoSearchResults(item) {
  // Return the template string with
  // all thumbnails and captions ready to
  // inject into the results page div
  console.log(`'renderVideoSearchResults' ran`);
  vidNumber++;
  return `<a class="vidLink" href="https://www.youtube.com/watch?v=${
    item.id.videoId
  }" data-lity>
					 <div class="vidResult ${vidNumber}">
		         <img src=${
               item.snippet.thumbnails.medium.url
             } class="thumbnail" alt="${item.snippet.title}">
		         <h3>${item.snippet.title}</h3>
	         </div>
				 </a>`;
}

function displayHeroBio(data) {
  // Injects the html for the bio text and adds a button
  // at the top to navigate back to the hero screen
  // Hides the character selection screen and reveals
  // history page for chosen character
  console.log(`'displayHeroBio' ran`);
  let chosenHeroInfo = renderHeroBio(data);
  $(".js-bio-page").html(chosenHeroInfo);
  $(".js-bio-page").prepend(
    '<button onClick="handleBackToHeroScreenClicked()" role="button" class="flash-button">Choose a different Hero!</button>'
  );
  $(".js-choice-page").hide();
  $(".js-bio-page").show();
}

function displayVideoResultsPage(data) {
  // Inject the HTML into the video results page and
  // display it in the DOM
  let listOfVideos = data.items.map((item, index) =>
    renderVideoSearchResults(item)
  );
  console.log(listOfVideos);
  console.log(`'displayVideoPage' ran`);
  $(".js-video-page").html(listOfVideos);
  $(".js-video-page").show();
}

function displayShoppingResultsPage(data) {
  // Inject the HTML into the shopping item results page to
  // display the items in the DOM
  console.log("data", data);
  data = data.findItemsByKeywordsResponse[0].searchResult[0];
  let listOfShoppingImages = data.item.map((item, index) =>
    renderShoppingSearchResults(item)
  );
  console.log(listOfShoppingImages);
  console.log(`'displayShoppingPage' ran`);
  $(".js-shopping-page").html(listOfShoppingImages);
  $(".js-shopping-page").append(
    '<button onClick="handleBackToHeroScreenClicked()" role="button" class="flash-button">Choose a different Hero!</button>'
  );
  $(".js-shopping-page").show();
}

function handleBackToHeroScreenClicked() {
  // hides the whole character page and reveals the
  // character selection screen
  console.log(`'handleBackToHeroScreenClicked' ran`);
  $(document).ready(function() {
    $(".js-shopping-page").hide();
    $(".js-shopping-title").hide();
    $(".js-shopping-message").hide();
    $(".js-bio-page").hide();
    $(".js-video-page").hide();
    $(".js-video-title").hide();
    $(".js-choice-title").show();
    $(".js-choice-page").show();
  });
  //$(".js-choice-page").toggleClass("hidden", false);
  vidNumber = 0;
  itemNumber = 0;
}

function handleHeroClicked(key) {
  // hides the character selection screen and
  // reveals the character bio, video and
  // shopping screens
  console.log("Hero button clicked");
  let searchCharacter = STORE[key][0];
  console.log("searchCharacter", searchCharacter);
  let heroIdNum = key;
  console.log("heroIdNum", heroIdNum);
  getDataFromMarvelApi(heroIdNum, displayHeroBio);
  getDataFromYouTubeApi(searchCharacter, displayVideoResultsPage);
  getDataFromEbay(searchCharacter);
  $(document).ready(function() {
    $(".js-choice-page").hide();
    $(".js-choice-title").hide();
    $(".js-video-title").show();
    $(".js-shopping-title").show();
    $(".js-shopping-message").show();
  });
}

function initialLoadOfHeroLinks() {
  // loads all the characters on page load
  Object.keys(STORE).forEach(function(key) {
    // console.log(key);
    $(
      ".js-choice-page"
    ).append(`<a href="#marvel" onClick="handleHeroClicked(${key})" class="heroLink">
																 	<div class="choiceContainer">
																		<div className="choiceImageContainer">
																			<img className="choiceImage" src="${
                                        STORE[key][1]
                                      }" alt="${STORE[key][0]}"><h2>${STORE[key][0]}</h2>
																		</div>
																 	</div>
																 </a>
																	`);
  });
}

function handleMarvelApp() {
  $(initialLoadOfHeroLinks);
  //$(getImages);
}

$(handleMarvelApp);
