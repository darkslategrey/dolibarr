<?php
/* Copyright (C) 2004-2007 Rodolphe Quiedeville <rodolphe@quiedeville.org> 
 * Copyright (C) 2005      Laurent Destailleur  <eldy@users.sourceforge.net> 
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
 *
 * $Id: pre.inc.php,v 1.22 2009/08/19 17:10:19 eldy Exp $
 * $Source: /cvsroot/dolibarr/dolibarr/htdocs/compta/facture/pre.inc.php,v $
 *
 */

/**
   \file         htdocs/compta/facture/pre.inc.php
   \ingroup      facture
   \brief        Fichier de gestion du menu gauche du module facture
   \version      $Revision: 1.22 $
*/

require("../../main.inc.php");
require_once(DOL_DOCUMENT_ROOT."/facture.class.php");

$langs->load('bills');

function llxHeader($head = "", $title="", $help_url='') {
    global $user, $conf, $langs;

    $langs->load("companies");
    $langs->load("commercial");
    $langs->load("bills");
    $langs->load("banks");
    $langs->load("propal");
    
    top_menu($head, $title);
    
    $menu = new Menu();
    
    $menu->add(DOL_URL_ROOT."/compta/clients.php", $langs->trans("Customers"));
    
    $langs->load("bills");
    $menu->add(DOL_URL_ROOT."/compta/facture.php",$langs->trans("Bills"));
    $menu->add_submenu(DOL_URL_ROOT."/compta/facture/impayees.php",$langs->trans("Unpaid"));
    
    $menu->add(DOL_URL_ROOT."/compta/prelevement/",$langs->trans("StandingOrders"));
    
    left_menu($menu->liste, $help_url);
}

?>
