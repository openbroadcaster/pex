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

OB.Media.editPage = (function(){
  var cached_function = OB.Media.editPage;;
  return function() {
  var dhtml = '<button class="edit extend_button" onclick="OB.Media.extendForm(this);">Show Extended Details</button><button class="edit hidden basic_button" onclick="OB.Media.extendForm(this);">Show Basic Details</button>';
  var result = cached_function.apply(this.arguments);
  $('#media_data').prepend(dhtml);
  return result;
  };
 }());

OB.Media.extendForm = function(button)
{ 
//get the HTML 
   var form = OB.UI.getHTML('modules/programs/extend.html');
//request for extended media data?
    if($(button).hasClass('extend_button')){
//set-up each instance of form
   $('.media_addedit').each(function(index, element)
      {
       local_id = $(element).attr('data-id');
       var $form = $('#media_addedit_'+local_id);
       $form.find('.addedit_form_container').append('<div id="media_extend_'+local_id+'" class="media_extend" data-id="'+local_id+'">'+form+'</div>');
       $form.find('.cc_license_select').attr('data-id',local_id);
       $form.find('.cc_license_form').attr('data-id',local_id);
       $('.extend_button').hide();
       $('.basic_button').show();
       $('#media_data button.add').click(OB.Media.extendedSave);

//fill in license dropdown and textarea
       OB.Media.setCC(local_id);
//fill in role list
       OB.Media.roleList(local_id);

//set-up MAPL logos

//setup data
//       OB.Media.showGallery(local_id);
     OB.Media.metaFormProcess(local_id);
      }); //end of form instance
      }
	 else  // go back to basics
      {
      $('.media_addedit').each(function(index, element)
      {
       local_id = $(element).attr('data-id');
       $('#media_extend_'+local_id).remove();
       });
       $('#media_data button.add').click(OB.Media.save);
       $('.extend_button').show();
       $('.basic_button').hide();
      }

//Hide copy to all for single instance
   if($('.media_addedit').length==1) $('.copy_to_all').addClass('hidden');
//set-up MAPL logo
   $('.cancon_field').click(function(){
     $('#mapl_logo').html('');
     var imgval=0;
     $('.mapl_class input:checked').each(function(){
        imgval += parseInt($(this).val());
      });
     $('#mapl_logo').removeAttr('class');
     $('#mapl_logo').addClass('mapl_'+imgval);
    });

     OB.Media.setMapl();
   
OB.UI.widgetHTML( $('#media_data_middle') );
   OB.UI.translateHTML( $('#media_data_middle') );
   // one or more elements have visibility depending on permissions. call our update function to adjust this.
   OB.UI.permissionsUpdate(); 
}

OB.Media.metaFormProcess = function(media_id) {

    var $form = $('.media_extend[data-id=' + media_id + ']');
    //fill in fields
    //Get the data
    OB.API.post('programs', 'getx', {
        'id': media_id
    }, (function(data) {
        if (data.status == false) return;

        var metadata = data.data;
        $form.find('.recording_location_field').val(metadata['recording_location']);
        $form.find('.recording_date_field').val(metadata['recording_date']);
        $form.find('.tracklist_field').val(metadata['tracklist']);
        var license = (metadata['license.id']);
        $form.find('.cc_license').show();
        $form.find('.cc_license_select').val(metadata['license.id']);
        $form.find('#' + media_id + '_' + license).show().siblings().hide();
        $form.find('button.viz_button').text("Hide License");
        if (metadata['cancon'] && (metadata['cancon']).indexOf('m') >= 0) $form.find('.cancon_field[value=1]').attr('checked', true);
        if (metadata['cancon'] && (metadata['cancon']).indexOf('a') >= 0) $form.find('.cancon_field[value=2]').attr('checked', true);
        if (metadata['cancon'] && (metadata['cancon']).indexOf('p') >= 0) $form.find('.cancon_field[value=4]').attr('checked', true);
        if (metadata['cancon'] && (metadata['cancon']).indexOf('l') >= 0) $form.find('.cancon_field[value=8]').attr('checked', true);
        OB.Media.setMapl();
        if (metadata['advisory'] && (metadata['advisory']).indexOf('l') >= 0) $form.find('.language_advisory_field').attr('checked', true);
        if (metadata['advisory'] && (metadata['advisory']).indexOf('v') >= 0) $form.find('.violence_advisory_field').attr('checked', true);
        if (metadata['advisory'] && (metadata['advisory']).indexOf('d') >= 0) $form.find('.drug_advisory_field').attr('checked', true);
        if (metadata['advisory'] && (metadata['advisory']).indexOf('n') >= 0) $form.find('.nudity_advisory_field').attr('checked', true);
        if (metadata['advisory'] && (metadata['advisory']).indexOf('s') >= 0) $form.find('.sex_advisory_field').attr('checked', true);
        if (metadata['advisory'] && (metadata['accessibility']).indexOf('c') >= 0) $form.find('.access_caption_field').attr('checked', true);
        if (metadata['accessibility'] && (metadata['accessibility']).indexOf('s') >= 0) $form.find('.access_sign_field').attr('checked', true);
        if (metadata['accessibility'] && (metadata['accessibility']).indexOf('d') >= 0) $form.find('.access_described_field').attr('checked', true);
        //       $form.find('.advisory_field').val(metadata['tracklist']);
        //       $form.find('.accessibility_field').val(metadata['tracklist']);
        // add our credits
        var credits = metadata.credits;
        for (var j in credits) {
          OB.Media.detailsAddCredit(credits[j].media_id, credits[j].role_id, credits[j].role + ' : ' + credits[j].name);
        }
      //set saved placard

       OB.Media.showGallery(metadata.id,metadata.placard_id);
    })); // end of API call
}

