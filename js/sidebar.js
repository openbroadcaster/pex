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
//Schedule mods
OB.Schedule.schedule = (function(){
   var cached_function = OB.Schedule.schedule;
   return function(){
   var result = cached_function.apply(this.arguments);
   $('#schedule_container').addClass('droppable_target_program');
$('#schedule_container').droppable({
      drop: function(event, ui) {
        if($(ui.draggable).attr('data-mode')=='media')
        {         

          if($('.sidebar_search_media_selected').length!=1) { OB.UI.alert(['Schedule','Schedule Only One']); return; }

          var item_type = 'media';
          var item_id = $('.sidebar_search_media_selected').first().attr('data-id');
          var item_name = $('.sidebar_search_media_selected').first().attr('data-artist')+' - '+$('.sidebar_search_media_selected').first().attr('data-title');
        }

        else if($(ui.draggable).attr('data-mode')=='playlist')
        {

          if($('.sidebar_search_playlist_selected').length!=1) { OB.UI.alert(['Schedule','Schedule Only One']); return; }

          var item_type = 'playlist';
          var item_id = $('.sidebar_search_playlist_selected').first().attr('data-id');
          var item_name = $('.sidebar_search_playlist_selected').first().attr('data-name');

        }

       else if($(ui.draggable).attr('data-mode')=='program')
        {

          if($('.sidebar_search_program_selected').length!=1) { OB.UI.alert(['Schedule','Schedule Only One']); return; }

          var item_type = 'program';
          var item_id = $('.sidebar_search_program_selected').first().attr('data-pid');
          var item_name = $('.sidebar_search_program_selected').first().attr('data-title');

          OB.UI.alert(['Schedule','Coming soon: Schedule the latest/random episodes for '+item_name+' !']);  
          return;
        }

        else return; // media_dynamic not supported yet.

        var item_duration = $('.sidebar_search_media_selected').first().attr('data-duration');

        OB.Schedule.addShowWindow(item_type,item_id,item_name,item_duration);

      }

    });
    return result;
    };
 }());

//Sidebar mods
OB.Sidebar.contextMenuDetailsPage = function(id)
{
  OB.Media.extendedDetailsPage(id);
}
OB.Sidebar.contextMenuProgramEditPage = function()
{
  OBModules.Programs.editPage();
}

OB.Sidebar.contextMenuProgramDetailsPage = function(id)
{
  OBModules.Programs.detailsPage(id);
}

OB.Sidebar.contextMenuProgramDeletePage = function(id)
{
  OBModules.Programs.programDelete(id);
}

OB.Sidebar.showMediaSearch = (function(){
  var cached_function = OB.Sidebar.showMediaSearch;
  return function() {
  $('#sidebar_search_program_container').hide();
  var result = cached_function.apply(this.arguments);
  return result;
  };
 }());

OB.Sidebar.showPlaylistSearch = (function(){
  var cached_function = OB.Sidebar.showPlaylistSearch;
  return function() {
  $('#sidebar_search_program_container').hide();
  var result = cached_function.apply(this.arguments);
  return result;
  };
 }());

OB.Sidebar.showProgramSearch = function()
{

  $('#sidebar_search_media_container').hide();
  $('#sidebar_search_playlist_container').hide();
  $('#sidebar_search_program_container').showFlex();

  /* $('#sidebar_search_tab_playlist').css('z-index',5); */
  /* $('#sidebar_search_tab_programs').css('z-index',15); */

  $('.sidebar_search_tab').removeClass('selected');
  $('#sidebar_search_tab_programs').addClass('selected');


  // TODO this is temporary to fix context menu not loading properly sometimes. real cause should be fixed and this should be removed.
  OB.Sidebar.programSearch(true);

  OB.Layout.tableFixedHeaders($('#sidebar_search_program_headings'),$('#sidebar_search_program_results'));
}

OB.Sidebar.program_search_filters = new Object();
OB.Sidebar.program_search_filters.my=false;
OB.Sidebar.program_search_filters.bookmarked=false;

OB.Sidebar.programSearchFilter = function(what)
{

  // toggle on off
  if(what=='my') OB.Sidebar.program_search_filters.my = !OB.Sidebar.program_search_filters.my;

  if(OB.Sidebar.program_search_filters.my==true) $('#sidebar_search_program_my').text(OB.t('Program Sidebar','My Filter Link').toUpperCase());
  else $('#sidebar_search_program_my').text(OB.t('Program Sidebar','My Filter Link').toLowerCase());

  // reload search
  OB.Sidebar.programSearch();

}

OB.Sidebar.programSelectAll = function()
{
  $('.sidebar_search_program_result').addClass('sidebar_search_program_selected');
}

OB.Sidebar.programSelectNone = function()
{
  $('.sidebar_search_program_result').removeClass('sidebar_search_program_selected');
}

OB.Sidebar.program_last_selected = null;

