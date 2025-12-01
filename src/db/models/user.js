// src/db/models/User.js

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Temel email regex
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Instance Method: Şifre karşılaştırması için
userSchema.methods.checkPassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;