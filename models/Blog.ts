import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  category: String,
  tags: [String],
  readingTime: { type: Number, default: 5 },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
}, { timestamps: true })

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
