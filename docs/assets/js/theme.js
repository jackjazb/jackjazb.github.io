const THEME = "data-color-scheme";
const DARK = "dark";
const LIGHT = "light";

getTheme();

function toggleTheme() {
	const theme = document.documentElement.attributes[THEME].value;

	if(theme === DARK){
		setTheme(LIGHT);
	}
	else{
		setTheme(DARK);
	}
}

/**
 * Queries localStorage for the user's theme preference.
 * Uses the device default if this is not set.
 */
function getTheme(){
	let theme = localStorage.getItem(THEME);

	if(!theme){
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = LIGHT;
		}
		else{
			theme = DARK;
		}
	}
	setTheme(theme);
}

/**
 * Sets the current theme, storing the user's preference in local storage.
 */
function setTheme(theme){
	if(!theme in [DARK, LIGHT] ){
		return undefined;
	}
	
	if(theme === LIGHT){
		document.body.classList.add(LIGHT);
	}
	else{
		document.body.classList.remove(LIGHT);
	}

	// Store the theme on the document so we don't need to read from localStorage every toggle.
	document.documentElement.setAttribute(THEME, theme);
	localStorage.setItem(THEME, theme);
}