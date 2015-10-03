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

// get the media format settings.
OBModules.Programs.settings = function()
{
  $('.sf-submenu').hide();

    OB.UI.replaceMain('modules/programs/settings.html');
    
    OBModules.Programs.rolesGet();
    OBModules.Programs.themesGet();
    OBModules.Programs.licensesGet();

}

OBModules.Programs.rolesGet = function()
{

  $('#credit_roles').html('');

  OB.API.post('programs','get_roles',{},function(response)
  {

    if(!response.status) return;
  
    roles = response.data;

    $('#credit_roles').data('roles',roles);

    if(roles.length==0)
    {
      $('#credit_roles').html('<td colspan="3">No roles found.</td>');
      return;
    }

    var edit_button_text = OB.t('Common','Edit');
    $.each(roles,function(index,role) 
    {
      var $tr = $('<tr data-expanded="false" id="credit_role_'+role.id+'"></tr>');
      $tr.append('<td>'+htmlspecialchars(role.name)+'</td>');
      $tr.append('<td><a href="javascript:OBModules.Programs.rolesAddeditWindow('+role.id+');" >'+edit_button_text+'</a></td>');

      $('#credit_roles').append($tr.outerHTML());

      $('#credit_role_'+role.id).data('details',role);
    });


  });

}

OBModules.Programs.rolesAddeditWindow = function(id)
{

  if(id)
  {
    var role = $('#credit_role_'+id).data('details');
    if(!role) return;
  }

  OB.UI.openModalWindow('modules/programs/role_addedit.html');

  if(id) 
  {
    $('#role_addedit_heading').text(OB.t('Role Edit','Edit Role'));
    $('#role_name_input').val(role.name);
    $('#role_addedit_id').val(id);
  }
  else
  {
    $('#role_addedit_heading').text(OB.t('Role Edit','New Role'));
    $('#layout_modal_window .edit_only').hide();
  }


}

OBModules.Programs.roleSave = function()
{

  var postfields = new Object();
  postfields.id = $('#role_addedit_id').val();
  postfields.name = $('#role_name_input').val();

  OB.API.post('programs','role_save',postfields,function(response)
  {

    if(response.status==false) { $('#credit_role_addedit_message').obWidget('error',response.msg); }
    else
    {
      OB.UI.closeModalWindow();
      OBModules.Programs.rolesGet();
      $('#credit_roles_message').obWidget('success',['Role Edit','Saved Message']);
    }

  });
}

OBModules.Programs.roleDelete = function(confirm)
{

  var role_id = $('#role_addedit_id').val();
  var role_name = $('#credit_roles #credit_role_'+role_id+' td a').first().text();

  if(!confirm)
  {
    OB.UI.confirm('Are you sure you want to delete this role ('+role_name+')?)',function() { OBModules.Programs.roleDelete(true); }, ['Common','Yes Delete'], ['Common','No Cancel'], 'delete');
  }  

  else
  {
    OB.API.post('programs','role_delete', {'id': role_id}, function(response)
    {
      if(response.status==false) { $('#role_addedit_message').obWidget('error',response.msg); }
      else
      {
        OB.UI.closeModalWindow();
        OBModules.Programs.rolesGet();
        $('#credit_roles_message').obWidget('success',['Role Edit','Category Deleted Message']);
      }
    });
  }
}

OBModules.Programs.themesGet = function()
{

  $('#program_themes').html('');

  OB.API.post('programs','get_themes',{},function(response)
  {

    if(!response.status) return;
  
    themes = response.data;

    $('#program_themes').data('themes',themes);

    if(themes.length==0)
    {
      $('#program_themes').html('<td colspan="3">No themes found.</td>');
      return;
    }

    var edit_button_text = OB.t('Common','Edit');
    $.each(themes,function(index,theme) 
    {
      var $tr = $('<tr data-expanded="false" id="program_theme_'+theme.id+'"></tr>');
      $tr.append('<td>'+htmlspecialchars(theme.name)+'</td>');
      $tr.append('<td><a href="javascript:OBModules.Programs.themesAddeditWindow('+theme.id+');" >'+edit_button_text+'</a></td>');

      $('#program_themes').append($tr.outerHTML());

      $('#program_theme_'+theme.id).data('details',theme);
    });


  });

}

OBModules.Programs.themesAddeditWindow = function(id)
{

  if(id)
  {
    var theme = $('#program_theme_'+id).data('details');
    if(!theme) return;
  }

  OB.UI.openModalWindow('modules/programs/theme_addedit.html');

  if(id) 
  {
    $('#theme_addedit_heading').text(OB.t('Theme Edit','Edit Theme'));
    $('#theme_name_input').val(theme.name);
    $('#theme_addedit_id').val(id);
  }
  else
  {
    $('#theme_addedit_heading').text(OB.t('Theme Edit','New Theme'));
    $('#layout_modal_window .edit_only').hide();
  }


}

