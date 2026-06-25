import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  gender:          {type: String,enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],required: true,trim: true},
  college:         { type: String, default: '' },
  bio:             { type: String, default: '' },
  avatarUrl:       { type: String, default: '' },
  skillsToTeach:   [String],
  skillsToLearn:   [String],
  openToLearnAll:  { type: Boolean, default: false },
  connections:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  githubUrl:       { type: String, default: '' },
  linkedinUrl:     { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);