import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: { type: String, required: true },
  techStack: [String],
  liveUrl: String,
  githubUrl: String,
  imageUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['completed', 'ongoing'], default: 'completed' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
