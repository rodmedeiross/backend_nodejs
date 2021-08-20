import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import ensureAuthenticaded from '../middlewares/ensureAuthenticaded';

const usersRouter = Router();
const upload = multer(uploadConfig);

const singleUploadAvatar = upload.single('avatar');

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticaded,
  singleUploadAvatar,
  async (request, response) => {
    return response.json({ ok: true });
  },
);

export default usersRouter;