OB.Media.showGallery = function(id,placard_id)
{
  var $form = $('.media_extend[data-id=' + id + ']');
  OB.API.post('programs','programmed',{'id':id},function(data){
//we only get the first program, should either limit or allow multiple
   if (data.status == false) return;
    var program_id=data.data.program_id;
    var program_title =data.data.title;
    var title_htm = '<h2>'+program_title+'</h2>';
    $form.find('.media_placards').append(title_htm);
//set the program title for the placards
    OB.API.post('programs','get_placard',{'pid':program_id}, function(results){
  var gallery = results.data;
  var dhtml = '';
  for(var i in gallery)
	{
var placard_src ='<figure><img src="preview.php?id='+gallery[i]+'&dl=0&mode=0"/></figure>';
        dhtml += '<div style="white-space:nowrap; display:inline-block;"><input type="radio" name="media_'+id+'_placards" id="placard_'+id+'_'+gallery[i]+'" value="'+gallery[i]+'"/><label for="placard_'+id+'_'+gallery[i]+'">'+placard_src+'</label></div>';  
	}
    $form.find('.media_placards').append(dhtml);
//after much delib, back here again to create an API call to find the gallery_id
     if(placard_id)
     {
      $form.find('.media_placards input:radio[name=media_'+id+'_placards]').filter('[value="'+placard_id+'"]').prop('checked',true);
     }
    });
  $form = $('#media_extend_'+id); 
  $form.find('.media_placards').show();
  });
}

OB.Media.setMapl = function()
{
    $('#mapl_logo').html('');
     var imgval=0;
    $('.mapl_class input:checked').each(function(){
        imgval += parseInt($(this).val());
        });
	$('#mapl_logo').removeClass();
        if(imgval>0)  $('#mapl_logo').removeClass().addClass('mapl_'+imgval);
}

OB.Media.setCC = function(mid)
{
   OB.API.post('programs','get_licenses',{},function(data){
   var licenses=data.data;
    for(var i in licenses)
	{
	   $('.cc_license_select[data-id='+mid+']').append('<option value='+licenses[i].id+'>'+htmlspecialchars(licenses[i].shortform)+'</option>');
	   $('.cc_license_form[data-id='+mid+']').append('<textarea id="'+mid+'_'+licenses[i].id+'" class="hidden cc_license_text">'+htmlspecialchars(licenses[i].description)+'</textarea>');
	} 
   });
   $('.cc_license_select[data-id='+mid+']').change(function(){
	$('#'+mid+'_'+this.value).show().siblings().hide();
	}).change();
//	alert('Holy #%it its #'); //which is not a unique id!

}

OB.Media.roleList = function(id)
{
  OB.API.post('programs','get_roles',{},function(roles){
  var list = roles.data;
  for(var i in list)
  {
      $form = $('#media_extend_'+id);
      $form.find('#media_roles').attr('data-id',id).addClass('capitalize');
      $form.find('#media_role_add_name').attr('data-id',id);
      $form.find('#media_roles[data-id="'+id+'"]').append('<option value='+list[i].id+'>'+htmlspecialchars(list[i].name)+'</option>');
  }
      $form.find('.media_credits_add').append('<input type="button" class="rmargin" value="Add" onclick="OB.Media.appendCredit('+id+')" >');

      $form.find('#media_roles').val('0');
});
}

