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

OBModules.Programs.detailsForm = function(data)
{
  if(data) var program_id = data.pid;
  else program_id = 'new';

  var $html = $(OB.UI.getHTML('modules/programs/details_form.html'));
  // set device id on form.
  $html.find('.program_details_form').attr('data-pid',program_id);
  return $html.html();
}

OBModules.Programs.programDetails = function(id) 
{
  var expand_text = OB.t('Common', 'Expand');
  var collapse_text = OB.t('Common', 'Collapse');

  if($('#program_'+id+'_details').is(':visible')==true)
  {
    $('#program_'+id+'_details').hide();
    $('#program_'+id+'_expand_link').html(expand_text);
  }
  else
  {
    $('#program_'+id+'_details').show();
    $('#program_'+id+'_expand_link').html(collapse_text);
  }
  $('#program_list .program_details').not('#program_'+id+'_details').hide(); // only allow one program 'expanded' at a time.
  $('#program_list .program_expand_link').not('#program_'+id+'_expand_link').html(expand_text);
}

OBModules.Programs.detailsFormProcess = function(data)
{
  if(data) var program_id = data.pid;
  else program_id = 'new';

  var $form = $('.program_details_form[data-pid='+program_id+']');

  // establish drop target for gallery placards (media IDs)
  $form.find('.program_gallery_media_ids').addClass('droppable_target_media');
  $form.find('.program_gallery_media_ids').droppable({
      drop: function(event, ui)
      {
//        alert('ding dong');
        if($(ui.draggable).attr('data-mode')=='media')
        {
           $('.sidebar_search_media_selected').each(function(index,element) {
             if($(ui.draggable).attr('data-type')=='image')
             {
               OBModules.Programs.galleryAddMediaId(program_id,$(element).attr('data-id'),$(element).attr('data-title'));
             } 
          });
        }
      }
  });

  // establish drop target for episodes (media IDs)  
  $form.find('.program_episode_media_ids').addClass('droppable_target_media');
  $form.find('.program_episode_media_ids').droppable({
      drop: function(event, ui) 
      {
//        alert('ding dong');
        if($(ui.draggable).attr('data-mode')=='media') 
        {
         $('.sidebar_search_media_selected').each(function(index,element) {
          OBModules.Programs.detailsAddMediaId(program_id,$(element).attr('data-id'),$(element).attr('data-artist')+' - '+$(element).attr('data-title'));  
         });
        } else if($(ui.draggable).attr('data-mode')=='playlist')
	{
         $('.sidebar_search_playlist_selected').each(function(index,element) {
          OBModules.Programs.assembleTracklist(program_id,$(element).attr('data-id'),$(element).attr('data-name'));  
	});
        }
      }
  });
var tags;
var sourcetags = [];
if(data) tags=data.keywords; else tags='';
OB.API.post('programs','get_tags',{},function(result){
$tagwords = result.data;
for(var i in $tagwords)
{
  sourcetags.push($tagwords[i]);
}
    $form.find('.keyword_list').tagEditor({
    initialTags: tags,
    delimiter: ', ', /* space and comma */
    autocomplete: {
	delay: 0,
	position: {collision: 'flip'},
	source: sourcetags
	},
    placeholder: 'Enter tags ...'
    });
});

  // fill country list
  for(var i in OB.Settings.countries)
  {
    $form.find('.program_details_country').append('<option value="'+OB.Settings.countries[i].id+'">'+htmlspecialchars(OB.Settings.countries[i].name)+'</option>');
  }

  // fill language list
  for(var i in OB.Settings.languages)
  {
    $form.find('.program_details_language').append('<option value="'+OB.Settings.languages[i].id+'">'+htmlspecialchars(OB.Settings.languages[i].name)+'</option>');
  }

  if(data)
  {
    $form.find('#program_details_title').val(data.title);
    $form.find('#program_details_producer').val(data.producer);
    $form.find('#program_details_summary').val(data.summary);
//set duration fields
        var duration_tmp = data.duration;
        var duration_seconds = duration_tmp%60;
        duration_tmp = (duration_tmp-duration_seconds)/60;
        var duration_minutes = duration_tmp%60;
        duration_tmp = (duration_tmp-duration_minutes)/60;
        var duration_hours = duration_tmp%24;
        var duration_days = (duration_tmp - duration_hours)/24;

        $form.find('#program_duration_days').val(timepad(duration_days));
        $form.find('#program_duration_hours').val(timepad(duration_hours));
        $form.find('#program_duration_minutes').val(timepad(duration_minutes));
        $form.find('#program_duration_seconds').val(timepad(duration_seconds));


    $form.find('.program_details_theme').val(data.theme_id);
    $form.find('#program_details_linkurl').val(data.link_url);
    $form.find('.program_details_country').val(data.country_id);
    $form.find('.program_details_language').val(data.language_id);
    $form.find('.content_advisory_flag').val(data.explicit_flag);
    $form.find('.program_dynamic_select').val(data.dynamic_select);
    $form.find('.keyword_list').val(data.keywords);
  //  var placard_src = "preview.php?id="+program_id+"&dl=0&mode=1";
  //  $form.find('.program_default_placard').attr("src",placard_src);
  }
  $('.program_episode_media_ids').sortable({ start: OBModules.Programs.addeditSortStart, stop: OBModules.Programs.addeditSortStop });
  $('.program_gallery_media_ids').sortable({ start: OBModules.Programs.addeditSortStart, stop: OBModules.Programs.addeditSortStop });
}


