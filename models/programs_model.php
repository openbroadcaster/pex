<?
/*     
    Copyright 2012-2013 OpenBroadcaster, Inc.
    This file is part of OpenBroadcaster Server.
    OpenBroadcaster Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public Lecense as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    OpenBroadcaster Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/>.
*/
class ProgramsModel extends OBFModel
{
  
  public function get_init()  
  {
    $this->db->what('programs.pid','pid');
    $this->db->what('programs.title','title');
    $this->db->what('programs.producer','producer');
    $this->db->what('programs.summary','summary');
    $this->db->what('programs.link_url','link_url');
    $this->db->what('programs.theme_id','theme_id');
    $this->db->what('program_themes.name','theme_name');
    $this->db->what('programs.country_id','country_id');
    $this->db->what('media_countries.name','country_name');
    $this->db->what('programs.language_id','language_id');
    $this->db->what('media_languages.name','language_name');
    $this->db->what('programs.copyright','copyright');
    $this->db->what('programs.owner_id','owner_id');
    $this->db->what('programs.created','created');
    $this->db->what('programs.updated','updated');
    $this->db->what('programs.explicit_flag','explicit_flag');
    $this->db->what('programs.dynamic_select','dynamic_select');
    $this->db->what('users.display_name','owner_name');
    $this->db->leftjoin('program_themes','program_themes.id','programs.theme_id');
    $this->db->leftjoin('media_languages','programs.language_id','media_languages.id');
    $this->db->leftjoin('media_countries','programs.country_id','media_countries.id');
    $this->db->leftjoin('users','programs.owner_id','users.id');
  }

  public function get_by_id($id=false)
  {
    if($id!==false)
   {
    $this('get_init');
    $this->db->where('programs.pid',$id);
    $result = $this->db->get_one('programs'); 
    if($result === false) return array(false,'An unknown error occurred while fetching programs.');
    
      // get our keywords 
      $result['keywords']=array();
      $keywords = $this('get_program_keywords',$id); //keywords
      foreach($keywords as $keyword)
      {
        if($keyword) $result['keywords'][]=$keyword;
      }

      // get our episode ids
      $result['episode_ids']=array();
      $episode_ids = $this('get_episode_ids',$id);
      foreach($episode_ids as $episode_id)
      {
        $this->db->where('id',$episode_id);
        $media=$this->db->get_one('media');
        if($media) $result['episode_ids'][]=$media;
      }

      // get our gallery ids
      $result['gallery_ids']=array();
      $gallery_ids = $this('get_gallery_ids',$id);
      foreach($gallery_ids as $gallery_id)
      {
        $this->db->where('id',$gallery_id);
        $media=$this->db->get_one('media');
        if($media) $result['gallery_ids'][]=$media;
      }
      // get our  credits
      $result['credits']=array();
      $roles = $this('get_credit_roles',$id); //role and name
      foreach($roles as $role)
      {
        $this->db->where('role_id',$role);
        $this->db->where('program_id',$id);
        $credit=$this->db->get_one('programs_credit_roles');
        if($credit) $result['credits'][]=$credit;
      }
   }
   return $result;
  }


