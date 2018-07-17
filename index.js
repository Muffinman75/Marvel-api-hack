'use strict';

// const MARVEL_SEARCH_URL = 'https://gateway.marvel.com/v1/public/characters'


// const PRIV_KEY = "513d67f9e79d2c6319e89122a9f3ab5aa73214d4";
// const PUBLIC_KEY = "c6a0054b9fdccbf11696e79f0e7d1f74";

const EBAY_SEARCH_URL = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.13.0&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=2&';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search?';

const CORS = 'https://cors-anywhere.herokuapp.com/';

let itemNumber = 0;

let resultNumber = 0;

let searchCharacter = null;

// $(function(){
// const marvelAPI = 'https://gateway.marvel.com/v1/public/comics';
// $.getJSON( marvelAPI, {
//     apikey: 'c6a0054b9fdccbf11696e79f0e7d1f74'
//   })
//     .done(function( response ) {
//       let results = response.data.results;
//       let resultsLen = results.length;
//       let output = '<ul>'; 
      
//       for(let i=0; i<resultsLen; i++){
//         if(results[i].images.length > 0) {
//           let imgPath = results[i].images[0].path + '/standard_xlarge.' + results[i].images[0].extension;
//           output += '<li><img src="' + imgPath + '"><br>'+results[i].title+'</li>';
//         }
//       }  
//       output += '</ul>'
//       $('.js-bio-page').append(output);
//   });
   
// });

function getDataFromYouTubeApi(inputText, callback) {
	// Take the value passed from handleSubmit and use 
	// it to find the data for the videos related to 
	// the value
	const paramsObject = {
		url: YOUTUBE_SEARCH_URL,
		data: { 
			part: 'snippet',
			q: inputText+'origin,history',
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

function renderShoppingSearchResults(item) {
	// Return the template string with
	// all thumbnails and captions ready to 
	// inject into the results page div
	console.log(`'renderShoppingSearchResults' ran`);
	incrementItemNumber();
	return`
		<h4>Item Number${itemNumber}</h4> 
		<a href="${item.viewItemUrl[0]}" target="_blank"><img src=${item.galleryUrl[0]}>Small Image</a>
		`; 
}

function incrementItemNumber() {
	itemNumber++;
}

function renderVideoSearchResults(item) {
	// Return the template string with
	// all thumbnails and captions ready to 
	// inject into the results page div
	console.log(`'renderVideoSearchResults' ran`);
	incrementResultNumber();
	return`
		<h4>Search result ${resultNumber}</h4>
		<a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank"><img src=${item.snippet.thumbnails.medium.url}>Medium Image</a>
		`; 
}

function incrementResultNumber() {
 	resultNumber++;
}

function getDataFromEbay(searchItem) {
	// Take the value passed from handleSubmit and use 
	// it to find the data for the videos related to 
	// the value
	let url = CORS + "https://svcs.ebay.com/services/search/FindingService/v1";
    	url += "?OPERATION-NAME=findItemsByKeywords";
    	url += "&SERVICE-VERSION=1.0.0";
    	url += "&SECURITY-APPNAME=ManojMod-Marvelch-PRD-88bba853c-a97f3744";
    	url += "&GLOBAL-ID=EBAY-US";
    	url += "&RESPONSE-DATA-FORMAT=JSON";
    	url += "&callback=displayShoppingResultsPage";
    	url += "&REST-PAYLOAD";
    	url += `&keywords=${searchItem}%20tshirt`;
    	url += "&paginationInput.entriesPerPage=4";
	// const ebayTshirtUrl = EBAY_SEARCH_URL + `keywords=${searchItem}%20tshirt&`;
	// console.log(ebayTshirtUrl);
	console.log(url); 
	console.log(`getDataFromEbay 'ran'`);
	const paramsObject = {
		url: url,
		data: {},
		error: function(error) {
			console.log(error);
		}
	};

	$.getJSON(paramsObject);

}

// function getImageUrlFromEbayData() {
	// Take the item id from the data returned from the getDataFromEbay 
	// function, find the image data and create the url for the image ready
	// to pass to renderResults
// }

function displayVideoResultsPage(data) { 
	// Inject the HTML into the results page to 
	// display in the DOM
	const listOfVideos = data.items.map((item, index) => renderVideoSearchResults(item));
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
	const listOfShoppingImages = data.item.map((item, index) => renderShoppingSearchResults(item));
	console.log(listOfShoppingImages);
	console.log(`'displayShoppingPage' ran`); 
	$('.js-shopping-page').html(listOfShoppingImages);
	$('.js-shopping-page').prop('hidden', false);
}

function handleSubmit() {
	// Look for and store the value for the search term
	// then pass the value to getDataFromApi function
	$('.js-marvel-search-page').submit(event => {
		event.preventDefault();
		const searchCharacter = $('#marvel-search').val();
		// const searchObject = $(event.currentTarget).find('#video-search');
		// const searchValue = $searchObject.val();
		$('#marvel-search').val('');
		console.log(searchCharacter);
		getDataFromYouTubeApi(searchCharacter, displayVideoResultsPage);
		getDataFromEbay(searchCharacter);
	});
}


handleSubmit();

