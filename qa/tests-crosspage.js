var Browser = require('zombie'),
  assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
  setup(function(){
    browser = new Browser();
  });
  test('requesting a group rate quote     from the river tour page' +
      'should populate the referrer field', function(done){
      browser.visit(referrer, function(){
        browser.clickLink('.requestGroupRate', function(){
          assert(browser.field('referrer').value
            === referrer);
            done();
          });
      });
    });
});
