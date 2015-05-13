/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
  config.allowedContent = true;
  config.width = '105%';
  config.height = '20em';
  config.toolbar = 'Full';
  config.enterMode = CKEDITOR.ENTER_BR;

  config.extraPlugins = 'graph';

  config.toolbar_Full =
  [
  	{ name: 'clipboard', items : [ 'Source','Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
  	{ name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
  	'/',
  	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
  	{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
  	'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
  	{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
  	{ name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
  	{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
  	{ name: 'colors', items : [ 'TextColor', 'graph'] }
  ];
};
