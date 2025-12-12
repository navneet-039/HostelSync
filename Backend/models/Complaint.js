const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["electricity", "water", "furniture", "cleaning", "other"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved"],
    default: "pending"
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  

  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    // Supervisor
    default: null
  },

  // Optional worker name (if supervisor assigns)
  assignedWorkerName: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);