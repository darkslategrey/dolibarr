function pp(object, depth, embedded) { 
  typeof(depth) == "number" || (depth = 0)
  typeof(embedded) == "boolean" || (embedded = false)
  var newline = false
  var spacer = function(depth) { var spaces = ""; for (var i=0;i<depth;i++) { spaces += "  "}; return spaces }
  var pretty = ""
  if (      typeof(object) == "undefined" ) { pretty += "undefined" }
  else if ( typeof(object) == "boolean" || 
            typeof(object) == "number" ) {    pretty += object.toString() } 
  else if ( typeof(object) == "string" ) {    pretty += "\"" + object + "\"" } 
  else if (        object  == null) {         pretty += "null" } 
  else if ( object instanceof(Array) ) {
    if ( object.length > 0 ) {
      if (embedded) { newline = true }
      var content = ""
      for each (var item in object) { content += pp(item, depth+1) + ",\n" + spacer(depth+1) }
      content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
      pretty += "[ " + content + "\n" + spacer(depth) + "]"
    } else { pretty += "[]" }
  } 
  else if (typeof(object) == "object") {
    if ( Object.keys(object).length > 0 ){
      if (embedded) { newline = true }
      var content = ""
      for (var key in object) { 
        content += spacer(depth + 1) + key.toString() + ": " + pp(object[key], depth+2, true) + ",\n" 
      }
      content = content.replace(/,\n\s*$/, "").replace(/^\s*/,"")
      pretty += "{ " + content + "\n" + spacer(depth) + "}"
    } else { pretty += "{}"}
  }
  else { pretty += object.toString() }
  return ((newline ? "\n" + spacer(depth) : "") + pretty)
}



$(document).ready(function() {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    
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
	
	eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
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
	    alert(event.title + " was moved " +
		  dayDelta + " days and " +
		  " event id : <" + event.id + ">",
		  minuteDelta + " minutes.");

	    alert("datep <"+Date.parse(event.start)+">");
	    alert("datef <"+pp(event)+"> parsed <"+Date.parse(event.end)+">");
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
	    	alert(data); 
	    }); 
	    // alert(event.id + ' was moved ' + delta + ' days\n' +
	    // 	  '(should probably update your database)');
	    
	},
	
        events: function(start, end, callback) {
	    alert("An event commes");
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

