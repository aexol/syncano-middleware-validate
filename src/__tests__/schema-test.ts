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
  it('test inputs with socket data', async () => {
    const inputs = {
      GET: {
      },
      POST: {
      },
    };
    const socketYaml = `endpoints:
    inputs:
      GET:
        type: object
        properties:
          id:
            type: number
        required:
          - id
      POST:
        $ref: '#/Model'
Model:
  type: object
  properties:
    firstname:
      type: string
    lastname:
      type: string
  required:
    - firstname
    - lastname
`;
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
      socketFile: Buffer.from(socketYaml),
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
      socketFile: Buffer.from(socketYaml),
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
  it('test inputs with extra schema', async () => {
    const inputs = {
      GET: {
      },
      POST: {
      },
    };
    const socketYaml = `endpoints:
    inputs:
      GET:
        type: object
        properties:
          id:
            type: number
        required:
          - id
      POST:
        $ref: 'main#/Model'
schemas:
  main:
    Model:
      type: object
      properties:
        firstname:
          type: string
        lastname:
          type: string
      required:
        - firstname
        - lastname
`;
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
      socketFile: Buffer.from(socketYaml),
    });
    await expect(postSchema.validate({
      firstname: 'First',
      lastname: 'Last',
    })).resolves.toBe(true);
    await expect(postSchema.validate({
      id: 1,
    })).rejects.toThrow();
  });
});
