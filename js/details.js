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
      $('#program_details_owner').text(progdata.owner_name);
      $('#program_details_keywords').text(progdata.keywords);
      $('#program_details_keywords').addClass('capitalize');

      // handle episode items
      if(typeof(progdata.episode_ids)=='undefined' || progdata.episode_ids.length==0) $('#program_details_episodes_table').replaceWith(htmlspecialchars(OB.t('Program Details','No episodes found')));

      else { 

        $.each(progdata.episode_ids, function(index,episode) {

          if(episode.type=='playlist') 
          {
          }
          else 
          {
           var episode_date=episode.recording_date;
	   $('#program_details_episodes_table').append('<tr><td>'+htmlspecialchars(episode.title)+'</td><td>'+episode_date+'</td><td>'+secsToTime(episode.duration,"hms")+'</td><td><a href="javascript:OB.Media.extendedDetailsPage('+episode.id+')">Details</a></td><td><a href="javascript:OB.Sidebar.playerPlay(\'program\',\'audio\','+episode.id+')">Preview</a></td></tr>');
          }
	//handle credits
 var credits  = progdata['credits'];
   for(var j in credits)
    {
     OBModules.Programs.detailsAddCredit(progdata['pid'],credits[j].role_id,credits[j].role+' : '+credits[j].name);
    }

        });
      }

      $('#program_details_message').html('');
      $('#program_details').show();

    });
}

OBModules.Programs.detailsAddCredit = function(program_id,credit_id,credit_text)
{
    if($('#program_details[data-pid='+program_id+'] #program_details_credits').children('[data-id="'+credit_id+'"]').length<1)
    {
      var html = '<div data-id="'+credit_id+'" class="capitalize">'+htmlspecialchars(credit_text)+'</div>';
      $('#program_details[data-pid='+program_id+'] #program_details_credits').append(html);  
    }
}

