<?php
/* Copyright (C) 2005-2010 Laurent Destailleur <eldy@users.sourceforge.net>
 * Copyright (C) 2005-2009 Regis Houssin       <regis@dolibarr.fr>
 *
 * This file is an example to follow to add your own email selector inside
 * the Dolibarr email tool.
 * Follow instructions given in README file to know what to change to build
 * your own emailing list selector.
 * Code that need to be changed in this file are marked by "CHANGE THIS" tag.
 */

/**
 *	\file       htdocs/includes/modules/mailings/thirdparties.modules.php
 *	\ingroup    mailing
 *	\brief      Example file to provide a list of recipients for mailing module
 *	\version    $Revision$
 */

include_once DOL_DOCUMENT_ROOT.'/includes/modules/mailings/modules_mailings.php';


/**
 *	    \class      mailing_thirdparties
 *		\brief      Class to manage a list of personalised recipients for mailing feature
 */
class mailing_thirdparties extends MailingTargets
{
	// CHANGE THIS: Put here a name not already used
	var $name='ContactsCategories';
	// CHANGE THIS: Put here a description of your selector module.
	// This label is used if no translation found for key MailingModuleDescXXX where XXX=name is found
	var $desc="Third parties (by categories)";
	// CHANGE THIS: Set to 1 if selector is available for admin users only
	var $require_admin=0;

	var $require_module=array("categorie","societe");
	var $picto='company';
	var $db;


	function mailing_thirdparties($DB)
	{
		$this->db=$DB;
	}


