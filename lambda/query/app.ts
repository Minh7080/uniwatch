export const lambdaHandler = async (
  _event: any,
  _context: any,
): Promise<{ statusCode: number; body: string }> => {
  const body = _event.body ? JSON.parse(_event.body) : undefined;
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body provided'
      })
    };
  }

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        he: JSON.parse(_event.body).greeting,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
