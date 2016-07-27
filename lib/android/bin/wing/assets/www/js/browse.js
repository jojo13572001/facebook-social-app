
/*
 * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
 */
if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

var total_choice = 0;
var total_friends,user_id;
var selected_friends=[], img_src=[], div_src=[], like_queue=[];
var user_info, p_img_src=0, img_num=7, div_num=3 ,select_num=0,like_send_value=5;
var radius, x_move;
var round_x, round_y,circle;
var left_x,left_y,center_x,center_y,right_x,right_y;
var left_div, center_div, right_div, left_div, next_div="", like_img, dislike_img;
var center_div_top;
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
		document.addEventListener('touchmove', this.preventDefaultScroll, false);//??????
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		user_info = JSON.parse(window.localStorage.getItem("user_info"));
		try {
			  //alert('Device is ready! Make sure you set your app_id below this alert.');
			  FB.init({ appId: "556427731117839", nativeInterface: CDV.FB, useCachedDialogs: true, status: true});
		}catch (e) {
			  alert(e);
        }
		app.initBrowse();
		app.initFourHead();
		app.initParseNotification();
		//checkeMember();
		//updateMemberFriends();
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
								if(div_src.length >0){
									next_div = "#"+div_src.pop();
								}
								else {
									next_div = "";
								}
							}
							
							if (phase!="cancel" && phase!="end") {//Moving Circle
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
								alert("cancel");
							}
							
							if (phase=="end"){ //successfully moving circle
								restart = true;
								if(distance < x_move*0.67)//moving distance lower then threshold, cancel move
								{
									//restore left, right, and center div original position
									$(left_div).css("left",-radius);
									$(left_div).css("top",0);
									$(center_div).css("left",0);
									$(center_div).css("top",center_div_top);
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
								}else{//successfully moving the circle end
									distance = x_move;
									moveCircle(direction, distance);//auto moving the circle to target left or right
									$(center_div+" img" ).remove( ".like" ); //remove the like or dislike dom element
									$(center_div).css("z-index",6);
									$(center_div).css("left",0);
									$(center_div).css("top",0);
									$(center_div).hide();
									
									if(direction == 'left')//Dislike
									{
										var dislike_id = $(center_div).attr("id").split('_')[1];
										var send_data = {method:"POST",path:"/1/classes/likes",body:{MemID:user_id,FrID:dislike_id,Like:"0"}};
										like_queue.push(send_data);
									}else{
										var like_id = $(center_div).attr("id").split('_')[1];
										var send_data = {method:"POST",path:"/1/classes/likes",body:{MemID:user_id,FrID:dislike_id,Like:"1"}};
										like_queue.push(send_data);
									}
									
									if(p_img_src < img_num){//image array not empty, assign center div a new photo and inser into div_src
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
									
									//Send to Server like and dislike choices
									if(like_queue.length == like_send_value || select_num == img_num)
									{
										send_data = {requests:like_queue};
										
										$.parse.post('batch', send_data, function(data){
													//alert("upload like_queue success: " + JSON.stringify(data));
													//retrieve browse list and start browse
													},
												   function(data){//We have to deal with error handling later
														if(data.status != 0)
															alert("upload unselected friends error: "+ JSON.stringify(data));
														//else alert("upload like_queue success2: " + JSON.stringify(data));
												   }
										);
										like_queue.length = 0;
										like_queue = [];
									}
								}
							}
						},
						threshold:200,
						maxTimeThreshold:5000,
						fingers:'all'
					});
		});
	},
	initFourHead: function(){
		$("#fourHead_decision_quit").click(function() {
			$(this).css("background-image","url(img/btn_gray_down.png)");
		});
		$("#fourHead_decision_agree").click(function() {
			$(this).css("background-image","url(img/btn_gray_down.png)");
		});
		var fourHead_height = $( window ).height();
		var fourHead_member_row_height = $("#fourHead_member_row").height() * fourHead_height/100;
		var fourHead_target_row_height = $("#fourHead_target_row").height() * fourHead_height/100;
		var fourHead_decision_row_width = $( window ).width();
		var fourHead_decision_row_height = $("#fourHead_decision_row").height() * fourHead_height/100;
		
		$.parse.init({app_id : "1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7", // <-- enter your Application Id here 
					  rest_key : "xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv" // <--enter your REST API Key here
		});
		
		//alert($("#fourHead_decision_row").width());
		$("#fourHead_member_ring").css("height", fourHead_member_row_height*0.8);
		$("#fourHead_member_ring").css("top", fourHead_member_row_height*0.1);
		
		$("#fourHead_member_name").css("width", fourHead_member_row_height*0.8);//Follow #fourHead_member_ring
		$("#fourHead_member_name").css("height", fourHead_member_row_height*0.8);
		$("#fourHead_member_name").css("top", fourHead_member_row_height*0.1);
		
		$("#fourHead_member").css("width", fourHead_member_row_height*0.5);
		$("#fourHead_member").css("height", fourHead_member_row_height*0.5);
		$("#fourHead_member").css("top", fourHead_member_row_height*0.4);
		$("#fourHead_member").css("left", -fourHead_member_row_height*0.4);
		
		$("#fourHead_member_round").css("width", fourHead_member_row_height*0.56);
		$("#fourHead_member_round").css("height", fourHead_member_row_height*0.56);
		$("#fourHead_member_round").css("top", fourHead_member_row_height*0.37);
		$("#fourHead_member_round").css("left", -fourHead_member_row_height*0.43);
		
		$("#fourHead_member_like").css("width", fourHead_member_row_height*0.5);
		$("#fourHead_member_like").css("height", fourHead_member_row_height*0.5);
		$("#fourHead_member_like").css("top", fourHead_member_row_height*0.7);
		$("#fourHead_member_like").css("left", -fourHead_member_row_height*0.05);
		
		$("#fourHead_member_like_round").css("width", fourHead_member_row_height*0.56);
		$("#fourHead_member_like_round").css("height", fourHead_member_row_height*0.56);
		$("#fourHead_member_like_round").css("top", fourHead_member_row_height*0.67);
		$("#fourHead_member_like_round").css("left", -fourHead_member_row_height*0.08);
		//------------------------------------------------------------------------------
		$("#fourHead_target_ring").css("height", fourHead_member_row_height*0.8);
		$("#fourHead_target_ring").css("top", fourHead_member_row_height*0.1);
		
		$("#fourHead_target_name").css("width", fourHead_member_row_height*0.8);//Follow #fourHead_member_ring
		$("#fourHead_target_name").css("height", fourHead_member_row_height*0.8);
		$("#fourHead_target_name").css("top", fourHead_member_row_height*0.1);
		
		
		$("#fourHead_target").css("width", fourHead_member_row_height*0.5);
		$("#fourHead_target").css("height", fourHead_member_row_height*0.5);
		$("#fourHead_target").css("top", fourHead_member_row_height*0.4);
		$("#fourHead_target").css("left", fourHead_member_row_height*0.7);
		
		//$("#fourHead_target_icon").css("top", fourHead_member_row_height*0.4);//Follow #fourHead_target
		$("#fourHead_target_icon").css("left", fourHead_member_row_height*1.2);
		
		$("#fourHead_target_round").css("width", fourHead_member_row_height*0.56);
		$("#fourHead_target_round").css("height", fourHead_member_row_height*0.56);
		$("#fourHead_target_round").css("top", fourHead_member_row_height*0.37);
		$("#fourHead_target_round").css("left", fourHead_member_row_height*0.67);
		
		$("#fourHead_target_like").css("width", fourHead_member_row_height*0.5);
		$("#fourHead_target_like").css("height", fourHead_member_row_height*0.5);
		$("#fourHead_target_like").css("top", fourHead_member_row_height*0.7);
		$("#fourHead_target_like").css("left", fourHead_member_row_height*0.35);
		
		$("#fourHead_target_like_round").css("width", fourHead_member_row_height*0.56);
		$("#fourHead_target_like_round").css("height", fourHead_member_row_height*0.56);
		$("#fourHead_target_like_round").css("top", fourHead_member_row_height*0.67);
		$("#fourHead_target_like_round").css("left", fourHead_member_row_height*0.32);
		//------------------------------------------------------------------------------
		$("#decision_round").css("width", fourHead_decision_row_width*0.97);
		$("#decision_love").css("width", fourHead_decision_row_width*0.15);
		$("#decision_love").css("left", fourHead_decision_row_width*0.08);
		$("#decision_love").css("top", fourHead_decision_row_height*0.15);
		
		$("#fourHead_decision_quit").css("width", fourHead_decision_row_width*0.2);
		//$("#fourHead_decision_quit").css("height", fourHead_decision_row_width*0.084);
		$("#fourHead_decision_quit").css("left", fourHead_decision_row_width*0.1);
		$("#fourHead_decision_quit").css("top", fourHead_decision_row_height*0.6);
		
		$("#fourHead_decision_agree").css("width", fourHead_decision_row_width*0.2);
		//$("#fourHead_decision_agree").css("height", fourHead_decision_row_width*0.084);
		$("#fourHead_decision_agree").css("left", fourHead_decision_row_width*0.7);
		$("#fourHead_decision_agree").css("top", fourHead_decision_row_height*0.6);
		
		$("#suggestion_guide").css("width", fourHead_decision_row_width);
		$("#suggestion_guide").css("top", fourHead_decision_row_height*0.1);
		//------------Dialog---------------------
		$("#fourHead_dialog_pid").css("width", fourHead_height*0.3);
		$("#fourHead_dialog_pid").css("height", fourHead_height*0.3);
		$("#fourHead_dialog_pid").css("left", $( window ).width()/2 - fourHead_height*0.15);
		$("#fourHead_dialog_pid").css("top", -fourHead_height*0.5);
		$("#dialog_button").css("width", fourHead_height*0.12);//40% width fourHead_dialog_pid
		$("#dialog_button").css("height", fourHead_height*0.05);//42% dialog_button width
		
		$("#fourHead_send_dialog_pid").css("width", fourHead_height*0.3);
		$("#fourHead_send_dialog_pid").css("height", fourHead_height*0.3);
		$("#fourHead_send_dialog_pid").css("left", $( window ).width()/2 - fourHead_height*0.15);
		$("#fourHead_send_dialog_pid").css("top", -fourHead_height*0.5);
		$("#dialog_sned_button").css("width", fourHead_height*0.12);//40% width fourHead_dialog_pid
		$("#dialog_send_button").css("height", fourHead_height*0.05);//42% dialog_button width
	},
	initParseNotification: function(){
		window.plugins.webintent.recvBroadcast({
				action: 'com.wingapp.wing.UPDATE_STATUS',
				ecb: 'onNotificationParse',
				extras: {
					'option': true
				}
			}, function() {
				//alert("register Parse Message Receiver success");
			}, function() {
				alert("register Parse Message Receiver Fail");
		});
	},
	initBrowse: function(){
		radius = $("#swipe_img_row").width()* 0.7;
		$("#main_div").css("left", ($(window).width() - radius)/2);
		$("#fire").css("height",$( window ).height()*0.1);
		var src;
		user_id = JSON.parse(window.localStorage.getItem("login_info")).userId;
		var browse_list = JSON.parse(window.localStorage.getItem("browse_list"));
		//alert("initBrowse "+ JSON.stringify(browse_list['result']));
		img_num = browse_list['result'].length;
		
		var duplicate_img = browse_list;
		var tmp_img=[];
		for(var i=0;i<img_num;i++)
		{	
			var j;//workaround Filter duplicate image
			for(j=0 ;j<img_num;j++){
				if(j == i) 
				{
					j++;
					continue;
				}
				if(duplicate_img['result'][j] == browse_list['result'][i]){
					for(var k=0;k<tmp_img.length;k++){
						if(tmp_img[k]["id"] == browse_list['result'][i])
							break;
					}
					if(k == tmp_img.length){
						var src = "http://graph.facebook.com/"
									+ browse_list['result'][i] + "/picture";
						tmp_img.push({"id": browse_list['result'][i], "src":src});
					}
					break;
				}
			}
			if(j==img_num){
				src = "http://graph.facebook.com/"
						+ browse_list['result'][i] + "/picture";
				img_src.push({"id": browse_list['result'][i], "src":src});
			}
		}

		for(var i=0;i<tmp_img.length;i++)
			img_src.push(tmp_img[i]);
		//alert(JSON.stringify(img_src));
		img_num = img_src.length;
		
		for(p_img_src=0;p_img_src<3;p_img_src++)
		{
			div_src.push("div_"+img_src[p_img_src]['id']);
			$("#main_div").append('<div id="'+ div_src[p_img_src] +'" class="div_RCL">'+
									'<img src="'+ img_src[p_img_src]['src'] +'" class="browse">'+
									'<img src="img/wround.png" class="round">'+
								  '</div>');
			//photograph circle
			$("#"+div_src[p_img_src]+" img:nth-child(1)").css("height", radius);
			$("#"+div_src[p_img_src]+" img:nth-child(1)").css("width", radius);
			
			//mask circle
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("width",radius*1.08);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("height",radius*1.08);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("left",-radius*0.04);
			$("#"+div_src[p_img_src]+" img:nth-child(2)").css("top",-radius*0.04);
			$("#"+div_src[p_img_src]).hide();
		}
		//alert("div_src " + div_src);
		//create center circle
		center_div = "#"+div_src.pop();
		center_div_top = $("#swipe_img_row").height()-radius*1.04;
		$(center_div).css("top", center_div_top);//moving the outer circle to bottom of the row
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
		
		//create all next div photograph

		for(; p_img_src<div_num+3 && p_img_src<img_num; p_img_src++)
		{
			div_src.push("div_"+img_src[p_img_src]['id']);
			$("#main_div").append('<div id="'+ div_src[p_img_src-3] +'" class="div_RCL">'+
									'<img src="'+ img_src[p_img_src]['src'] +'" class="browse">'+
									'<img src="img/wround.png" class="round">'+
								  '</div>');
			//photograph circle
			$("#"+div_src[p_img_src-3]+" img:nth-child(1)").css("height", radius);
			$("#"+div_src[p_img_src-3]+" img:nth-child(1)").css("width", radius);
			
			//mask circle
			$("#"+div_src[p_img_src-3]+" img:nth-child(2)").css("width",radius*1.08);
			$("#"+div_src[p_img_src-3]+" img:nth-child(2)").css("height",radius*1.08);
			$("#"+div_src[p_img_src-3]+" img:nth-child(2)").css("left",-radius*0.04);
			$("#"+div_src[p_img_src-3]+" img:nth-child(2)").css("top",-radius*0.04);
			$("#"+div_src[p_img_src-3]).hide();
		}
		/*
		window.plugins.webintent.recvBroadcast({
				action: 'com.wingapp.wing.UPDATE_STATUS',
				extras: {
					'option': true
				}
			}, function() {
				alert("recvBroadcast success");
			}, function() {
				alert("recvBroadcast fail");
		});*/
		/*
		window.plugins.webintent.hasExtra("com.parse.Data", 
		   function(has) {
			  alert("hasExtra execute success " + JSON.stringify(has));
			  if(has == true) {
						alert("com.parse.Data has");
					    window.plugins.webintent.getExtra("com.parse.Data", 
							function(d) {
							   alert("getExtra success" + JSON.stringify(d));
							}, function() {
							   alert("getExtra success fail");
							}
						);
			  }else{
					alert("com.parse.Data doesn't has");
			  }
		   }, function() {
			  alert("hasExtra fail");
		   }
		);*/
		//$("#test").text(left_div+" "+center_div+" "+right_div+" "+next_div+" "+div_src.length+" "+img_src.length+" "+p_img_src);
	}
	/*
	initBrowse: function(){
		radius = $("#browse_images").width()* 0.7;
		$("#main_div").css("left", ($(window).width() - radius)/2);
		$("#fire").css("height",$( window ).height()*0.1);
		var src;
		//var friend_pictures = user_info.friends.data;
		$.parse.init({app_id : "1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7", // <-- enter your Application Id here 
					  rest_key : "xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv" // <--enter your REST API Key here
		 });
		$.parse.get('friends', {where : {Post:'1'}}, function(data){
																alert("Get Browse lists success: " + JSON.stringify(data));
																img_num = data.results.length;
																for(var i=0;i<data.results.length;i++)
																{
																	src = "http://graph.facebook.com/"
																			+ data.results[i]["FrID"] + "/picture";
																	img_src.push({"id":data.results[i]["FrID"], "src":src});
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
																$(center_div).css("top", $("#browse_images").height()-radius*1.04);
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
												   , function(data){
																alert("Get Browse lists error: "+ JSON.stringify(data));
													}
		);
		
	}
	*/
};

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

