// function prettyPrint(obj){
//     var toString = Object.prototype.toString,
//         newLine = "<br>", space = "&nbsp;", tab = 8,
//         buffer = "",        
//         //Second argument is indent
//         indent = arguments[1] || 0,
//         //For better performance, Cache indentStr for a given indent.
//         indentStr = (function(n){
//             var str = "";
//             while(n--){
//                 str += space;
//             }
//             return str;
//         })(indent); 
 
//     if(!obj || ( typeof obj != "object" && typeof obj!= "function" )){
//         //any non-object ( Boolean, String, Number), null, undefined, NaN
//         buffer += obj;
//     }else if(toString.call(obj) == "[object Date]"){
//         buffer += "[Date] " + obj;
//     }else if(toString.call(obj) == "[object RegExp"){
//         buffer += "[RegExp] " + obj;
//     }else if(toString.call(obj) == "[object Function]"){
//         buffer += "[Function] " + obj;
//     }else if(toString.call(obj) == "[object Array]"){
//         var idx = 0, len = obj.length;
//         buffer += "["+newLine;
//         while(idx < len){
//             buffer += [
//                 indentStr, idx, ": ", 
//                 prettyPrint(obj[idx], indent + tab)
//             ].join("");
//             buffer += "<br>";
//             idx++;
//         }
//         buffer += indentStr + "]";
//     }else { //Handle Object
//         var prop;
//         buffer += "{"+newLine;
//         for(prop in obj){
//             buffer += [
//                 indentStr, prop, ": ", 
//                 prettyPrint(obj[prop], indent + tab)
//             ].join("");
//             buffer += newLine;
//         }
//         buffer += indentStr + "}";
//     }
 
//     return buffer;
// }



// function pp(object, depth, embedded) { 
//   typeof(depth) == "number" || (depth = 0)
//   typeof(embedded) == "boolean" || (embedded = false)
//   var newline = false
//   var spacer = function(depth) { var spaces = ""; for (var i=0;i<depth;i++) { spaces += "  "}; return spaces }
//   var pretty = ""
//   if (      typeof(object) == "undefined" ) { pretty += "undefined" }
//   else if ( typeof(object) == "boolean" || 
//             typeof(object) == "number" ) {    pretty += object.toString() } 
//   else if ( typeof(object) == "string" ) {    pretty += "\"" + object + "\"" } 
//   else if (        object  == null) {         pretty += "null" } 
//   else if ( object instanceof(Array) ) {
//     if ( object.length > 0 ) {
//       if (embedded) { newline = true }
//       var content = ""
//       for each (var item in object) { content += pp(item, depth+1) + ",\n" + spacer(depth+1) }
//       content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
//       pretty += "[ " + content + "\n" + spacer(depth) + "]"
//     } else { pretty += "[]" }
//   } 
//   else if (typeof(object) == "object") {
//     if ( Object.keys(object).length > 0 ){
//       if (embedded) { newline = true }
//       var content = ""
//       for (var key in object) { 
//         content += spacer(depth + 1) + key.toString() + ": " + pp(object[key], depth+2, true) + ",\n" 
//       }
//       content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
//       pretty += "{ " + content + "\n" + spacer(depth) + "}"
//     } else { pretty += "{}"}
//   }
//   else { pretty += object.toString() }
//   return ((newline ? "\n" + spacer(depth) : "") + pretty)
// }



