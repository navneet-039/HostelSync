const HostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  block: String,

  capacity: Number,

  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Hostel", HostelSchema);