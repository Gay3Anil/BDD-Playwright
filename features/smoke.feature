Feature: SauceDemo smoke checks

  @smoke
  Scenario: Standard user can log in
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    Then I should be successfully logged in