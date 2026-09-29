import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from './Role';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  assignedKoottayma?: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  personId?: mongoose.Types.ObjectId;
  isActive: boolean;
  refreshTokens: string[];
  fcmTokens: string[];
  lastLogin?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.PARISHIONER,
    },
    assignedKoottayma: { type: Schema.Types.ObjectId, ref: 'Koottayma', default: null },
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', default: null },
    personId: { type: Schema.Types.ObjectId, ref: 'Person', default: null },
    isActive: { type: Boolean, default: true },
    refreshTokens: [{ type: String }],
    fcmTokens: [{ type: String }],
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
