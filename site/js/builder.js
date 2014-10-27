(function(window, document, builder) {

	builder.utils = {};

	builder.utils.readFile = function(filename) {
		var request = new XMLHttpRequest();
		var url = 'https://cdn.rawgit.com/grayghostvisuals/transformicons/master/sass/transformicons/' + filename;
		request.open('GET', url, false);
		request.send(null);

		return request.responseText;
	};

	builder.utils.readFiles = function(filenames) {
		var concat = '';
		filenames.forEach(function(filename) {
			var file = builder.utils.readFile(filename);
			concat += file + '\n\n';
		});
		return concat;
	};

	builder.utils.filterChecked = function() {
		var checked = [];
		var length = builder.settings.checkboxes.length;
		for (var i = 0; i < length; i++) {
			if(builder.settings.checkboxes[i].checked) {
				checked.push(builder.settings.checkboxes[i]);
			}
		}

		return checked;
	};

	builder.getAccordingFiles = function(checkbox) {
		var files = checkbox.getAttribute('data-files').split(' ');

		return files;
	};

	builder.getNeedles = function() {
		var surelyNeeded = ['base/_config-globals.scss', 'base/_global-styles.scss'];
		var checkedCheckboxes = builder.utils.filterChecked(builder.settings.checkboxes);
		var selectedNeedles = [];
		checkedCheckboxes.forEach(function(checkbox) {
			selectedNeedles = selectedNeedles.concat(builder.getAccordingFiles(checkbox));
		});
		var needles = surelyNeeded.concat(selectedNeedles);

		return needles;
	};

	builder.attachEvents = function() {
		builder.settings.form.addEventListener('submit', function(event) {
			builder.generate();
			event.preventDefault();
		});
	};

	builder.generate = function() {
		builder.settings.textarea.value = builder.utils.readFiles( builder.getNeedles() );
	};

	builder.init = function(settings) {
		builder.settings = settings;
		builder.attachEvents();
	};

})(this, this.document, this.builder = {});