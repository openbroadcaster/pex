//Schedule mods
OB.Schedule.programModeChange = function()
{
  $('#episodes').hide();
  if($('#program_mode option:selected').val()=='series') {
  // Disable on-time schedule option
  $("#show_mode option[value='once']").attr('disabled','disabled');
  $("#show_mode").val('daily');
  var pfields = new Object();
  pfields.pid = $('.sidebar_search_program_selected').first().attr('data-pid'); //$('#show_item_id').val();
  pfields.device = OB.Schedule.device_id; //need this to come from schedule
  OB.API.post('programs','get_series',pfields,function(episodes)
  {
    $('#series_episodes tbody').html('');
    var series = episodes.data;
    $('#series_episodes tbody').append('<tr><th data-t>Episode</th><th data-t>Title</th><th>Select</th></tr>');
    for(var i in series)
	{
	$('#series_episodes tbody').append('<tr><td>'+i+'</td><td>'+series[i]['title']+'</td><td><input class="chbx" type="checkbox" name="'+series[i]['id']+'" checked="checked"></td></tr>');
        }

  $('#episodes').show();


   });
 } else
{
  $('#show_item_type').val('media');
}
}

OB.Schedule.seriesEpisodeChange = function()
{
        var playme = new Array();
        $('#series_episodes').find('tr').each(function () {
        var row = $(this);
        if (row.find('input[type="checkbox"]').is(':checked')) {
	playme.push(row.find('input[type="checkbox"]').attr('name'));
	}
	});
	alert(playme.join('\n'));
}

OB.Schedule.programSeries = function(device_id,program_id)
{
  var series = [];
 

}
OB.Schedule.addeditProgramWindow = function(timeslots)
{

  // no advanced schedule and no timeslots for user? display alert instead.
  if(timeslots.length==0 && OB.Settings.permissions.indexOf('advanced_show_scheduling')==-1)
  {
    OB.UI.alert(['Schedule Edit','No Timeslots Available']);
    return;
  }

  OB.UI.openModalWindow('modules/programs/show_addedit.html');
  $('#show_mode').change(function() { OB.Schedule.addeditModeChange('show'); });
  $('#program_mode').change(function() { OB.Schedule.programModeChange(); });

  // fill up time slots.
  $.each(timeslots,function(index,slot)
  {

    var start = new Date(slot.start*1000);
    var description = slot.description+': '+OB.t('Schedule',month_name(start.getMonth()))+' '+start.getDate()+', '+timepad(start.getHours())+':'+timepad(start.getMinutes())+':'+timepad(start.getSeconds())+' ('+secsToTime(slot.duration,'hms')+')';

    var date = start.getFullYear()+'-'+timepad(start.getMonth()+1)+'-'+timepad(start.getDate());

    $('#show_time_slot').append('<option data-start_date="'+date+'" data-start_hour="'+start.getHours()+'" data-start_minute="'+start.getMinutes()+'" data-start_second="'+start.getSeconds()+'" data-duration="'+slot.duration+'">'+htmlspecialchars(description)+'</option>');

  });

  if(OB.Settings.permissions.indexOf('advanced_show_scheduling')==-1)
  {
    $('#timeslot_manual_input_option').remove();
    $('#show_time_slot').val($('#show_time_slot').children().first().val());
    $('#show_time_slot').change();
  }

  else // we have advanced permissions
  {

    // friendly date picker
    $('#show_start_date').datepicker({ dateFormat: "yy-mm-dd" });
    $('#show_stop_date').datepicker({ dateFormat: "yy-mm-dd" });

    // friendly time picker
    $('#show_start_time').timepicker({timeFormat: 'hh:mm:ss',showSecond: true});

  }

}

