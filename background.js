
const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?
const manifest = browser.runtime.getManifest();
const extname = manifest.name;

const log = (level, msg) => {
	level = level.trim().toLowerCase();
	if (['error','warn'].includes(level)
		|| ( temporary && ['debug','info','log'].includes(level))
	) {
		console[level](extname + '::' + level.toUpperCase() + '::' + msg);
		return;
	}
};

function onCreated() {
	log('debug', 'onCreated');
	if (browser.runtime.lastError) {
		log('error',browser.runtime.lastError);
	} 
}

function onMenuClicked(clickData , tab) { 
	log('debug', 'onMenuClicked');
	if ( typeof clickData.menuItemId !== 'string' ) { return; }
	if ( !clickData.menuItemId.startsWith(extname) ) { return; }
	if ( typeof clickData.selectionText !== 'string') { return; }
	if ( clickData.selectionText.trim() === '') { return; }
	let urlstr = clickData.menuItemId.replace(extname + " ", ''); 
	urlstr = urlstr.replace("%s",clickData.selectionText);
	try {
		const url = new URL(urlstr);
		browser.tabs.create({url: urlstr, active: false});
	}catch(error) {
		log('error',error);
		return;
	}
}

async function onMenuShow(info,tab) {

	log('debug', 'onMenuShow');

	browser.menus.removeAll();
	const store = await browser.storage.local.get('placeholder_urls');
	store.placeholder_urls.forEach( async (val) => {
		if(val.activ) {
			if(typeof val.name !== 'string') {return;}
			const menuId = extname + " " + val.name
			const menuTitle = extname + ": '" + val.name + '"';
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

