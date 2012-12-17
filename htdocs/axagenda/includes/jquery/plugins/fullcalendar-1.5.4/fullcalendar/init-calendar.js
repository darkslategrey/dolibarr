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
	events: "/json-events.php",
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
	
	events: [
	    {
		title: 'All Day Event',
		start: new Date(y, m, 1)
	    },
	    {
		title: 'Long Event',
		start: new Date(y, m, d-5),
		end: new Date(y, m, d-2)
	    },
	    {
		id: 999,
		title: 'Repeating Event',
		start: new Date(y, m, d-3, 16, 0),
		allDay: false
	    },
	    {
		id: 999,
		title: 'Repeating Event',
		start: new Date(y, m, d+4, 16, 0),
		allDay: false
	    },
	    {
		title: 'Meeting',
		start: new Date(y, m, d, 10, 30),
		allDay: false
	    },
	    {
		title: 'Lunch',
		start: new Date(y, m, d, 12, 0),
		end: new Date(y, m, d, 14, 0),
		allDay: false
	    },
	    {
		title: 'Birthday Party',
		start: new Date(y, m, d+1, 19, 0),
		end: new Date(y, m, d+1, 22, 30),
		allDay: false
	    },
	    {
		title: 'Click for Google',
		start: new Date(y, m, 28),
		end: new Date(y, m, 29),
		url: 'http://google.com/'
	    }
	]
    });
    
});

