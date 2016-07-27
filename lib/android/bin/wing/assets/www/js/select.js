
/*
 * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
 */
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

var total_choice = 0;
var total_friends;
var selected_friends=[], img_src=[], div_src=[], like_queue=[], dislike_queue=[];
var user_info, p_img_src=0, img_num=10, div_num=5 ,select_num=0;
var radius, x_move;
var round_x, round_y,circle;
var left_x,left_y,center_x,center_y,right_x,right_y;
var left_div, center_div, right_div, left_div, next_div="", like_img, dislike_img;
var first=true, restart=true;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		this.enableSwipe();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		//document.addEventListener('touchmove', this.preventDefaultScroll, false);//??????
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		user_info = JSON.parse(window.localStorage.getItem("user_info"));
        app.showFriends();
		app.showOthers();
		
		//app.initBrowse();
		//$.mobile.changePage( $("#browse_pid"));
		//checkeMember();
		//updateMemberFriends();
		
		$(".ui-block-a, .ui-block-b, .ui-block-c").click(function() {
			var div_height = $(this).height();
			$(this).find("*").fadeOut("fast");
			
			$(this).height(div_height);
			total_choice++;
			$("#intro_friends").text("我願意推薦的單身朋友 : " + (total_friends - total_choice) + "位");
			selected_friends.push($(this).attr("id").split('-')[1]);
			//alert(JSON.stringify(selected_friends));
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
        //alert('Received Event: ' + id);
    },
	showFriends: function(){
		var i, j, html = "", count = 0, grid;
		var friend_pictures = user_info.friends.data;
		total_friends = friend_pictures.length;
		$("#intro_friends").text("我願意推薦的單身朋友 : " + total_friends + "位");
		var body_width = $( window ).width() * 0.2;
		//alert(JSON.stringify(user_info));
		//alert("friend_pictures: "+JSON.stringify(friend_pictures));
		
		html = html + "<div class='ui-grid-b'>\n";
		while (count < friend_pictures.length) {
		/*
			if(friend_pictures[count]["relationship_status"] == "In a relationship" ||
			   friend_pictures[count]["relationship_status"] == "Married"){
			   count++;
			   continue;
			}
		*/
			for (j = 0; j < 3 && count < friend_pictures.length; j = j + 1) {
				if(count % 3 == 0)
					 grid = "<div id='friend-" + count + "' class='ui-block-a' align='center' style='padding:10px'>\n";
				else if(count % 3 == 1)
					 grid = "<div id='friend-" + count + "' class='ui-block-b' align='center' style='padding:10px'>\n";
				else grid = "<div id='friend-" + count + "' class='ui-block-c' align='center' style='padding:10px'>\n";
				
				html = html + grid + "<img src='http://graph.facebook.com/"
										+ friend_pictures[count]["id"] + "/picture' onload='showCutIcons(this)' "
										+ "style='border:1px white; width:" + body_width + "px'"
										+ ">"
								   + "<br><p style='color:white'>" + friend_pictures[count]["name"] + "</p>"
							+ "</div>\n";
				count = count + 1;
			}
		}
		
		html = html + "</div>\n\n";
		$("#select_tbl").after(html);
		//alert(html);
	},
	showSelfSlide: function(){
		var albums_data = user_info.albums.data;
		var html="", i;
		for(i=0; i<albums_data.length; i++)
		  if(albums_data[i].name == "Profile Pictures")
			break;
		//alert(i+ " " + albums_data[i].name);
		var photos_data = albums_data[i].photos.data;
		//alert(photos_data);
		for(i=0;i<Math.min(4,photos_data.length);i++)
		{	
			$(".swiper-wrapper").find("div:nth-child("+(i+1)+")").find("img").attr("src", photos_data[i].source);
		}
		//alert($("body").html());
	},
	showOthers: function(){
		var education="", work="";
		if(user_info.education.length > 0)
		{
			education = user_info.education[user_info.education.length - 1].type;
		}
		
		if(user_info.work.length > 0)
		{
		  //alert(user_info.work[i].end_date);
		  work = user_info.work[user_info.work.length - 1].employer.name;
		}
		
		 re = /"/g;                       	//创建正则表达式模式。   
		 r = education.replace(re, "");
		 $("#text-education").attr("value", r);
		 r = work.replace(re, "");
		 $("#text-work").attr("value", r);
	},
	enableSwipe: function(){
		$(function() {			
					//Enable swiping...
					$("#main_div").swipe( {
						swipeStatus:function(event, phase, direction, distance, duration, fingers)
						{/*
							var str = "<h4>Swipe Phase : " + phase + "<br/>";
							str += "Direction from inital touch: " + direction + "<br/>";
							str += "Distance from inital touch: " + distance + "<br/>";
							str += "Duration of swipe: " + duration + "<br/>";
							str += "Fingers used: " + fingers + "<br/></h4>";
						*/
							//Here we can check the:
							//phase : 'start', 'move', 'end', 'cancel'
							//direction : 'left', 'right', 'up', 'down'
							//distance : Distance finger is from initial touch point in px
							//duration : Length of swipe in MS 
							//fingerCount : the number of fingers used
							if(first == true)
							{
								x_move = $(center_div).position().left - $(left_div).position().left;
								var half_radius = radius/2;
								left_x = $(left_div).position().left + half_radius;
								left_y = -($(left_div).position().top + half_radius); 
									
								center_x = $(center_div).position().left + half_radius;
								center_y = -($(center_div).position().top + half_radius);
									
								right_x = $(right_div).position().left + half_radius;
								right_y = -($(right_div).position().top + half_radius);
								round_x = (left_x + right_x)/2;
								round_y = (center_y*center_y*(left_x-right_x)
											  -right_y*right_y*(left_x-center_x)
											  -left_y*left_y*(center_x-right_x)
											  -(left_x-center_x)*(left_x-right_x)
											  *(center_x-right_x))/(2*(left_x*(center_y-right_y)
											  +right_x*(left_y-center_y)+center_x*(right_y-left_y)));
								circle = Math.sqrt((center_x-round_x)*(center_x-round_x)+(center_y-round_y)*(center_y-round_y));
								//$("#dislike_img").css("left", (radius - $("#dislike_img").width())/2);//workaround here

								first = false;
							}
							if(phase == "start"){
								$("#dislike_img").css("left", (radius - $("#dislike_img").width())/2);//workaround here
								if(div_src.length >0)
									next_div = "#"+div_src.pop();
								else {
									next_div = "";
									//alert("next image empty!");
								}
							}
							
							if (phase!="cancel" && phase!="end") {
								if (duration<5000);
								else {
									$("#like_img").css("opacity", 0);
									$("#dislike_img").css("opacity", 0);
									//alert("Over maxTimeThreshold.Swipe handler will be canceled if you release at this point.");
								}
								/*
								if (distance<200);
								else {	
									//alert("Not yet reached threshold.Swipe will be canceled if you release at this point.");
									$("#like_img").css("opacity", 0);
									$("#dislike_img").css("opacity", 0);
								}
								*/
								
								if(direction == 'left' && restart == true)//temporal solution
								{
									if(next_div != ""){
										$(next_div).css("left",radius);
										$(next_div).show();
									}
									restart = false;
								}else if(direction == 'right' && restart == true){
									if(next_div != ""){
										$(next_div).css("left",-radius);
										$(next_div).show();
									}
									restart = false;
								}
								
								if (distance > x_move)
									distance = x_move;
									
								if (distance <= x_move){
									moveCircle(direction, distance);
									//$("#test").text(left_div+" "+center_div+" "+right_div+" "+next_div+" "+div_src.length+" "+img_src.length+" "+p_img_src);
								}
							}
							
							if (phase=="cancel") {
								$("#like_img").css("opacity", 0);
								$("#dislike_img").css("opacity", 0);
								restart = true;
							}
							
							if (phase=="end"){
								restart = true;
								if(distance < x_move*0.67)//cancel move
								{
									$(left_div).css("left",-radius);
									$(left_div).css("top",0);
									$(center_div).css("left",0);
									$(center_div).css("top",radius/3);
									$(right_div).css("left",radius);
									$(right_div).css("top",0);
									$("#like_img").css("opacity",0);
									$("#dislike_img").css("opacity",0);
									//restore next_div
									if(next_div != ""){
										div_src.push(next_div.split('#')[1]);
										$(next_div).css("left",0);
										$(next_div).hide();
									}
									//$("#test").text(left_div+" "+center_div+" "+right_div+" "+next_div+" "+div_src.length+" "+img_src.length+" "+p_img_src);
								}else{
									distance = x_move;
									moveCircle(direction, distance);
									$(center_div+" img" ).remove( ".like" );
									$(center_div).css("z-index",6);
									$(center_div).css("left",0);
									$(center_div).css("top",0);
									$(center_div).hide();
									if(direction == 'left')
									{
										dislike_queue.push($(center_div).attr("id").split('_')[1]);
									}else{
										like_queue.push($(center_div).attr("id").split('_')[1]);
									}
									
									if(p_img_src < img_num){//image array empty
										$(center_div+" img:nth-child(1)").attr("src", img_src[p_img_src]['src']);
										$(center_div).attr("id", "div_"+img_src[p_img_src]['id']);
										center_div = "#div_" + img_src[p_img_src]['id'];
										p_img_src++;
										div_src.unshift(center_div.split('#')[1]);//re-insert into queue
									}
									
									if(direction == 'left')
									{
										if(left_div != "" && right_div != ""){
											center_div = right_div;
											right_div = next_div;
										}else if(left_div != "" && right_div == ""){
											center_div = left_div;
											left_div = "";
										}else if(left_div == "" && right_div != ""){
											center_div = right_div;
											right_div = "";
										}else{
											center_div = "";
										}
									}else{
										if(left_div != "" && right_div != ""){
											center_div = left_div;
											left_div = next_div;
										}else if(left_div != "" && right_div == ""){
											center_div = left_div;
											left_div = "";
										}else if(left_div == "" && right_div != ""){
											center_div = right_div;
											right_div = "";
										}else{
											center_div = "";
										}
										//alert(center_div+" "+left_div);
									}

									$(center_div).append('<img id="like_img" src="img/like.png" class="like">'+
														 '<img id="dislike_img" src="img/dontlike.png" class="like">');
									$(center_div).css("z-index", 7);
									$(left_div).css("z-index", 8);
									$(right_div).css("z-index", 8);
									
									$("#like_img").css("top",radius*0.46);
									$("#like_img").css("max-width",radius);
									
									$("#dislike_img").css("max-height",radius);
									select_num++;
									$("#percent").text(select_num/img_num*100 + "%");
									//$("#test").text(left_div+" "+center_div+" "+right_div+" "+next_div+" "+div_src.length+" "+img_src.length+" "+p_img_src);
								}
							}
						},
						threshold:200,
						maxTimeThreshold:5000,
						fingers:'all'
					});
		});
	},
	initBrowse: function(){
		radius = $( window ).height() * $("#browse_images").height() / 100 * 0.7;
		$("#main_div").css("left", ($(window).width() - radius)/2);
		$("#fire").css("height",$( window ).height()*0.1);
		var src;
		var friend_pictures = user_info.friends.data;
		for(var i=0;i<img_num;i++)
		{
			src = "http://graph.facebook.com/"
					+ friend_pictures[i]["id"] + "/picture";
			img_src.push({"id":friend_pictures[i]["id"], "src":src});
		}
		
		for(p_img_src=0;p_img_src<div_num;p_img_src++)
		{
			div_src.push("div_"+img_src[p_img_src]['id']);
			$("#main_div").append('<div id="'+ div_src[p_img_src] +'" class="div_RCL">'+
									'<img src="'+ img_src[p_img_src]['src'] +'" class="browse">'+
									'<img src="img/wround.png" class="round">'+
								  '</div>');
			$("#"+div_src[p_img_src]+" img:nth-child(1)").css("height", radius);
			$("#"+div_src[p_img_src]+" img:nth-child(1)").css("width", radius);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("width",radius*1.08);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("height",radius*1.08);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("left",-radius*0.04);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("top",-radius*0.04);
			$("#"+div_src[p_img_src]).hide();
		}
		
		//create center circle
		center_div = "#"+div_src.pop();
		$(center_div).css("top",radius/3);
		$(center_div).css("z-index",7);
		$(center_div).show();
		//create left circle
		left_div = "#"+div_src.pop();
		$(left_div).css("left",-radius);
		$(left_div).css("z-index",8);
		$(left_div).show();
		//create right circle
		right_div = "#"+div_src.pop();
		$(right_div).css("left",radius);
		$(right_div).css("z-index",8);
		$(right_div).show();
		
		$(center_div).append('<img id="like_img" src="img/like.png" class="like">'+
							 '<img id="dislike_img" src="img/dontlike.png" class="like">');
		$("#like_img").css("top",radius*0.46);
		$("#like_img").css("max-width",radius);
		
		$("#dislike_img").css("max-height",radius);
		//$("#test").text(left_div+" "+center_div+" "+right_div+" "+next_div+" "+div_src.length+" "+img_src.length+" "+p_img_src);
	}
};

