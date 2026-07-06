import mongoose from 'mongoose'

const ExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  current: { type: Boolean, default: false },
  description: String,
  skills: [String],
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema)