  public function get_all()
  {
    return $this->db->get('programs');

  }
  public function get_episode($params)
{
    foreach($params as $name=>$value) $$name=$value;
    $this->db->leftjoin('media_meta','media_meta.id','programs_media_ids.media_id');
    $this->db->where('program_id',$id);
    if($filters){
	foreach($filters as $filter)
   	{
      	$column = $filter['column'];
      	$value = $filter['value'];
      	$operator = (empty($filter['operator']) ? '=' : $filter['operator']);
      	$this->db->where($column,$value,$operator);
	}
    }
    $this->db->orderby('programs_media_ids.episode');
    $episode_ids = $this->db->get('programs_media_ids');
    $media_ids = array();
    
    foreach($episode_ids as $episode_id) $media_ids[]=$episode_id['recording_location'];

    return $media_ids;
}
  public function get($params)
  {

    foreach($params as $name=>$value) $$name=$value;

    if($filters) foreach($filters as $filter)
    {
      $column = $filter['column'];
      $value = $filter['value'];
      $operator = (empty($filter['operator']) ? '=' : $filter['operator']);
      $this->db->where($column,$value,$operator);
    }
    if($orderby) $this->db->orderby($orderby,(!empty($orderdesc) ? 'desc' : 'asc'));
    if($limit) $this->db->limit($limit);
    if($offset) $this->db->offset($offset);
    $result = $this->db->get('programs');
    if($result === false) return array(false,'An unknown error has occurred while fetching programs.');
    foreach($result as $index=>$row)
    {
      // get our keywords 
      $result[$index]['keywords']=array();
      $keywords = $this('get_program_keywords',$row['pid']); //keywords
      foreach($keywords as $keyword)
      {
        if($keyword) $result[$index]['keywords'][]=$keyword;
      }

      // get our episode ids
      $result[$index]['episode_ids']=array();
      $episode_ids = $this('get_episode_ids',$row['pid']);
      foreach($episode_ids as $episode_id)
      {
        $this->db->where('id',$episode_id);
        $media=$this->db->get_one('media');
        if($media) $result[$index]['episode_ids'][]=$media;
      }

      // get our gallery ids
      $result[$index]['gallery_ids']=array();
      $gallery_ids = $this('get_gallery_ids',$row['pid']);
      foreach($gallery_ids as $gallery_id)
      {
        $this->db->where('id',$gallery_id);
        $media=$this->db->get_one('media');
        if($media) $result[$index]['gallery_ids'][]=$media;
      }

      // get our  credits
      $result[$index]['credits']=array();
      $roles = $this('get_credit_roles',$row['pid']); //role and name
      foreach($roles as $role)
      {
        $this->db->where('role_id',$role);
        $this->db->where('program_id',$row['pid']);
        $credit = $this->db->get_one('programs_credit_roles');
        if($credit) $result[$index]['credits'][]=$credit;
      }

    }
    return $result;
  }

  public function get_tags()
  {
   $this->db->what('tag');
   $tagwords = $this->db->get('program_keywords');
   $tags = array();
   foreach($tagwords as $tag) $tags[]=$tag['tag'];
   return array_unique($tags);
  }
  public function get_program_keywords($id)
  {
    $this->db->where('program_id',$id);
    $tags = $this->db->get('program_keywords');
    $keywords = array();
    
    foreach($tags as $tag) $keywords[]=$tag['tag'];
    return $keywords;
  }

  public function get_episode_ids($id)
  {
    $this->db->where('program_id',$id);
    $this->db->orderby('episode');
    $episode_ids = $this->db->get('programs_media_ids');
    $media_ids = array();
    
    foreach($episode_ids as $episode_id) $media_ids[]=$episode_id['media_id'];
    return $media_ids;
  }

  public function get_gallery_ids($id)
  {
    $this->db->where('program_id',$id);
    $gallery_ids = $this->db->get('gallery_media_ids');
    $media_ids = array();
    
    foreach($gallery_ids as $gallery_id) $media_ids[]=$gallery_id['media_id'];
    return $media_ids;
  }

  public function get_credit_roles($id)
  {
    $this->db->where('program_id',$id);
    $roles = $this->db->get('programs_credit_roles');
    $credits = array();
    
    foreach($roles as $role) $credits[]=$role['role_id'];
    return $credits;
  }


  public function get_roles()
  {
  $this->db->orderby('name');
  $credits=$this->db->get('credit_roles');
  $roles = array();
  foreach($credits as $role) $roles[]=$role;
  return $roles; 
  }

  public function get_themes()
  {
  $this->db->orderby('name');
  $topics=$this->db->get('program_themes');
  $themes = array();
  foreach($topics as $theme) $themes[]=$theme;
  return $themes; 
  }

  public function get_media_license($id)
  {
   $this->db->where('media_meta.id',$id);
   $this->db->what('license_attributes.title');
   $this->db->leftjoin('license_attributes','license_attributes.id','media_meta.license');
   $license=$this->db->get('media_meta');
   return $license;
  }

  public function get_licenses()
  {
  $attributes=$this->db->get('license_attributes');
  $licenses = array();
  foreach($attributes as $license) $licenses[]=$license;
  return $licenses; 
  }

  public function save_role($data,$id=false)
  {
    if(empty($id))
    {
     return $this->db->insert('credit_roles',$data);
    } 
    else
    {
     if(!$this->db->id_exists('credit_roles',$id)) return false;
     $this->db->where('id',$id);
     return $this->db->update('credit_roles',$data);
    }
  }

  public function delete_role($id)
  {
   $this->db->where('id',$id);
   $delete = $this->db->delete('credit_roles',$id);

   return $delete;
  }

  public function save_theme($data,$id=false)
  {
    if(empty($id))
    {
     return $this->db->insert('program_themes',$data);
    } 
    else
    {
     if(!$this->db->id_exists('program_themes',$id)) return false;
     $this->db->where('id',$id);
     return $this->db->update('program_themes',$data);
    }
  }