	/**
	 *    \brief      This is the main function that returns the array of emails
	 *    \param      mailing_id    Id of mailing. No need to use it.
	 *    \param      filterarray   If you used the formFilter function. Empty otherwise.
	 *    \return     int           <0 if error, number of emails added if ok
	 */
	function add_to_target($mailing_id,$filtersarray=array())
	{
		global $conf, $langs;

		$cibles1 = array();
		$cibles2 = array();
		$cibles3 = array();

		// Select the third parties from category
		if (empty($_POST['filter']))
		{
		    $sql = "SELECT s.rowid as id, s.email as email, s.nom as name, null as fk_contact, null as firstname, null as label";
		    $sql.= " FROM ".MAIN_DB_PREFIX."societe as s";
		    $sql.= " WHERE s.email != ''";
		    $sql.= " AND s.entity = ".$conf->entity;
		}
		else
		{

		  $sql  = "SELECT sp.email as email, sp.firstname as firstname, sp.name as name, null as fk_contact, ";
		  $sql .= "c.label as label, cf.fk_societe as id ";
		  $sql .= "FROM ".MAIN_DB_PREFIX."categorie_fournisseur as cf, ";
		  $sql .= MAIN_DB_PREFIX."categorie             as c, ";
		  $sql .= MAIN_DB_PREFIX."socpeople             as sp, ";
		  $sql .= MAIN_DB_PREFIX."societe               as s ";
		  $sql .= "WHERE cf.fk_categorie = ".$this->db->escape($_POST['filter'])." AND ";
		  $sql .= "cf.fk_societe   = sp.fk_soc AND ";
		  $sql .= "c.rowid         = cf.fk_categorie ";
		  $sql .= "GROUP BY sp.email ";
		  $sql .= "UNION SELECT sp.email as email, sp.firstname as firstname, sp.name as name, null as fk_contact, ";
		  $sql .= "c.label as label, cf.fk_societe as id ";
		  $sql .= "FROM ".MAIN_DB_PREFIX."categorie_societe as cf, ";
		  $sql .= MAIN_DB_PREFIX."categorie         as c, ";
		  $sql .= MAIN_DB_PREFIX."societe           as s, ";
		  $sql .= MAIN_DB_PREFIX."socpeople         as sp      ";
		  $sql .= "WHERE cf.fk_categorie = ".$this->db->escape($_POST['filter'])." AND ";
		  $sql .= "cf.fk_societe   = sp.fk_soc AND ";
		  $sql .= "c.rowid         = cf.fk_categorie ";
		  $sql .= "GROUP BY sp.email ";
		}
		$sql.= " ORDER BY email";

		dol_syslog(get_class($this)."::add_to_target QUERY <".$sql.">");
		// Stock recipients emails into targets table
		$result=$this->db->query($sql);
		if ($result)
		{
			$num = $this->db->num_rows($result);
			$i = 0;
			$j = 0;

			dol_syslog(get_class($this)."::add_to_target mailing ".$num." targets found");

			$old = '';
			while ($i < $num)
			{
				$obj = $this->db->fetch_object($result);
				if ($old <> $obj->email)
				{
					$cibles1[$j] = array(
                    			'email' => $obj->email,
                    			'fk_contact' => $obj->fk_contact,
                    			'name' => $obj->name,
                    			'firstname' => $obj->firstname,
                    			'other' => ($obj->label?$langs->transnoentities("Category").'='.$obj->label:''),
					'source_url' => $this->url($obj->id),
					'source_id' => $obj->id,
					'source_type' => 'thirdparty'
					);
					$old = $obj->email;
					$j++;
				}

				$i++;
			}
		}
		else
		{
			dol_syslog($this->db->error());
			$this->error=$this->db->error();
			return -1;
		}

		/* THIER PART */
		  $sql  = "SELECT s.email as email, null as firstname, s.nom as name, null as fk_contact, ";
		  $sql .= "c.label as label, s.rowid as id ";
		  $sql .= "FROM ".MAIN_DB_PREFIX."categorie_fournisseur as cf, ";
		  $sql .= MAIN_DB_PREFIX."categorie_societe as cs, ";
		  $sql .= MAIN_DB_PREFIX."categorie             as c, ";
		  $sql .= MAIN_DB_PREFIX."socpeople             as sp, ";
		  $sql .= MAIN_DB_PREFIX."societe               as s ";
		  $sql .= 'WHERE ( cf.fk_categorie = '.$this->db->escape($_POST['filter']).' AND s.rowid = cf.fk_societe ) OR ';
		  $sql .= '( cs.fk_categorie = '.$this->db->escape($_POST['filter']).' AND s.rowid = cs.fk_societe ) AND ';
		  $sql .= "c.rowid         = ".$this->db->escape($_POST['filter'])." ";
		  $sql .= "GROUP BY s.email ";

		dol_syslog(get_class($this)."::add_to_target QUERY 2<".$sql.">");
		$result=$this->db->query($sql);
		if ($result)
		{
			$num = $this->db->num_rows($result);
			$i = 0;
			$j = 0;

			dol_syslog(get_class($this)."::add_to_target mailing ".$num." targets found");

			$old = '';
			while ($i < $num)
			{
				$obj = $this->db->fetch_object($result);
				if ($old <> $obj->email)
				{
					$cibles2[$j] = array(
                    			'email' => $obj->email,
                    			'fk_contact' => $obj->fk_contact,
                    			'name' => $obj->name,
                    			'firstname' => $obj->firstname,
                    			'other' => ($obj->label?$langs->transnoentities("Category").'='.$obj->label:''),
					'source_url' => $this->url($obj->id),
					'source_id' => $obj->id,
					'source_type' => 'thirdparty'
					);
					$old = $obj->email;
					$j++;
				}

				$i++;
			}
		}
		else
		{
			dol_syslog($this->db->error());
			$this->error=$this->db->error();
			return -1;
		}
		/* END THIER PART */
		/* $myFile = "/tmp/greg.txt"; */
		/* $fh = fopen($myFile, 'w') or die("can't open file"); */
		/* fwrite($fh, "CIBLE 1"); */
		/* $stringData = print_r($cibles1, true); */
		/* fwrite($fh, $stringData); */
		/* fwrite($fh, "CIBLE 2"); */
		/* $stringData = print_r($cibles2, true); */
		/* fwrite($fh, $stringData); */

		foreach ($cibles2 as $cible) {
		  array_push($cibles1, $cible);
		}

		/* fwrite($fh, "CIBLE 3"); */
		/* $stringData = print_r($cibles1, true); */
		/* fwrite($fh, $stringData); */

		/* fclose($fh); */

		return parent::add_to_target($mailing_id, $cibles1);
	}


