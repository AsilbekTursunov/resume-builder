const fs = require('node:fs')
const path = require('node:path')
const upload = require('../middlewares/uploadMiddleware')
const Resume = require('../models/resume') 

const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([{ name: 'thumbnail' }, { name: 'profileImage' }])(req, res, async (error) => {
      if (error) {
        res.status(400).json({ message: 'File upload feiled', error: error.message })
      } 
      
      const resumeId = req.params.id
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })

      if (!resume) {
        res.status(404).json({ message: 'Resume not found or unauthorized' })
      }

      const uploadsFolder = path.join(__dirname, '..', 'uploads')
      const baseUrl = process.env.BASE_URL || 'https://resume-builder-hfxc.onrender.com'

      const newThumbnail = req.files.thumbnail?.[0]
      const newProfileImage = req.files.profileImage?.[0]
 
      
      // If new thumbnail uploaded, delete old one
      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      // If new profile image uploaded, delete old one
      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
      });
    });
  } catch (err) { 
    res.status(500).json({ message: "Failed to upload images", error: err.message });
  }
}

module.exports = { uploadResumeImages }