OBModules.Programs.themeSave = function()
{

  var postfields = new Object();
  postfields.id = $('#theme_addedit_id').val();
  postfields.name = $('#theme_name_input').val();

  OB.API.post('programs','theme_save',postfields,function(response)
  {

    if(response.status==false) { $('#program_theme_addedit_message').obWidget('error',response.msg); }
    else
    {
      OB.UI.closeModalWindow();
      OBModules.Programs.themesGet();
      $('#program_themes_message').obWidget('success',['Theme Edit','Saved Message']);
    }

  });
}

OBModules.Programs.themeDelete = function(confirm)
{

  var theme_id = $('#theme_addedit_id').val();
  var theme_name = $('#program_themes #program_theme_'+theme_id+' td a').first().text();

  if(!confirm)
  {
    OB.UI.confirm('Are you sure you want to delete this theme ('+theme_name+')?)',function() { OBModules.Programs.themeDelete(true); }, ['Common','Yes Delete'], ['Common','No Cancel'], 'delete');
  }  

  else
  {
    OB.API.post('programs','theme_delete', {'id': theme_id}, function(response)
    {
      if(response.status==false) { $('#theme_addedit_message').obWidget('error',response.msg); }
      else
      {
        OB.UI.closeModalWindow();
        OBModules.Programs.themesGet();
        $('#program_themes_message').obWidget('success',['Theme Edit','Category Deleted Message']);
      }
    });
  }
 }

OBModules.Programs.licensesGet = function()
{

  $('#media_licenses').html('');

  OB.API.post('programs','get_licenses',{},function(response)
  {

    if(!response.status) return;
  
    licenses = response.data;

    $('#media_licenses').data('licenses',licenses);

    if(licenses.length==0)
    {
      $('#media_licenses').html('<td colspan="3">No licenses found.</td>');
      return;
    }

    var edit_button_text = OB.t('Common','Edit');
    $.each(licenses,function(index,license) 
    {
      var $tr = $('<tr data-expanded="false" id="media_license_'+license.id+'"></tr>');
      $tr.append('<td>'+htmlspecialchars(license.title)+'</td>');
      $tr.append('<td><a href="javascript:OBModules.Programs.licensesAddeditWindow('+license.id+');" >'+edit_button_text+'</a></td>');

      $('#media_licenses').append($tr.outerHTML());

      $('#media_license_'+license.id).data('details',license);
    });


  });

}

OBModules.Programs.licensesAddeditWindow = function(id)
{

  if(id>=0)
  {
    var license = $('#media_license_'+id).data('details');
    if(!license) return;
  }

  OB.UI.openModalWindow('modules/programs/license_addedit.html');

  if(id>=0) 
  {
    $('#license_addedit_heading').text(OB.t('License Edit','Edit License'));
    $('#license_title_input').val(license.title);
    $('#license_shortform_input').val(license.shortform);
    $('#license_description_input').val(license.description);
    $('#license_addedit_id').val(id);
  }
  else
  {
    $('#license_addedit_heading').text(OB.t('License Edit','New License'));
    $('#layout_modal_window .edit_only').hide();
  }


}

OBModules.Programs.licenseSave = function()
{

  var postfields = new Object();
  postfields.id = $('#license_addedit_id').val();
  postfields.title = $('#license_title_input').val();
  postfields.shortform = $('#license_shortform_input').val();
  postfields.description = $('#license_description_input').val();

  OB.API.post('programs','license_save',postfields,function(response)
  {

    if(response.status==false) { $('#media_license_addedit_message').obWidget('error',response.msg); }
    else
    {
      OB.UI.closeModalWindow();
      OBModules.Programs.licensesGet();
      $('#media_licenses_message').obWidget('success',['License Edit','Saved Message']);
    }

  });
}

OBModules.Programs.licenseDelete = function(confirm)
{

  var license_id = $('#license_addedit_id').val();
  var license_title = $('#media_licenses #media_license_'+license_id+' td a').first().text();

  if(!confirm)
  {
    OB.UI.confirm('Are you sure you want to delete this license ('+license_title+')?)',function() { OBModules.Programs.licenseDelete(true); }, ['Common','Yes Delete'], ['Common','No Cancel'], 'delete');
  }  

  else
  {
    OB.API.post('programs','license_delete', {'id': license_id}, function(response)
    {
      if(response.status==false) { $('#license_addedit_message').obWidget('error',response.msg); }
      else
      {
        OB.UI.closeModalWindow();
        OBModules.Programs.licensesGet();
        $('#media_licenses_message').obWidget('success',['License Edit','License Deleted Message']);
      }
    });
  }
 }