OBModules.Programs.details_program_cache = false;
OBModules.Programs.detailProgramList = function()
{
  $('#program_list').hide();

  $('#program_list').html('<tr><th data-t data-tns="Program Manager">Title</th><th data-t data-tns="Program Manager">Producer</th><th data-t data-tns="Program Manager"># of Episodes</th><th>&nbsp;</th></tr>');

  OB.API.post('programs','get_program_list', { }, function(data) { 
  
	OBModules.Programs.details_program_cache = data.data;
    	var programs = data.data;
	for(var i in programs)
    	  {
	   if(programs[i].pid)
           {
	    var dhtml = '<tr id="program_'+programs[i].pid+'_row">\
		<td >'+htmlspecialchars(programs[i].title)+'</td>\
          	<td>'+htmlspecialchars(programs[i].producer)+'</td>\
		<td>'+programs[i].episode_ids.length+'</td>\
          	<td><a class="program_expand_link" id="program_'+programs[i].pid+'_expand_link" href="javascript: OBModules.Programs.programDetails('+programs[i].pid+');" data-t data-tns="Common">Expand</a></td></tr>\
          	<tr class="hidden expanding program_details" id="program_'+programs[i].pid+'_details"><td colspan="4">\
            	<obwidget id="program_'+programs[i].pid+'_message" type="message"></obwidget>';
                
      		dhtml += OBModules.Programs.detailsForm(programs[i]);

      		dhtml +='<fieldset><div class="fieldrow"><button class="add" onclick="OBModules.Programs.programSave('+programs[i].pid+');" data-permissions="manage_programs" data-t data-tns="Common">Save</button><button onclick="OBModules.Programs.programDelete('+programs[i].pid+');" class="delete" data-permissions="manage_programs" data-t data-tns="Common">Delete</button><button onclick="OBModules.Programs.details()" data-permissions="manage_programs" data-t data-tns="Common">Cancel</button></div></fieldset>\
			</td></tr>';

     		$('#program_list').append(dhtml);
		OBModules.Programs.roleList(programs[i].pid);

      		OB.UI.widgetHTML( $('#program_list') );

	      // add our credits 
      		var credits  = programs[i].credits;
      		  for(var j in credits)
    		  {
     		   OBModules.Programs.addCredit(programs[i].pid,credits[j].role_id,credits[j].role +' : '+ credits[j].name);
     		  }

	      // add our episode ids
      		var episode_ids = programs[i].episode_ids;
      		  for(var j in episode_ids)
    		  {
     		   OBModules.Programs.detailsAddMediaId(programs[i].pid,episode_ids[j].id,episode_ids[j].artist+' - '+episode_ids[j].title);
     		  }

	      // add our gallery ids
      		var gallery_ids = programs[i].gallery_ids;
      		  for(var j in gallery_ids)
    		  {
     		   OBModules.Programs.galleryAddMediaId(programs[i].pid,gallery_ids[j].id,gallery_ids[j].title);
     		  }

		// some form processing

      		OBModules.Programs.detailsFormProcess(programs[i]);
                OBModules.Programs.themeList(programs[i]);
	     }
    	  }
    $('#program_list').show();
    OB.UI.translateHTML( $('#layout_main') );
  });
}


OBModules.Programs.galleryAddMediaId = function(program_id,media_id, media_text)
{
    // get rid of our help text if this is the first item.
    if($('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids > div').length<1) $('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').html('');

    // only add if it doesn't already exist
    if($('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').children('[data-id="'+media_id+'"]').length<1)
    {
    var placard_src = "preview.php?id="+media_id+"&dl=0&mode=0";
      var html = '<div class="gallery_placard" data-id="'+media_id+'"><img src="'+placard_src+'" alt="'+media_text+'"/><br/><a href="javascript: OBModules.Programs.galleryRemoveMediaId(\''+program_id+'\','+media_id+');">x</a> '+htmlspecialchars(media_text)+'</div>';
      $('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').append(html);

    }
}

