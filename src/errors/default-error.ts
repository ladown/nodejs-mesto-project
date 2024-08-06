class DefaultError extends Error {
  statusCode: number;

  constructor(message: string = 'Произошла какая-то ошибка, попробуйте позже.') {
    super(message);
    this.statusCode = 500;
  }
}

export default DefaultError;
