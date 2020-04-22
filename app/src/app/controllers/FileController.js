import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, mimetype, size, filename: path } = req.file;

    const file = await File.create({
      name,
      mimetype,
      size,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
