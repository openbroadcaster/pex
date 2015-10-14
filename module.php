<?
/*     
    Copyright 2012 OpenBroadcaster, Inc.

    This file is part of OpenBroadcaster Server.

    OpenBroadcaster Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenBroadcaster Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/>.
*/

class ProgramsModule extends OBFModule
{

        public $name = 'Program Manager';
        public $description = 'Use OB for managing programs';

        public function callbacks()
        {

        }


        public function install()
        {

        $this->db->query('CREATE TABLE IF NOT EXISTS `programs` (
          `pid` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `title` varchar(255) NOT NULL,
          `producer` varchar(255) NOT NULL,
          `summary` text NOT NULL,
          `theme_id` int(11) NOT NULL,
          `country_id` int(11) DEFAULT NULL,
          `language_id` int(11) DEFAULT NULL,
          `copyright` varchar(255) NOT NULL,
          `link_url` varchar(255) NOT NULL,
          `owner_id` int(11) NOT NULL DEFAULT 0,
          `created` int(11) unsigned NOT NULL,
          `updated` int(10) unsigned NOT NULL,
          `explicit_flag` tinyint(1) NOT NULL DEFAULT  0,
          `dynamic_select` tinyint(1) NOT NULL DEFAULT 1,
          `latest_media` int(11) DEFAULT NULL,
          `program_duration` decimal(10,3) DEFAULT NULL,
        PRIMARY KEY (`pid`),
        KEY `module_program_manager_ibfk_1` (`producer`),
        KEY `module_program_manager_ibfk_2` (`title`)
                ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `programs_media_ids` (
  	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  	`program_id` int(10) unsigned NOT NULL,
  	`media_id` int(10) unsigned NOT NULL,
  	`episode` int(4) unsigned NOT NULL,
  	PRIMARY KEY (`id`),
  	KEY `program_id` (`program_id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `gallery_media_ids` (
  	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  	`program_id` int(10) unsigned NOT NULL,
  	`media_id` int(10) unsigned NOT NULL,
  	PRIMARY KEY (`id`),
  	KEY `gallery_program_id` (`program_id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `license_attributes` (
  	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  	`title` varchar(64) NOT NULL,
  	`shortform` varchar(16) NOT NULL,
  	`description` varchar(254) NOT NULL,
  	PRIMARY KEY (`id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `credit_roles` (
  	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  	`name` varchar(255) NOT NULL,
  	PRIMARY KEY (`id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `program_themes` (
  	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  	`name` varchar(255) NOT NULL,
  	PRIMARY KEY (`id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;'
	);


       $this->db->query('CREATE TABLE IF NOT EXISTS `program_keywords` (
  	`program_id` int(11) unsigned NOT NULL,
  	`tag` varchar(255) NOT NULL,
  	PRIMARY KEY (`program_id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 ;'
	);

        //View permission

       $this->db->query('CREATE TABLE IF NOT EXISTS `programs_credit_roles` (
  	`program_id` int(11) unsigned NOT NULL,
  	`role_id` int(10) unsigned NOT NULL,
  	`role` varchar(64) NOT NULL,
  	`name` varchar(64) NOT NULL,
  	KEY `program_id` (`program_id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `media_credit_roles` (
  	`media_id` int(11) unsigned NOT NULL,
  	`role_id` int(10) unsigned NOT NULL,
  	`role` varchar(64) NOT NULL,
  	`name` varchar(64) NOT NULL,
  	KEY `media_id` (`media_id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 ;'
	);

       $this->db->query('CREATE TABLE IF NOT EXISTS `media_meta` (
  	`id` int(11) unsigned NOT NULL,
  	`recording_location` varchar(255),
  	`recording_date` date,
  	`tracklist` text,
  	`license` varchar(64),
  	`cancon` char(4),
  	`advisory` char(5),
  	`accessibility` char(3),
        `placard_id` varchar(16), 
  	KEY `meta_id` (`id`)
  	) ENGINE=MyISAM DEFAULT CHARSET=latin1 ;'
	);

        //View permission
        $data = array();
        $data['name'] = 'view_programs';
        $data['description'] = 'view programs';
        $data['category'] = 'media';

        $this->db->insert('users_permissions',$data);

        //Edit permission
        $data = array();
        $data['name'] = 'manage_programs';
        $data['description'] = 'add/edit/delete programs';
        $data['category'] = 'media';

        $this->db->insert('users_permissions',$data);

//populate themes
        $data=array();
        $themes = array('Strange Noises','Education','Arts, Culture, and Entertainment','Crime, Law and Justice','Economy, Business and Finance','Food','Health','Human Interest','Lifestyle and Leisure','Politics','Religion and Belief','Science and Technology','Society','Sport','Weather','Indigenous First Peoples','Conflicts, War and Peace','Disaster and Accident','Environment','Music');
        foreach($themes as $index=>$theme)
	{ $data['name']=$theme;
           $this->db->insert('program_themes', $data);        
	} 
/*
//populate category

        $key=array();
        $categories = array('Experimental','Jazz and Blues','Non-classical religous','World Beat and International','Folk and Folk-oriented','Concert','Easy-Listening','Spoken Word','Pop, Rock and Dance','Acoustic','Live Performance','Advertising','Production');
        foreach($categories as $index=>$category)
	{ $key['name']=$category;
           $this->db->insert('media_categories', $key);        
	} 
*/ 
//populate roles 
        $key=array();
        $roles=array('host','producer','label','guest','sponsor','station','executive producer','composer'); 
        foreach($roles as $index=>$role)
        { $key['name']=$role;
          $this->db->insert('credit_roles',$key);
        }

        return true;
       }

        public function uninstall()
        {
        $this->db->where('name','view_programs');
        $this->db->delete('users_permissions');
        $this->db->where('name','manage_programs');
        $this->db->delete('users_permissions');
/*
        $this->db->query('DROP TABLE `program_keywords`;');
        $this->db->query('DROP TABLE `program_themes`;');
     //   $this->db->query('DROP TABLE `license_attributes`;');
        $this->db->query('DROP TABLE `programs_credit_roles`;');
        $this->db->query('DROP TABLE `media_credit_roles`;');
        $this->db->query('DROP TABLE `credit_roles`;');
        $this->db->query('DROP TABLE `programs_media_ids`;');
        $this->db->query('DROP TABLE `gallery_media_ids`;');
        $this->db->query('DROP TABLE `media_meta`;');
        $this->db->query('DROP TABLE `programs`;');
*/
      return true;

       }
}