OB.Sidebar.programSelect = function(object,dragging,keypress)
{

  if(keypress==null && !dragging) $('.sidebar_search_program_selected').removeClass('sidebar_search_program_selected');
  else if(keypress==null && dragging && !$(object).hasClass('sidebar_search_program_selected')) $('.sidebar_search_program_selected').removeClass('sidebar_search_program_selected');

  var media_id = $(object).attr('data-pid');

  if(!dragging && keypress!='shift' && $('#sidebar_search_program_result_'+media_id).hasClass('sidebar_search_program_selected'))
    $('#sidebar_search_program_result_'+media_id).removeClass('sidebar_search_program_selected');

  else
  {
    if(keypress=='shift')
    {

      var last_selected = $('#sidebar_search_program_result_'+OB.Sidebar.program_last_selected);

      // figure out if we have to move up or down.
      if($(last_selected).parent().children().index($(last_selected)) < $('#sidebar_search_program_result_'+media_id).parent().children().index($('#sidebar_search_program_result_'+media_id))) var shift_down = true;
      else var shift_down = false;

      while(last_selected.attr('data-pid')!=media_id)
      {
        if(shift_down) last_selected = $(last_selected).next();
        else last_selected = $(last_selected).prev();

        last_selected.addClass('sidebar_search_program_selected');
      }

    }

    else $('#sidebar_search_program_result_'+media_id).addClass('sidebar_search_program_selected');

    OB.Sidebar.program_last_selected = media_id;

  }

  OB.Sidebar.programEditDeleteVisibility();


}

// determine whether user can edit media (id).
OB.Sidebar.programCanEdit = function(id)
{

  if(OB.Settings.permissions.indexOf('manage_programs')!=-1) return true;

  else if(OB.Settings.permissions.indexOf('create_own_programs')==-1) return false;

  else if($('#sidebar_search_program_result_'+id).attr('data-owner_id')==OB.Account.user_id) return true;

  return false;

}

// adjust the visibility of the playlist edit / delete buttons.
OB.Sidebar.programEditDeleteVisibility = function()
{

  // default to true.
  var visible = true;

  // if there is nothing selected, then we can't edit or delete.
  if($('#sidebar_search_program_results tbody .sidebar_search_program_selected').length==0) visible = false;

  // if we can manage playlists, then we can always edit/delete.
  else if(OB.Settings.permissions.indexOf('manage_programs')!=-1) visible = true;

  // if we can't edit our own playlists either, then we definitely can't edit/delete.
  else if(OB.Settings.permissions.indexOf('create_own_programs')==-1) visible = false;

  // otherwise, we have to go through each seleted item to see if we can edit/delete.
  else
  {

    $('#sidebar_search_program_results tbody .sidebar_search_program_selected').each(function(index,element)
    {
      if(!OB.Sidebar.programCanEdit($(element).attr('data-id'))) { visible = false; return false; }
    });

  }

  if(visible) { $('#sidebar_program_edit_button').show(); $('#sidebar_program_delete_button').show(); }
  else { $('#sidebar_program_edit_button').hide(); $('#sidebar_program_delete_button').hide(); }

}

OB.Sidebar.program_search_offset = 0;

OB.Sidebar.programSearchPageNext = function()
{

  var num_results = $('#sidebar_search_program_results').attr('data-num_results');

  if(num_results <= OB.Sidebar.program_search_offset + OB.ClientStorage.get('results_per_page'))
  {
    return;
  }

  OB.Sidebar.program_search_offset += OB.ClientStorage.get('results_per_page');
  OB.Sidebar.programSearch(true);

}

OB.Sidebar.programSearchPagePrevious = function()
{

  if(OB.Sidebar.program_search_offset == 0) return;

  OB.Sidebar.program_search_offset -= OB.ClientStorage.get('results_per_page');
  if(OB.Sidebar.program_search_offset<0) OB.Sidebar.program_search_offset = 0;
  OB.Sidebar.programSearch(true);

}

OB.Sidebar.program_search_sort_by = 'updated';
OB.Sidebar.program_search_sort_dir = 'desc';

OB.Sidebar.programSearchSort = function(sortby)
{

  // change direction if already sorting by this column
  if(sortby == OB.Sidebar.program_search_sort_by)
  {
    if(OB.Sidebar.program_search_sort_dir=='asc') OB.Sidebar.program_search_sort_dir = 'desc';
    else OB.Sidebar.program_search_sort_dir = 'asc';
  }

  OB.Sidebar.program_search_sort_by = sortby;

  OB.Sidebar.programSearch();

}

