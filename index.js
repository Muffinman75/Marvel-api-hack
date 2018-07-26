'use strict';

// const PRIV_KEY = "513d67f9e79d2c6319e89122a9f3ab5aa73214d4";
// const PUBLIC_KEY = "c6a0054b9fdccbf11696e79f0e7d1f74";

const MARVEL_SEARCH_URL = 'https://manoj-marvel-api.herokuapp.com/api/by-id/';

const EBAY_SEARCH_URL = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.13.0&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=2&';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search?';

const CORS = 'https://cors-anywhere.herokuapp.com/';

let searchCharacter = null;

let heroIdNum = null;

let vidNumber = 0;

let itemNumber = 0;

function getDataFromMarvelApi(heroIdNum, callback) {
	const paramsObject = {
		url: MARVEL_SEARCH_URL + heroIdNum,
    	success: callback,
    	error: function(error) {
    		console.log(error);
    	}
	};
	$.getJSON(paramsObject);

	console.log(paramsObject);
}

function getDataFromYouTubeApi(inputText, callback) {
	// Take the value passed from handleSubmit and use
	// it to find the data for the videos related to
	// the value
	const paramsObject = {
		url: YOUTUBE_SEARCH_URL,
		data: {
			part: 'snippet',
			q: inputText+'origin,history,',
		    maxResults: 4,
			key: 'AIzaSyAw1hPcxvy1hwfZ8fTP-zOHaPzxVuqKFDI',
			type: 'video'
		},
		// type: 'GET',
		// dataType: 'json',
		success: callback,
		error: function(error) {
			console.log(error);
		}
	};

	$.getJSON(paramsObject);
}

function getDataFromEbay(searchItem) {
	// Take the value passed from handleSubmit and use
	// it to find the data for the videos related to
	// the value
	$('.js-shopping-page').prop('hidden', false);
	$('.js-shopping-page').html('<img src="img/giphy.gif"/>');
	let url = CORS + "https://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
  	url += "&SERVICE-VERSION=1.0.0";
  	url += "&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744";
	 	url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
	  url += "&REST-PAYLOAD";
    url += `&keywords=${searchItem}%20figurine%20comics`;
    url += "&paginationInput.entriesPerPage=4";
	// const ebayTshirtUrl = EBAY_SEARCH_URL + `keywords=${searchItem}%20tshirt&`;
	// console.log(ebayTshirtUrl);
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
	return`
		<div class="bioContainer">
	  	<h1 aria-label="string">Name : ${item.name}</h1>
		  <img src="${item.image}" alt="${item.name}">
		  <h1 aria-label="string">history</h1>
			<h2 aria-label="string">${item.description}</h2>
			<br>
			<br>
			<h2 aria-label="string">If there is no history information present or you would like to
			know more about this character, please select a video from below.</h2>
		</div>	`;
}

function renderShoppingSearchResults(item) {
	// Return the template string with
	// all thumbnails and captions ready to
	// inject into the results page div
	console.log(`'renderShoppingSearchResults' ran`);
	return`
		 <a href="${item.viewItemURL[0]}" target="_blank"><img src=${item.galleryURL[0]}>Click To Purchase</a>
		`;
}


function renderVideoSearchResults(item) {
	// Return the template string with
	// all thumbnails and captions ready to
	// inject into the results page div
	console.log(`'renderVideoSearchResults' ran`);
	vidNumber++;
	return`
	<div class="vidResult ${vidNumber}">
		<a href="https://www.youtube.com/watch?v=${item.id.videoId}" data-lity><img src=${item.snippet.thumbnails.medium.url}></a>
	</div>
		`;
}


function displayHeroBio(data) {
	console.log(`'displayHeroBio' ran`);
	let chosenHeroInfo = renderHeroBio(data);
	$('.js-bio-page').html(chosenHeroInfo);
	$('.js-bio-page').prepend('<button onClick="handleBackToHeroScreenClicked()" role="button" class="backToheroScreen">Choose a different Hero!</button>');
	$('.js-choice-page').prop('hidden', true);
	$('.js-bio-page').prop('hidden', false);
}

function displayVideoResultsPage(data) {
	// Inject the HTML into the results page to
	// display in the DOM
	let listOfVideos = data.items.map((item, index) => renderVideoSearchResults(item));
	console.log(listOfVideos);
	console.log(`'displayVideoPage' ran`);
	$('.js-video-page').html(listOfVideos);
	$('.js-video-page').prop('hidden', false);
}

function displayShoppingResultsPage(data) {
	console.log(data);
	data = data.findItemsByKeywordsResponse[0].searchResult[0];
	// Inject the HTML into the results page to
	// display in the DOM
	let listOfShoppingImages = data.item.map((item, index) => renderShoppingSearchResults(item));
	console.log(listOfShoppingImages);
	console.log(`'displayShoppingPage' ran`);
	$('.js-shopping-page').html(listOfShoppingImages);
	$('.js-shopping-page').append('<button onClick="handleBackToHeroScreenClicked()" role="button" class="backToheroScreen">Choose a different Hero!</button>');
}

function handleBackToHeroScreenClicked() {
		console.log(`'handleBackToHeroScreenClicked' ran`)
		$('.js-shopping-page').prop('hidden', true);
		$('.js-shopping-title').prop('hidden', true);
		$('.js-bio-page').prop('hidden', true);
		$('.js-video-page').prop('hidden', true);
		$('.js-video-title').prop('hidden', true)
		$('.js-choice-title').prop('hidden', false);
		$('.js-choice-page').prop('hidden', false);
		vidNumber = 0;
		itemNumber = 0;
}


function handleHeroClicked(key) {
	console.log('button click');
	let searchCharacter = STORE[key][0];
	console.log('searchCharacter', searchCharacter);
	let heroIdNum = key;
	console.log('heroIdNum', heroIdNum);
	$('.js-choice-page').prop('hidden', true);
	$('.js-video-title').prop('hidden', false);
	$('.js-choice-title').prop('hidden', true);
	$('.js-shopping-title').prop('hidden', false);
	getDataFromMarvelApi(heroIdNum, displayHeroBio);
	getDataFromYouTubeApi(searchCharacter, displayVideoResultsPage);
	getDataFromEbay(searchCharacter);
}

function initialLoadOfHeroLinks() {
	Object.keys(STORE).forEach(function(key) {
		// console.log(key);
		$('.js-choice-page').append(`<a onClick="handleHeroClicked(${key})" class="heroLink">
																 	<div class="choiceContainer">
																		<img src="${STORE[key][1]}" alt="${STORE[key][0]}"><h2 aria-label="string">${STORE[key][0]}</h2>
																 	</div>
																 </a>
																	`);
	});
}


// function getImages() {
// 	Object.keys(STORE).forEach(function(key) {
// 		let data = $.getJSON(MARVEL_SEARCH_URL + key);
// 		console.log(data);
// 		STORE[key].push(data.image);
// 	});
// }




function handleMarvelApp() {
	$(initialLoadOfHeroLinks);
	//$(getImages);
}

$(handleMarvelApp);