  public function delete_theme($id)
  {
   $this->db->where('id',$id);
   $delete = $this->db->delete('program_themes',$id);

   return $delete;
  }

  public function save_license($data,$id=false)
  {
    if(empty($id))
    {
     return $this->db->insert('license_attributes',$data);
    } 
    else
    {
     if(!$this->db->id_exists('license_attributes',$id)) return false;
     $this->db->where('id',$id);
     return $this->db->update('license_attributes',$data);
    }
  }

  public function delete_license($id)
  {
   $this->db->where('id',$id);
   $delete = $this->db->delete('license_attributes',$id);

   return $delete;
  }

  public function search($query,$limit,$offset,$sort_by,$sort_dir,$my=false)
  {
    $where_strings = array();
    if($query!=='' && $query!==false && $query!==null) $where_strings[] = '(title LIKE "%'.$this->db->escape($query).'%" OR summary LIKE "%'.$this->db->escape($query).'%")';
    // if(!$this->user->check_permission('manage_programs')) $where_strings[] = '(status = "public" or owner_id = "'.$this->db->escape($this->user->param('id')).'")';
    // limit results to those owned by the presently logged in user.
    if($my) $where_strings[]='owner_id = "'.$this->db->escape($this->user->param('id')).'"';
    if(count($where_strings)>0) $this->db->where_string(implode(' AND ',$where_strings));

    if(!empty($offset)) $this->db->offset($offset);
    if(!empty($limit)) $this->db->limit($limit);
    // otherwise, if posted sort by data is valid, use that...
    if( ($sort_dir =='asc' || $sort_dir == 'desc') && array_search($sort_by, array('title','summary','updated'))!==false )
    {
      $this->db->orderby($sort_by,$sort_dir);
    }
    // otherwise, show the most recently updated first
    else $this->db->orderby('updated','desc');

    $programs = $this->db->get('programs');
    return array('num_results'=>$this->db->found_rows(),'programs'=>$programs);
  }

  public function pid_exists($id)
  {
    $this->db->where('pid',$id);
    $test = $this->db->get_one('programs');
    if($test) return true;
    else return false;
  }

 public function validate($data,$id=false)

  {
    $error = false;

    if(empty($data['title'])) $error = 'A program title is required.';

    elseif(isset($data['link_url']) && $data['link_url']!='' && !preg_match('|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i', $data['link_url'])) $error = 'The link URL is not valid.  Only HTTP(s) is supported.';

    elseif($id && !$this('pid_exists',$id)) $error = 'The program you attempted to edit does not exist.';

   // validate select fields
    if(!empty($data['theme_id']) && !$this->db->id_exists('program_themes',$data['theme_id'])) return array(false,$data['local_id'],'Theme Not Valid');



    // verify episode IDs.

    if(is_array($data['episode_ids']) && !$error) 
    {
      foreach($data['episode_ids'] as $episode_id) 
      {
        $this->db->where('id',$episode_id);
        $episode_info = $this->db->get_one('media');
        if(!$episode_info) { $error = 'An episode you have selected no longer exists.'; break; }
        if($episode_info['is_archived']==1 || $episode_info['is_approved']==0) { $error = 'Episodes may be approved media only.'; break; }

      }
    }

    // verify gallery IDs.

    if(is_array($data['gallery_ids']) && !$error) 
    {
      foreach($data['gallery_ids'] as $gallery_id) 
      {
        $this->db->where('id',$gallery_id);
        $gallery_info = $this->db->get_one('media');
        if(!$gallery_info) { $error = 'An image you have selected no longer exists.'; break; }
        if($gallery_info['is_archived']==1 || $gallery_info['is_approved']==0) { $error = 'Program placards may be approved media only.'; break; }
      }
    }

    if($error) return array(false,$error);
    return array(true,'');
  }


  public function save($data,$id=false)