OB.Sidebar.programSearch = function(pagination)
{

  // if not the result of pagination (new search), reset offset to 0
  if(!pagination)
  {
    OB.Sidebar.program_search_offset = 0;
  }

  $('#sidebar_search_program_headings').show();

  OB.API.post('programs','program_search',{ sort_by: OB.Sidebar.program_search_sort_by, sort_dir: OB.Sidebar.program_search_sort_dir, q: $('#sidebar_search_program_input').val(), l: OB.ClientStorage.get('results_per_page'), o: OB.Sidebar.program_search_offset, my: OB.Sidebar.program_search_filters.my },function (data) {

    var programs = data.data.programs;
    var num_results = data.data.num_results;

    // update pagination
    if(OB.Sidebar.program_search_offset > 0) var pagination_previous = true;
    else var pagination_previous = false;

    if(num_results > OB.Sidebar.program_search_offset + OB.ClientStorage.get('results_per_page')) { var pagination_next = true; }
    else var pagination_next = false;

    if(pagination_previous) $('#sidebar_search_program_pagination_previous a').removeClass('disabled');
    else $('#sidebar_search_program_pagination_previous a').addClass('disabled');

    if(pagination_next) $('#sidebar_search_program_pagination_next a').removeClass('disabled');
    else $('#sidebar_search_program_pagination_next a').addClass('disabled');

    // handle results
    $('#sidebar_search_program_results').attr('data-num_results',num_results);

    $('#sidebar_search_program_results tbody').html('');

    if(num_results == 0)
    {
      $('#sidebar_search_program_results tbody').html('<tr><td colspan="3" class="sidebar_search_noresults"></td></tr>');
      $('#sidebar_search_program_results tbody .sidebar_search_noresults').text(OB.t('Sidebar','No Programs Found'));
    }

    if(num_results==1) num_results_text = OB.t('Sidebar','Program Found');
    else num_results_text = OB.t('Sidebar','Programs Found',num_results);

    $('#sidebar_search_program_footer .results .num_results').html(num_results_text);



    for(var i in programs)
    {

      var program_summary = programs[i]['summary'];
      if(program_summary.length>150) program_summary = program_summary.substr(0,150)+'...';

      $('#sidebar_search_program_results tbody').append('\
        <tr class="sidebar_search_program_result" id="sidebar_search_program_result_'+programs[i]['pid']+'" data-mode="program">\
          <td class="sidebar_search_program_name" data-column="name">'+htmlspecialchars(programs[i]['title'])+'</td>\
          <td class="sidebar_search_program_description" data-column="summary">'+program_summary+'</td>\
        </tr>');

      $('#sidebar_search_program_result_'+programs[i]['pid']).click(function(e) {

        var keypress = null;
        if(e.shiftKey) keypress='shift';
        else if(e.ctrlKey) keypress='ctrl';

        OB.Sidebar.programSelect(this,false,keypress);

      });

      // some additional attributes to set
      $('#sidebar_search_program_result_'+programs[i]['pid']).attr('data-pid', programs[i]['pid']);
      $('#sidebar_search_program_result_'+programs[i]['pid']).attr('data-title', programs[i]['title']);
      $('#sidebar_search_program_result_'+programs[i]['pid']).attr('data-summary', programs[i]['summary']);
      $('#sidebar_search_program_result_'+programs[i]['pid']).attr('data-link_url', programs[i]['link_url']);
      $('#sidebar_search_program_result_'+programs[i]['pid']).attr('data-owner_id', programs[i]['owner_id']);

      // set up context menu

      var menuOptions = new Object();

      menuOptions[OB.t('Common','Details')] = { click: function(element) { OB.Sidebar.contextMenuProgramDetailsPage($(element).attr('data-pid')); } };
//      if(OB.Sidebar.programCanEdit(programs[i]['pid'])) menuOptions[OB.t('Common','Edit')] = { click: function(element) { OB.Sidebar.contextMenuProgramEditPage(); } };

      if(Object.keys(menuOptions).length>0)
      {

        $('#sidebar_search_program_result_'+programs[i]['pid']).contextMenu('context-menu-'+programs[i]['pid'],

            menuOptions,

            {
              disable_native_context_menu: false,
              showMenu: function(element) { $(element).click(); },
              hideMenu: function() { },
              leftClick: false // trigger on left click instead of right click
            });

      }

    }

    if(programs.length>0) {
      $('.sidebar_search_program_result').draggable({helper: 'clone', opacity: 0.8, cursor: 'crosshair',
        start: function(event, ui) {

          var keypress = null;
          if(event.shiftKey) keypress='shift';
          else if(event.ctrlKey) keypress='ctrl';

          // select the media we're dragging also.
          OB.Sidebar.programSelect($(ui.helper),true,keypress);

          // but we don't actually want the helper to count as part of this.
          $(ui.helper).removeClass('sidebar_search_program_selected');

          var num_selected = $('.sidebar_search_program_selected').size();

          if(num_selected==1) var helper_text = $(ui.helper).attr('data-name');
          else var helper_text = num_selected+' items';

          $(ui.helper).html('<div class="sidebar_dragging_items">'+htmlspecialchars(helper_text)+'</div>');

          $('.droppable_target_program').addClass('droppable_target_highlighted');

        },

        stop: function(event, ui) {
          $('.droppable_target_program').removeClass('droppable_target_highlighted');
        }
      });

      OB.Layout.tableFixedHeaders($('#sidebar_search_program_headings'),$('#sidebar_search_program_results'));
    }

    OB.Sidebar.programEditDeleteVisibility();

  });

}
