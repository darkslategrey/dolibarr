

function success_notify(msg) {
    // e.preventDefault();
    jSuccess(
	msg,
	{
	    autoHide : true, // added in v2.0
	    clickOverlay : false, // added in v2.0
	    MinWidth : 250,
	    TimeShown : 500,
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

}
function failure_notify(msg) {
    // e.preventDefault();
    jError(
	msg,
	{
	    autoHide : true, // added in v2.0
	    clickOverlay : false, // added in v2.0
	    MinWidth : 250,
	    TimeShown : 500,
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
}

function confirm_delete(ele) {
    event_id = ele.getAttribute('event_id');
    var baseUri = document.baseURI;
    baseUri = baseUri.slice(0, baseUri.indexOf("/axagenda"));
    // alert(baseUri);
    url = baseUri + '/axagenda/ajax/event_operations.php';
    // url = '/axagenda/ajax/event_operations.php';
    $( "#confirm_del_event" ).dialog({
        resizable: false,
        height:140,
        modal: true,
        buttons: {
            "Oui": function() {
		params = { 'action': 'delete', 'event_id': event_id };
		jQuery.getJSON(url, params, function(data, status) {
		    if(status == 'success') {
			$("#success_notification").click(success_notify('Mise à jour réussie'));
			$('#calendar').fullCalendar('removeEvents', event_id);
			$( "#confirm_del_event" ).dialog("close").delay(1000);
		    } else {
			$("#failure_notification").click(failure_notify('Echec de la mise à jour'));
			$(this).dialog("close", {'delay': 400});
		    }
		});
            },
            "Non": function() {
		$(this).dialog("close");
            }
        }
    });

    return 0;
}


$(document).ready(function() {

    var baseUri = document.baseURI;
    baseUri = baseUri.slice(0, baseUri.indexOf("/axagenda"));

    var event_drag = false;

    // FULL CALENDAR PART
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#success_notification, #failure_notification, #confirm_del_event').hide();
    
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

	//     if(!event_drag) {  
	// 	alert("C'est un click");		
	// 	window.location = "/comm/action/fiche.php?id="+calEven.id;
	//     } 
	//     return 1;
	// },

	// eventRender: function(event, element) {
	//     element.find('span.fc-event-title').html(element.find('span.fc-event-title').text());
	// },

	
	eventDragStart: function( event, jsEvent, ui, view ) { 
	    event_drag = true;
	},
	eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
	    jsEvent.preventDefault();
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
			   //
			   // "fiche_url": event.fiche_url,
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

            jQuery.getJSON(baseUri + "/axagenda/ajax/event_operations.php", params, function(data, status) {
		// alert("<"+status+">"); 
		if(status == "success") {
		    $("#success_notification").click(success_notify('Mise à jour réussie'));
		} else {
		    $("#failure_notification").click(failure_notify('Echec de la mise à jour'));
		};
	    });
	    // alert(event.id + ' was moved ' + delta + ' days\n' +
	    // 	  '(should probably update your database)');
	    event_drag = false;
	},
	
        events: function(start, end, callback) {
	    userasked = $("#userasked").val();
	    usertodo = $("#usertodo").val(); 
	    userdone = $("#userdone").val(); 
	    actioncode = $("#actioncode").val(); 
	    projectid  = $("select[name=projectid]").val(); 

            jQuery.getJSON(baseUri + "/axagenda/ajax/functions.php?userasked="+userasked+
                           "&usertodo="+usertodo+"&userdone="+userdone+"&projectid="+projectid
                           +"&actioncode="+actioncode,
                           {},
			   function(data, status) {
			       callback(data);
			   });
	    
	}

    });
    
});

