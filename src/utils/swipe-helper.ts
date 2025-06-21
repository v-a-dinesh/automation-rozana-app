import { browser } from "@wdio/globals";

export class SwipeHelper {
  static async swipeUp(duration: number = 800) {
    const windowSize = await browser.getWindowSize();
    await browser.execute("mobile: swipeGesture", {
      left: 50,
      top: 400,
      width: windowSize.width - 200,
      height: windowSize.height - 1000,
      direction: "up",
      percent: 0.8,
    });
  }

  static async swipeDown(duration: number = 800) {
    const windowSize = await browser.getWindowSize();
    await browser.execute("mobile: swipeGesture", {
      left: 50,
      top: 400,
      width: windowSize.width - 200,
      height: windowSize.height - 1000,
      direction: "down",
      percent: 0.8,
    });
  }

  static async swipeUntilElementFound(xpath: string, maxSwipes: number = 5) {
    for (let i = 0; i < maxSwipes; i++) {
      try {
        const element = await browser.$(xpath);
        if (await element.isExisting()) {
          return element;
        }
      } catch (error) {
        // Element not found, continue swiping
      }

      const windowSize = await browser.getWindowSize();
      await browser.execute("mobile: swipeGesture", {
        left: 50,
        top: 300,
        width: windowSize.width - 200,
        height: windowSize.height - 1000,
        direction: "up",
        percent: 0.79,
      });
      await browser.pause(1500);
    }
    throw new Error(`Element ${xpath} not found after ${maxSwipes} swipes.`);
  }
}
