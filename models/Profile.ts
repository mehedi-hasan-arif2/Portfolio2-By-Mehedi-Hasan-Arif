import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
  name: String,
  jobTitles: [String],
  shortBio: String,
  aboutText: String,
  location: String,
  email: String,
  github: String,
  linkedin: String,
  facebook: String,
  instagram: String,
  whatsapp: String,
  heroPhoto: { type: String, default: '' },
  aboutPhoto: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  seoTitle: String,
  seoDescription: String,
}, { timestamps: true })

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
