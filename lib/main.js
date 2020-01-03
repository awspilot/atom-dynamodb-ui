'use babel';

path = require('path')

import { CompositeDisposable } from 'atom';
import {Notification} from "atom";
import AwspilotDynamoDbUi from './my-view.js';

import StatusButton from './status-btn';

export default {

	dynamodbUiView: null,
	status_btn: null,
	//modalPanel: null,
	subscriptions: null,

	config: {
		isEnabled: {
			type: "boolean",
			default: false,
			enum: [true, false],
		},
		AllowTracking: {
			type: "boolean",
			default: false,
			enum: [true,false],
		},

		DynamodbAccessKeyId: {
			type: "string",
			default: 'AKIAXXXXXXX',
		},
		DynamodbSecretAccessKey: {
			type: "string",
			default: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		},
		DynamodbRegion: {
			type: "string",
			default: "us-east-1",
			enum: [
				'us-east-1',
				'us-east-2',
				'us-west-1',
				'us-west-2',

				'ap-east-1',
				'ap-south-1',
				'ap-northeast-2',
				'ap-southeast-1',
				'ap-southeast-2',
				'ap-northeast-1',

				'ca-central-1',

				'eu-central-1',
				'eu-west-1',
				'eu-west-2',
				'eu-west-3',
				'eu-north-1',

				'me-south-1',

				'sa-east-1',
			],
		},
		DynamodbEndpoint: {
			type: "string",
			default: 'https://djaorxfotj9hr.cloudfront.net/v1/dynamodb',
		},

	},

	activate(state) {

		console.log("dynamodb:activate(",state,")")

		//this.dynamodbUiView = new DynamodbUiView();
		// this.modalPanel = atom.workspace.addModalPanel({
		// 	item: this.dynamodbUiView.getElement(),
		// 	visible: false
		// });

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable(

	      // atom.packages.onDidActivateInitialPackages(createPdfStatusView),
	      // atom.config.observe('pdf-view.fileExtensions', updateFileExtensions),

		);

		// Register command that toggles this view
		this.subscriptions.add( atom.commands.add('atom-workspace', { 'dynamodb-ui:toggle': () => this.toggle() }));
		this.subscriptions.add( atom.commands.add('atom-workspace', { 'dynamodb-ui:new': () => {
			//console.log("opening", require('os').homedir() + require('path').sep);
			atom.workspace.open('awspilot-dynamodb-ui://' + require('os').homedir() + require('path').sep );
			// var view = new AwspilotDynamoDbUi()
			// atom.workspace.addTopPanel({
			// 	item: view.element,
			// });
		} }));

		this.subscriptions.add(
			atom.workspace.addOpener( function( uri ) {

				var found;
				atom.workspace.getPaneItems().forEach(item => {
					console.log(item)
					if (item instanceof AwspilotDynamoDbUi) {
						found=true;
						//	item.destroy();
				 	}
				});

				if (found) {
					return;
				}

				var match = uri.match(/^awspilot-dynamodb-ui:\/\/(.*)$/);
				if ( match && !found ) {
					return new AwspilotDynamoDbUi( uri,  state.dynamodbUiViewState ); // match[1]
				}

				// if found, switch to
			})
		);

		// no open for .awspilot.yaml files
		// this.subscriptions.add( atom.workspace.addOpener(function(uri) {
		// 	console.log("openURI", uri )
		// 	//var uriExtension = path.extname(uri).toLowerCase()
		// 	if (path.basename(uri) === '.awspilot.yaml')
		// 		return new AwspilotDynamoDbUi(uri);
		// }))

		// this.view = new AwspilotDynamoDbUi();
		// atom.workspace.addTopPanel({
		// 	item: this.view.element,
		// });
		//atom.packages.activatePackage('dynamodb-ui')

		//return this.openerDisposable = atom.workspace.addOpener(openURI);


	},


	deactivate() {
		// this.modalPanel.destroy();
		this.subscriptions.dispose();
		//this.dynamodbUiView.destroy();
		//this.openerDisposable.dispose();
		this.subscriptions.dispose();
		this.status_btn.destroy();
	},

	serialize() {
		return {
			//dynamodbUiViewState: this.dynamodbUiView.serialize()
			ui: {}
		};
	},

	toggle() {
		var isEnabled = atom.config.get('dynamodb-ui:isEnabled')
		atom.config.set('dynamodb-ui:isEnabled', ! isEnabled )

		atom.notifications.addNotification(new Notification('info', 'DynamoDB', { detail: isEnabled ? 'Disabled':'Enabled', dismissable: true, }));


		// if (this.modalPanel.isVisible())
		// 	atom.notifications.addNotification(new Notification('error', 'DynamoDB', { detail: 'Yha', dismissable: true, }));
		// else
		// 	atom.notifications.addNotification(new Notification('info', 'DynamoDB', { detail: 'Yha', dismissable: true, }));

		return true;
		return (
			this.modalPanel.isVisible() ?
			this.modalPanel.hide() :
			this.modalPanel.show()
		);
	},

	packageStatus() {
		return atom.config.get('dynamodb-ui:isEnabled')
	},

	consumeStatusBar(statusBar) {
		this.status_btn = new StatusButton(statusBar);
	}
};