OBModules.Programs.galleryRemoveMediaId = function(program_id, media_id)
{
  $('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').children('[data-id="'+media_id+'"]').remove();

  // restore our help text if there are no more media IDs.
  if($('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').children().length<1) $('.program_details_form[data-pid='+program_id+'] .program_gallery_media_ids').html(OB.t('Program Manager','Gallery Drag Zone')).addClass("program_gallery_media");
}

OBModules.Programs.detailsAddMediaId = function(program_id,media_id, media_text)
{
    // get rid of our help text if this is the first item.
    if($('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids > div').length<1) $('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').html('');

    // only add if it doesn't already exist
    if($('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').children('[data-id="'+media_id+'"]').length<1)
    {
      var html = '<div class="program_episode_media_item" data-id="'+media_id+'"><a href="javascript: OBModules.Programs.detailsRemoveMediaId(\''+program_id+'\','+media_id+');">x</a> '+htmlspecialchars(media_text)+'</div></div>';
      $('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').append(html);  
      $('.program_details_form[data-pid='+program_id+'] .program_episode_media_item').click(OBModules.Programs.addeditItemSelect);
eval("$('.program_details_form[data-pid='+program_id+'] .program_episode_media_item').dblclick(function() { OB.Media.detailsPage("+media_id+"); });");

    }
}

OBModules.Programs.detailsRemoveMediaId = function(program_id, media_id)
{
  $('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').children('[data-id="'+media_id+'"]').remove();

  // restore our help text if there are no more media IDs.
  if($('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').children().length<1) $('.program_details_form[data-pid='+program_id+'] .program_episode_media_ids').html(OB.t('Program Manager','Media Drag Zone')).addClass("program_episode_media");
}

OBModules.Programs.addCredit = function(program_id,credit_id,credit_text)
{
    // get rid of our help text if this is the first item.
    if($('.program_details_form[data-pid='+program_id+'] .program_credits > div').length<1) $('.program_details_form[data-pid='+program_id+'] .program_credits').html('');

    // only add if it doesn't already exist

        var newtext = 'x ' + credit_text;
       if($('.program_credits:contains("'+newtext+'")').length<1)
   {
    if($('.program_details_form[data-pid='+program_id+'] .program_credits').children('[data-id="'+credit_id+'"]').length<1)
    {
      var html = '<div data-id="'+credit_id+'" class="capitalize"><a href="javascript: OBModules.Programs.detailsRemoveCredit(\''+program_id+'\','+credit_id+');">x</a> '+htmlspecialchars(credit_text)+'</div>';
      $('.program_details_form[data-pid='+program_id+'] .program_credits').append(html);  
    }
   }
}

OBModules.Programs.detailsRemoveCredit = function(program_id, credit_id)
{
  $('.program_details_form[data-pid='+program_id+'] .program_credits').children('[data-id="'+credit_id+'"]').remove();

  // restore our help text if there are no more station IDs.
  if($('.program_details_form[data-pid='+program_id+'] .program_credits').children().length<1) $('.program_details_form[data-pid='+program_id+'] .program_credits').html(OB.t('Program Manager','Credits')).addClass("program_credit");

}


OBModules.Programs.appendCredit = function(id)
{
 if(!id) id='new';
  $form = $('.program_details_form[data-pid='+id+']');
     var rind = $form.find('#credit_roles :selected').val();
     var role = $form.find('#credit_roles :selected').text();
     var credit = $form.find('#credit_role_add_name').val();
     var nextnum = $form.find('.program_credits').children().length + 1;
     if(credit !="" && rind !="") OBModules.Programs.addCredit(id,nextnum,role + ' : ' + credit);
    $form.find('#credit_role_add_name').val('');
    $form.find('#credit_roles').val('');
}

