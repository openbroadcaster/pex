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

OBModules.Programs = new Object();

/* Manager Page */

OBModules.Programs.init = function()
{
  OB.Callbacks.add('ready',0,OBModules.Programs.initMenu);
}

OBModules.Programs.initMenu = function()
{
  OB.UI.addSubMenuItem('media','Program Manager','programs',OBModules.Programs.details,20,'manage_programs');
  OB.UI.addSubMenuItem('admin','Program Settings','programs',OBModules.Programs.settings,20,'manage_programs');
  $('#sidebar_search_program_input').keyup(
      function () {
        $.doTimeout('program_search_timeout',750, function() { OB.Sidebar.programSearch(); });
      });
  $('#sidebar_search_tabs').append('<div class="sidebar_search_tab" id="sidebar_search_tab_programs" onclick="OB.Sidebar.showProgramSearch();"><a data-t>Programs</a></div>');
  var dhtml = OB.UI.getHTML('modules/programs/search.html');
  $('#sidebar_search').append(dhtml);
  $('#sidebar_search_program_input').keyup(
      function () {
        $.doTimeout('program_search_timeout',750, function() { OB.Sidebar.programSearch(); });
      });
  OB.Sidebar.programEditDeleteVisibility();
  OB.Sidebar.mediaSearchFilter('approved');
  OB.Sidebar.programSearch();
}

OBModules.Programs.settings = function()
{
  OB.UI.replaceMain('modules/programs/settings.html');
  $('.sf-submenu').hide();
  OBModules.Programs.programSettings();
}

OBModules.Programs.details = function()
{
  OB.UI.replaceMain('modules/programs/programs.html');
  $('.sf-submenu').hide();
  OBModules.Programs.detailProgramList();
}

OBModules.Programs.roleList = function(id)
{
  OB.API.post('programs','get_roles',{},function(roles){
  var list = roles.data;
  for(var i in list)
  {
      $form = $('.program_details_form[data-pid='+id+']');
      $form.find('#credit_roles').attr('data-id',id).addClass('capitalize');
      $form.find('#credit_role_add_name').attr('data-id',id);
      $form.find('#credit_roles[data-id="'+id+'"]').append('<option value='+list[i].id+'>'+htmlspecialchars(list[i].name)+'</option>');
  }
     $form.find('.program_credits_add').append('<input type="button" class="rmargin" value="Add" onclick="OBModules.Programs.appendCredit(\''+id+'\')" >');

      $form.find('#credit_roles').val('0');
});
}

OBModules.Programs.themeList = function(data)
{
  OB.API.post('programs','get_themes',{},function(themes){
  	var list = themes.data;
  if(data) var program_id = data.pid;
  else program_id = 'new';
  	for(var i in list)
  	{
      	$form = $('.program_details_form[data-pid='+program_id+']');
   //   	$form.find('.program_details_theme').attr('data-id',id);
   //   	$form.find('.program_details_theme[data-id='+id+']').append('<option value="'+list[i].id+'">'+htmlspecialchars(list[i].name)+'</option>');
      	$form.find('.program_details_theme').append('<option value="'+list[i].id+'">'+htmlspecialchars(list[i].name)+'</option>');
  	}
        if(!program_id==='new') {$form.find('.program_details_theme').val(data.theme_id);}
   });
}
