/*
 * Javascript code to render the Twitter Feed for a given user
*/

var userObj = {}; // Global object to user data

// Utility function to get the current date in the required format
function getCurrentDate() {

	var date = new Date().toDateString();
	
	return 0;
}

// Post Handler. Makes AJAX Post call to post user tweets
function onClickPostHandler() {
	event.preventDefault();

	var tweet = $('#text').val().trim();
	console.log(tweet);

	var date = getCurrentDate();

	var obj = { name: userObj.name, handle: userObj.handle, tweet: tweet, date:''};

	$.ajax({
		url: 'http://mock.aphetech.com/feed',
		method: 'POST',
		data: obj
	}).then(function(response) {
		console.log(response);
	});
}

// Execute the following when the document is fully loaded and ready to go!
$(document).ready(function() {

	// AJAX call to get the user information upon loading the page
	$.ajax({
		url: 'http://mock.aphetech.com/profile'
	}).then(function(response) {

		var imgDiv = $('#photo');
		var htmlStr = `<img src=${response.imageUrl} alt=${response.name} height="40" width="40">`;
		htmlStr += `<span class="name">${response.name}</span>`;
		imgDiv.html(htmlStr);

		var followDiv = $('#follow');
		var str = `${response.tweets} tweets  ${response.followers} followers ${response.following} following`;
		followDiv.html(str);

		// Save User Data for use with Posts
		userObj[`name`] = response.name;
		userObj[`handle`] = response.handle;
	});

	// AJAX call to get the recent tweets for this user account
	$.ajax({ 
		url: 'http://mock.aphetech.com/feed'
	}).then(function(response) {
		console.log(response);
		var tweetsDiv = $('#tweets');
		response.forEach(function(item) {
			var tDiv = $('<div>');
			tDiv.html(`<p><span>${item.name}</span>
								<span>${item.handle}<span>
								<span>${item.date}</span>
								<p>${item.tweet}</p>`);
			tweetsDiv.append(tDiv)
		});
	});


	// Define handler for Posts by the user
	$('#post').on('click', onClickPostHandler);
});