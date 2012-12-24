<?php
/* Copyright (C) 2009 Regis Houssin <regis@dolibarr.fr>
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
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

/**
 *	\file       htdocs/multicompany/multicompany.class.php
 *	\ingroup    multicompany
 *	\brief      File Class multicompany
 *	\version    $Id: multicompany.class.php,v 1.10 2009/10/30 17:08:02 hregis Exp $
 */


/**
 *	\class      Multicompany
 *	\brief      Class of the module multicompany
 */
class Multicompany
{
	var $db;
	var $error;
	//! Numero de l'erreur
	var $errno = 0;
	
	var $entities = array();

	/**
	 *    \brief      Constructeur de la classe
	 *    \param      DB          Handler acces base de donnees
	 *    \param      id          Id produit (0 par defaut)
	 */
	function Multicompany($DB)
	{
		$this->db = $DB;
		
		$this->canvas = "default";
		$this->name = "admin";
		$this->description = "";
		
		/*
		$this->active = MAIN_MULTICOMPANY;
		
		$this->menu_new = 'Admin';
		$this->menu_add = 1;
		$this->menu_clear = 1;

		$this->no_button_copy = 1;

		$this->menus[0][0] = '';
		$this->menus[0][1] = '';
		$this->menus[1][0] = '';
		$this->menus[1][1] = '';

		$this->next_prev_filter = "canvas='default'";

		$this->onglets[0][0] = 'URL';
		$this->onglets[0][1] = 'name1';
		$this->onglets[1][0] = 'URL';
		$this->onglets[1][1] = 'name2';
		*/
	}

	/**
	 *    \brief      Creation
	 */
	function Create($user,$datas)
	{
		
	}
	
	/**
	 *    \brief      Supression
	 */
	function Delete($id)
	{

	}
	
    /**
	 *    \brief      Fetch entity
	 */
	function fetch($id)
	{
		global $conf;
		
		$sql = "SELECT ";
		$sql.= $this->db->decrypt('name',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." as name";
		$sql.= ", ".$this->db->decrypt('value',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." as value";
		$sql.= " FROM ".MAIN_DB_PREFIX."const";
		$sql.= " WHERE ".$this->db->decrypt('name',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." LIKE 'MAIN_%'";
		$sql.= " AND entity = ".$id;
		
		$result = $this->db->query($sql);
		if ($result)
		{
			$num = $this->db->num_rows($result);
			$entityDetails = array();
			$i = 0;
			
			while ($i < $num)
			{
				$obj = $this->db->fetch_object($result);

				if (preg_match('/^MAIN_INFO_SOCIETE_PAYS$/i',$obj->name))
				{
					$entityDetails[$obj->name] = getCountryLabel($obj->value);
				}
				else if (preg_match('/^MAIN_MONNAIE$/i',$obj->name))
				{
					$entityDetails[$obj->name] = currency_name($obj->value);
				}
				else
				{
					$entityDetails[$obj->name] = $obj->value;
				}
				
				$i++;
			}
			return $entityDetails;
		}
		
	}
	
    /**
	 *    \brief      Enable/disable entity
	 */
	function setEntity($id,$action)
	{
		global $conf;

		if ($action == 'enable') 
		{
			$newid = str_replace('-','',$id);
		}
		else if ($action == 'disable')
		{
			$newid = '-'.$id;
		}

		$sql = "UPDATE ".MAIN_DB_PREFIX."const";
		$sql.= " SET entity = ".$newid;
		$sql.= " WHERE ".$this->db->decrypt('name',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." = 'MAIN_INFO_SOCIETE_NOM'";
		$sql.= " AND entity = ".$id;
		
		dol_syslog("Multicompany::setEntity sql=".$sql, LOG_DEBUG);
		
		$result = $this->db->query($sql);
	}
	
	/**
	 *    \brief      List of entities
	 */
	function getEntities($details=0)
	{
		global $conf;
		
		$sql = "SELECT ";
		$sql.= $this->db->decrypt('value',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." as value";
		$sql.= ", entity";
		$sql.= " FROM ".MAIN_DB_PREFIX."const";
		$sql.= " WHERE ".$this->db->decrypt('name',$conf->db->dolibarr_main_db_encryption,$conf->db->dolibarr_main_db_cryptkey)." = 'MAIN_INFO_SOCIETE_NOM'";
		$sql.= " ORDER BY value ASC";
		
		$result = $this->db->query($sql);
		if ($result)
		{
			$num = $this->db->num_rows($result);
			$i = 0;
			
			while ($i < $num)
			{
				$obj = $this->db->fetch_object($result);
				
				$active = 1;
				$entity = $obj->entity;
				
				if ($obj->entity < 0)
				{
					$entity = str_replace('-','',$obj->entity);
					$active = 0;
				}
				
				$this->entities[$i]['label']   = $obj->value;
				$this->entities[$i]['id']      = $obj->entity;
				if ($details) $this->entities[$i]['details'] = $this->fetch($entity);
				$this->entities[$i]['active']  = $active;
				
				$i++;
			}
		}
		
	}
	
	/**
	 *    \brief      Return combo list of entities.
	 *    \param      entities    Entities array
	 *    \param      selected    Preselected entity
	 */
	function select_entities($entities,$selected='',$option='')
	{
		print '<select class="flat" name="entity" '.$option.'>';
				
		if (is_array($entities))
		{	
			foreach ($entities as $entity)
			{
				if ($entity['active'] == 1)
				{
					print '<option value="'.$entity['id'].'" ';
					if ($selected == $entity['id'])	print 'selected="true"';
					print '>';
					print $entity['label'];
					print '</option>';
				}
			}
		}
		print '</select>';
	}

	/**
	 *    \brief      Assigne les valeurs pour les templates Smarty
	 *    \param      smarty     Instance de smarty
	 */
	function assign_smarty_values(&$smarty, $action='')
	{
		global $conf,$langs;
		
		$smarty->assign('langs', $langs);
		
		$picto='title.png';
		if (empty($conf->browser->firefox)) $picto='title.gif';
		$smarty->assign('title_picto', img_picto('',$picto));
		
		$smarty->assign('entities',$this->entities);
		$smarty->assign('img_on',img_picto($langs->trans("Activated"),'on'));
		$smarty->assign('img_off',img_picto($langs->trans("Disabled"),'off'));

	}



}
?>