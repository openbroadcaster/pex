<?
/*     
    Copyright 2012-2013 OpenBroadcaster, Inc.

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

class Programs extends OBFController
{

  public function __construct()
  {
    parent::__construct();
    $this->ProgramsModel = $this->load->model('Programs');
  }


  public function get_program()
  {

      $id = $this->data('pid');
      $program = $this->ProgramsModel('get_by_id',$id);
      return array(true,'Program data',$program);
    
  }

  public function get_program_list()
  {
  
    $params['filters'] = $this->data('filters');
    $params['orderby'] = $this->data('orderby');
    $params['orderdesc'] = $this->data('orderdesc');
    $params['limit'] = $this->data('limit');
    $params['offset'] = $this->data('offset');

    if($params['orderby'] == false) $params['orderby'] = 'title';

    $programs = $this->ProgramsModel('get',$params);

    return array(true,"Program List",$programs);


  }

  public function get_all_programs()
  {
    $programs = $this->ProgramsModel('get_all');
    return array(true,"All programs",$programs);
  }

  public function get_placard()
  {
    $id = $this->data('pid');
    $placard = $this->ProgramsModel('get_placard',$id);
    return array(true,"Placard",$placard);
  }

  public function get_credits()
{
   $id = $this->data('pid');
   $credits = $this->ProgramsModel('get_credit_roles',$id);
   return array(true,"Credits",$credits);
}

  public function get_keywords()
{
   $id = $this->data('pid');
   $keywords = $this->ProgramsModel('get_program_keywords',$id);
   return array(true,"Keywords",$keywords);
}

  public function get_tags()
{
   $id = $this->data('pid');
   $tags = $this->ProgramsModel('get_tags',$id);
   return array(true,"Tags",$tags);
}

  public function getx()
{
   $id = $this->data('id');
   $meta = $this->ProgramsModel('get_meta',$id);
   return array(true, "Metadata",$meta);
}

  public function edit()
  {
    $this->user->require_permission('manage_programs');
    $id = trim($this->data('pid'));
    $data['episode_ids'] = $this->data('episode_ids');
    $data['gallery_ids'] = $this->data('gallery_ids');
    $data['credit_roles'] = $this->data('credit_roles');
    $data['keywords'] = $this->data('keywords');
    $data['title'] = $this->data('title');
    $data['producer'] = $this->data('producer');
    $data['summary'] = $this->data('summary');
    $data['link_url'] = $this->data('link_url');
    $data['theme_id'] = $this->data('theme_id');
    $data['country_id'] = $this->data('country_id');
    $data['language_id'] = $this->data('language_id');
    $data['explicit_flag'] = $this->data('content_advisory');
    $data['dynamic_select'] = $this->data('dynamic_select');
    $validation = $this->ProgramsModel('validate',$data,$id);
    if($validation[0]==false) return $validation;
    $this->ProgramsModel('save',$data,$id);
    return array(true,['Programs Manager','Saved Message', $id]);
  }

  public function editx()
  {
//    $this->user->require_permission('create_own_media or manage_media');
    $media = $this->data('media');
    foreach($media as $index=>$item) $this->ProgramsModel('savex',$item);
    return array(true,['Programs Manager','Metadata Save Message']);
  }

  // simple search
  public function program_search()
  {
    $query = $this->data('q');
    $limit = $this->data('l');
    $offset = $this->data('o');
    $sort_by = $this->data('sort_by');
    $sort_dir = $this->data('sort_dir');
    $my = $this->data('my');
    $search_result = $this->ProgramsModel('search',$query,$limit,$offset,$sort_by,$sort_dir,$my);
    return array(true,'Programs',$search_result);
  }

  public function delete()
{
    $this->user->require_permission('manage_programs');
    $ids = $this->data('pid');
    if(empty($ids)) return array(false,'A program ID is required.');
    // If we just have a single PID, make it into an array
    if(!is_array($ids)) $ids = array($ids);
    foreach($ids as $id)
    {
    $program = $this->ProgramsModel('get_by_id',$id);
    if(!$program) return array(false,'One or more programs not found');
    }
    foreach($ids as $id)
    {
    $this->ProgramsModel('delete',$id);
    }
    return array(true,'Programs have been deleted.');
}

  public function get_roles()
  {
   $roles = $this->ProgramsModel('get_roles');
   return array(true,"Roles",$roles);
  }

  public function role_save()
  {
    $this->user->require_permission('manage_programs');
  
    $id = trim($this->data['id']);
    
    $data = array();
    $id = $this->data('id');
    $data['name'] = trim($this->data('name'));
    if($data['name'])
     {
      $save = $this->ProgramsModel('save_role',$data,$id);
      if(!$save) return array(false,'An unknown error occurred while trying to save this role.');
      else return array(true,'Role saved.');
     }
  }
  public function role_delete()
  {
    $this->user->require_permission('manage_programs');
    $id = trim($this->data['id']);
    $delete = $this->ProgramsModel('delete_role',$id);
    
    if($delete) return array(true,'Role deleted.');
    else return array(false,'An unknown error occured while trying to delete the role.');
  }

  public function get_themes()
  {
   $themes = $this->ProgramsModel('get_themes');
   return array(true,"Themes",$themes);
  }

  public function theme_save()
  {
    $this->user->require_permission('manage_programs');
  
    $id = trim($this->data['id']);
    
    $data = array();
    $id = $this->data('id');
    $data['name'] = trim($this->data('name'));
    if($data['name'])
     {
      $save = $this->ProgramsModel('save_theme',$data,$id);
      if(!$save) return array(false,'An unknown error occurred while trying to save this theme.');
      else return array(true,'Theme saved.');
     }
  }

  public function theme_delete()
  {
    $this->user->require_permission('manage_programs');
    $id = trim($this->data['id']);
    $delete = $this->ProgramsModel('delete_theme',$id);
    
    if($delete) return array(true,'Theme deleted.');
    else return array(false,'An unknown error occured while trying to delete the theme.');
  }

  public function get_licenses()
  {
   $licenses = $this->ProgramsModel('get_licenses');
   return array(true,"License List",$licenses);
  }

  public function get_license()
  {
   $id = trim($this->data['id']);
   $license = $this->ProgramsModel('get_media_license',$id);
   return array(true,"License",$license);
  }

  public function license_save()
  {
    $this->user->require_permission('manage_programs');
  
    $id = trim($this->data['id']);
    
    $data = array();
    $id = $this->data('id');
    $data['title'] = trim($this->data('title'));
    $data['shortform'] = trim($this->data('shortform'));
    $data['description'] = trim($this->data('description'));
    if($data['title'])
     {
      $save = $this->ProgramsModel('save_license',$data,$id);
      if(!$save) return array(false,'An unknown error occurred while trying to save this license.');
      else return array(true,'License saved.');
     }
  }

  public function license_delete()
  {
    $this->user->require_permission('manage_programs');
    $id = trim($this->data['id']);
    $delete = $this->ProgramsModel('delete_license',$id);
    
    if($delete) return array(true,'License deleted.');
    else return array(false,'An unknown error occured while trying to delete the license.');
  }
}
