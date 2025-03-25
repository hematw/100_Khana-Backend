import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
}, { timestamps: true });

const ViewLog = mongoose.model("ViewLog", viewLogSchema);

export default ViewLog;

