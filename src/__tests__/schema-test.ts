import {InputValidator} from '../inputs';
describe('schema test', () => {
  it('test inputs', async () => {
    const schema = new InputValidator({
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
    const getSchema = new InputValidator({
      meta: {
        metadata: {
          inputs,
        },
        request: {
          REQUEST_METHOD: 'GET',
        },
      },
    });
    const postSchema = new InputValidator({
      meta: {
        metadata: {
          inputs,
        },
        request: {
          REQUEST_METHOD: 'POST',
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
    const gctx = {
      meta: {
        metadata: {
          inputs,
        },
        request: {
          REQUEST_METHOD: 'GET',
        },
      },
    };
    const pctx = {
      meta: {
        metadata: {
          inputs,
        },
        request: {
          REQUEST_METHOD: 'POST',
        },
      },
    };
    const opts = {
        ctx: {
          meta: {
            metadata: {
              inputs,
            },
        },
      },
      socketFile: Buffer.from(socketYaml),
    };
    const getSchema = new InputValidator(gctx, opts);
    const postSchema = new InputValidator(pctx, opts);
    await expect(getSchema.validate({
      id: 1,
    })).resolves.toBe(true);
    try {
      await expect(getSchema.validate({
        firstname: 'First',
      })).rejects.toThrow();
    } catch (e) {
      console.log(getSchema.schema.ajv);
    }
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
    const ctx = {
        meta: {
          metadata: {
            inputs,
          },
          request: {
            REQUEST_METHOD: 'POST',
          },
        },
      };
    const postSchema = new InputValidator(ctx,
      {ctx, socketFile: Buffer.from(socketYaml)},
    );
    await expect(postSchema.validate({
      firstname: 'First',
      lastname: 'Last',
    })).resolves.toBe(true);
    await expect(postSchema.validate({
      id: 1,
    })).rejects.toThrow();
  });
});
