<?php
/* Copyright (C) 2001-2005 Rodolphe Quiedeville <rodolphe@quiedeville.org>
 * Copyright (C) 2004-2012 Laurent Destailleur  <eldy@users.sourceforge.net>
 * Copyright (C) 2005      Simon TOSSER         <simon@kornog-computing.com>
 * Copyright (C) 2005-2012 Regis Houssin        <regis@dolibarr.fr>
 * Copyright (C) 2010      Juanjo Menent        <jmenent@2byte.es>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 *       \file       htdocs/comm/action/fiche.php
 *       \ingroup    agenda
 *       \brief      Page for event card
 */

require '../../main.inc.php';
require_once DOL_DOCUMENT_ROOT.'/core/lib/agenda.lib.php';
require_once DOL_DOCUMENT_ROOT.'/core/lib/project.lib.php';
require_once DOL_DOCUMENT_ROOT.'/core/lib/date.lib.php';
require_once DOL_DOCUMENT_ROOT.'/contact/class/contact.class.php';
require_once DOL_DOCUMENT_ROOT.'/user/class/user.class.php';
require_once DOL_DOCUMENT_ROOT.'/comm/action/class/cactioncomm.class.php';
require_once DOL_DOCUMENT_ROOT.'/comm/action/class/actioncomm.class.php';
require_once DOL_DOCUMENT_ROOT.'/core/class/html.formactions.class.php';
require_once DOL_DOCUMENT_ROOT.'/projet/class/project.class.php';
require_once DOL_DOCUMENT_ROOT.'/core/class/extrafields.class.php';

require_once DOL_DOCUMENT_ROOT.'/axagenda/class/my_action_com.class.php';

$langs->load("companies");
$langs->load("commercial");
$langs->load("other");
$langs->load("bills");
$langs->load("orders");
$langs->load("agenda");

$action=GETPOST('action','alpha');
$cancel=GETPOST('cancel','alpha');
$backtopage=GETPOST('backtopage','alpha');
$contactid=GETPOST('contactid','int');

// Security check
$socid = GETPOST('socid','int');
$id = GETPOST('id','int');
if ($user->societe_id) $socid=$user->societe_id;
//$result = restrictedArea($user, 'agenda', $id, 'actioncomm', 'actions', '', 'id');

$error=GETPOST("error");
$mesg='';

$cactioncomm = new CActionComm($db);
$actioncomm = new ActionComm($db);
$contact = new Contact($db);
$extrafields = new ExtraFields($db);

//var_dump($_POST);

// Initialize technical object to manage hooks of thirdparties. Note that conf->hooks_modules contains array array
include_once DOL_DOCUMENT_ROOT.'/core/class/hookmanager.class.php';
$hookmanager=new HookManager($db);
// $hookmanager->initHooks(array('actioncard'));

dol_syslog("event_operations: apmonth: <".GETPOST('apmonth','int').">");

/*
 * Action creation de l'action
 */
$response = '';
if($action == 'delete') {
  $event_id = GETPOST('event_id');
  dol_syslog("event_id <".$event_id.">");
  $actioncomm = new MyActionComm($db);
  $actioncomm->fetch($event_id);

  if ($user->rights->agenda->myactions->delete
      || $user->rights->agenda->allactions->delete)
    {
      $result=$actioncomm->delete();

      if ($result < 0)
	{
	  $d_error=$actioncomm->error;
	  $msg="Error Occured: <"+$d_error+">";
	}
      else
	{
	  $msg = "Delete ok";
	}
    }

  $response = Array('error' => $d_error,
		    'msg' => $msg);
}

/*
 * Action update event
 */
