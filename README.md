# Syncano Middleware Validate

## About

Library used to validate socket input based on socket.yml.

## Installation
```
npm install @aexol/syncano-middleware-validate
```

## Usage

This library depends on syncano-middleware lib. The basic socket example is

#### socket.yml

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

###### socket schema
```yaml
endpoints:
  hello:
    inputs:
      world:
        $ref: '../../#/Model'
Model:
  type: object
  properties:
    name:
      type: string
```

##### endpoint schema
```yaml
endpoints:
  hello:
    inputs:
      world:
        $ref: '../#/Model'
  Model:
    type: object
    properties:
      name:
        type: string
```

##### parameter schema
```yaml
endpoints:
  hello:
    inputs:
      world:
        $schema:
          $ref: '#/Model'
        Model:
          type: object
          properties:
            name:
              type: string
```

You can add external schemas with schemas property. Schema files must be placed in src directory of socket. Schema properties are key: value pairs
where key is schema id and value must be either schema object or file name in src directory.

socket.yml
```yaml
endpoints:
  hello:
    inputs:
      world:
        $schema:
          $ref: '../schema#/Model'
schema:
  schema: schema.yml
```

src/schema.yml
```yaml
Model:
  type: object
  properties:
    name:
      type: string
```