function showCutIcons(obj){
		var img_pos = $(obj).position();
		var width = $(obj).width()*0.4;
		var left = img_pos.left + $(obj).width()- width*0.5;
		var top = img_pos.top - width*0.5;
		var style = 'style="position:absolute; ' + 'width:' + width + 'px; left:'+ left + 'px; top:'+top+'px;"';
		$(obj).after('<img src="img/btn_headimage_cancel_default.png" '+ style + '>');
		//alert(JSON.stringify(img_pos)+" "+JSON.stringify(width));
}

function moveCircle(direction, distance){
		var y;
		if(direction == 'left')
		{
			if(left_div != "" && right_div != ""){
				y = Math.sqrt((circle*circle)-(right_x-distance-round_x)*(right_x-distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(right_div).css("left",right_x-distance-radius/2);
				$(right_div).css("top",(-y-radius/2));
				
				y = Math.sqrt((circle*circle)-(center_x-distance-round_x)*(center_x-distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(center_div).css("left",center_x-distance-radius/2);
				$(center_div).css("top",(-y-radius/2));
			}else if(left_div == "" && right_div != ""){
				y = Math.sqrt((circle*circle)-(right_x-distance-round_x)*(right_x-distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(right_div).css("left",right_x-distance-radius/2);
				$(right_div).css("top",(-y-radius/2));
			}else if(left_div != "" && right_div == ""){
				y = Math.sqrt((circle*circle)-(left_x+distance-round_x)*(left_x+distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(left_div).css("left",left_x+distance-radius/2);
				$(left_div).css("top",(-y-radius/2));
			}else{
				y = Math.sqrt((circle*circle)-(center_x-distance-round_x)*(center_x-distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(center_div).css("left",center_x-distance-radius/2);
				$(center_div).css("top",(-y-radius/2));
			}
			$("#dislike_img").css("opacity",distance*2/x_move);
		}
		else if(direction == 'right')
		{
			if(left_div != "" && right_div != ""){
				y = Math.sqrt((circle*circle)-(left_x+distance-round_x)*(left_x+distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(left_div).css("left",left_x+distance-radius/2);
				$(left_div).css("top",(-y-radius/2));
				
				y = Math.sqrt((circle*circle)-(center_x+distance-round_x)*(center_x+distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(center_div).css("left",center_x+distance-radius/2);
				$(center_div).css("top",(-y-radius/2));
			}else if(left_div == "" && right_div != ""){
				y = Math.sqrt((circle*circle)-(right_x-distance-round_x)*(right_x-distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(right_div).css("left",right_x-distance-radius/2);
				$(right_div).css("top",(-y-radius/2));

			}else if(left_div != "" && right_div == ""){
				y = Math.sqrt((circle*circle)-(left_x+distance-round_x)*(left_x+distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(left_div).css("left",left_x+distance-radius/2);
				$(left_div).css("top",(-y-radius/2));
			}else{
				y = Math.sqrt((circle*circle)-(center_x+distance-round_x)*(center_x+distance-round_x));
				y = Math.min(y,-y)+round_y;
				$(center_div).css("left",center_x+distance-radius/2);
				$(center_div).css("top",(-y-radius/2));
			}
			$("#like_img").css("opacity",distance*2/x_move);
		}
}

function createMember(){
		var login_info = JSON.parse(window.localStorage.getItem("login_info"));
		var member_data;
		var age_range,gender;
		
		$.parse.init({app_id : "1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7", // <-- enter your Application Id here 
					  rest_key : "xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv" // <--enter your REST API Key here
		});
		
		if(typeof user_info.age_range.min == "undefined"){
			age_range = "?-";
		}else{
			age_range = user_info.age_range.min + "-";
		}

		if(typeof user_info.age_range.max == "undefined"){
			age_range += "?";
		}else{
			age_range += user_info.age_range.max;
		}
		
		//var age = $("#slider-age").val();
		//var weight = $("#slider-weight").val();
		//var height = $("#slider-height").val();
		//var education = $("#text-education").attr("value");
		//var work = $("#text-work").attr("value");
		
		member_data = {username:login_info.userId, password:"12345678", DName:user_info.name,
									  Gender:user_info.gender, Locale:user_info.locale, AgeRange:age_range,
									  LocationID:user_info.location.id};
		/*
		member_data = JSON.stringify({username:login_info.userId, password:"12345678", DName:"test",
									  Gender:"M", Locale:"en", AgeRange:"20-30",
									  LocationID:"12345"});
		*/
		//alert(JSON.stringify(member_data));
		$.mobile.loading( 'show', {
					text: '',
					textVisible: true,
					theme: 'z',
					html: ""
		});
		$.parse.signup(member_data, function(data){
														window.localStorage.setItem("member_data", member_data);
														uploadMemberFriends();
														retrieveFriendList_Open();
														//alert("signup success " + JSON.stringify(data));
												  },
									function(data){
											//$.mobile.loading('hide');
											alert("parse.signup error: "+ JSON.stringify(data));
											retrieveFriendList_Open();
									}
					   );
}

function uploadMemberFriends(){
	var login_info = JSON.parse(window.localStorage.getItem("login_info"));
	var friends = user_info.friends.data;
	var send_data,select_index = 0;
	//alert(JSON.stringify(selected_friends));
	var selected=[];
	for(var i=0; i< friends.length; i++)
	{
		if(select_index < selected_friends.length && i == selected_friends[select_index])
		{
				//post 1
				send_data = {method:"POST",path:"/1/classes/friends",body: {MemID:login_info.userId, FrID:friends[i].id, DName:friends[i].name, 
							 Gender:friends[i].gender, Locale:friends[i].locale,AgeRange:"",LocationID:"", Post:"1"}};

				//alert(JSON.stringify(send_data));	
				/*
				$.parse.post('friends', send_data, function(data){
														//alert("upload selected friends success: " + JSON.stringify(data));			
												   },
												   function(data){//there's bug here, success but response error
														if(data.status == 0){
															
														}else alert("upload selected friends error: "+ JSON.stringify(data));
												   } 
				);
				*/
				selected.push(send_data);
				select_index++;
		}else{
		//post 0
		
			send_data = {method:"POST",path:"/1/classes/friends",body: {MemID:login_info.userId, FrID:friends[i].id, DName:friends[i].name, 
							 Gender:friends[i].gender, Locale:friends[i].locale,AgeRange:"",LocationID:"", Post:"0"}};
			/*
			$.parse.post('friends', send_data, function(data){
													//alert("upload friends success: " + JSON.stringify(data));		
												},
											   function(data){
													if(data.status != 0)
														alert("upload unselected friends error: "+ JSON.stringify(data));
											   }
			);
			*/
			selected.push(send_data);
		}
		if(i % 50 == 0){
			send_data = {requests:selected};
			$.parse.post('batch', send_data, function(data){
											//alert("upload friends success: " + JSON.stringify(data));
											//retrieve browse list and start browse
										},
									   function(data){
											if(data.status != 0)
												alert("upload unselected friends error: "+ JSON.stringify(data));
											//else alert("upload friends success: " + JSON.stringify(data));
									   }
			);
			selected.length = 0;
			selected = [];
		}
	}
	//send_data = {requests:selected};
	//alert(JSON.stringify(send_data));
	//send_data = {"requests":[{"method":"POST","path":"/1/classes/friends","body": {"MemID":"1527823273","FrID":"12345","DName":"test1","Gender":"M","Locale":"zh_TW","AgeRange":"30~40", "Post":"1","LocationID":"105527782844441"}},{"method":"POST","path":"/1/classes/friends","body": {"MemID":"1527823273","FrID":"23456","DName":"test2","Gender":"F","Locale":"zh_TW","AgeRange":"zh_TW", "Post":"1","LocationID":"105527782844442"}}]};
	//alert(JSON.stringify(send_data));
	send_data = {requests:selected};
	$.parse.post('batch', send_data, function(data){
									//alert("upload friends success: " + JSON.stringify(data));
									//retrieve browse list and start browse
									},
								   function(data){
										if(data.status != 0)
											alert("upload unselected friends error: "+ JSON.stringify(data));
										//else alert("upload friends success: " + JSON.stringify(data));
								   }
	);
	
}

function retrieveFriendList_Open(){
	$.parse.get('friends', {where : {Post:'1'}}, function(data){
													window.localStorage.setItem("browse_list", JSON.stringify(data.results));
													//alert("parse.get " + JSON.stringify(data.results));
													window.open("browse.html","_self");
											     }
											  , function(data){
													$.mobile.loading('hide');
													alert("after sign up get browse list error: " + JSON.stringify(data));
											    }
				);
}