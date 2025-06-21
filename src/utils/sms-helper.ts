import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class SMSHelper {
  private static readonly ADB_PATH = "adb";
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 5000;

  static async getOTPFromSMS(
    retryAttempts: number = this.MAX_RETRY_ATTEMPTS
  ): Promise<string | null> {
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Fetching OTP from SMS...`);

        // Get only the last 20 messages to avoid buffer overflow
        const { stdout } = await execAsync(
          `${this.ADB_PATH} shell "content query --uri content://sms/inbox --projection body --sort 'date DESC' | head -20"`,
          {
            maxBuffer: 1024 * 1024 * 2, // 2MB buffer should be enough for 20 messages
          }
        );

        // Look for OTP in the recent messages
        const lines = stdout.split("\n");
        for (const line of lines) {
          if (line.includes("Your OTP is") && line.includes("Rozana")) {
            const otpMatch = line.match(/Your OTP is (\d{4,6})/);
            if (otpMatch) {
              console.log(`✅ OTP found: ${otpMatch[1]}`);
              return otpMatch[1];
            }
          }
        }

        if (attempt < retryAttempts) {
          console.log(
            `OTP not found, retrying in ${this.RETRY_DELAY / 1000} seconds...`
          );
          await this.sleep(this.RETRY_DELAY);
        }
      } catch (error) {
        console.error(`❌ Error fetching SMS (Attempt ${attempt}):`, error);
        if (attempt === retryAttempts) {
          throw error;
        }
      }
    }

    console.log("❌ OTP not found after all attempts");
    return null;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
