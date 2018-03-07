# Syncano Middleware Validate

## About

Library used to validate socket input based on socket.yml.

## Installation
```
npm install @aexol/syncano-middleware-validate
```

## Usage

This library depends on syncano-middleware lib. The basic socket example is

### socket.yml

```yaml
name: example
description: Description of example
version: 0.1.0
runtime: nodejs_v8
endpoints:
  hello:
    response:
      success:
        mimetype: application/json
        exit_code: 200
```

```javascript
import serve, {response} from '@aexol/syncano-middleware';
import validate from '@aexol/syncano-middleware-validate';

async function run(ctx, syncano) {
    return response.success({message: 'Hello world'})
}

export default ctx => serve(ctx, validate(run))
```

Input schema validation must be in inputs key.

Inputs can contain either method name objects (GET, POST, PUT, DELETE) or
common schema for all cases.

```yaml
endpoints:
  hello:
    inputs:
      GET:
        properties:
          world:
            type: string
        required:
          - world
```

## Available schemas
* #/ (https://{instanceName}.syncano.space/${socketName}) - Your socket.yml as schema
* http://local/meta - Metadata as a schema. In case of missing socket.yml schema this becomes your root schema.
* {schemaName}#/ - Extra schema for any schemas defined in `schemas` property of socket.yml. `schemas` property must be an object of key: value pairs where value must be either valid JSON Schema object or file containing schema in src directory of socket.

To use model from socket for example you can do this:

```yaml
endpoints:
  hello:
    inputs:
      GET:
        $ref: '#/Model'
Model:
  type: object
  properties:
    world:
      type: string
  required:
    - world
```

To use extra schemas you can do:

socket.yml:
```yaml
endpoints:
  hello:
    inputs:
      GET:
        $ref: 'main#/Model'
schemas:
  main: schema.yml
```

src/schema.yml
```yaml
Model:
  type: object
  properties:
    world:
      type: string
  required:
    - world
```

TODO:
* Support extension detection for extra schemas.