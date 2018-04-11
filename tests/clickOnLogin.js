// Example Test file for writing tests

module.exports = {
  'Click Login': function (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('.login-button', 3000)
      .click('.login-button')
      .pause(3000)
      .assert.containsText('h3', 'Log In')
      .end()
  },
  'Sign In': function (browser) {
    browser
      .url('http://localhost:3000/login')
      .pause(3000)
      .setValue('input[name=username]', 'username')
      .setValue('input[name=password]', 'password')
      .click('button[type=submit]')
      .end()
  }
}
