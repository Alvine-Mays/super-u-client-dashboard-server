import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer', index: true },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type User = InferSchemaType<typeof userSchema> & { _id: any };
export const UserModel = model('User', userSchema);