if ($action == 'update')
{
	if (empty($cancel))
	{
        $fulldayevent=GETPOST('fullday');
	$datep=GETPOST('datep');
	$datef=GETPOST('datef');
        $aphour=GETPOST('aphour');
	$apday=GETPOST('apday');
	$apmonth=GETPOST('apmonth');
	$apyear=GETPOST('apyear');
        $apmin=GETPOST('apmin');
        $p2hour=GETPOST('p2hour');
        $p2day=GETPOST('p2day');
        $p2year=GETPOST('p2year');
        $p2month=GETPOST('p2month');
        $p2min=GETPOST('p2min');
	dol_syslog("GREG fullday: ".$fulldayevent."\n".
		   "apday: ".$apday."\n".
		   "apmonth: ".$apmonth."\n".
		   "apyear: ".$apyear."\n".
		   "aphour: ".$aphour."\n".
		   "apmin: ".$apmin."\n".
		   "p2month: ".$p2month."\n".
		   "p2day: ".$p2day."\n".
		   "p2year: ".$p2year."\n".
		   "p2hour: ".$p2hour."\n".
		   "p2min: ".$p2min."\n".
		   "datep: ".$datep."\n".
		   "datef: ".$datef."\n");
		   
	$percentage=in_array(GETPOST('status'),array(-1,100))?GETPOST('status'):GETPOST("percentage");	// If status is -1 or 100, percentage is not defined and we must use status

	    // Clean parameters
		if ($aphour == -1) $aphour='0';
		if ($apmin == -1) $apmin='0';
		if ($p2hour == -1) $p2hour='0';
		if ($p2min == -1) $p2min='0';

		$actioncomm = new Actioncomm($db);
		$actioncomm->fetch($id);

		// $datep=dol_mktime($fulldayevent?'00':$aphour, $fulldayevent?'00':$apmin, 0, $apmonth, $apday, $apyear);
		// $datef=dol_mktime($fulldayevent?'23':$p2hour, $fulldayevent?'59':$p2min, $fulldayevent?'59':'0', $p2month, $p2day, $p2year);


		// GREG datep <1356108780> datef <1356108780>
		dol_syslog("datep <".$datep."> datef <".$datef);

		// $actioncomm->label       = GETPOST("label");
		$actioncomm->datep       = ($datep == null) ? null : substr($datep, 0, strlen($datep)-3) ; 
		$actioncomm->datef       = ($datef == null) ? null : substr($datef, 0, strlen($datef)-3) ; 

		/* $actioncomm->percentage  = $percentage; */
		/* $actioncomm->priority    = GETPOST("priority"); */
		/* $actioncomm->fulldayevent= GETPOST("fullday")?1:0; */
		/* $actioncomm->location    = ''; // isset(GETPOST("location"))?GETPOST("location"):''; */
		/* $actioncomm->societe->id = GETPOST("socid"); */
		/* $actioncomm->contact->id = GETPOST("contactid"); */
		/* $actioncomm->fk_project  = GETPOST("projectid"); */
		/* $actioncomm->note        = GETPOST("note"); */
		/* $actioncomm->pnote       = GETPOST("note"); */

		dol_syslog("ActionComm Création <".print_r($actioncomm, true).">");
		/* if (! $datef && $percentage == 100) */
		/* { */
		/* 	$error=$langs->trans("ErrorFieldRequired",$langs->trans("DateEnd")); */
		/* 	$action = 'edit'; */
		/* } */

		/* // Users */
		/* $usertodo=new User($db); */
		/* if ($_POST["affectedto"]) */
		/* { */
		/* 	$usertodo->fetch($_POST["affectedto"]); */
		/* } */
		/* $actioncomm->usertodo = $usertodo; */
		/* $userdone=new User($db); */
		/* if ($_POST["doneby"]) */
		/* { */
		/* 	$userdone->fetch($_POST["doneby"]); */
		/* } */
		/* $actioncomm->userdone = $userdone; */

		/* // Get extra fields */
		/* foreach($_POST as $key => $value) */
		/* { */
		/* 	if (preg_match("/^options_/",$key)) */
		/* 	{ */
		/* 		$actioncomm->array_options[$key]=GETPOST($key); */
		/* 	} */
		/* } */
		
		if (! $error)
		{
			$db->begin();

			$result=$actioncomm->update($user);

			if ($result > 0)
			{
				$db->commit();
			}
			else
			{
				$db->rollback();
			}
		}
	}

	if ($result < 0)
	{
		setEventMessage($actioncomm->error,'errors');
		setEventMessage($actioncomm->errors,'errors');
	}
	else
	{
        /* if (! empty($backtopage)) */
        /* { */
        /*     header("Location: ".$backtopage); */
        /*     exit; */
        /* } */
	}
	$response = Array();
}


/*
 * View
 */

/* $help_url='EN:Module_Agenda_En|FR:Module_Agenda|ES:M&omodulodulo_Agenda'; */
/* llxHeader('',$langs->trans("Agenda"),$help_url); */

/* $form = new Form($db); */
/* $htmlactions = new FormActions($db); */

/* // fetch optionals attributes and labels */
/* $extralabels=$extrafields->fetch_name_optionals_label('actioncomm'); */

$db->close();
top_httphead();
/* { */
/*   "one": "Singular sensation", */
/*   "two": "Beady little eyes", */
/*   "three": "Little birds pitch by my doorstep" */
/* } */
echo json_encode($response);
// print "<html><body></body></html>"
// llxFooter();




?>