$(document).ready(function() {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#confirmation').hide();
    
    $('#calendar').fullCalendar({
	header: {
	    left: 'prev,next today',
	    center: 'title',
	    right: 'month,agendaWeek,agendaDay'
	},

	editable: true,
	buttonText: {
	    today:    "aujourd'hui",
	    month:    'mois',
	    week:     'semaine',
	    day:      'jour'
	},
	monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
		     'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
	monthNamesShort: ['Jan.', 'Fév.', 'Ma.', 'Avr.', 'Mai', 'Juin', 'Jui.',
		     'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.' ],
	dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercerdi', 'Jeudi', 'Vendredi', 'Samedi' ],
	dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.' ],
	titleFormat: {
	    month: 'MMMM yyyy',                             // September 2009
	    week: "d[ yyyy]{ '&#8212;'[ MMM] d MMM yyyy}", // Sep 7 - 13 2009
	    day: 'dddd d MMM, yyyy'                  // Tuesday, Sep 8, 2009
	},
	columnFormat: {
	    month: 'ddd',    // Mon
	    week: 'ddd d/M', // Mon 9/7
	    day: 'dddd d/M'  // Monday 9/7
	},
	timeFormat: 'H(:mm)',
	axisFormat: 'H(:mm)',
	// eventDragStart: function(event) {
	//     alert("eventDragStart event <"+pp(event)+">");
	// },
	// eventDragStop: function(event) {
	//     alert("eventDragStop event <"+pp(even)+">");
	// },
	eventClick: function(calEven, jsEvent, view) {
	    window.location = "/comm/action/fiche.php?id="+calEven.id;
	},

	daySegHTML: function(segs) { // also sets seg.left and seg.outerWidth
		var rtl = opt('isRTL');
		var i;
		var segCnt=segs.length;
		var seg;
		var event;
		var url;
		var classes;
		var bounds = allDayBounds();
		var minLeft = bounds.left;
		var maxLeft = bounds.right;
		var leftCol;
		var rightCol;
		var left;
		var right;
		var skinCss;
		var html = '';
		// calculate desired position/dimensions, create html
		for (i=0; i<segCnt; i++) {
			seg = segs[i];
			event = seg.event;
			classes = ['fc-event', 'fc-event-skin', 'fc-event-hori'];
			if (isEventDraggable(event)) {
				classes.push('fc-event-draggable');
			}
			if (rtl) {
				if (seg.isStart) {
					classes.push('fc-corner-right');
				}
				if (seg.isEnd) {
					classes.push('fc-corner-left');
				}
				leftCol = dayOfWeekCol(seg.end.getDay()-1);
				rightCol = dayOfWeekCol(seg.start.getDay());
				left = seg.isEnd ? colContentLeft(leftCol) : minLeft;
				right = seg.isStart ? colContentRight(rightCol) : maxLeft;
			}else{
				if (seg.isStart) {
					classes.push('fc-corner-left');
				}
				if (seg.isEnd) {
					classes.push('fc-corner-right');
				}
				leftCol = dayOfWeekCol(seg.start.getDay());
				rightCol = dayOfWeekCol(seg.end.getDay()-1);
				left = seg.isStart ? colContentLeft(leftCol) : minLeft;
				right = seg.isEnd ? colContentRight(rightCol) : maxLeft;
			}
			classes = classes.concat(event.className);
			if (event.source) {
				classes = classes.concat(event.source.className || []);
			}
			url = event.url;
			skinCss = getSkinCss(event, opt);

		    html += "<div id='grego2'>Hello</div>";
			if (url) {
				html += "<a href='" + htmlEscape(url) + "'";
			}else{
				html += "<div";
			}
			html +=
				" class='" + classes.join(' ') + "'" +
				" style='position:absolute;z-index:8;left:"+left+"px;" + skinCss + "'" +
				">" +
				"<div" +
				" class='fc-event-inner fc-event-skin'" +
				(skinCss ? " style='" + skinCss + "'" : '') +
				">";
			if (!event.allDay && seg.isStart) {
				html +=
					"<span class='fc-event-time'>" +
					htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) +
					"</span>";
			}
			html +=
				"<span class='fc-event-title'>" + htmlEscape(event.title) + "</span>" +
				"</div>";
			if (seg.isEnd && isEventResizable(event)) {
				html +=
					"<div class='ui-resizable-handle ui-resizable-" + (rtl ? 'w' : 'e') + "'>" +
					"&nbsp;&nbsp;&nbsp;" + // makes hit area a lot better for IE6/7
					"</div>";
			}
			html +=
				"</" + (url ? "a" : "div" ) + ">";
			seg.left = left;
			seg.outerWidth = right - left;
			seg.startCol = leftCol;
			seg.endCol = rightCol + 1; // needs to be exclusive
		}
		return html;
	},
	

	slotSegHtml: function(event, seg) {
	    var html = "<div id='grego'>Hello</div>";
		html += "<";
		var url = event.url;
		var skinCss = getSkinCss(event, opt);
		var skinCssAttr = (skinCss ? " style='" + skinCss + "'" : '');
		var classes = ['fc-event', 'fc-event-skin', 'fc-event-vert'];
		if (isEventDraggable(event)) {
			classes.push('fc-event-draggable');
		}
		if (seg.isStart) {
			classes.push('fc-corner-top');
		}
		if (seg.isEnd) {
			classes.push('fc-corner-bottom');
		}
		classes = classes.concat(event.className);
		if (event.source) {
			classes = classes.concat(event.source.className || []);
		}
		if (url) {
			html += "a href='" + htmlEscape(event.url) + "'";
		}else{
			html += "div";
		}
		html +=
			" class='" + classes.join(' ') + "'" +
			" style='position:absolute;z-index:8;top:" + seg.top + "px;left:" + seg.left + "px;" + skinCss + "'" +
			">" +
			"<div class='fc-event-inner fc-event-skin'" + skinCssAttr + ">" +
			"<div class='fc-event-head fc-event-skin'" + skinCssAttr + ">" +
			"<div class='fc-event-time'>" +
			htmlEscape(formatDates(event.start, event.end, opt('timeFormat'))) +
			"</div>" +
			"</div>" +
			"<div class='fc-event-content'>" +
			"<div class='fc-event-title'>" +
			htmlEscape(event.title) +
			"</div>" +
			"</div>" +
			"<div class='fc-event-bg'></div>" +
			"</div>"; // close inner
		if (seg.isEnd && isEventResizable(event)) {
			html +=
				"<div class='ui-resizable-handle ui-resizable-s'>=</div>";
		}
		html +=
			"</" + (url ? "a" : "div") + ">";
		return html;
	},
	
	eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
	    // alert(prettyPrint(ui));
	    // alert(prettyPrint(view));
	    // alert(prettyPrint(jsEvent));

/*	    // update original url: http://dolibarr-new.local:88/comm/action/fiche.php/comm/action/fiche.php
	    // Params to post
	    action	update
	    affectedto	-1
	    ap	10/12/2012
	    apday	10
	    aphour	00
	    apmin	57
	    apmonth	12
	    apyear	2012
	    contactid	-1
	    doneby	1
	    edit	Enregistrer
	    id	1
	    label	Société DEV_COMPANY ajoutée dans Dolibarr
	    location	
	    note	Soci&eacute;t&eacute; DEV_COMPANY ajout&eacute;e dans Dolibarr<br /> Auteur: admin
	    p2	17/12/2012
	    p2day	17
	    p2hour	00
	    p2min	57
	    p2month	12
	    p2year	2012
	    priority	
	    projectid	0
	    ref_ext	
	    socid	1
	    status	-1
	    token	2151fbfb67b124047d8c53a3938bb921 */
	    // var the_start_date = new Date();
	    // alert(event.title + " was moved " +
	    // 	  dayDelta + " days and " +
	    // 	  " event id : <" + event.id + ">",
	    // 	  minuteDelta + " minutes.");

	    // alert("datep <"+Date.parse(event.start)+">");
	    // alert("datef <"+pp(event)+"> parsed <"+Date.parse(event.end)+">");
	    var date_start = (event.start == null || event.start == "") ? null : Date.parse(event.start);
	    var date_end = (event.end == null || event.end == "") ? null : Date.parse(event.end);

	    // date
	    var params = { "action":"update",
	    		   "datep": date_start,
	    		   "datef": date_end,
	    		   // "affectedto":"-1",
	    		   // "ap":"10/12/2012",
	    		   // "apday":'',
	    		   // "aphour":00,
	    		   // "apmin":57,
	    		   // "apmonth":01,
	    		   // "apyear":2013,
	    		   // "contactid":"-1",
	    		   // "doneby":1,
	    		   // "edit":"Enregistrer",
	    		   "id":event.id,
	    		   "label":event.title,
	    		   // "location":"",
	    		   // "note":"Soci&eacute;t&eacute;",
	    		   // "p2":"17/12/2012",
	    		   // "p2day":17,
	    		   // "p2hour":00,
	    		   // "p2min":57,
	    		   // "p2month":01,
	    		   // "p2year":2013,
	    		   // "priority":"",
	    		   // "projectid":0,
	    		   // "ref_ext":"",
	    		   "socid":1,
	    		   "status":"-1" };
	    		   // "token":"2151fbfb67b124047d8c53a3938bb921" };

            jQuery.getJSON("/axagenda/ajax/event_operations.php", params, function(data, status) {
		// alert("<"+status+">"); 
		if(status == "success") {
		    // alert("success");
		    var options = {};

		    $("#confirmation").dialog({height: 140, modal: true});
		    // $("#confirmation").hide().delay(800);
		    // $( "#confirmation" ).effect("fade", options, 500, function() {
		    // 	    $( "#confirmation" ).show().fadeIn();
		    // 	    $( "#confirmation" ).hide().fadeOut();
		    // });
		};
	    });
	    // alert(event.id + ' was moved ' + delta + ' days\n' +
	    // 	  '(should probably update your database)');
	    
	},
	
        events: function(start, end, callback) {
	    // alert("An event commes");
	    userasked = $("#userasked").val();
	    usertodo = $("#usertodo").val(); 
	    userdone = $("#userdone").val(); 
	    actioncode = $("#actioncode").val(); 
	    projectid  = $("select[name=projectid]").val(); 

            jQuery.getJSON("/axagenda/ajax/functions.php?userasked="+userasked+
                           "&usertodo="+usertodo+"&userdone="+userdone+"&projectid="+projectid
                           +"&actioncode="+actioncode,
                           {},
			   function(data, status) {
			       callback(data);
			   });
	    
	}

    });
    
});

