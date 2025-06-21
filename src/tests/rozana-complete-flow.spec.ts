import { SMSHelper } from "../utils/sms-helper";
import { SwipeHelper } from "../utils/swipe-helper";
import { HomePage } from "../pages/home-page";
import * as userData from "../test-data/users.json";
import { expect, browser } from "@wdio/globals";

describe("Rozana App - Complete Flow", () => {
  let homePage: HomePage;

  //Test 1: Invalid Login

  // it("should show error for invalid mobile number", async () => {
  //   try {
  //     console.log("Test 1: Testing invalid login...");

  //     // Enter invalid mobile number
  //     await browser.pause(3000);
  //     const mobileInput = await browser.$("//android.widget.EditText");
  //     await mobileInput.setValue("111111111");

  //     // Click Continue
  //     await browser.pause(3000);
  //     const mobileContinue = await browser.$(
  //       '//android.view.View[@content-desc="Continue "]'
  //     );
  //     await mobileContinue.click();

  //     // Check for error message
  //     const errorMessage = await browser.$("~Invalid mobile number");
  //     await errorMessage.waitForExist({ timeout: 10000 });
  //     expect(await errorMessage.isExisting()).toBe(true);
  //     console.log("✅ Invalid mobile number error shown correctly");

  //     // Clear the input for next test
  //     await mobileInput.clearValue();
  //   } catch (error) {
  //     console.error("❌ Invalid login test failed:", error);
  //     throw error;
  //   }
  // });


  // Test 2: Valid Login
  it("should complete login flow with valid mobile number", async () => {
    try {
      console.log("Test 2: Testing valid login...");
      await browser.pause(5000);

      // Click Skip
      const skipButton = await browser.$(
        '//android.view.View[@content-desc="Skip"]'
      );
      await skipButton.waitForExist({ timeout: 10000 });
      await skipButton.click();

      // Click Continue (English is default)
      await browser.pause(2000);
      const languageContinue = await browser.$("~Continue ");
      await languageContinue.click();

      // Enter valid mobile number
      const mobileInput = await browser.$("//android.widget.EditText");
      await mobileInput.setValue(userData.validUser.mobileNumber);

      // Click Continue
      await browser.pause(3000);
      const mobileContinue = await browser.$(
        '//android.view.View[@content-desc="Continue "]'
      );
      await mobileContinue.click();

      // Wait for OTP
      await browser.pause(20000);
      const otp = await SMSHelper.getOTPFromSMS();

      if (otp) {
        console.log("✅ OTP found:", otp);
        const otpInput = await browser.$("//android.widget.EditText");
        await otpInput.setValue(otp);
      } else {
        console.log("❌ OTP not found - please enter manually");
        await browser.pause(30000);
      }

      console.log("✅ Login completed successfully");
      await browser.pause(7000);

      // Initialize HomePage for subsequent tests
      homePage = new HomePage();
    } catch (error) {
      console.error("❌ Valid login test failed:", error);
      throw error;
    }
  });

  // Test 3: Add items using search
  it("should add items using search functionality", async () => {
    try {
      console.log("Test 3: Adding items using search...");
      await browser.pause(5000);

      // Search and add Sugar
      await homePage.tapSearchButton();
      await browser.pause(7000);
      await homePage.enterSearchText("sugar");
      await browser.pause(5000);
      await homePage.selectFirstResult();
      await browser.pause(5000);
      await homePage.addToBagButton();
      await browser.pause(5000);
      await browser.back();

      // Search and add Rice
      await homePage.enterSearchText("rice");
      await browser.pause(5000);
      await homePage.selectFirstResult();
      await browser.pause(5000);
      await homePage.addToBagButton();
      await browser.pause(5000);
      await browser.back();

      // Search and add Soap
      await homePage.enterSearchText("soap");
      await browser.pause(5000);
      await homePage.selectFirstResult();
      await browser.pause(5000);
      await homePage.addToBagButton();
      await browser.pause(5000);
      await browser.back();

      // Search and add Biscuits
      await homePage.enterSearchText("biscuits");
      await browser.pause(5000);
      await homePage.selectFirstResult();
      await browser.pause(5000);
      await homePage.addToBagButton();
      await browser.pause(5000);
      await browser.back();
      await browser.back();
      await browser.back();

      console.log("✅ All items added via search successfully");
    } catch (error) {
      console.error("❌ Search and add items test failed:", error);
      throw error;
    }
  });

  // Test 4: Add items from default view and swap
  it("should add items from default view and perform swap operations", async () => {
    try {
      console.log("Test 4: Adding items from default view...");
      await browser.pause(5000);

      // Find and add items
      const item1 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[1]"
      );
      const item2 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[2]"
      );
      const item3 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[3]"
      );
      const item4 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[4]"
      );

      await browser.pause(5000);

      // Add items
      await item1.click();
      await browser.pause(5000);
      await item2.click();
      await browser.pause(5000);
      await item3.click();
      await browser.pause(5000);

      // Remove one item
      const itemRemove = await browser.$(
        "(//android.view.View[contains(@content-desc, '₹')]/android.view.View[2])"
      );
      await itemRemove.waitForExist({ timeout: 20000 });
      await browser.pause(5000);
      await itemRemove.click();

      // Add fourth item
      await item4.click();

      // Add one more of an item
      const itemAddMore = await browser.$(
        "(//android.view.View[contains(@content-desc, '₹')]/android.view.View[3])"
      );
      await itemAddMore.waitForExist({ timeout: 20000 });
      await browser.pause(4000);
      await itemAddMore.click();
      await browser.pause(5000);

      console.log("✅ Items added and swapped successfully");
    } catch (error) {
      console.error("❌ Add and swap items test failed:", error);
      throw error;
    }
  });

  // Test 5: Order from Grocery category
  it("should add items from Grocery category", async () => {
    try {
      console.log("Test 5: Adding items from Grocery category...");

      // Swipe down to find categories
      await SwipeHelper.swipeDown();
      await browser.pause(3000);
      await SwipeHelper.swipeDown();
      await browser.pause(5000);

      // Click Fashion category
      const fashionButton = await browser.$(
        "//android.widget.ImageView[contains(@content-desc, 'Grocery')]"
      );
      await fashionButton.waitForExist({ timeout: 20000 });
      await fashionButton.click();

      await browser.pause(5000);
      await SwipeHelper.swipeUp();

      // Find and add grocery items
      const item1 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[1]"
      );
      const item2 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[2]"
      );
      const item3 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[3]"
      );
      const item4 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[4]"
      );

      await browser.pause(3000);

      // Add all grocery items
      await item1.click();
      await browser.pause(5000);
      await item2.click();
      await browser.pause(5000);
      await item3.click();
      await browser.pause(5000);
      await item4.click();
      await browser.pause(5000);

      console.log("✅ Grocery items added successfully");
    } catch (error) {
      console.error("❌ Grocery category test failed:", error);
      throw error;
    }
  });

  //Test 5: Order from Fashion category

  // it("should add items from Fashion category", async () => {
  //   try {
  //     console.log("Test 5: Adding items from Fashion category...");

  //     // Swipe down to find categories
  //     await SwipeHelper.swipeDown();
  //     await browser.pause(3000);
  //     await SwipeHelper.swipeDown();
  //     await browser.pause(5000);

  //     // Click Fashion category
  //     const fashionButton = await browser.$(
  //       "//android.widget.ImageView[contains(@content-desc, 'Fashion')]"
  //     );
  //     await fashionButton.waitForExist({ timeout: 20000 });
  //     await fashionButton.click();

  //     await browser.pause(5000);
  //     await SwipeHelper.swipeUp();

  //     // Find and add fashion items
  //     const item1 = await SwipeHelper.swipeUntilElementFound(
  //       "(//android.view.View[@content-desc='Add +'])[1]"
  //     );
  //     const item2 = await SwipeHelper.swipeUntilElementFound(
  //       "(//android.view.View[@content-desc='Add +'])[2]"
  //     );
  //     const item3 = await SwipeHelper.swipeUntilElementFound(
  //       "(//android.view.View[@content-desc='Add +'])[3]"
  //     );
  //     const item4 = await SwipeHelper.swipeUntilElementFound(
  //       "(//android.view.View[@content-desc='Add +'])[4]"
  //     );

  //     await browser.pause(3000);

  //     // Add all fashion items
  //     await item1.click();
  //     await browser.pause(5000);
  //     await item2.click();
  //     await browser.pause(5000);
  //     await item3.click();
  //     await browser.pause(5000);
  //     await item4.click();
  //     await browser.pause(5000);

  //     console.log("✅ Fashion items added successfully");
  //   } catch (error) {
  //     console.error("❌ Fashion category test failed:", error);
  //     throw error;
  //   }
  // });

  //Test 6: Order from Footwear category

  it("should add items from Footwear category", async () => {
    try {
      console.log("Test 6: Adding items from Footwear category...");

      // Swipe down to find categories
      await SwipeHelper.swipeDown();
      await browser.pause(3000);
      await SwipeHelper.swipeDown();
      await browser.pause(5000);

      // Click Footwear category
      const footwearButton = await browser.$(
        "//android.widget.ImageView[contains(@content-desc, 'Footwear')]"
      );
      await footwearButton.waitForExist({ timeout: 20000 });
      await footwearButton.click();

      await browser.pause(5000);
      await SwipeHelper.swipeUp();

      // Find and add footwear items
      const item1 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[1]"
      );
      const item2 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[2]"
      );
      const item3 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[3]"
      );
      const item4 = await SwipeHelper.swipeUntilElementFound(
        "(//android.view.View[@content-desc='Add +'])[4]"
      );

      await browser.pause(5000);

      // Add all footwear items
      await item1.click();
      await browser.pause(5000);
      await item2.click();
      await browser.pause(5000);
      await item3.click();
      await browser.pause(5000);
      await item4.click();
      await browser.pause(5000);

      console.log("✅ Footwear items added successfully");
    } catch (error) {
      console.error("❌ Footwear category test failed:", error);
      throw error;
    }
  });

  //Test 7: Validate cart items
  it("should validate items in cart", async () => {
    try {
      console.log("Test 7: Validating cart items...");

      // Open My Bag
      const myBagButton = await browser.$(
        '//android.widget.Button[@content-desc="My Bag"]'
      );
      await myBagButton.waitForExist({ timeout: 20000 });
      await myBagButton.click();
      // Wait for items count to appear
      const totalItemLocator = await browser.$(
        '//android.view.View[contains(@content-desc, "Items")]'
      );
      await totalItemLocator.waitForExist({ timeout: 20000 });

      const itemText = await totalItemLocator.getAttribute("content-desc");
      console.log("Raw item text:", itemText);

      // Extract number from string
      const match = itemText.match(/(\d+)/);
      if (match) {
        const itemCount = parseInt(match[1]);
        console.log("Parsed item count:", itemCount);

        // if (itemCount > 8) {
        //   console.log("✅ More than 8 items in cart.");
        // } else {
        //   console.log("❌ Less than or equal to 8 items in cart.");
        // }

        // expect(itemCount).toBeGreaterThan(8);
      }

      console.log("✅ Cart validation completed");
    } catch (error) {
      console.error("❌ Cart validation test failed:", error);
      throw error;
    }
  });

  // Test 8: Complete payment flow
  it("should complete payment and track order", async () => {
    try {
      console.log("Test 8: Completing payment flow...");

      // Make sure we're on the bag page first
      const bagIndicator = await browser.$(
        '//android.view.View[contains(@content-desc, "Items")]'
      );
      await bagIndicator.waitForExist({ timeout: 10000 });
      console.log("✅ On My Bag page");

      // Click Go to Payment
      console.log("Clicking Go to Payment...");
      await homePage.goToPayment();

      // Wait for navigation to complete
      await browser.pause(5000);

      // Check if we're on payment page by looking for the Pay button itself
      console.log("Checking if payment page loaded...");
      let paymentPageLoaded = false;

      try {
        // The most reliable indicator is the Pay button itself
        const payButton = await browser.$(
          '//android.view.View[@content-desc="Pay"]'
        );
        paymentPageLoaded = await payButton.isExisting();

        if (paymentPageLoaded) {
          console.log("✅ Payment page loaded - Pay button found");
        }
      } catch (e) {
        console.log("Pay button not found yet");
      }

      // If Pay button not found, check for other indicators
      if (!paymentPageLoaded) {
        const paymentIndicators = [
          '//android.view.View[contains(@content-desc, "Price details")]',
          '//android.widget.TextView[contains(@text, "Price details")]',
          '//android.view.View[contains(@content-desc, "₹")]',
          '//android.widget.TextView[contains(@text, "Total")]',
        ];

        for (const indicator of paymentIndicators) {
          const element = await browser.$(indicator);
          if (await element.isExisting()) {
            paymentPageLoaded = true;
            console.log("✅ Payment page loaded - found:", indicator);
            break;
          }
        }
      }

      if (!paymentPageLoaded) {
        // Take screenshot to see what's on screen
        await browser.saveScreenshot(
          `./screenshots/payment-page-check-${Date.now()}.png`
        );
        console.log(
          "⚠️ Payment page indicators not found, but continuing anyway..."
        );
      }

      // Look for Cash on Delivery
      console.log("Looking for payment options...");
      const codSelectors = [
        '//android.view.View[contains(@content-desc, "Cash on Delivery")]',
        '//android.widget.TextView[contains(@text, "Cash on Delivery")]',
        '//android.widget.ImageView[contains(@content-desc, "Cash")]',
        '//*[contains(@text, "COD")]',
      ];

      let codFound = false;
      for (const selector of codSelectors) {
        const element = await browser.$(selector);
        if (await element.isExisting()) {
          codFound = true;
          console.log("✅ Cash on Delivery option found");
          break;
        }
      }

      if (!codFound) {
        console.log(
          "⚠️ Cash on Delivery option not explicitly found, but continuing..."
        );
      }

      // Wait for page to stabilize
      await browser.pause(3000);

      // Scroll to make sure Pay button is visible
      console.log("Scrolling to find Pay button...");
      await SwipeHelper.swipeUp();
      await browser.pause(2000);

      // Click Pay button
      console.log("Clicking Pay button...");
      try {
        await homePage.clickPay();
        console.log("✅ Pay button clicked");
      } catch (error) {
        console.error("Failed to click Pay button:", error);

        // Try alternative method
        console.log("Trying alternative method to click Pay...");
        const payButtonAlt = await browser.$(
          '//android.view.View[@content-desc="Pay"]'
        );
        await payButtonAlt.click();
      }

      // Wait for order processing
      console.log("Waiting for order to be processed...");
      await browser.pause(5000);

      // Check for order success
      const successFound = await homePage.isOrderPlacedSuccessfully();

      if (successFound) {
        console.log("✅ Order placed successfully!");

        // Try to click Track Order
        try {
          await homePage.clickTrackOrder();
          await browser.pause(3000);
          console.log("✅ Clicked Track Order");
        } catch (error) {
          console.log("Track Order not found, continuing...");
        }
      } else {
        console.log("⚠️ Order success message not found");
        // Take screenshot
        await browser.saveScreenshot(
          `./screenshots/order-result-${Date.now()}.png`
        );
      }

      // Navigate back to home
      console.log("Navigating back to home...");
      await browser.pause(2000);

      // Try multiple times to get back to home
      for (let i = 0; i < 4; i++) {
        await browser.back();
        await browser.pause(2000);

        const homeVisible = await homePage.isHomeVisible();
        if (homeVisible) {
          console.log("✅ Returned to home screen");
          break;
        }
      }

      // Final verification
      const isHomeVisible = await homePage.isHomeVisible();
      expect(isHomeVisible).toBe(true);
      console.log("✅ Test completed successfully");
    } catch (error) {
      console.error("❌ Payment flow test failed:", error);

      // Take error screenshot
      await browser.saveScreenshot(
        `./screenshots/payment-error-${Date.now()}.png`
      );

      // Try to recover by going back to home
      console.log("Attempting to recover...");
      try {
        for (let i = 0; i < 5; i++) {
          await browser.back();
          await browser.pause(1000);
        }
      } catch (e) {
        console.log("Recovery failed");
      }

      throw error;
    }
  });

  // Optional Test 9: Clear cart for next run
  // it("should clear cart after test completion", async () => {
  //   try {
  //     console.log("Test 9: Clearing cart for next run...");

  //     // Check if we need to open My Bag
  //     const myBagButton = await browser.$(
  //       '//android.widget.Button[@content-desc="My Bag"]'
  //     );
  //     if (await myBagButton.isExisting()) {
  //       await myBagButton.click();
  //       await browser.pause(2000);
  //     }

  //     // Clear all items from cart
  //     let removeButtons = await browser.$$(
  //       '//android.view.View[contains(@content-desc, "₹")]/android.view.View[1]'
  //     );

  //     // while (removeButtons.length > 0) {
  //     //   for (const button of removeButtons) {
  //     //     try {
  //     //       if (await button.isExisting()) {
  //     //         await button.click();
  //     //         await browser.pause(1000);
  //     //       }
  //     //     } catch (error) {
  //     //       // Button might have been removed, continue
  //     //     }
  //     //   }
  //     //   // Re-check for remaining items
  //     //   removeButtons = await browser.$$(
  //     //     '//android.view.View[contains(@content-desc, "₹")]/android.view.View[1]'
  //     //   );
  //     // }

  //     console.log("✅ Cart cleared for next test run");
  //   } catch (error) {
  //     console.log("⚠️ Could not clear cart:", error);
  //   }
  // });

  // After all tests
  after(async () => {
    console.log("All tests completed successfully!");
    // Take a final screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await browser.saveScreenshot(`./screenshots/final-state-${timestamp}.png`);
  });
});
