
function deleteRow(rowTr) {
	var mainTableBody = document.getElementById('mainTableBody');
	mainTableBody.removeChild(rowTr);
}

function createTableRow(feed) {
	var mainTableBody = document.getElementById('mainTableBody');
	var tr = mainTableBody.insertRow();

	Object.keys(feed).sort().forEach( (key) => {

		if( key === 'activ'){
			//if(feed[key] !== null) {
				var input = document.createElement('input');
				input.className = key;
				input.placeholder = key;
				input.style.width = '100%';
				input.type='radio';
				input.name="placeholdergroup";
				input.checked= (typeof feed[key] === 'boolean' && feed[key] === true)? true: false;
				input.addEventListener("change", saveOptions);
				tr.insertCell().appendChild(input);
			/*}else{
				tr.insertCell();
			}*/

		}else if( key === 'name'){
			//var input = document.createElement('textarea');
			var input = document.createElement('input');
			input.className = key;
			input.placeholder = key;
			input.style.float = 'right';
			input.style.width = '90%';
			input.style.margin = '3px';
			input.value = feed[key];
			tr.insertCell().appendChild(input);
		}else
			if( key !== 'action'){
				var input = document.createElement('input');
				input.className = key;
				input.placeholder = key;
				input.style.width = '0px';
				input.value = feed[key];
				tr.insertCell().appendChild(input);
			}
	});

	var button;
	if(feed.action === 'save'){
		button = createButton("Create", "saveButton", function() {},  true);
	}else{
		button = createButton("Delete", "deleteButton", function() { deleteRow(tr); }, true );
	}
	tr.insertCell().appendChild(button);
}

function collectConfig() {
	// collect configuration from DOM
	var mainTableBody = document.getElementById('mainTableBody');
	var feeds = [];
	for (var row = 0; row < mainTableBody.rows.length; row++) { 
		try {
			var name = mainTableBody.rows[row].querySelector('.name').value.trim().toLowerCase();
			try {
			var activ = mainTableBody.rows[row].querySelector('.activ').checked;
			if(name !== '' &&  name.indexOf(" ") === -1 && name.length > 1) {
				feeds.push({
					'activ': activ,
					'name': name
				});
			}
			}catch(e) {
				console.error(e);
			}
		}catch(e){
			console.error(e);
		}
	}
	return feeds;
}

function createButton(text, id, callback, submit) {
	var span = document.createElement('span');
	var button = document.createElement('button');
	button.id = id;
	button.textContent = text;
	button.className = "browser-style";
	if (submit) {
		button.type = "submit";
	} else {
		button.type = "button";
	}
	button.name = id;
	button.value = id;
	button.addEventListener("click", callback);
	span.appendChild(button);
	return span;
}

async function saveOptions(e) {
	var feeds = collectConfig();
	await browser.storage.local.set({ 'placeholder_urls': feeds });
}

async function restoreOptions() {
	var mainTableBody = document.getElementById('mainTableBody');
	createTableRow({
		'activ': null,
		'name': '' ,
		'action':'save'
	});
	var res = await browser.storage.local.get('placeholder_urls');
	if ( !Array.isArray(res.placeholder_urls) ) { return; }
	res.placeholder_urls.forEach( (selector) => {
		selector.action = 'delete'
		createTableRow(selector);
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

/*
const impbtnWrp = document.getElementById('impbtn_wrapper');
const impbtn = document.getElementById('impbtn');
const expbtn = document.getElementById('expbtn');

expbtn.addEventListener('click', async function (evt) {
    var dl = document.createElement('a');
    var res = await browser.storage.local.get('placeholder_urls');
    var content = JSON.stringify(res.placeholder_urls);
    //console.log(content);
    //	return;
    dl.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
    dl.setAttribute('download', 'data.json');
    dl.setAttribute('visibility', 'hidden');
    dl.setAttribute('display', 'none');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
});

// delegate to real Import Button which is a file selector
impbtnWrp.addEventListener('click', function(evt) {
	console.log('impbtnWrp');
	impbtn.click();
})

impbtn.addEventListener('input', function (evt) {

	console.log('impbtn');
	
	var file  = this.files[0];

	//console.log(file.name);
	
	var reader = new FileReader();
	        reader.onload = async function(e) {
            try {
                var config = JSON.parse(reader.result);
		//console.log("impbtn", config);
		await browser.storage.local.set({ 'placeholder_urls': config});
		document.querySelector("form").submit();
            } catch (e) {
                console.error('error loading file: ' + e);
            }
        };
        reader.readAsText(file);

});
*/