OB.Schedule.addProgramWindow = function(type,id,name,duration)
{
  if(!id) id = 0;

  var pfields = new Object();
  pfields.start = String(Math.round(OB.Schedule.schedule_start.getTime()/1000));
  pfields.end = String(Math.round(OB.Schedule.schedule_end.getTime()/1000));
  pfields.device = OB.Schedule.device_id;
  pfields.user_id = OB.Account.user_id;

  OB.API.post('schedule','permissions',pfields,function(permissions)
  {

    OB.Schedule.addeditProgramWindow(permissions.data);
    $('.edit_only').hide();

    // if not using advanced permissions, the selected timeslot will be the first one.
    // run the timeslot change callback so that the start/duration is filled out.
    if(OB.Settings.permissions.indexOf('advanced_show_scheduling')==-1)
   {
      if($('#show_time_slot option').length>0) OB.Schedule.addeditShowWindowTimeslotChange();
    }

    // otherwise (using advanced permissions), automatically fill out program duration.
     else
   {
      var tmp = duration;

      var duration_seconds = tmp % 60;
      tmp = (tmp - duration_seconds) / 60;
      var duration_minutes = tmp % 60;
      tmp = (tmp - duration_minutes) / 60;
      var duration_hours = tmp % 24;
      tmp = (tmp - duration_hours) / 24;
      var duration_days = tmp;

      $('#show_duration_days').val(timepad(duration_days));
      $('#show_duration_hours').val(timepad(duration_hours));
      $('#show_duration_minutes').val(timepad(duration_minutes));
     $('#show_duration_seconds').val(timepad(duration_seconds));

    }

    $('#show_item_info').text(name+' ('+type+' #'+id+')');

    $('#show_item_type').val(type);
    $('#show_item_id').val(id);

  });
}
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

          var item_type = 'media';
          var item_id = $('.sidebar_search_program_selected').first().attr('data-pid');
          var item_name = $('.sidebar_search_program_selected').first().attr('data-title');
          var item_duration = $('.sidebar_search_program_selected').first().attr('data-duration');
          var item_latest = $('.sidebar_search_program_selected').first().attr('data-latest');
            OB.Schedule.addProgramWindow(item_type,item_latest,item_name,item_duration);
        //  OB.UI.alert(['Schedule','Coming soon: Schedule the latest/random episodes for '+item_name+' !']);
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

OB.Schedule.saveProgram = function()
{
 
  fields = new Object();

  fields.id = $('#show_id').val();
  fields.edit_recurring = $('#show_edit_recurring').val();

  fields.mode = $('#show_mode').val();
  fields.x_data = $('#show_x_data').val();  

  var start_date_array = $('#show_start_date').val().split('-');
  var start_time_array = $('#show_start_time').val().split(':');

  var start_date = new Date(start_date_array[0],start_date_array[1]-1,start_date_array[2],start_time_array[0],start_time_array[1],start_time_array[2],0);

  fields.start = Math.round(start_date.getTime()/1000)+'';

  fields.duration_days = $('#show_duration_days').val();
  fields.duration_hours = $('#show_duration_hours').val();
  fields.duration_minutes = $('#show_duration_minutes').val();
  fields.duration_seconds = $('#show_duration_seconds').val();

  if(fields.mode!='once' && $('#show_stop_date').val())
  {

    var stop_date_array = $('#show_stop_date').val().split('-');
    var stop_date = new Date(parseInt(stop_date_array[0]),parseInt(stop_date_array[1]-1),parseInt(stop_date_array[2]),23,59,59,0);  

    fields.stop = Math.round(stop_date.getTime()/1000)+'';

  }
  else fields.stop = '';

  fields.device_id = OB.Schedule.device_id;

   if($('#program_mode option:selected').val()=='series') {
        var playme = new Array();
        $('#series_episodes').find('tr').each(function () {
        var row = $(this);
        if (row.find('input[type="checkbox"]').is(':checked')) {
		 // cycle thru selected series as distinct media type schedule entries
		fields.item_id = (row.find('input[type="checkbox"]').attr('name'));
	  	OB.API.post('schedule','save_show',fields,function(data) {

	   	 if(data.status==true){ }
	  
		//playme.push(row.find('input[type="checkbox"]').attr('name') + ' on date');
		});
          }
		});
		//alert('Series '+ $('#show_item_id').val()+' includes following episode(s):\n'+playme.join('\n')); //program_series for each selected episode
	}
  fields.item_type = $('#show_item_type').val();
  fields.item_id = $('#show_item_id').val();

  OB.API.post('schedule','save_show',fields,function(data) {

    if(data.status==true)
    {

      OB.UI.closeModalWindow();
      OB.Schedule.loadSchedule();

    }

    else
    {
      $('#show_addedit_message').obWidget('error',data.msg);
    }

  });


}


OB.Schedule.saveShow = (function(){

   var cached_function = OB.Schedule.saveShow;
   return function(){   

   // Before sending to saveShow, we need to create a series ID, and set the show_item_type='series' and show_it_id=series_id
   // device
        $('#show_item_type').val('series');
	$('#show_item_id').val(1); //returned from insert of series
        var playme = new Array();
        $('#series_episodes').find('tr').each(function () {
        var row = $(this);
        if (row.find('input[type="checkbox"]').is(':checked')) {
	playme.push(row.find('input[type="checkbox"]').attr('name'));
	}
	});
	alert('Series '+ $('#show_item_id').val()+':\n'+playme.join('\n')); //program_series for each selected episode

   var result = cached_function.apply(this.arguments);

    return result;

   };
  }());
