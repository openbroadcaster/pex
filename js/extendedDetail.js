/*     
    Copyright 2012-2014 OpenBroadcaster, Inc.

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

// media details page
OB.Media.extendedDetailsPage = function(id)
{

  OB.UI.replaceMain('modules/programs/media_extend_detail.html');

  OB.API.post('media', 'get', { 'id': id }, function(data) {
  
    if(data.status==false) { $('#media_details_message').text(OB.t('Media Details','Media not found')); return; }
    var item = data.data;

    OB.API.post('media','get_details',{'id': id}, function(data) {

      var used = data.data;

      $('#media_details_id').text(id);

      $('#media_details_artist').text(item.artist);
      $('#media_details_title').text(item.title);
      $('#media_details_album').text(item.album);
      $('#media_details_year').text(item.year);
      $('#media_details_category').text(OB.t('Media Categories',item.category_name));
      $('#media_details_country').text(OB.t('Media Countries',item.country_name));
      $('#media_details_language').text(OB.t('Media Languages',item.language_name));
      $('#media_details_genre').text(OB.t('Media Genres',item.genre_name));
      $('#media_details_comments').text(item.comments);

      if(item.is_archived==1) $('#media_details_approval').text(OB.t('Media Details','Archived'));
      else if(item.is_approved==1) $('#media_details_approval').text(OB.t('Media Details','Approved'));
      else $('#media_details_approval').text(OB.t('Media Details','Not approved'));

      if(item.is_copyright_owner==1) $('#media_details_copyright').text(OB.t('Common','Yes'));
      else $('#media_details_copyright').text(OB.t('Common','No'));

      if(item.status=='private') $('#media_details_visibility').text(OB.t('Media Details','Private'));
      else $('#media_details_visibility').text(OB.t('Media Details','Public'));

      if(item.dynamic_select==1) $('#media_details_dynamic').text(OB.t('Common','Yes'));
      else $('#media_details_dynamic').text(OB.t('Common','No'));

      $('#media_details_created').text(format_timestamp(item.created));
      $('#media_details_updated').text(format_timestamp(item.updated));

      $('#media_details_uploader').text(item.owner_name);

      // handle 'where used';

      if(used.length==0) $('#media_details_used').append(OB.t('Media Details','Media is not in use'));

      else
      {
        $.each(used,function(index,used_detail) {
          if(used_detail.where=='playlist') $('#media_details_used ul').append('<li>'+htmlspecialchars(OB.t('Media Where Used','playlist'))+': <a href="javascript: OB.Playlist.detailsPage('+used_detail.id+');">'+htmlspecialchars(used_detail.name)+'</a></li>');
          if(used_detail.where=='playlist_dynamic') $('#media_details_used ul').append('<li>*'+htmlspecialchars(OB.t('Media Where Used','playlist_dynamic'))+': <a href="javascript: OB.Playlist.detailsPage('+used_detail.id+');">'+htmlspecialchars(used_detail.name)+'</a></li>');
          if(used_detail.where=='device') $('#media_details_used ul').append('<li>'+htmlspecialchars(OB.t('Media Where Used','device'))+': '+htmlspecialchars(used_detail.name)+'</li>');
          if(used_detail.where=='emergency') $('#media_details_used ul').append('<li>'+htmlspecialchars(OB.t('Media Where Used','emergency'))+': '+htmlspecialchars(used_detail.name)+'</li>');
          if(used_detail.where=='schedule' || used_detail.where=='recurring schedule') $('#media_details_used ul').append('<li>'+htmlspecialchars(OB.t('Media Where Used','schedule'))+': '+htmlspecialchars(used_detail.name)+'</li>');
        });

        $('#media_details_used').append('<p>* '+htmlspecialchars(OB.t('Media Details','Possible Dynamic Selection'))+'</p>');

      }

      $('#media_details_message').html('');

      $('#media_details_table').show();
      $('#media_details_used').show();

      OB.API.post('programs','getx',{'id':id },function(data){
       if(data.status==false) return;

       var metadata = data.data;
       $('#media_details_recLocation').text(metadata['recording_location']);
       $('#media_details_recDate').text(metadata['recording_date']);
       $('#media_details_tracklist').text(metadata['tracklist']);
       $('#media_details_license').text(metadata['license.title']);


       var dhtml = '';
       var logo=0;
       if((metadata['cancon']).indexOf('m') >= 0) {dhtml+=('(M)usic; '); logo+=1;}
       if((metadata['cancon']).indexOf('a') >= 0) {dhtml+=('(A)rtist; '); logo +=2;}
       if((metadata['cancon']).indexOf('p') >= 0) {dhtml+=('(P)erformance; '); logo +=4;}
       if((metadata['cancon']).indexOf('l') >= 0) {dhtml+=('(L)yrics'); logo +=8;}
       $('#media_details_mapl').text(dhtml);
       $('#media_details_mapl_logo').removeClass();
       $('#media_details_mapl_logo').addClass('mapl_'+logo);

       var xhtml = '';
       if((metadata['advisory']).indexOf('l') >= 0) {xhtml+='Explicit Language;\n ';}
       if((metadata['advisory']).indexOf('v') >= 0) {xhtml+='Violence;\n ';}
       if((metadata['advisory']).indexOf('d') >= 0) {xhtml+='Substance Abuse;\n ';}
       if((metadata['advisory']).indexOf('n') >= 0) {xhtml+='Nudity;\n ';}
       if((metadata['advisory']).indexOf('s') >= 0) {xhtml+='Sexual Activity';}
       $('#media_details_advisory').text(xhtml);

       var dhtml = '';
       if((metadata['accessibility']).indexOf('c') >= 0) {dhtml +='Close Captioned;\n'}
       if((metadata['accessibility']).indexOf('s') >= 0) {dhtml +='Sign Language;\n'}
       if((metadata['accessibility']).indexOf('d') >= 0) {dhtml +='Descriptive Video'};
       $('#media_details_access').text(dhtml);

// add our credits
       var credits  = metadata.credits;
       for(var j in credits)
         {
          OB.Media.showCredit(credits[j].media_id,credits[j].role_id,credits[j].role +' : '+ credits[j].name);
         }

      });

    });

  }); 

}

   OB.Media.showCredit = function(media_id,credit_id,credit_text)
   {
      var html = '<div data-id="'+credit_id+'" class="capitalize">'+htmlspecialchars(credit_text)+'</div>';
      $('#media_details_credits').append(html);
   }

