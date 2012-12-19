#!/usr/bin/env ruby
require 'json'

my_json = {"1355698800" => 
  [ { "element"       => "action", 
      "table_element" => "actioncomm",
      "table_rowid"   => "id",
      "id"            => "1",
      "type_id"       => nil,
      "type_code"     => "AC_OTH_AUTO",
      "type"          => nil,
      "label" => nil,"date" => nil,"datec" => nil,"datem" => nil,"author" => {"id" => "1"},"usermod" => {},"datep" => 1355702228,"datef" => 1355702228,"dateend" => nil,"durationp" => -1,"fulldayevent" => "0","punctual" => 1,"percentage" => "-1","location" => "","priority" => "0","note" => nil,"usertodo" => {"id" => nil},"userdone" => {"id" => "1"},"societe" => {"id" => "1"},"contact" => {"id" => nil},"fk_project" => nil,"fk_element" => nil,"elementtype" => nil,"icalname" => nil,"icalcolor" => nil,"actions" => [],"error" => nil,"errors" => nil,"canvas" => nil,"lastname" => nil,"firstname" => nil,"name" => nil,"nom" => nil,"civility_id" => nil,"array_options" => [],"libelle" => "Soci\u00e9t\u00e9 DEV_COMPANY ajout\u00e9e dans Dolibarr","date_start_in_calendar" => 1355702228,"date_end_in_calendar" => 1355702228,"ponctuel" => 1}]}
# { :array => [1, 2, 3, { :sample => "hash"} ], :foo => "bar" }
puts JSON.pretty_generate(my_json)
