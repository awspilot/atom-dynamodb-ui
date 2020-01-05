'use babel';


Ractive = require('ractive')
// no need to include aws-sdk because its using global AWS


async = require('async')

//var newUI = require('./ui')
var newUI = require('@awspilot/ractive-dynamodb-ui')

DynamoDB = null;
cloudwatch=null;
//import $ from "jquery";
$ = require("jquery");

import {relative} from 'path'

export default class AwspilotDynamoDbUi {

	constructor( serializedState, uri) {
		console.log("new AwspilotDynamoDbUi")

		this.element = document.createElement('div');
		this.element.id = 'awspilot-dynamodb-ui';

		var allconfig = atom.config.get('dynamodb-ui')
		var config = {
			access_key_id: allconfig.DynamodbAccessKeyId,
			secret_access_key: allconfig.DynamodbSecretAccessKey,
			region: allconfig.DynamodbRegion,
			local: allconfig.DynamodbLocal,
			endpoint: allconfig.DynamodbEndpoint,
			cwendpoint: allconfig.CloudwatchEndpoint,
		}
		console.log("started DynamoDB with config", JSON.stringify(config,null,"\t") )



		var ractive = Ractive({
			components: {
				ui: newUI,
			},
			target: this.element,
			template: `
				<ui
					region={{config.region}}
					accessKeyId={{config.access_key_id}}
					secretAccessKey={{config.secret_access_key}}
					{{#if config.local}}endpoint={{config.endpoint}}{{/if}}
					{{#if config.local}}cwendpoint={{config.cwendpoint}}{{/if}}
				/>`,
			data: { config: config }
		});


		//this.element.innerHTML = JSON.stringify(config)

	}

  getTitle() {
    return 'DynamoDB UI';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'center';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['center'];
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://dynamodb-ui'
  }

	// Returns an object that can be retrieved when package is activated
	serialize() { /* return {} */}


  // Tear down any state and detach
  destroy() {
    this.element.remove();
	 //this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

}
