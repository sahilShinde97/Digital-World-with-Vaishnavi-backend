import Razorpay from "razorpay";
import { config } from "dotenv";

config();

let instance = null;

if (process.env.Razorpay_Key && process.env.Razorpay_Secret) {
  instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
  });
} else {
  console.warn("Razorpay credentials are missing. Payment functionality will be disabled.");
}

export { instance }; 