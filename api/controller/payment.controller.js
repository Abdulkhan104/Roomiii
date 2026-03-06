import { instance } from "../index.js";
import crypto from "crypto";
import Joi from "joi";
import Payment from "../models/payment.model.js";

const schema = Joi.object().keys({
  listingId: Joi.string().required(),
  price: Joi.number().positive().required(),
});

export const checkout = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { listingId, price, payment_capture } = req.body;

    const options = {
      amount: Number(price * 100), // Convert to cents
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture: payment_capture,
    };

    const order = await instance.orders.create(options);
    console.log("Order created:", order);

    return res.status(200).json({
      success: true,
      order,
      amount: options.amount,
      listingId,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log("Payment verification request body:", req.body);

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // If the signature is valid, save the payment details
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await payment.save();
      console.log("Payment verified and saved:", payment);

      res.redirect(`/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
      console.error("Invalid signature:", expectedSignature, razorpay_signature);
      return res.status(400).json({
        success: false,
        error: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
