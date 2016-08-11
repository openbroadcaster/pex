---
layout: page
title: "Installation"
category: tut
date: 2016-08-09 11:44:03
---

## Installing the Module

Download or clone the PEX archive from GIT into  server\_root/modules/programs, where server\_root is the installation location of OpenBroadcaster Server.

Admin users can access the Admin->Modules menu to install the Program Manager module from the list of available modules.

Installation will:

1. Add tables to the database:
 - program_keywords
 - program_themes
 - license_attributes
 - programs_credit_roles
 - media_credit_roles
 - credit_roles
 - programs_media_ids
 - gallery_media_ids
 - media_meta
 - programs


1. Add user permissions:
 - view programs
 - manage (add/edit/delete) programs

1. Add a __Program Manager__ item to the Media menu

1. Add __Program__ tab to the Sidebar 

1. Insert default values for __Role__ and __Theme__ into the database

   _Roles_

   - host
   - producer
   - label
   - guest
   - sponsor
   - station
   - executive producer
   - composer

   _Theme_

   - Strange Noises
   - Education
   - Arts, Culture, and Entertainment
   - Crime, Law and Justice
   - Economy, Business and Finance
   - Food
   - Health
   - Human Interest
   - Lifestyle and Leisure
   - Politics
   - Religion and Belief
   - Science and Technology
   - Society
   - Sport
   - Weather
   - Indigenous First Peoples
   - Conflicts, War and Peace
   - Disaster and Accident
   - Environment
   - Music


## Uninstalling the Module

To disable the Program Manager, access the Admin->Modules menu to uninstall the module. Saved metadata will be lost, however the local module.php file may edited to preserve local data.




