$(document).ready(function() {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    
    $('#calendar').fullCalendar({
	header: {
	    left: 'prev,next today',
	    center: 'title',
	    right: 'month,basicWeek,basicDay'
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
	dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Jeudi', 'Vendredi', 'Samedi' ],
	dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Jeu.', 'Ven.', 'Sam.' ],
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
	eventDrop: function(event, delta) {
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
	    var params = { "action":"update",
			   "affectedto":"-1",
			   "ap":"10/12/2012",
			   "apday":10,
			   "aphour":00,
			   "apmin":57,
			   "apmonth":01,
			   "apyear":2013,
			   "contactid":"-1",
			   "doneby":1,
			   "edit":"Enregistrer",
			   "id":2,
			   "label":"Société",
			   "location":"",
			   "note":"Soci&eacute;t&eacute;",
			   "p2":"17/12/2012",
			   "p2day":17,
			   "p2hour":00,
			   "p2min":57,
			   "p2month":01,
			   "p2year":2013,
			   "priority":"",
			   "projectid":0,
			   "ref_ext":"",
			   "socid":1,
			   "status":"-1",
			   "token":"2151fbfb67b124047d8c53a3938bb921" };

            jQuery.getJSON("/axagenda/ajax/event_operations.php", params, function(data, status) {
		alert(data); 
	    }); 
	    // alert(event.id + ' was moved ' + delta + ' days\n' +
	    // 	  '(should probably update your database)');
	    
	},
	
        events: function(start, end, callback) {
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

