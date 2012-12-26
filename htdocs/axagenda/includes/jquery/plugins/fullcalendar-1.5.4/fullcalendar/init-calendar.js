function confirm_delete(ele) {
    event_id = ele.getAttribute('event_id');
    url = '/axagenda/ajax/event_operations.php';
    $( "#confirm_del_event" ).dialog({
        resizable: false,
        height:140,
        modal: true,
        buttons: {
            "Oui": function() {
		params = { 'action': 'delete', 'event_id': event_id };
		jQuery.getJSON(url, params, function(data, status) {
		    if(status == 'success') {
			alert(data.msg);
		    } else {
		    }
		    
		});
            },
            "Non": function() {
                $( this ).dialog( "Non" ).close();
            }
        }
    });

    return 0;
}


$(document).ready(function() {


//     '/comm/action/fiche.php?action=delete&id=" + event ._id + "' class='icon-del icon'></a>";

// 	if ($action == 'delete')
// 	{
// 		$ret=$form->form_confirm("fiche.php?id=".$id,$langs->trans("DeleteAction"),$langs->trans("ConfirmDeleteAction"),"confirm_delete",'','',1);
// 		if ($ret == 'html') print '<br>';
// 	}

//     // DELETE CLICK
// if ($action == 'confirm_delete' && GETPOST("confirm") == 'yes')
// {
// 	$actioncomm = new ActionComm($db);
// 	$actioncomm->fetch($id);

// 	if ($user->rights->agenda->myactions->delete
// 		|| $user->rights->agenda->allactions->delete)
// 	{
// 		$result=$actioncomm->delete();

// 		if ($result >= 0)
// 		{
// 			header("Location: index.php");
// 			exit;
// 		}
// 		else
// 		{
// 			$mesg=$actioncomm->error;
// 		}
// 	}
// }


    // NOTIFICATION PART
    $("#success_notification").click(function(e){
	e.preventDefault();
	jSuccess(
	    'Mise à jour réussie',
	    {
		autoHide : true, // added in v2.0
		clickOverlay : false, // added in v2.0
		MinWidth : 250,
		TimeShown : 1500,
		ShowTimeEffect : 200,
		HideTimeEffect : 200,
		LongTrip :20,
		HorizontalPosition : 'center',
		VerticalPosition : 'top',
		ShowOverlay : true,
   		ColorOverlay : '#000',
		OpacityOverlay : 0.3,
		onClosed : function(){ // added in v2.0
		    
		},
		onCompleted : function(){ // added in v2.0
		    
		}
	    });
    });

    $("#failure_notification").click(function(e){
	e.preventDefault();
	jError(
	    'Echec de la mise à jour',
	    {
		autoHide : true, // added in v2.0
		clickOverlay : false, // added in v2.0
		MinWidth : 250,
		TimeShown : 1500,
		ShowTimeEffect : 200,
		HideTimeEffect : 200,
		LongTrip :20,
		HorizontalPosition : 'center',
		VerticalPosition : 'top',
		ShowOverlay : true,
   		ColorOverlay : '#000',
		OpacityOverlay : 0.3,
		onClosed : function(){ // added in v2.0
		    
		},
		onCompleted : function(){ // added in v2.0
		    
		}
	    });
    });
    



    // FULL CALENDAR PART
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


	// eventClick: function(calEven, jsEvent, view) {
	//     window.location = "/comm/action/fiche.php?id="+calEven.id;
	// },

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
		    $("#success_notification").trigger('click');
		} else {
		    $("#failure_notification").trigger('click');
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

