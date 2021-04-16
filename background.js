const extId = 'text2link';

function onCreated() {
  if (browser.runtime.lastError) {
    console.log("error creating item:" + browser.runtime.lastError);
  } else {
    console.log("item created successfully");
  }
}

function onMenuClicked(clickData , tab) { 
	//if ( typeof clickData.menuItemId !== 'string' ) { return; }
	//if ( !clickData.menuItemId.startsWith(extId) ) { return; }
	if ( typeof clickData.selectionText !== 'string') { return; }
	if ( clickData.selectionText.trim() === '') { return; }
	//console.log(clickData.menuItemId);
	//console.log(JSON.stringify(clickData,null,4));
	let placeholder_url = clickData.menuItemId.replace(extId + " ", ''); 
	//console.log(placeholder_url);
	placeholder_url = placeholder_url.replace("%s",clickData.selectionText);
	//console.log(placeholder_url);
	browser.tabs.create({url: placeholder_url, active: false});
}

async function onMenuShow(info) {

		const store = await browser.storage.local.get('placeholder_urls');
		console.log('store', store);

		await browser.menus.removeAll();

		store.placeholder_urls.forEach( async (val) => {
			console.log(val);
			if(typeof val.name !== 'string') {return;}
			//const menuId = extId + " " + val.name
			await browser.menus.create({   
				id: extId + " " + val.name 
				,title: "open " + val.name 
				,contexts: ["selection" ]
			}, onCreated);
		});
		browser.menus.refresh();
}

browser.menus.onClicked.addListener(onMenuClicked); 
browser.menus.onShown.addListener(onMenuShow);

