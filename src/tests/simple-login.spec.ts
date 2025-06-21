// src/tests/simple-login.spec.ts
import { SMSHelper } from "../utils/sms-helper";
import * as userData from "../test-data/users.json";
import { expect } from "@wdio/globals";

describe("Rozana App - Simple Flow", () => {
  it("should complete login flow and reach home page", async () => {
    try {
      console.log("Step 1: App opened, waiting for Skip button...");
      await browser.pause(5000);

      // Step 1: Click Skip
      const skipButton = await $('//android.view.View[@content-desc="Skip"]');
      await skipButton.waitForExist({ timeout: 10000 });
      await skipButton.click();
      console.log("✅ Clicked Skip button");

      // Step 2: Select language (Click Continue - English is default)
      await browser.pause(2000);
      const languageContinue = await $("~Continue ");
      await languageContinue.click();
      console.log("✅ Selected language (English)");

      // Step 3: Enter valid mobile number
      await browser.pause(3000);
      const mobileInput = await $("//android.widget.EditText");
      await mobileInput.setValue(userData.validUser.mobileNumber);
      console.log("✅ Entered mobile number:", userData.validUser.mobileNumber);

      // Click Continue after entering number
      await browser.pause(3000);
      const mobileContinue = await $(
        '//android.view.View[@content-desc="Continue "]'
      );
      await mobileContinue.click();
      console.log("✅ Clicked Continue after mobile number");

      // Step 4: Wait for OTP screen and enter OTP
      await browser.pause(5000);
      console.log("Fetching OTP...");

      const otp = await SMSHelper.getOTPFromSMS();
      if (otp) {
        console.log("✅ OTP found:", otp);

        // Enter OTP
        const otpInput = await $("//android.widget.EditText");
        await otpInput.waitForExist({ timeout: 10000 });
        await otpInput.setValue(otp);
        console.log("✅ OTP entered successfully");
      } else {
        console.log(
          "❌ OTP not found - please enter manually within 30 seconds"
        );
        await browser.pause(30000);
      }

      // Step 5: Wait for login to complete
      console.log("Waiting for login to complete...");
      await browser.pause(5000);

      // Check for home page elements
      console.log("Checking if we reached home page...");
      let isOnHomePage = false;

      // Try multiple selectors for home page verification
      const homePageSelectors = [
        '//android.widget.Button[@content-desc="Search"]',
        '//android.view.View[@content-desc="Search"]',
        '//*[@content-desc="Search"]',
        '//android.widget.TextView[contains(@text, "Rozana")]',
        '//android.widget.TextView[contains(@text, "Categories")]',
        '//android.widget.TextView[contains(@text, "Home")]',
        '//*[contains(@content-desc, "Home")]',
        '//*[contains(@content-desc, "Categories")]',
      ];

      for (const selector of homePageSelectors) {
        try {
          const element = await $(selector);
          if (await element.isExisting()) {
            console.log(`✅ Found home page element: ${selector}`);
            isOnHomePage = true;
            break;
          }
        } catch (error) {
          // Continue checking other selectors
        }
      }

      // If not on home page, check for any additional screens
      if (!isOnHomePage) {
        console.log("Home page not found, checking for additional screens...");

        // Check for permission dialogs or additional screens
        const additionalScreenSelectors = [
          '//android.widget.Button[@text="Allow"]',
          '//android.widget.Button[@text="ALLOW"]',
          '//android.widget.Button[@content-desc="Allow"]',
          '//android.widget.Button[@content-desc="Continue"]',
          '//android.widget.Button[@content-desc="Get Started"]',
          '//android.widget.Button[@text="OK"]',
          '//android.widget.Button[@text="Skip"]',
        ];

        for (const selector of additionalScreenSelectors) {
          try {
            const element = await $(selector);
            if (await element.isExisting()) {
              console.log(`Found additional screen button: ${selector}`);
              await element.click();
              await browser.pause(3000);
              break;
            }
          } catch (error) {
            // Continue checking
          }
        }

        // Check again for home page
        await browser.pause(3000);
        for (const selector of homePageSelectors) {
          try {
            const element = await $(selector);
            if (await element.isExisting()) {
              console.log(
                `✅ Found home page element after handling additional screen: ${selector}`
              );
              isOnHomePage = true;
              break;
            }
          } catch (error) {
            // Continue checking
          }
        }
      }

      // If still not on home page, log page source for debugging
      if (!isOnHomePage) {
        console.log(
          "Still not on home page. Taking screenshot for debugging..."
        );
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        await browser.saveScreenshot(
          `./screenshots/home-page-not-found-${timestamp}.png`
        );

        // Log some page details
        try {
          const pageSource = await driver.getPageSource();
          console.log("Current page structure (first 1000 chars):");
          console.log(pageSource.substring(0, 1000) + "...");
        } catch (error) {
          console.log("Could not get page source");
        }
      }

      expect(isOnHomePage).toBe(true);
      console.log("✅ Successfully reached home page!");
    } catch (error) {
      console.error("❌ Test failed:", error);

      // Take screenshot on failure
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await browser.saveScreenshot(`./screenshots/failure-${timestamp}.png`);

      throw error;
    }
  });

  after(async () => {
    console.log("Test execution completed");
  });
});
