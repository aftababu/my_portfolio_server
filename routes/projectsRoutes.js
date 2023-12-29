const express = require('express');
const router = express.Router();

const {getAllProject, createProjectType, updateProject, deleteProject, createNewProject,deleteNewProject} = require('../controllers/projectsController');
const { isAuthencateUser } = require('../utils/auth');

router.route('/projects').get(getAllProject).post(createProjectType).delete(deleteProject)
router.route('/projects/:projectcategoryId/project/:id').put(updateProject).delete(deleteNewProject)
router.route('/projects/project/:id').post(createNewProject)



module.exports = router