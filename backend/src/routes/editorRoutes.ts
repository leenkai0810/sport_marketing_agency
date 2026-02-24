import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { editorAuth } from '../middleware/editorAuth';
import { upload } from '../config/storage';
import {
    getVideoQueue,
    getMyAssignedVideos,
    assignToSelf,
    uploadEditedVideo,
    markReady,
    addNotes,
} from '../controllers/editorController';

const router = express.Router();

// All routes require authentication + editor/admin role
router.use(authenticateToken, editorAuth);

router.get('/queue', getVideoQueue);
router.get('/my-videos', getMyAssignedVideos);
router.post('/assign/:id', assignToSelf);
router.post('/upload/:id', upload.single('video'), uploadEditedVideo);
router.patch('/ready/:id', markReady);
router.patch('/notes/:id', addNotes);

export default router;
