import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  tagline:        { type: String, default: '' },
  hackathonName:  { type: String, required: true },
  theme:          { type: String, default: '' },
  eventDate:      { type: Date },
  description:    { type: String, default: '' },
  requiredSkills: [String],
  maxSize:        { type: Number, required: true },
  members:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  owner:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:         { type: String, enum: ['open', 'full'], default: 'open' },
  applications:   [{
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, default: '' },
    status:  { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
