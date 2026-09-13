import Stripe from "stripe";
import config from "./config";

export function getStripe() {
  const apiKey = config.stripe.secretKey?.trim();
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is required before checkout or webhook handling can run.");
  }

  return new Stripe(apiKey, {
    apiVersion: "2023-10-16",
  });
}

export default getStripe;

