import User from '../models/User';
import File from '../models/File';

import Notification from '../../mongo/schemas/Notification';
import NewUserMail from '../jobs/NewUserMail';

import Queue from '../../services/Queue';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const user = await User.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(user);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email } = await User.create(req.body);

    Queue.add(NewUserMail.key, { name, email, password: req.body.password });

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.query.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    await Notification.create({
      content: `Os dados do usuário: ${name} foram alterados`,
      user: id,
    });

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
