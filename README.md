# Syncano Middleware Validate

## About

Library used to validate socket input based on socket.yml.

## Installation
```
npm install syncano-middleware-validate
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

For each point validation rules can be contained in two places, either parameters or constraints objects of endpoint.


### Parameters
```yaml
endpoints:
  hello:
    parameters:
      world:
        type: string
        required: true
```

### Constraints
```yaml
endpoints:
  hello:
    constraints:
      get:
        world:
          type: string
          required: true
```

The difference between the two boils down to the fact that constraints allow
for separate validation rules depending on request method (DELETE, GET, PUT, POST) while each property in parameters object is treated as input argument.

For constraints object if it contains property matching lower case of request method contents of `constraints.${lcaseMethod}` will be used as validation rules.

Both objects, that is `parameters` and `constraints<.lcaseMethod>` are merged with constraints object having higher priority.

### Available validators

All validate.js validators are avilable, with some additional ones:
* contains - Test whether value is contained in an array
* defined - Tests if object is defined (not `null` or `undefined`)
* empty - Tests if object is not empty (defined and not falsy)
* match - Matches string against regex pattern
* type - Check if object type matches (array, boolean, datetime, integer, number, object, string)
* $schema - This is a special case validator for more complex scenarios, it takes either schema object or string with schema id as an argument and matches object against that schema. Schema must be a valid JSON Schema.

#### $schema validator

From parameter's viewpoint schema validator has 3 available schemas:
* socket schema
* endpoint schema
* parameter schema

You can refer to each of those from parameter like so:

###### socket schema
```yaml
endpoints:
  hello:
    parameters:
      world:
        $schema:
          $ref: '../../schema#/Model'
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
    parameters:
      world:
        $schema:
          $ref: '../schema#/Model'
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
    parameters:
      world:
        $schema:
          $ref: '#/Model'
        Model:
          type: object
          properties:
            name:
              type: string
```

Schema validator is also capable of extending socket.yml with external Yaml source using $source property. It will look for that file within app sources unless path to source starts with /.

$source keyword can apear anywhere in socket, object which contains that keyword will be extended with contents of referenced file.

socket.yml
```yaml
endpoints:
  hello:
    parameters:
      world:
        $schema:
          $ref: '../../schema#/Model'
$source: schema.yml
```

src/schema.yml
```yaml
Model:
  type: object
  properties:
    name:
      type: string
```

###### Schema for whole endpoint.

As a special case you can defined $schema validator on the level of parameters or constraints object. In that case all other validators in parameters/constraints object will be ignored and input will be validated against schema.

socket.yml
```yaml
endpoints:
  hello:
    parameters:
      $schema:
        $ref: '../../schema#/HelloEndpoint'
HelloEndpoint:
  type: object
  properties:
    lastNamename:
      type: string
    firstName:
      type: string
```

socket.yml
```yaml
endpoints:
  hello:
    constraints:
      post:
        $schema:
          $ref: '../../schema#/HelloEndpoint'
HelloEndpoint:
  type: object
  properties:
    lastNamename:
      type: string
    firstName:
      type: string
```