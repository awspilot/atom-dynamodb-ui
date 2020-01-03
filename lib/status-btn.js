'use babel';

export default class ReloadButtonView {

	constructor(statusBar) {
		this.element = document.createElement('a');
		//this.element.classList.add('icon', 'icon-file');
		this.element.classList.add('inline-block');
		this.element.innerHTML = 'DynamoDB';

		this.element.addEventListener('click', this.onClick);

		this.statusBarTile = statusBar.addRightTile({ item: this.element, priority: 1000 });
	}

	destroy() {
		this.statusBarTile.destroy();
		this.statusBarTile = null;

		this.element.removeEventListener('click', this.onClick);

		this.element.remove();
		this.element = null;
	}

	onClick(e) {
		e.preventDefault();
		e.stopPropagation();
		atom.commands.dispatch(atom.views.getView(atom.workspace), 'dynamodb-ui:new');
	}

}
