/*
 * Javascript code to render the Twitter Feed for a given user
*/

var userObj = {}; // Global object to store user data

// Utility function to get the current date in the required format
function getCurrentDate() {
	var date = new Date();

	var dateStr = date.toLocaleString(); 

  // LocalString gives this format: 3/9/2018, 10:20:19 AM
  // Below string manipulations convert that into the one needed for this page's format
	var time = dateStr.split(' ')[1].split(':').slice(0,-1).join(':');
	var ampm = dateStr.split(' ').pop();
	var date = dateStr.split(' ').shift().slice(0,-1);

	return(`${date} ${time}${ampm}`);
}

// Post Button Click Handler
function onClickPostHandler() {
	// Prevent page reload
	event.preventDefault();
	console.log("clicked");

	if ($('#text').val()) {
		var tweet = $('#text').val().trim();
		var date = getCurrentDate();

		var obj = { name: userObj.name, handle: userObj.handle, tweet: tweet, date: date};

		// AJAX call to POST user tweets to the server
		$.ajax({
			url: 'http://mock.aphetech.com/feed',
			method: 'POST',
			data: obj
		}).then(function(response, error) {
			// Do something with error?
			if (error !== 'success') {
				console.log("Error posting tweet: ", error)
				return;
			}

			// Posted successfully
			$('#text').val(''); // Clear the text area

			// Reload the tweets so the latest one is shown on the page!
			loadTweets();
		});
	}
}

// Function to retrieve all tweets
function loadTweets() {

	// AJAX call to get the recent tweets for this user account
	$.ajax({ 
		url: 'http://mock.aphetech.com/feed'
	}).then(function(response) {
		var tweetsDiv = $('#tweets');
		tweetsDiv.empty();
		response.forEach(function(item) {
			// Filter invalid entries
			if (item.name !== undefined) {
				var tDiv = $('<div>');
				tDiv.html(`<p><span style="font-weight: bold; font-size: medium; margin-right: 10px;">${item.name}</span>
									<span style="font-size: small; margin-right: 10px;">@${item.handle}</span>
									<span style="font-size: small;">${item.date}</span></p>
									<p style="font-size: small">${item.tweet}</p>`);
				tweetsDiv.append(tDiv)
			}
		});
	});
}

function displayUserProfile() {
	// AJAX call to get the user information upon loading the page
	$.ajax({
		url: 'http://mock.aphetech.com/profile'
	}).then(function(response) {

		//  Insert HTML content to display user profile
		var imgDiv = $('#photo');
		var htmlStr = `<img class="picture" src=${response.imageUrl} alt=${response.name}>`;
		htmlStr += `<span class="name">${response.name}</span>`;

		imgDiv.html(htmlStr);

		// Insert HTML content to display user's twitter data
		var followDiv = $('#follow');
		var str = `<span>${response.tweets} tweets</span>
						 	 <span>${response.followers} followers</span>
						 	 <span>${response.following} following</span>`;
		followDiv.html(str);	

		// Save User Data for use with Posts
		userObj[`name`] = response.name;
		userObj[`handle`] = response.handle;
	});
}

// Execute the following when the document is fully loaded and ready to go!
$(document).ready(function() {

	// Display User Profile
	displayUserProfile();
	
	// Get all the User's tweets
	loadTweets();

	// Install Post Button click handler
	$('#post-button').on('click', onClickPostHandler);
});