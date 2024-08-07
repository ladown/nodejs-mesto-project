import type { Error } from 'mongoose';

export default (errors: Record<string, Error.ValidatorError>): string => {
  let errorMessage = '';

  Object.keys(errors).forEach((errorKey) => {
    const errorValue = errors[errorKey];

    if (errorValue?.properties?.message) {
      errorMessage += errorValue.properties.message;
    }
  });

  return errorMessage;
};
