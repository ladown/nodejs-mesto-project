class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Передан неверный логин или пароль') {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
