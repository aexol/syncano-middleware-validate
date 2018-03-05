import {Schema} from '../schema';
describe('schema test', () => {
  it('test inputs', async () => {
    const schema = new Schema({
      ctx: {
        meta: {
          metadata: {
            inputs: {
              properties: {
                firstname: {
                  type: 'string',
                },
                lastname: {
                  type: 'string',
                },
              },
              required: [
                'firstname',
                'lastname',
              ],
              type: 'object',
            },
          },
        },
      },
    });
    await expect(schema.validate({
      firstname: 'First',
      lastname: 'Last',
    })).resolves.toBe(true);
    await expect(schema.validate({
      firstname: 'First',
    })).rejects.toThrow();
  });
  it('test inputs methods', async () => {
    const inputs = {
      GET: {
        properties: {
          id: {
            type: 'number',
          },
        },
        required: [
          'id',
        ],
        type: 'object',
      },
      POST: {
        properties: {
          firstname: {
            type: 'string',
          },
          lastname: {
            type: 'string',
          },
        },
        required: [
          'firstname',
          'lastname',
        ],
        type: 'object',
      },
    };
    const getSchema = new Schema({
      ctx: {
        meta: {
          metadata: {
            inputs,
          },
          request: {
            REQUEST_METHOD: 'GET',
          },
        },
      },
    });
    const postSchema = new Schema({
      ctx: {
        meta: {
          metadata: {
            inputs,
          },
          request: {
            REQUEST_METHOD: 'POST',
          },
        },
      },
    });
    await expect(getSchema.validate({
      id: 1,
    })).resolves.toBe(true);
    await expect(getSchema.validate({
      firstname: 'First',
    })).rejects.toThrow();
    await expect(postSchema.validate({
      firstname: 'First',
      lastname: 'Last',
    })).resolves.toBe(true);
    await expect(postSchema.validate({
      id: 1,
    })).rejects.toThrow();
  });
});