function checkeMember(){
	var login_info = JSON.parse(window.localStorage.getItem("login_info"));
	var accessToken = login_info.accessToken;
	var member_data = JSON.parse(window.localStorage.getItem("member_data"));
	var age_range,gender;
	var url = "https://api.parse.com/1/users";
	
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
	/*
	var age = $("#slider-age").val();
	var weight = $("#slider-weight").val();
	var height = $("#slider-height").val();
	var education = $("#text-education").attr("value");
	var work = $("#text-work").attr("value");
	*/
	member_data = JSON.stringify({username:login_info.userId, password:"12345678", DName:user_info.name,
								  Gender:user_info.gender, Locale:user_info.locale, AgeRange:age_range,
								  LocationID:user_info.location.id});
	//alert(member_data);
	window.localStorage.setItem("member_data", member_data);	
	 $.ajax({
				url: url,
				beforeSend: function(request) { 
					request.setRequestHeader("X-Parse-Application-Id", '1IACmE34zT9fe341TD5OkZVUlSWimS0xdZw8EkW7');
					request.setRequestHeader("X-Parse-REST-API-Key", 'xwNgxVS4OC2lN1lbBNavZrMhzRh1va6msLo0I8wv');
					request.setRequestHeader("Content-Type", 'application/json')
				},
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				processData: false,
				data: member_data,
				success: function (data) {
				  alert(JSON.stringify(data));
				},
				error: function(){
				  alert("Network or Server Has Error!");
				}
			});
			
}
function updateMemberFriends(){
	var login_info = JSON.parse(window.localStorage.getItem("login_info"));
	var accessToken = window.localStorage.getItem("member_data").Token;
	var url = "http://ec2-54-201-71-203.us-west-2.compute.amazonaws.com/wing/member/"+ login_info.userId +"/friends";
	var friends = user_info.friends.data;
	var send_data = [];
	for(var i=0; i< friends.length -1; i++)
		send_data.push( {FBID:friends[i].id, DisplayName:friends[i].name, POST:1} );
	send_data.push( {FBID:friends[i].id, DisplayName:friends[i].name, POST:0} );
	send_data = JSON.stringify({friends: send_data});
	//alert(accessToken);
	
	 $.ajax({
				url: url,
				beforeSend: function(xhr) { 
				  xhr.setRequestHeader("Authorization", "Basic " + btoa(login_info.userId+":"+accessToken)); 
				},
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				processData: false,
				data: send_data,
				success: function (data) {
				  alert("updateMemberFriends "+JSON.stringify(data));
				},
				error: function(){
				  alert("Cannot get data");
				}
			});	
}
function uploadProfile(){
	
	var age = $("#slider-age").val();
	var weight = $("#slider-weight").val();
	var height = $("#slider-height").val();
	var education = $("#text-education").attr("value");
	var work = $("#text-work").attr("value");
	
	var send_data = JSON.stringify({Age:age, Weight:weight, Height:height, Education:education, Work:work});
	//alert(send_data);
		/*
	 $.ajax({
				url: url,
				beforeSend: function(xhr) { 
				  xhr.setRequestHeader("Authorization", "Basic " + btoa("wing:willwin")); 
				},
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				processData: false,
				data: send_data,
				success: function (data) {
				  alert(JSON.stringify(data));
				},
				error: function(){
				  alert("Cannot get data");
				}
			});
		*/	
}
function fourHead_decision_agree_dialog(){
	$('#fourHead_dialog_pid').show();
}
function fourHead_decision_agree_check_dialog(){
	$('#fourHead_dialog_pid').hide();
	$.mobile.changePage( '#browse_pid', {
		  transition: "pop"
	});
	var login_info = JSON.parse(window.localStorage.getItem("login_info"));
	//var accessToken = window.localStorage.getItem("member_data").Token;
	/*
	FB.ui({method: 'apprequests',
			  message: 'My Great Request',
			  to: login_info.userId
			}, function () {
			  alert("send message success "+JSON.stringify(arguments));
		  });
	*/
	/*
	FB.api(
    "/"+login_info.userId+"/notifications",
    "POST",
    {
		"access_token" : "65276fd00104266ab4fc49f66069a5d6",
        "template": "This is a test message"
    },
    function (response) {
      if (response && !response.error) {
       alert(JSON.stringify(response));
      }else{alert(JSON.stringify(response));}
    }
	);*/
/*
	FB.ui({
		  method: 'friends',
		  id: 'littleqoo'
		}, function(response){alert(JSON.stringify(response))});
	*/
}
function fourHead_decision_point_dialog(){
	$('#fourHead_send_dialog_pid').show();
}
function fourHead_decision_agree_send_dialog(){
	$('#fourHead_send_dialog_pid').hide();
	$.mobile.changePage( '#browse_pid', {
		  transition: "pop"
	});
}
function onNotificationParse(channel){
	//alert('channel ' + channel);
	switch(channel){
	  case 'match':
	   onNotificationSingleAgree();
	   break;
	  case 'pay':
	   onNotificationBotheAgree();
	   break;
	  default:
	   break;
	 }
}
function onNotificationBotheAgree() {
	//alert("receive notification success");
	$('#fourHead_decision_agree > p').text('使用30點');
	$('#suggestion_guide > p:nth-child(1)').text('雙方已經同意交換FB ID');
	$('#suggestion_guide > p:nth-child(2)').text('馬上取得Alice的FB ID？');
	$("#fourHead_decision_agree").attr('onClick', "fourHead_decision_point_dialog()");
	$.mobile.changePage( '#fourHead_pid', {
		  transition: "pop"
	});
}

function onNotificationSingleAgree() {
	$('#fourHead_decision_agree > p').text('同意');
	$('#suggestion_guide > p:nth-child(1)').text('不如跟Alice互相幫忙');
	$('#suggestion_guide > p:nth-child(2)').text('交換Facebook ID ?');
	$("#fourHead_decision_agree").attr('onClick', "fourHead_decision_agree_dialog()");
	$.mobile.changePage( '#fourHead_pid', {
		  transition: "pop"
	});
}