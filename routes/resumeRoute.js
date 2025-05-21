const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { createResume, getResumebyId, updateResume, deleteResume, getUserResumes } = require('../controllers/resumeController')
const { uploadResumeImages } = require('../controllers/uploadImages')
const router = express.Router()

router.post('/create', protect, createResume)
router.get('/get-resumes', protect, getUserResumes)
router.get('/one/:id', protect, getResumebyId)
router.post('/update/:id', protect, updateResume)
router.delete('/delete/:id', protect, deleteResume)
router.put('/upload-images/:id', protect, uploadResumeImages)

module.exports = router