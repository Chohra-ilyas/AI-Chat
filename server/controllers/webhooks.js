import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const handleStripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.log("⚠️ Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { transactionId, appId } = session.metadata;

      if (appId !== "AI-Chat") {
        return res.json({ received: true, message: "App ID mismatch" });
      }

      const transaction = await Transaction.findOne({
        _id: transactionId,
        isPaid: false,
      });

      if (!transaction) {
        return res.json({ received: true, message: "Transaction not found" });
      }

      transaction.isPaid = true;
      await transaction.save();

      await User.findByIdAndUpdate(transaction.userId, {
        $inc: { credits: transaction.credits },
      });

      console.log("✅ Payment confirmed & credits added");
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ message: error.message });
  }
};
