import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticaded from '../middlewares/ensureAuthenticaded';

const usersRouter = Router();
const upload = multer(uploadConfig);

const singleUploadAvatar = upload.single('avatar');

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticaded,
  singleUploadAvatar,
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
