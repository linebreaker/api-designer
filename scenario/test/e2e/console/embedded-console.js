'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var shelf = new ShelfHelper();
  var apiConsole = new ConsoleHelper();

  describe('generals', function(){

    beforeEach(function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    xit('it is not displayed if are parser errors', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        '/resss: ',
        '  get: ',
        '  /ressss2:'
      ].join('\\n');
      editor.setValue(definition);
      var embeddedConsole = browser.findElement(by.css('[role="console"]'));
      expect(embeddedConsole.getAttribute('class')).toEqual('');
      editor.setLine(5,'  resss2:');
      expect(embeddedConsole.getAttribute('class')).not.toContain('ng-hide');
    });

    xdescribe('verify parser response on the console', function(){
      it('using alias', function(){
        var definition = [
          '#%RAML 0.8 ',
          'title: My api',
          '/resource1: &res1',
          '  description: this is resource1 description',
          '  /resource2: *res1'
        ].join('\\n');
        editor.setValue(definition);
        var expList = ['/resource1','/resource1 /resource2'];
        designerAsserts.consoleResourceName(expList);
        apiConsole.expandCollapseResourcebyPos(0);
        var expDescriptions = ['this is resource1 description','this is resource1 description'];
        designerAsserts.consoleResourceDescription(expDescriptions);
      });
    }); // verify parser response on the console

  });// generals

  describe('partial Refresh', function(){

    it('clear editor', function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    describe('expand method', function(){

      it('resource description', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My API it this ',
          '/presentations:  \\n        '
        ].join('\\n');
        editor.setValue(definition);
        apiConsole.expandCollapseResourcebyPos(0);
        editor.setLine(4,'  description: this is presentation resource description \\n     ');
        designerAsserts.consoleResourcesDescription(['this is presentation resource description']);
      });

      it('method + description', function (){
        editor.setLine(5, '  connect: \\n    description: this is connect method description \\n       ');
        designerAsserts.consoleMethodDescriptionCollapsed(['connect'],['this is connect method description']);
      });

    });

  }); // partial refresh

});// Embedded-console