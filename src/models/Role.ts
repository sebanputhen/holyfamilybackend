import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  PARISHIONER = 'Parishioner',
  KOOTTAYMA_LEADER = 'Koottayma Leader',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin',
}

export interface IRole extends Document {
  name: UserRole;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(UserRole),
    },
    description: { type: String, default: '' },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
