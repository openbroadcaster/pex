/*
    Copyright 2015 OpenBroadcaster, Inc.

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
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/></a>.
*/

OBModules.Programs.detailsPage = function(pid)
{

  OB.UI.replaceMain('modules/programs/details.html');
  OBModules.Programs.setDefault(pid);
  OB.API.post('programs', 'get_program', { 'pid': pid }, function(data) {
  
    if(data.status==false) { $('#program_details_message').text(OB.t('Program Details','Program not found')); return; }
    var progdata = data.data;
      $('#program_details').attr('data-pid',pid);

      $('#program_title').text(progdata.title);
      $('#program_details_summary').text(progdata.summary);

      $('#program_details_theme').text(progdata.theme_name);
      $('#program_details_producer').text(progdata.producer);
      $('#program_details_origin').text(progdata.country_name);
      $('#program_details_language').text(progdata.language_name);
      var content_advisory='no';
      if(progdata.explicit_flag==1) (content_advisory = 'yes');
      $('#program_details_advisory').text(content_advisory);
//      $('#program_details_owner').text(progdata.owner_name);
      $('#program_details_keywords').text(progdata.keywords);
      $('#program_details_keywords').addClass('capitalize');
      //handle program credits

        var credits = progdata.credits;
        for (var j in credits)
        {
        OBModules.Programs.detailsAddCredit(progdata.pid, credits[j].role_id, credits[j].role + ' : ' + credits[j].name);
        }

      // handle episode items
      if(typeof(progdata.episode_ids)=='undefined' || progdata.episode_ids.length==0) $('#program_details_episodes_table').replaceWith(htmlspecialchars(OB.t('Program Details','No episodes found')));

      else { 
      if(progdata.episode_ids.length==1) {epitext='episode found'} else {epitext='episodes found'};
      $('#episode_count').text(progdata.episode_ids.length +' '+epitext);
        $.each(progdata.episode_ids, function(index,episode) {

          if(episode.type=='playlist') 
          {
          }
          else 
          {
           var episode_date=episode.recording_date;
           var def_placard = OBModules.Programs.defaultPlacard;
           if(episode.placard_id==false || !episode.placard_id)
           {
           var placard_src ='<img height="50px;" src="preview.php?id='+def_placard+'&dl=0&mode=0"/>';
           } else {
	    var placard_src = '<img height="50px;" src="preview.php?id='+episode.placard_id+'&dl=0&mode=0"/>';
           }
           var dhtml = '<tr><td>'+placard_src+'</td><td>'+htmlspecialchars(episode.title)+'</td><td>'+episode.recording_date+'</td><td>'+secsToTime(episode.duration,"hms")+'</td>';
           dhtml +='<td ><button class="add episode_expand_link" id="episode_'+episode.id+'_expand_link" onclick="OBModules.Programs.episodeDetails('+episode.id+')">Expand</button></td>';
           dhtml +='<td><a href="javascript:OB.Sidebar.playerPlay(\'program\',\'audio\','+episode.id+')">Preview</a></td><td><a href="javascript:OB.Media.download('+episode.id+')">Download</a></td></tr>';
	   dhtml +='<tr class="episode_details hidden" id="episode_'+episode.id+'_details"><td style="border-left:0px;"></td><td colspan="6">';
           var $html = OBModules.Programs.episodeForm(episode.id);
           dhtml += $html;
           dhtml += '</td></tr>/';
	   $('#program_details_episodes_table').append(dhtml);
          }
    	OBModules.Programs.episodeDetailsProcess(episode);

         $('#episode_'+episode.id+'_details #episode_title').text(episode.title);
         $('#episode_'+episode.id+'_details #media_details_tracklist').text(episode.tracklist);
	//handle episode credits
	 var credits = episode.credits;
 	for (var j in credits)
   	{
    	OBModules.Programs.episodeAddCredit(episode.id, credits[j].role_id, credits[j].role + ' : ' + credits[j].name);
    	}
     }); //end of episode list

    }

      $('#program_details_message').html('');
      $('#program_details').show();

    });
}

OBModules.Programs.addeditPreview = function(id)
{
if(OB.Settings.permissions.indexOf('manage_programs')!=-1)
   {
    OB.Media.extendedDetailsPage(id);
    //OB.Media.editPage(episode);	
   } 
     else
   {
    OB.Media.extendedDetailsPage(id);
   }
}

OBModules.Programs.detailsAddCredit = function(program_id,credit_id,credit_text)
{
    if($('#program_details[data-pid='+program_id+'] #program_details_credits').children('[data-id="'+credit_id+'"]').length<1)
    {
      var html = '<div data-id="'+credit_id+'" class="capitalize">'+htmlspecialchars(credit_text)+'</div>';
      $('#program_details[data-pid='+program_id+'] #program_details_credits').append(html);  
    }
}

OBModules.Programs.episodeAddCredit = function(episode_id,credit_id,credit_text)
{
      var html = '<div data-id="'+credit_id+'" class="capitalize">'+htmlspecialchars(credit_text)+'</div>';
      $('#episode_'+episode_id+'_details #media_details_credits').append(html);  
}

OBModules.Programs.episodeForm = function(episode_id){

  var $html = $(OB.UI.getHTML('modules/programs/episode_detail.html'));
  $html.find('.episode_details_table').attr('data-id',episode_id);
  return $html.html();
}

OBModules.Programs.episodeDetails = function(id)
{
  var expand_text = OB.t('Common', 'Expand');
  var collapse_text = OB.t('Common', 'Collapse');

  if($('#episode_'+id+'_details').is(':visible')==true)
  {
    $('#episode_'+id+'_details').hide();
    $('#episode_'+id+'_expand_link').html(expand_text);
  }
  else
  {
    $('#episode_'+id+'_details').show();
    $('#episode_'+id+'_expand_link').html(collapse_text);
  }
  $('#program_details_episodes_table .episode_details').not('#episode_'+id+'_details').hide(); // only allow one program 'expanded' at a time.
  $('#program_details_episodes_table .episode_expand_link').not('#episode_'+id+'_expand_link').html(expand_text);
}

OBModules.Programs.episodeDetailsProcess = function(data)
{
 var $form=$('#episode_details_table[data-id='+data.id+']');
}
