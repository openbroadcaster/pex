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
          queue_item.push(playlist_items[j]['artist']+'-'+playlist_items[j]['title']);
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
      var tmp = total_duration.toFixed(3);

      var duration_seconds = tmp % 60;
      tmp = (tmp - duration_seconds) / 60;
      var duration_minutes = tmp % 60;
      tmp = (tmp - duration_minutes) / 60;
      var duration_hours = tmp % 24;
      tmp = (tmp - duration_hours) / 24;
      var duration_days = tmp;
      var selection_duration = '';
      if(duration_days>0) selection_duration += duration_days+'d';
      if(duration_hours>0) selection_duration += duration_hours+'h';
       selection_duration += duration_minutes+'m';
       selection_duration += duration_days+'s';

//   $('.selection_heading').append('Donate NOW to Assemble '+ playlist_text+' into a single downloadable episode of '+selection_duration); 
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
         OBModules.Programs.getTrack(dyn_parts[k].id,dyn_parts[k].artist+'-'+dyn_parts[k].title); 
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
	$('#filequeue').append('<li>'+$media_file+'</li>');

   OB.API.post('programs','getx',{'id': id},function(meta) {
         $('#showparts').append('<li>'+title+'</li>'); 
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
    });
   }
  });

  OBModules.Programs.buildPodcast = function()
  {
   var filebase = $('#filequeue li')[0].innerText;
        $('#filequeue li').each(function(index){
        if(index>0)
        {
	// build a comma seperated list of input files
        var fileq = '';
        fileq += this.innerText;
     	OB.API.post('programs','build_podcast',{'filebase':filebase,'filename':fileq},function(status){
        if(status.status) OB.UI.alert(['Podcast',status.msg]); 	
    	});

        }
       }); 
  }
}
