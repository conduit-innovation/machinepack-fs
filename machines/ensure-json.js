module.exports = {


  friendlyName: 'Ensure JSON file',


  description: 'Attempt to read from a JSON file, and if it does not exist, create it.',


  extendedDescription: 'Assumes file is encoded using utf8.',


  idempotent: true,


  inputs: {

    path: {
      description: 'Absolute path for the JSON file (if relative path is provided, will resolve path from current working directory)',
      example: '/Users/mikermcneil/.tmp/foo.json',
      required: true
    },

    schema: {
      description: 'An example of what the parsed data should look like (used for type-coercion)',
      extendedDescription: 'If file does not exist, a "base value" will be derived from this example schema and used as the contents of the newly created JSON file.',
      example: '*',
      defaultsTo: '*'
    }

  },


  exits: {

    couldNotParse: {
      description: 'Could not parse file as JSON.'
    },

    success: {
      description: 'Returns the data which is now stored in the JSON file.',
      getExample: function (inputs){
        return inputs.schema;
      }
    }

  },


  fn: function (inputs, exits) {
    var rttc = require('rttc');
    var thisPack = require('../');

    thisPack.readJson({
      source: inputs.path,
      schema: inputs.schema
    }).exec({
      error: function (err){
        return exits.error(err);
      },
      couldNotParse: function (parseErr){
        return exits.couldNotParse(parseErr);
      },
      success: function (data){
        return exits.success(data);
      },
      doesNotExist: function (){
        try {
          // If the JSON file does not exist, create it using the base value
          // for the provided schema.
          var baseVal = rttc.coerce(rttc.infer(inputs.schema));
          thisPack.writeJson({
            destination: inputs.path,
            json: baseVal
          }).exec({
            error: function (err){
              return exits.error(err);
            },
            success: function (){
              return exits.success(baseVal);
            }
          });// </writeJson>
        }
        catch (e) {
          return exits.error(e);
        }
      }//</readJson.doesNotExist>
    });//</readJson>

  }


};
