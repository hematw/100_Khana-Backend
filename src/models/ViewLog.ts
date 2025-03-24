import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ipAddress: {
        type: String,
    },
}, { timestamps: true });

const ViewLog = mongoose.model("ViewLog", viewLogSchema);

export default ViewLog;

