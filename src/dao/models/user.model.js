import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);

export default userModel;