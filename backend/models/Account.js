import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    plaidAccountId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    officialName: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    subtype: {
      type: String,
    },
    balanceAvailable: {
      type: Number,
    },
    balanceCurrent: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model('Account', accountSchema);

export default Account;
