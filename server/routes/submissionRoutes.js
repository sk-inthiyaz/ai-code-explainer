const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Submission = require('../models/Submission');
const { generatePresignedUrl, verifyLocalToken, getCode } = require('../utils/storageService');

/**
 * GET /api/problems/:problemId/submissions/latest
 * Get latest accepted submission for the authenticated user
 * Query param: status=accepted (default)
 */
router.get('/problems/:problemId/submissions/latest', auth, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user?._id || req.user?.userId;
    const status = req.query.status || 'accepted';

    const submission = await Submission.findOne({
      userId,
      problemId,
      status
    })
      .sort({ createdAt: -1 })
      .select('_id language status createdAt runtimeMs');

    if (!submission) {
      return res.status(404).json({ message: 'No accepted submission found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching latest submission:', error);
    res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
});

/**
 * GET /api/submissions/:submissionId/code
 * Get presigned URL to view code for a submission
 * AuthZ: validates ownership and tenant (userId match)
 */
router.get('/submissions/:submissionId/code', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user?._id || req.user?.userId;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // AuthZ check: must be owner
    if (String(submission.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate short-lived presigned URL (5 min)
    const signedUrl = await generatePresignedUrl(submission.storageKey, String(userId));

    res.json({
      signedUrl,
      language: submission.language,
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Error generating code URL:', error);
    res.status(500).json({ message: 'Failed to generate code URL', error: error.message });
  }
});

/**
 * GET /api/submissions/view/:token
 * Local dev endpoint: validates token and returns code directly
 * For S3/GCS, this endpoint won't be used (client fetches from presigned URL directly)
 */
router.get('/submissions/view/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyLocalToken(token);

    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const { storageKey } = decoded;
    const code = await getCode(storageKey);

    // Return as plain text for Monaco editor
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(code);
  } catch (error) {
    console.error('Error viewing code:', error);
    res.status(500).json({ message: 'Failed to retrieve code', error: error.message });
  }
});

module.exports = router;
