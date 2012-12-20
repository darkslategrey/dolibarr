$(document).ready(function() {
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    userasked = $("#userasked").val();
    usertodo = $("#usertodo").val(); 
    userdone = $("#userdone").val(); 
    actioncode = $("#actioncode").val(); 
    projectid  = $("select[name=projectid]").val(); 

    
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
	
        events: '/axagenda/ajax/functions.php?userasked='+userasked+
            '&usertodo='+usertodo+'&userdone='+userdone+'&projectid='+projectid
            +'&actioncode='+actioncode

    });
    
});

