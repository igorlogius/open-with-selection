const extId = 'text2link';

function onCreated() {
	if (browser.runtime.lastError) {
		console.error(browser.runtime.lastError);
	} 
}

function onMenuClicked(clickData , tab) { 
	if ( typeof clickData.menuItemId !== 'string' ) { return; }
	if ( !clickData.menuItemId.startsWith(extId) ) { return; }
	if ( typeof clickData.selectionText !== 'string') { return; }
	if ( clickData.selectionText.trim() === '') { return; }
	let placeholder_url = clickData.menuItemId.replace(extId + " ", ''); 
	placeholder_url = placeholder_url.replace("%s",clickData.selectionText);
	browser.tabs.create({url: placeholder_url, active: false});
}

async function onMenuShow(info) {

	browser.menus.removeAll();
	const store = await browser.storage.local.get('placeholder_urls');
	store.placeholder_urls.forEach( async (val) => {
		if(val.activ) {
			if(typeof val.name !== 'string') {return;}
			const menuId = extId + " " + val.name
			const menuTitle = "text2link: Open '" + val.name + '"';
			browser.menus.create({   
				id: menuId 
				,title: menuTitle
				,contexts: ["selection" ]
			}, onCreated);
		}
	});
	browser.menus.refresh();
}

browser.menus.onClicked.addListener(onMenuClicked); 
browser.menus.onShown.addListener(onMenuShow);

