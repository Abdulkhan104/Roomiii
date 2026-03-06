import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
      listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing', // Assuming you have a Listing model
        required: true,
    },
        razorpay_order_id: {
            type: String,
            required: true,
          },
          razorpay_payment_id: {
            type: String,
            required: true,
          },
          razorpay_signature: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;