	/**
	 *		\brief		On the main mailing area, there is a box with statistics.
	 *					If you want to add a line in this report you must provide an
	 *					array of SQL request that returns two field:
	 *					One called "label", One called "nb".
	 *		\return		array
	 */
	function getSqlArrayForStats()
	{
		// CHANGE THIS: Optionnal

		//var $statssql=array();
		//$this->statssql[0]="SELECT field1 as label, count(distinct(email)) as nb FROM mytable WHERE email IS NOT NULL";
		return array();
	}


	/*
	 *		\brief		Return here number of distinct emails returned by your selector.
	 *					For example if this selector is used to extract 500 different
	 *					emails from a text file, this function must return 500.
	 *		\return		int
	 */
	function getNbOfRecipients()
	{
		global $conf;

		$sql = "SELECT count(distinct(s.email)) as nb";
		$sql.= " FROM ".MAIN_DB_PREFIX."societe as s";
		$sql.= " WHERE s.email != ''";
		$sql.= " AND s.entity = ".$conf->entity;

		// La requete doit retourner un champ "nb" pour etre comprise
		// par parent::getNbOfRecipients
		return parent::getNbOfRecipients($sql);
	}

	/**
	 *      \brief      This is to add a form filter to provide variant of selector
	 *					If used, the HTML select must be called "filter"
	 *      \return     string      A html select zone
	 */
	function formFilter()
	{
		global $conf, $langs;

		$langs->load("companies");

		$s='';
		$s.='<select name="filter" class="flat">';

		# Show categories
		$sql = "SELECT rowid, label, type, visible";
		$sql.= " FROM ".MAIN_DB_PREFIX."categorie";
		$sql.= " WHERE type in (1,2)";	// We keep only categories for suppliers and customers/prospects
		// $sql.= " AND visible > 0";	// We ignore the property visible because third party's categories does not use this property (only products categories use it).
		$sql.= " AND entity = ".$conf->entity;
		$sql.= " ORDER BY label";

		//print $sql;
		$resql = $this->db->query($sql);
		if ($resql)
		{
			$num = $this->db->num_rows($resql);

			if ($num) $s.='<option value="0">&nbsp;</option>';
			else $s.='<option value="0">'.$langs->trans("ContactsAllShort").'</option>';

			$i = 0;
			while ($i < $num)
			{
				$obj = $this->db->fetch_object($resql);

				$type='';
				if ($obj->type == 1) $type=$langs->trans("Supplier");
				if ($obj->type == 2) $type=$langs->trans("Customer");
				$s.='<option value="'.$obj->rowid.'">'.dol_trunc($obj->label,38,'middle');
				if ($type) $s.=' ('.$type.')';
				$s.='</option>';
				$i++;
			}
		}
		else
		{
			dol_print_error($db);
		}

		$s.='</select>';
		return $s;

	}


	/**
	 *      \brief      Can include an URL link on each record provided by selector
	 *					shown on target page.
	 *      \return     string      Url link
	 */
	function url($id)
	{
		//$companystatic=new Societe($this->db);
		//$companystatic->id=$id;
		//$companystatic->nom='';
		//return $companystatic->getNomUrl(1);	// Url too long
		return '<a href="'.DOL_URL_ROOT.'/societe/soc.php?socid='.$id.'">'.img_object('',"company").'</a>';
	}

}
// VERIFIER le TRI PAR  Contacts de tiers (par catégorie de tiers)
?>
