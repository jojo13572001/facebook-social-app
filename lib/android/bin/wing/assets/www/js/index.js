
/*
 * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
 */
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

//facebook login
FB.Event.subscribe('auth.login', function(response) {
					  //alert('auth.login event');
                  });
				  
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('touchmove', this.preventDefaultScroll, false);//??????
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var check_login = window.localStorage.getItem("checkbox_login");
		$.parse.init({app_id : "1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7", // <-- enter your Application Id here 
					  rest_key : "xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv", // <--enter your REST API Key here
		});
		//alert("check_login "+check_login);
		if(check_login == 1) {
			//alert("start change check_login");
			$("#checkbox_login").prop("checked", true);
			$("#checkbox_div").hide();
		}
		try {
			  //alert('Device is ready! Make sure you set your app_id below this alert.');
			  FB.init({ appId: "556427731117839", nativeInterface: CDV.FB, useCachedDialogs: true, status: true, oauth: true});
		}catch (e) {
			  alert(e);
        }
		$("#btn_login").click(function() {
			$(this).prop("src","img/btn_login_down.png");
			setTimeout(function(){$("#btn_login").prop("src","img/btn_login.png");}, 300);
			facebookLogin();
		});
    },
	//  Prevent Default Scrolling  
	preventDefaultScroll: function(event) 
	{
		// Prevent scrolling on this element
		event.preventDefault();
		window.scroll(0,0);
		return false;
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //alert('Received Event: ' + id);
    }
	
};

var member = {
	login: function (username, password){
		var login_data = JSON.stringify({username: username, password: password});
		//alert(login_data);
		
		var url = "http://api.parse.com/1/login";	
		 $.ajax({
					url: url,
					beforeSend: function(request) { 
						request.setRequestHeader("X-Parse-Application-Id", '1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7');
						request.setRequestHeader("X-Parse-REST-API-Key", 'xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv');
					},
					type: 'GET',
					contentType: 'application/json',
					processData: false,
					data: login_data,
					success: function (data) {
					  //alert(JSON.stringify(data));
					  window.open("browse.html","_self");
					},
					error: function(){
					  alert("login Network or Server Has Error!");
					  $.mobile.loading('hide');
					  //member.createMember();
					}
				});
	}
};

function facebookLogin() {
		if ( $("#checkbox_login").prop('checked') ) {
			  window.localStorage.setItem("checkbox_login", 1);
			  var check_login = window.localStorage.getItem("checkbox_login");
			  $.mobile.loading( 'show', {
					text: '',
					textVisible: true,
					theme: 'z',
					html: ""
			  });
			  FB.login( function(response) {
							 if (response.authResponse) {
								//FB login success
								 window.localStorage.setItem("login_info", JSON.stringify(response.authResponse));
								 if( window.localStorage.getItem("member_data") == null )
									 LoginParseServer(response.authResponse.userId, "12345678");
								 else GetBrowseList_Browse(response.authResponse.userId);
							 } else {
								 $.mobile.loading('hide');
								 alert('logged in fail');
							 }
						 },{ scope: "user_birthday, user_photos, offline_access, user_work_history, user_education_history, publish_stream, publish_actions" }
					   );
		}
}

function GetBrowseList_Browse(user_id) {
	$.parse.post('functions/getPosts', {MemID: user_id}, function(data){
													window.localStorage.setItem("browse_list", JSON.stringify(data));
													//alert("LoginParseServer "+JSON.stringify(data));
													window.open("browse.html","_self");
											     }
											   , function(data){
													$.mobile.loading('hide');
													alert("after login get browse list error: " + JSON.stringify(data));
											     }
				);
}

function LoginParseServer(user_id, password) {
		 $.parse.login(user_id, password, function(data){ 
														  //deleteUser(data.objectId, data.sessionToken);
														  
														  //The user exist, retrieve browse list and start browse
														  GetBrowseList_Browse();
														},
										  function(data){  
										                   if(data.status == 404){//Not Found the user in the login server
														      FB_QueryUserData();
														   }else {
															  $.mobile.loading('hide');
															  alert("Login Server Error "+ JSON.stringify(data));
														   }
														}
					   );
}
function FB_QueryUserData() {
		FB.api('/me?fields=id,name,gender,locale,age_range,location,education,work,friends.fields(gender,locale,name),albums.fields(name,photos)', function(response) {
				   if (response.error) { 
					   $.mobile.loading('hide');
					   alert('FB Query Your Data error : ' + JSON.stringify(response));
				   } else {
					    window.localStorage.setItem("user_info", JSON.stringify(response));
						window.open("preselect.html","_self");
				   }
			   });
}

function deleteUser(objectId, sessionToken) {
		 $.parse.init({app_id : "1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7", // <-- enter your Application Id here 
					  rest_key : "xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv", // <--enter your REST API Key here
					  session_token : sessionToken
		 });
		 $.parse.delete('users/'+objectId, function(data){ 
															  alert("Delete Success " + JSON.stringify(data));
														},
										   function(data){
															  alert("Delete Fail "+ JSON.stringify(data));
														}
						);
}