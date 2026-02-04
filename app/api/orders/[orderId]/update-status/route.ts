import { stripe } from "@/lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount } = req.body;
  const paymentIntentId = req.headers["x-payment-intent-id"];

  if (!paymentIntentId || !amount) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Retrieve the PaymentIntent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (
      paymentIntent.status === "succeeded" ||
      paymentIntent.status === "canceled"
    ) {
      return res.status(400).json({
        error: `Cannot update PaymentIntent with status: ${paymentIntent.status}`,
      });
    }

    // Update the PaymentIntent amount
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      { amount }
    );

    return res.status(200).json({ clientSecret: updatedPaymentIntent.client_secret });
  } catch (error) {
    console.error("Error updating payment intent:", error);
    return res.status(500).json({ error: error.message });
  }
}