  {
    $keywords = $data['keywords'];
    unset($data['keywords']);
    $episode_ids = $data['episode_ids'];

    unset($data['episode_ids']);

    $gallery_ids = $data['gallery_ids'];

    unset($data['gallery_ids']);

   $credit_roles = $data['credit_roles'];

   unset($data['credit_roles']);
  
    if(!$id)

    {

      $data['owner_id'] = $this->user->param('id');
      $data['created'] = time();

      $id = $this->db->insert('programs',$data);

      if(!$id) return false;

    }

    else

    {
      // get original program

      $this->db->where('pid',$id);

      $original_program = $this->db->get_one('programs');

      $data['updated'] = time();
 
      $this->db->where('pid',$id);

      $update = $this->db->update('programs',$data);

      if(!$update) return false;
    }

    $keyword_data['program_id']=$id;

    if($keywords!==false)

    {
      // delete all keywords for this program.

      $this->db->where('program_id',$id);

      $this->db->delete('program_keywords');

      // add all the keywords 

      if(is_array($keywords)) foreach($keywords as $keyword)

     {
       $keyword_data['tag']=$keyword;

       $this->db->insert('program_keywords',$keyword_data);
     }
    }


    $credit_data['program_id']=$id;

    if($credit_roles!==false)

    {
      // delete all credits for this program.

      $this->db->where('program_id',$id);

      $this->db->delete('programs_credit_roles');

      // add all the credits

      if(is_array($credit_roles)) foreach($credit_roles as $credit_role)

     {
       $credit = explode(":",$credit_role); 
       $credit_data['role_id']=$credit[0];
       $credit_data['role']=$credit[1];
       $credit_data['name']=$credit[2];

       $this->db->insert('programs_credit_roles',$credit_data);
     }
    }

    $gallery_id_data['program_id']=$id;

    if($gallery_ids!==false)

    {
      // delete all gallery IDs for this program.

      $this->db->where('program_id',$id);

      $this->db->delete('gallery_media_ids');

      // add all the episode IDs we have.

      if(is_array($gallery_ids)) foreach($gallery_ids as $gallery_id) 

      { 

        $gallery_id_data['media_id']=$gallery_id;

        $this->db->insert('gallery_media_ids',$gallery_id_data);

      }
    }

    $episode_id_data['program_id']=$id;

    if($episode_ids!==false)

    {
      // delete all episode IDs for this program.

      $this->db->where('program_id',$id);

      $this->db->delete('programs_media_ids');

      // add all the episode IDs we have.

      if(is_array($episode_ids)) foreach($episode_ids as $episode_id) 

      { 
        $i++;
        $episode_id_data['media_id']=$episode_id;
        $episode_id_data['episode'] = $i;

        $this->db->insert('programs_media_ids',$episode_id_data);

      }
    }


    return true;

  }

   public function delete($id)
{
   $this->db->where('program_id',$id);
   $this->db->delete('program_credit_roles');

   $this->db->where('pid',$id);
   $this->db->delete('programs');
}

public function savex($item)
{    

  $media_credits = $item['credits_array'];
  unset($item['credits_array']);
  $id = $item['id'];

  $this->db->where('id',$id);
  $this->db->delete('media_meta');

  $this->db->insert('media_meta',$item);

    $media_data['media_id']=$id;

    if($media_credits!==false)

    {
      // delete all credits for this media.

      $this->db->where('media_id',$id);

      $this->db->delete('media_credit_roles');

      // add all the credits

      if(is_array($media_credits)) foreach($media_credits as $media_role)

     {
       $credit = explode(":",$media_role);
       $media_data['role_id']=$credit[0];
       $media_data['role']=$credit[1];
       $media_data['name']=$credit[2];

       $this->db->insert('media_credit_roles',$media_data);
     }
    }
   }
  public function get_media_roles($id)
  {
    $this->db->where('media_id',$id);
    $roles = $this->db->get('media_credit_roles');
    $credits = array();

    foreach($roles as $role) $credits[]=$role['role_id'];
    return $credits;
  }


   public function get_meta($id)
   {
   $this->db->what('media_meta.id','id');
   $this->db->what('media_meta.recording_location','recording_location');
   $this->db->what('media_meta.recording_date','recording_date');
   $this->db->what('media_meta.tracklist','tracklist');
   $this->db->what('media_meta.cancon','cancon');
   $this->db->what('media_meta.advisory','advisory');
   $this->db->what('media_meta.accessibility','accessibility');
    $this->db->what('license_attributes.title','license.title');
    $this->db->what('license_attributes.id','license.id');
   $this->db->leftjoin('license_attributes','media_meta.license','license_attributes.id');
   $this->db->where('media_meta.id',$id);
   $result = $this->db->get_one('media_meta');

    // get our  credits
    $result['credits']=array();
    $roles = $this('get_media_roles',$id); //role and name
    foreach($roles as $role)
     {
      $this->db->where('role_id',$role);
      $this->db->where('media_id',$id);
      $credit = $this->db->get_one('media_credit_roles');
      if($credit) $result['credits'][]=$credit;
     }
   return $result;
   }
}
