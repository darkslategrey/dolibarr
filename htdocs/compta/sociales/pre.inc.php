<?php
/* Copyright (C) 2002-2003 Rodolphe Quiedeville <rodolphe@quiedeville.org> 
 * Copyright (C) 2005-2006 Laurent Destailleur  <eldy@users.sourceforge.net>
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
 * $Id: pre.inc.php,v 1.7 2007/06/25 00:02:37 eldy Exp $
 * $Source: /cvsroot/dolibarr/dolibarr/htdocs/compta/sociales/pre.inc.php,v $
 */
 
/**   
      \file   	    htdocs/compta/sociales/pre.inc.php
      \ingroup      tax
      \brief  	    Fichier gestionnaire du menu charges sociales
*/

require("../../main.inc.php");

function llxHeader($head = "")
{
    global $user, $conf, $langs;
    $langs->load("compta");
    $langs->load("propal");
    
    top_menu($head);
    
    $menu = new Menu();
    
    $menu->add(DOL_URL_ROOT."/compta/charges/index.php",$langs->trans("Contributions"));
    $menu->add_submenu(DOL_URL_ROOT."/compta/sociales/charges.php?action=create",$langs->trans("MenuNewSocialContribution"));
    $menu->add_submenu(DOL_URL_ROOT."/compta/sociales/index.php",$langs->trans("List"));
    
    left_menu($menu->liste);
}

?>