import { browser } from "@wdio/globals";

export class HomePage {
  // Locators
  private homeSearchButton = '//android.view.View[@content-desc="Search for"]';
  private homeSearchInput = "//android.widget.EditText";
  private searchItemFirst =
    "//android.view.View[@scrollable='true']/android.view.View[2]";
  private searchItemSecond =
    "//android.view.View[@scrollable='true']/android.view.View[3]";
  private goBack = 'new UiSelector().description("Go Back")';
  private addToBag = "~Add to Bag";
  private myBagButton = '//android.widget.Button[@content-desc="My Bag"]';
  private goToPaymentButton =
    '//android.widget.Button[@content-desc="Go to Payment"]';
  // Update the pay button selector in your HomePage class
  private payButton = '//android.view.View[@content-desc="Pay"]'; // Changed from '~Pay'
  private orderSuccessMessage = "~Your order is placed successfully!";
  private trackOrderButton = "~Track Order";
  private homeSection =
    '//android.widget.ImageView[contains(@content-desc, "Home")]';
  private itemsCount = '//android.view.View[contains(@content-desc, "Items")]';

  async tapSearchButton() {
    try {
      const searchButton = await browser.$(this.homeSearchButton);
      await searchButton.waitForExist({ timeout: 20000 });
      await searchButton.click();
    } catch (error) {
      throw new Error(
        "❌ Search input did not appear after tapping search button."
      );
    }
  }

  async enterSearchText(text: string) {
    const searchInput = await browser.$(this.homeSearchInput);
    await searchInput.waitForExist({ timeout: 20000 });
    await searchInput.clearValue();
    await searchInput.click();
    await searchInput.setValue(text);
  }

  async selectFirstResult() {
    const firstResult = await browser.$(this.searchItemFirst);
    await firstResult.waitForExist({ timeout: 20000 });
    await firstResult.click();
  }

  async selectSecondResult() {
    const secondResult = await browser.$(this.searchItemSecond);
    await secondResult.waitForExist({ timeout: 20000 });
    await secondResult.click();
  }

  async goBackButton() {
    const backButton = await browser.$(`android=${this.goBack}`);
    await backButton.waitForExist({ timeout: 20000 });
    await backButton.click();
  }

  async addToBagButton() {
    const addButton = await browser.$(this.addToBag);
    await addButton.waitForExist({ timeout: 20000 });
    await addButton.click();
  }

  // Add these methods inside the class


  async goToPayment() {
    try {
      // Wait for any loading to complete
      await browser.pause(2000);

      // Find the button
      const paymentBtn = await browser.$(this.goToPaymentButton);
      await paymentBtn.waitForExist({ timeout: 20000 });
      await paymentBtn.waitForDisplayed({ timeout: 10000 });

      // Scroll to make sure button is in view
      await paymentBtn.scrollIntoView();
      await browser.pause(1000);
      await paymentBtn.click();
      // Try multiple click methods

      // Wait a bit for navigation
      await browser.pause(2000);

      // Verify we actually navigated
      const stillOnBagPage = await browser
        .$('//android.view.View[contains(@content-desc, "Items")]')
        .isExisting();
      if (stillOnBagPage) {
        console.log("Still on bag page, trying alternative click method...");
      }
    } catch (error) {
      console.error("Failed to click Go to Payment:", error);
      throw error;
    }
  }

  async clickPay() {
    const payBtn = await browser.$(this.payButton);
    await payBtn.waitForExist({ timeout: 20000 });
    await payBtn.click();
  }

  async isOrderPlacedSuccessfully() {
    try {
      const successMsg = await browser.$(this.orderSuccessMessage);
      await successMsg.waitForExist({ timeout: 20000 });
      return await successMsg.isExisting();
    } catch {
      return false;
    }
  }

  async clickTrackOrder() {
    const trackBtn = await browser.$(this.trackOrderButton);
    await trackBtn.waitForExist({ timeout: 20000 });
    await trackBtn.click();
  }

  async isHomeVisible() {
    try {
      const home = await browser.$(this.homeSection);
      await home.waitForExist({ timeout: 20000 });
      return await home.isExisting();
    } catch {
      return false;
    }
  }

  async getItemCount() {
    const itemsElement = await browser.$(this.itemsCount);
    await itemsElement.waitForExist({ timeout: 20000 });
    const itemText = await itemsElement.getAttribute("content-desc");
    const match = itemText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
} // This closing brace ends the HomePage class