OB.Media.appendCredit = function(id)
{
  $form = $('#media_extend_'+id);
     var role = $form.find('#media_roles :selected').text();
     var credit = $form.find('#media_role_add_name').val();
     var nextnum = $form.find('.media_credits').children().length + 1;
     if(credit !="") OB.Media.detailsAddCredit(id,nextnum,role + ' : ' + credit);
    $form.find('#media_role_add_name').val('');
    $form.find('#media_roles').val('0');
}

OB.Media.detailsAddCredit = function(media_id,credit_id,credit_text)
{
    // get rid of our help text if this is the first item.
    if($('#media_extend_'+media_id+' .media_credits > div').length<1) $('#media_extend_'+media_id+' .media_credits').html('');

    // only add if it doesn't already exist

        var newtext = 'x ' + credit_text;
       if($('.media_credits:contains("'+newtext+'")').length<1)
   {
//    if($('#media_extend_'+media_id+' .media_credits').children('[data-id="'+credit_id+'"]').length<1)
    {
      var html = '<div data-id="'+credit_id+'" class="capitalize"><a href="javascript: OB.Media.detailsRemoveCredit(\''+media_id+'\','+credit_id+');">x</a> '+htmlspecialchars(credit_text)+'</div>';
      $('#media_extend_'+media_id+' .media_credits').append(html);
    }
   }
}

OB.Media.detailsRemoveCredit = function(media_id, credit_id)
{
  $('#media_extend_'+media_id+' .media_credits').children('[data-id="'+credit_id+'"]').remove();

  // restore our help text if there are no more station IDs.
  if($('#media_extend_'+media_id+' .media_credits').children().length<1) $('#media_extend_'+media_id+' .media_credits').html(OB.t('Extend Media','Credits')).addClass("media_credit");

}

OB.Media.showLicense = function(button)
{
if($('.cc_license').is(":visible"))
   {
    $('.cc_license').hide();
    $('button.viz_button').text("Show License");
   } else
   {
   $('.cc_license').show();
    $('button.viz_button').text("Hide License");
   }
}

/*
OB.Media.copyTag = function(button)
{
var tags = $(button).parent().find('.keyword_list').tagEditor('getTags')[0].tags;
 $('.media_addedit').each( function(index,element) {
  for (i = 0; i < tags.length; i++) { $(element).parent().find('.keyword_list').tagEditor('addTag', tags[i]); }
 });
}

OB.Media.clearTags = function(button)
{
var tags = $(button).parent().find('.keyword_list').tagEditor('getTags')[0].tags;
  for (i = 0; i < tags.length; i++) { $(button).parent().find('.keyword_list').tagEditor('removeTag', tags[i]); }
}
*/

OB.Media.extendedSave = function()
{
//   OB.Media.save();
  var extended_array = new Array();

  $('.media_extend').each( function(index, element) {

    var item = new Object();
    item.id = $(element).attr('data-id');

    item.recording_location = $(element).find('.recording_location_field').val();
    item.recording_date = $(element).find('.recording_date_field').val();
    item.tracklist = $(element).find('.tracklist_field').val();
    item.license = $(element).find('.cc_license_select').val();
    item.placard_id = $(element).find('.media_placards input:checked').val();
//cancon
   var mapl_content = '';
   $(element).find('.mapl_class input:checked').each(function(input)
   {
     mapl_content += (this.name.charAt(0));
   });
    item.cancon = mapl_content;

//PAL
   var advisory_content = '';
   $(element).find('.advisory_class input:checked').each(function(input)
   {
     advisory_content += (this.value);
   });
    item.advisory = advisory_content;

//CC
   var access_services = '';
   $(element).find('.access_class input:checked').each(function(input)
   {
     access_services += (this.value);
   });
    item.accessibility = access_services;

//credits
  item.credits_array = new Array();
  $form.find('.media_credits').children().each(function(index) {
       str = ($(this).text());
       ind = ($(this).index());
       firstpart = $.trim(str.split(':')[0]);
       role = $.trim(firstpart.split(' ').slice(1).join(' '));
       name = $.trim(str.split(':')[1]);
       item.credits_array.push(ind+':'+role+':'+name);
  });
    extended_array.push(item);
  });

  $('#media_data .addedit_form_message').hide();

  OB.API.post('programs','editx',{ 'media': extended_array }, function(data) { 

    // one or more validation errors.
    if(data.status==false)
    {
      var validation_errors = data.data;

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

