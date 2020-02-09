'use babel';


Ractive = require('ractive')
// no need to include aws-sdk because its using global AWS


async = require('async')

//var newUI = require('./ui')
var newUI = require('@awspilot/ractive-dynamodb-ui')

DynamoDB = null;
cloudwatch=null;

//$ = require("jquery");

import {relative} from 'path'

export default class AwspilotDynamoDbUi {

	constructor( serializedState, uri) {
		console.log("new AwspilotDynamoDbUi")

		this.element = document.createElement('div');
		this.element.id = 'awspilot-dynamodb-ui';

		var allconfig = atom.config.get('dynamodb-ui')
		var config = {
			access_key_id: allconfig.DynamoDB.DynamodbAccessKeyId,
			secret_access_key: allconfig.DynamoDB.DynamodbSecretAccessKey,
			region: allconfig.DynamoDB.DynamodbRegion,
			local: allconfig.DynamoDB.DynamodbLocal,
			endpoint: allconfig.DynamoDB.DynamodbEndpoint,
			cwendpoint: allconfig.CloudwatchEndpoint,
		}
		//console.log("started DynamoDB with config", JSON.stringify(config,null,"\t") )



		var ractive = Ractive({
			components: {
				ui: newUI,
			},
			target: this.element,
			template: `
				<div class="atom-dynamodb-ui theme-{{theme}}">

					<div class="toolbar">
						<a on-click="open-settings">Settings</a>
					</div>

					<div style="position: absolute; top: 30px;left: 0px;right: 0px;bottom: 0px;">
						<ui
							theme={{theme}}
							region={{config.region}}
							accessKeyId={{config.access_key_id}}
							secretAccessKey={{config.secret_access_key}}
							{{#if config.local}}endpoint={{config.endpoint}}{{/if}}
							{{#if config.local}}cwendpoint={{config.cwendpoint}}{{/if}}
						/>
					</div>
				</div>
`,
			data: { config: config, theme: allconfig.Layout.Theme },
			on: {
				'open-settings': function() {
					atom.workspace.open("atom://config/packages/dynamodb-ui")
				},
			}
		});

		atom.config.observe('dynamodb-ui.Layout.Theme', function(newValue) {
			ractive.set({theme: newValue })
		})

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
