OB.Playlist.addeditInit = (function(){
  var cached_function = OB.Playlist.addeditInit;
  return function(){
  var result = cached_function.apply(this.arguments);
  // establish drop target for media (station IDs)
  $('#playlist_items').droppable({
      drop: function(event, ui) {
        if($(ui.draggable).attr('data-mode')=='media')
        {
          $('.sidebar_search_media_selected').each(function(index,element) {

            if($(element).attr('data-type')=='image') var insert_duration = 15;
            else var insert_duration = $(element).attr('data-duration');

            OB.Playlist.addeditInsertItem($(element).attr('data-id'),$(element).attr('data-artist')+' - '+$(element).attr('data-title'),insert_duration,$(element).attr('data-type'));
          });

          // unselect our media from our sidebar
          OB.Sidebar.mediaSelectNone();

        }
        else if($(ui.draggable).attr('data-mode')=='playlist')
        {

          $('.sidebar_search_playlist_selected').each(function(index,element) {

            OB.API.post('playlist','get', { 'id': $(element).attr('data-id') }, function(data) {

              if(data.status==false) return;

              var playlist_data = data.data;

              $.each(playlist_data['items'], function(index, item) {
                if(item.type=='dynamic') OB.Playlist.addeditInsertDynamic(false,item['dynamic_query'],item['dynamic_duration'],item['dynamic_name'],item['dynamic_num_items'],item['dynamic_image_duration']);
                else if(item.type=='station_id') OB.Playlist.addeditInsertStationId();
                else OB.Playlist.addeditInsertItem(item['id'],item['artist']+' - '+item['title'],item['duration'],item['type']);
              });

            });

          });

          // get the content of this playlist, add it to our playlist we are editing.


          // unselect our playlists from our sidebar
          OB.Sidebar.playlistSelectNone();
        } 
        else if($(ui.draggable).attr('data-mode')=='program')
	{
        $('.sidebar_search_program_selected').each(function(index,element) {
	 OB.Playlist.addeditInsertSeries($(element).attr('data-pid'),$(element).attr('data-title'), $(element).attr('data-duration'));
	});
	}
     //put the progtam data-mode here
      } //end of drop function
  }); //end of droppable
   return result;
 }; //end of function return
}());

// add a dynamic program selection
OB.Playlist.addeditInsertSeries = function(id,item_text,duration)
{

  OB.Playlist.addedit_item_last_id += 1;
  var duration_text = secsToTime(duration);

  $('#playlist_items').append('<div class="playlist_addedit_item" id="playlist_addedit_item_'+OB.Playlist.addedit_item_last_id+'">'+htmlspecialchars( OB.t('Program Manager','Program Series') )+': <span id="playlist_dynamic_selection_'+OB.Playlist.addedit_item_last_id+'_name">'+item_text+'</span><span class="playlist_addedit_duration" id="playlist_dynamic_selection_'+OB.Playlist.addedit_item_last_id+'_duration">'+duration_text+'</span></div>');

  $('#playlist_addedit_item_'+OB.Playlist.addedit_item_last_id).attr('data-type','series');
  $('#playlist_addedit_item_'+OB.Playlist.addedit_item_last_id).attr('data-name',item_text);
  $('#playlist_addedit_item_'+OB.Playlist.addedit_item_last_id).attr('data-num_items',id);
  $('#playlist_addedit_item_'+OB.Playlist.addedit_item_last_id).attr('data-duration',duration);

$('#playlist_addedit_item_'+OB.Playlist.addedit_item_last_id).click(OB.Playlist.addeditItemSelect);
//update our total duration
OB.Playlist.addeditTotalDuration();

  // hide our 'drag items here' help.
  $('#playlist_items_drag_help').hide();
  $('#playlist_items').sortable({ start: OB.Playlist.addeditSortStart, stop: OB.Playlist.addeditSortStop });
}

