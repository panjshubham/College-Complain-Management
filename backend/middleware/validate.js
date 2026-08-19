const { z } = require('zod');

/**
 * Express middleware to validate request body against a Zod schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format the Zod error into a readable structure
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }
      next(error);
    }
  };
};

module.exports = { validate };
