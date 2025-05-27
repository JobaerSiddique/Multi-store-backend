import express from 'express'
import { UserController } from './user.controller';


const router = express.Router();


router.post('/create-user', UserController.createUser)
router.post('/createAdmin', UserController.createAdmin)
router.post('/createLocal', UserController.createLocalUser)
router.post('/createWhole', UserController.createWholerSeller)
router.get('/user',UserController.getAllUser);
router.delete('/user/:id',UserController.deleteUser);
router.put('/user/:id',UserController.userStatus);


export const UserRoute= router;