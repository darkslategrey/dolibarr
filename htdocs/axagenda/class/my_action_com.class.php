<?php
/* Copyright (C) 2002-2004 Rodolphe Quiedeville <rodolphe@quiedeville.org>
 * Copyright (C) 2004-2011 Laurent Destailleur  <eldy@users.sourceforge.net>
 * Copyright (C) 2005-2012 Regis Houssin        <regis@dolibarr.fr>
 * Copyright (C) 2011	   Juanjo Menent        <jmenent@2byte.es>
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
 *       \file       htdocs/comm/action/class/actioncomm.class.php
 *       \ingroup    agenda
 *       \brief      File of class to manage agenda events (actions)
 */
require_once DOL_DOCUMENT_ROOT.'/core/class/commonobject.class.php';
require_once DOL_DOCUMENT_ROOT.'/comm/action/class/cactioncomm.class.php';
require_once DOL_DOCUMENT_ROOT.'/comm/action/class/actioncomm.class.php';


/**
 *		Class to manage agenda events (actions)
 */
class MyActionComm extends ActionComm
{

    /**
     *      Constructor
     *
     *      @param		DoliDB		$db      Database handler
     */
    function __construct($db)
    {
        $this->db = $db;

        $this->author = (object) array();
        $this->usermod = (object) array();
        $this->usertodo = (object) array();
        $this->userdone = (object) array();
        $this->societe = (object) array();
        $this->contact = (object) array();
    }
    /**
     *    Delete event from database
     *
     *    @param    int		$notrigger		1 = disable triggers, 0 = enable triggers
     *    @return   int 					<0 if KO, >0 if OK
     */
    function delete($notrigger=0)
    {
        global $user,$langs,$conf;

        $error=0;

        $this->db->begin();

        $sql = "DELETE FROM ".MAIN_DB_PREFIX."actioncomm";
        $sql.= " WHERE id=".$this->id;

        dol_syslog(get_class($this)."::delete sql=".$sql, LOG_DEBUG);
        $res=$this->db->query($sql);
        if ($res < 0) {
        	$this->error=$this->db->lasterror();
        	$error++;
        }

        if (!$error)
        {
            if (! $notrigger)
            {
                // Appel des triggers
                include_once DOL_DOCUMENT_ROOT . '/core/class/interfaces.class.php';
                $interface=new Interfaces($this->db);
                $result=$interface->run_triggers('ACTION_DELETE',$this,$user,$langs,$conf);
                if ($result < 0) {
                    $error++; $this->errors=$interface->errors;
                }
                // Fin appel triggers
            }

            if (! $error)
            {
                $this->db->commit();
                return 1;
            }
            else
            {
                $this->db->rollback();
                return -2;
            }
        }
        else
        {
            $this->db->rollback();
            $this->error=$this->db->lasterror();
            dol_syslog(get_class($this)."::delete ".$this->error,LOG_ERR);
            return -1;
        }
    }

}

?>