OBModules.Programs.editPage = function()
{
  if($('.sidebar_search_program_selected').size() > 1) { OB.UI.alert( ['Program Edit','Select One Program Only'] ); return; }

  // program data from our search result (slight possibility it is out of date).
  var program_local = $('.sidebar_search_program_selected');

  OB.API.post('programs','get_program', { 'pid': $(program_local).attr('data-pid') }, function(data) {

    // if we didn't get our program we are trying to edit, just direct to create new program instead.
    if(data.status==false) { OBModules.Programs.newPage(); return; }

    program_data = data.data;
    OB.UI.replaceMain('modules/programs/details_form.html');
   $('.program_details_form').hide();

    // set device id on form.
    $('.program_details_form').attr('data-pid',program_data['pid']);

    OBModules.Programs.detailsFormProcess(program_data);
    OBModules.Programs.roleList(program_data['pid']);
    OBModules.Programs.themeList(program_data);

    // add our credits 
   var credits  = program_data['credits'];
   for(var j in credits)
    {
     OBModules.Programs.addCredit(program_data['pid'],credits[j].role_id,credits[j].role+' : '+credits[j].name);
    }

   // add our episode ids
   var episode_ids = program_data['episode_ids'];
   for(var j in episode_ids)
      {
        OBModules.Programs.detailsAddMediaId(program_data['pid'],episode_ids[j].id,episode_ids[j].artist+' - '+episode_ids[j].title);
      }

   // add our gallery ids
   var gallery_ids = program_data['gallery_ids'];
   for(var j in gallery_ids)
      {
        OBModules.Programs.galleryAddMediaId(program_data['pid'],gallery_ids[j].id,gallery_ids[j].title);
      }
    var dhtml ='<fieldset><div class="fieldrow"><button class="add" onclick="OBModules.Programs.programSave('+program_data['pid']+');" data-permissions="manage_programs" data-t data-tns="Common">Save</button><button onclick="OBModules.Programs.programDelete('+data.data.pid+');" class="delete" data-permissions="manage_programs" data-t data-tns="Common">Delete</button><button onclick="OBModules.Programs.details()" data-t data-tns="Common">Cancel</button></div></fieldset>\
                        </td></tr>';
   $('.program_details_form').append(dhtml); 
    $('.program_details_form').show();
   $('#edit_heading').html(program_data['title']);
   $('#edit_heading').show();

  });
}

OBModules.Programs.programDelete = function(program_id,confirm)
{
if(!program_id)
{
 if($('.sidebar_search_program_selected').size() < 1) {OB.UI.alert(['Program Delete','At least one delete']); return; }
var program_local = $('.sidebar_search_program_selected');
program_id=$(program_local).attr('data-pid');
}
  if(!confirm)
  {
    OB.UI.confirm('Are you sure you want to delete this program? Episodes from this program will not be removed.',
      function() { OBModules.Programs.programDelete(program_id,true); }, 'Yes, Delete', 'No, Cancel', 'delete');
  }
  else
  {
   var program_ids = Array()
   $('.sidebar_search_program_selected').each(function(index,element) { program_ids.push($(element).attr('data-id')); });

    OB.API.post('programs','delete', { 'pid': program_id },function(data) {

      if(data.status==true)
      {
        $('#program_main_message').obWidget('success','Program deleted.');
        OBModules.Programs.detailProgramList();
        OB.Sidebar.programSearch();
      }
    });
  }
}


OBModules.Programs.delete = function()
{
  var delete_ids = new Array();

  $('#program_delete_list > li').each(function(index,element) {

    delete_ids.push($(element).attr('data-pid'));
  });

  OB.API.post('programs','delete',{ 'pid': delete_ids },function(data) {
    if(data.status==true) 
    {
      OB.Sidebar.programSearch();
      $('#program_delete_list').remove();
      $('#program_top_message').text(OB.t('Program Delete','Programs have been deleted.'));
    }
    else OB.UI.alert(data.msg);
  });
}

OBModules.Programs.newPage = function()
{
  OB.UI.replaceMain('modules/programs/programs.html');
  $form = OB.UI.getHTML('modules/programs/details_form.html');
  $('#programs_heading').html(OB.t('Program Manager','New Program'));
  $('#programs_new_form').html($form) ;
  $('.program_details_form').attr('data-pid','new'); 
  OBModules.Programs.detailsFormProcess();
  OBModules.Programs.roleList('new');
  OBModules.Programs.themeList();
  var htmladd = '<fieldset>' + '<div class="fieldrow"><button class="add" onclick="OBModules.Programs.programSave();" data-t data-tns="Common">Save</button>' + '<button onclick="OBModules.Programs.newProgramCancel();" data-t data-tns="Common">Cancel</button></div></fieldset>';
   $('#programs_new_form').append(htmladd);
   $('.program_details_country').val(39); //Canada
   $('.program_details_language').val(36); //English
   $('.content_advisory_flag').val(0); //No advisory
   $('#programs_new_form').show();
   $('#programs_new_program_button').hide();
    OB.UI.translateHTML( $('.program_details_form') );
}


