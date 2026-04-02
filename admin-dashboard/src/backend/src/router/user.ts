import express from 'express';
import controller from '../controllers/user';
import {checkAuth, hasPermission } from '../middlewares/auth';


const router = express.Router();

// Define routes
router.post('/users/register', controller.register);
router.post('/users/login', controller.login);
router.patch('/users/', checkAuth, hasPermission('create_user'), controller.createUser);
router.patch('/users/:id', checkAuth, hasPermission('update_user'), controller.editUser);
router.delete('/users/:id', checkAuth, hasPermission('delete_user'), controller.deleteUser);
router.post('/users/logout', checkAuth, controller.logout);
router.get('/users', checkAuth, hasPermission('read_users'), controller.getAllUsers);
router.get('/admin/reports',checkAuth,hasPermission('view_reports'),controller.getAllReports);


// Export router
export default router;