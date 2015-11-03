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

OBModules.Programs.assembleTracklist = function(program_id,playlist_id,playlist_text)
{
 OB.API.post('programs','get_program',{'pid':program_id},function(progdata){
      OB.UI.openModalWindow('modules/programs/selection.html');
      $('#pod-id').text(program_id);
      $('#pod-series').text(progdata.data.title);
      $('#pod-artist').text(progdata.data.producer);
      $('#pod-comments').text('Created by Openbroadcaster Podcast Assembler on '+dateFormat(Date.now()));
      $('#pod-comments').append('<br />');

  OB.API.post('playlist','get',{'id': playlist_id},function(response){
        playlist_items = response.data.items;
        $('#pod-title').text(response.data.name+' '+dateFormat(Date.now(),"isoDate"));
        total_duration = 0.00;
        el = '';
        queue = new Array();
        for(var j in playlist_items) 
	{
         if(playlist_items[j]['type'] != 'dynamic' && playlist_items[j]['type'] != 'station_id')
	{
          queue_item=new Array();
          queue_item.push('media');
          queue_item.push(playlist_items[j]['id']);
          queue_item.push(playlist_items[j]['artist']+'-'+playlist_items[j]['title']+' : '+secsToTime(playlist_items[j]['duration']));
          queue.push(queue_item);
        total_duration = +total_duration + +playlist_items[j]['duration'];
	} else if(playlist_items[j]['type'] != 'station_id')
	{ 
        total_duration = +total_duration + +playlist_items[j]['dynamic_duration'];
        queue_item = new Array();
        queue_item.push('dynamic');
        queue_item.push(playlist_items[j]['dynamic_query']);
        queue_item.push(playlist_items[j]['dynamic_num_items']);
        queue.push(queue_item);

	}
	}
      var selection_duration = secsToTime(total_duration);
   $('#pod-duration').text(selection_duration); 
        for(var j in queue)
        {
        if(queue[j][0]=='dynamic'){
          OBModules.Programs.getSelection(queue[j][1],queue[j][2]);
         } else {
          OBModules.Programs.getTrack(queue[j][1],queue[j][2]);
         }
        }
//       setTimeout(function(){OB.UI.closeModalWindow()},12000);
     });
  });
 }

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

OBModules.Programs.getSelection = function(q,n) {
      if(!n) var $num_items=1; else var $num_items=n;
      var $query=q;
      var $media_ids = new Array();
      OB.API.post('programs','get_dynamic_selections',{'q': $query,'n': $num_items},function(selection){
       var dyn_parts=selection.data; 
       shuffle(dyn_parts);
       for(var k = 0; k< $num_items; k++)
        {
         tracktime = secsToTime(dyn_parts[k].duration);
         OBModules.Programs.getTrack(dyn_parts[k].id,dyn_parts[k].artist+'-'+dyn_parts[k].title +' : '+tracktime); 
        }
     });
}

OBModules.Programs.getTrack = function(id,title)
{
   OB.API.post('media','get',{'id':id},function(results){
    $media = results.data;
    if($media.type=='audio')
    {
         if($media.comments!='') $('#pod-comments').append($media.comments+'<br />'); 
    	$media_location ='/'+$media['file_location'][0]+'/'+$media['file_location'][1]+'/';
    	$media_file = $media_location+$media['filename'];
//just using page to stash values, should go straight into array
	$('#filequeue').append('<li>'+$media_file+'</li>');
        $('#showparts').append('<li>'+title+'</li>'); 

   OB.API.post('programs','getx',{'id': id},function(meta) {
         if(meta.data)
         {
          tracks = meta.data.tracklist;
         if(tracks !='')  $('#showparts').append('<div class="padl">Tracks: <ul style="display:inline-block;">'+ tracks + '</ul><br /></div>');
         
          credits = meta.data.credits;
          $('#showparts').append('<div class="padl">Credits:<ul>');
          for(var k in credits)
           {
            $('#showparts').append('<ul>'+credits[k].role+':'+credits[k].name+'</ul>');
           }
          $('#showparts').append('</div></ul>');
         }
      OB.UI.widgetHTML($('#pod_details'));
    });
   }
  });
}
  OBModules.Programs.buildPodcast = function()
  {
        var $fileq = new Array();
        $('#filequeue li').each(function(index){
	// build an array of input files
        $fileq.push(this.innerHTML);
       }); 
    OB.API.post('programs','build_podcast',{'filename':$fileq},function(status){
       if(!status.status) 
	   { alert('Assembly failed. Check rate and format'); }
	else {

        var media_array = new Array();
        var item = new Object();
        item.local_id = '1';
	item.file_id = status.data.id.toString();
	item.file_key = status.data.key;

        var file_info = new Array();
        file_info['file_key']= status.data.key;
        file_info['file_id'] = status.data.id.toString();
        file_info['format'] = 'wav';
        file_info['type'] = 'audio';
        file_info['duration'] = parseFloat(status.data.pod[0]);
        item.file_info = file_info;

        item.title = $('#pod-title').text();
        item.album = $('#pod-series').text();
        item.artist = $('#pod-artist').text();
        item.comments = $('#pod-comments').text();
        item.category_id = '60';
	item.genre_id = '1113';
        item.status = 'private';
        item.is_copyright_owner = '1';
        item.is_approved = '1';
        item.dynamic_select = '1';
        media_array.push(item);

      OB.API.post('media','edit',{ 'media': media_array }, function(data) { 

    	// one or more validation errors.
    	if(data.status==false)
    	{
      	  var validation_errors = data.data;
      	  for(var i in validation_errors)
      	  {
            $('#pod_assembler_message').obWidget('error',OB.t('Assemble Podcast',validation_errors[i][2]));
          }
    	}
       // update/new complete, no errors.
        else
        {
	// build a comma seperated list of input files
	   var loc_id = data.data;
           OBModules.Programs.detailsAddMediaId($('#pod-id').text(),loc_id,$('#pod-title').text());
      	   OB.UI.widgetHTML($('#pod_assembler_message'));
      	   OB.Sidebar.mediaSearch(); // reload our sidebar media search - maybe it needs updating.
      	   $('#pod_details').html($('#showparts'));
           $('#build_file').hide();
      	   $('#pod_assembler_message').obWidget('success',['Program Manager','Podcast Created']);
           $('#podcast_exit_button').text('Close');

//update extended metadata 
 var extended_array = new Array();
 var meta = new Object();
 var tracklist = '';
        $('#showparts li').each(function(index){
        // build an array of input files
        tracklist += this.innerHTML + '\n';
       });
 meta.id = loc_id;
 meta.tracklist = tracklist;
 meta.recording_date = dateFormat(Date.now(),"isoDate"); 
 extended_array.push(meta);
  OB.API.post('programs','editx',{ 'media': extended_array }, function(datax) { 

    // one or more validation errors.
    if(datax.status==false)
    {
      var validation_errors = datax.data;

      for(var i in validation_errors)
      {
        $('#media_addedit_'+validation_errors[i][1]).find('.addedit_form_message').obWidget('error',OB.t('Edit Media Form',validation_errors[i][2]));
      }
    }
    // update/new complete, no errors.
    else
    {
      $('#media_top_message').obWidget('success',['Edit Media Form','Extended Media Saved']);
    } 
  });

    	} 
     });
   }
 });
}
