import Mail from '../../services/Mail';

class NewUserMail {
  get key() {
    return 'NewUserMail';
  }

  async handle({ data }) {
    const { name, email, password } = data;

    console.log(
      `Executou a fila de envio de email para um novo usuário: ${email}`
    );

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Novo cadastro',
      template: 'newUser',
      context: {
        name,
        email,
        password,
        link: 'http://localhost:3333',
      },
    });
  }
}

export default new NewUserMail();
