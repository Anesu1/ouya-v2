import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

// Client-side Stripe configuration
export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables"
    );
  }

  return import("@stripe/stripe-js").then(({ loadStripe }) =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );
};

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: "gbp",
  apiVersion: "2025-05-28.basil" as const,
  paymentMethods: {
    card: true,
    applePay: true,
    googlePay: true,
  },
};

// Helper function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (
  amount: number,
  currency = "gbp"
): number => {
  return Math.round(amount * 100);
};

// Helper function to format amount from Stripe (convert from cents)
export const formatAmountFromStripe = (
  amount: number,
  currency = "gbp"
): number => {
  return amount / 100;
};
