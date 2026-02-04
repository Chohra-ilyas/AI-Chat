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
    console.log(`⚠️  Webhook signature verification failed.`, error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;
        if (appId === "AI-Chat") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });
          if (transaction) {
            transaction.isPaid = true;
            await User.findByIdAndUpdate(transaction.userId, {
              $inc: { credits: transaction.credits },
            });
            await transaction.save();
          }
        } else {
          return res.json({ received: true, message: "App ID mismatch" });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: error.message });
  }
};