OBModules.Programs.addeditItemUnselect = function(e)
{
  if(e && ($(e.target).hasClass('program_episode_media_item'))) return;
  $('.program_episode_media_item').removeClass('selected');
}

OBModules.Programs.addeditItemSelect = function()
{
  OBModules.Programs.addeditItemUnselect();
  $(this).addClass('selected');
}
OBModules.addeditSortStart = function(event, ui)
{
  // select the item if we start moving it.
  $(ui.helper).click();
}

OBModules.addeditSortStop = function(event, ui)
{
  $(ui.item).css('z-index','');
}

OBModules.Programs.clearTags = function(button)
{
var tags = $(button).parent().find('.keyword_list').tagEditor('getTags')[0].tags;
  for (i = 0; i < tags.length; i++) { $(button).parent().find('.keyword_list').tagEditor('removeTag', tags[i]); }
}

OBModules.Programs.saveTags = function(button)
{
var tags = $(button).parent().find('.keyword_list').tagEditor('getTags')[0].tags;
  for (i = 0; i < tags.length; i++) 
{
alert( $('.keyword_list').tagEditor('getTags')[0][i].tags );
 }
}


OBModules.Programs.programSave = function(program_id) 
{
  if(!program_id) {
    program_id = 'new';
  }

  var $form = $('.program_details_form[data-pid='+program_id+']');

  var program_title = $form.find('#program_details_title').val();
  var program_producer = $form.find('#program_details_producer').val();
  var program_summary = $form.find('#program_details_summary').val();
  var program_link_url = $form.find('#program_details_linkurl').val();
  var program_theme_id = $form.find('.program_details_theme').val();
  var program_country_id = $form.find('.program_details_country').val();
  var program_language_id = $form.find('.program_details_language').val();
  var program_content_advisory = $form.find('.content_advisory_flag').val();
  var program_dynamic_select = $form.find('.program_dynamic_select').val();
  var duration_days = $form.find('#program_duration_days').val();
  var duration_hours = $form.find('#program_duration_hours').val();
  var duration_minutes = $form.find('#program_duration_minutes').val();
  var duration_seconds = $form.find('#program_duration_seconds').val(); 
// get keywords 
  var keywords = new Array();
  keywords = $form.find('.keyword_list').tagEditor('getTags')[0].tags;
  
// get episode IDs.
  var program_episode_ids = new Array();
  $form.find('.program_episode_media_ids').children().each(function(key,value) {
    if($(value).attr('data-id')) program_episode_ids.push($(value).attr('data-id'));
  });

  // get gallery IDs.
  var program_gallery_ids = new Array();
  $form.find('.program_gallery_media_ids').children().each(function(key,value) {
    if($(value).attr('data-id')) program_gallery_ids.push($(value).attr('data-id'));
  });

  // get credits.
  var credits = new Array();
  $form.find('.program_credits').children().each(function(index) {
       str = ($(this).text());
       if(str !='Credits')
       {
       ind = ($(this).index());
       firstpart = $.trim(str.split(':')[0]);
       role = $.trim(firstpart.split(' ').slice(1).join(' '));
       name = $.trim(str.split(':')[1]);
       credits.push(ind+':'+role+':'+name); 
       }
  });


  if(program_id == 'new') program_id = false;

  OB.API.post('programs','edit', { 'pid': program_id, 'title': program_title, 'producer': program_producer, 'summary': program_summary, 'duration_days': duration_days,'duration_hours': duration_hours, 'duration_minutes': duration_minutes, 'duration_seconds': duration_seconds, 'link_url': program_link_url, 'theme_id': program_theme_id, 'language_id': program_language_id, 'country_id': program_country_id, 'content_advisory': program_content_advisory, 'dynamic_select': program_dynamic_select,'keywords': keywords, 'episode_ids': program_episode_ids, 'gallery_ids': program_gallery_ids, 'credit_roles': credits}, function(data) {

    if(!program_id) program_id = 'main'; // we want to manipulate the main message for new programs.

    $('#program_'+program_id+'_message').obWidget((data.status==true ? 'success' : 'error'), data.msg);

    if(program_id == 'main' && data.status == true)
    {
      OBModules.Programs.newProgramCancel(true); // hides form, keeps message
    }

    if(program_id!='main') {
      $('#program_main_message').hide(); // hide this so we aren't confusing.
    }
//  OBModules.Programs.detailProgramList();
  OB.Sidebar.programSearch();
  });
}

OBModules.Programs.newProgramCancel = function(keep_message){
   if(!keep_message) $('#program_main_message').hide();

  $('#programs_new_form').hide();
  $('#programs_new_program_button').show();
}


