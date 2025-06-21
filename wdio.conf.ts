export const config = {
  runner: "local",

  // specs: ["./src/tests/**/*.spec.ts"],
  // specs: ["./src/tests/simple-login.spec.ts"],
  specs: ["./src/tests/rozana-complete-flow.spec.ts"],

  exclude: [],

  maxInstances: 1,
  maxInstancesPerCapability: 1,

  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": "adb-fe55x4hior5hobvg-oe3ShO._adb-tls-connect._tcp",
      "appium:automationName": "UiAutomator2",
      "appium:appPackage": "com.rozana.customer",
      "appium:appActivity": "com.rozana.customer.MainActivity",
      "appium:noReset": false, // Change this from false to true
      "appium:autoGrantPermissions": true,
      "appium:newCommandTimeout": 180,
      "appium:fullReset": false,
      "appium:ignoreHiddenApiPolicyError": true,
      "appium:skipServerInstallation": false,
      "appium:skipDeviceInitialization": false,
    },
  ],

  logLevel: "info",

  bail: 0,

  baseUrl: "",

  waitforTimeout: 20000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,

  services: [
    [
      "appium",
      {
        logPath: "./logs",
        command: "appium",
        args: {
          address: "localhost",
          port: 4723,
          relaxedSecurity: true,
          sessionOverride: true,
          debugLogSpacing: true,
          allowInsecure: ["chromedriver_autodownload"],
        },
      },
    ],
  ],

  port: 4723,

  framework: "mocha",

  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 300000,
    // Remove the grep and invert lines
  },

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "./tsconfig.json",
    },
  },

  beforeSession: function () {
    console.log("Starting Appium session for Android device...");
  },

  after: function () {
    console.log("Test execution completed");
  },
};
