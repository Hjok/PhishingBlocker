//  This file is part of PhishingBlocker.

// PhishingBlocker is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// PhishingBlocker is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with PhishingBlocker.  If not, see <https://www.gnu.org/licenses/>.

// Copyright 2018 Hjok

function onError(err){
    console.error(err);
}

function changeButtonToEnable(element, domainName) {
	document.getElementById('disable').innerHTML = "Enable alert popups for this website"
	document.getElementById('disable_description').innerHTML = "Phishing Blocker alert popups are disabled for this website. You can enable them."
	document.getElementById('disable').id = "enable"
	addEnableListener()
}

function changeButtonToDisable(element) {
	if (document.getElementById('enable') !== null) {
		document.getElementById('enable').innerHTML = "Disable alert popups for this website"
		document.getElementById('enable').id = "disable"
	}
	document.getElementById('disable_description').innerHTML = "Phishing Blocker detected that this website may be trying to impersonate another one. If you think this site is legitimate, you can disable alert popups."
	addDisableListener()
}

function registerDomainName(tabs) {
    var domainName = tabs[0].url.replace(/http.?:\/\//, '').split('/', 1)[0]
    var value = {}
    value[domainName] = true
    browser.storage.local.set(value).then(changeButtonToEnable.bind(null, domainName), onError)
}

function deleteDomainName(tabs) {
    var domainName = tabs[0].url.replace(/http.?:\/\//, '').split('/', 1)[0]
    browser.storage.local.remove(domainName).then(changeButtonToDisable, onError)
}

function initialize(domainName, item) {
	if (domainName in item && item[domainName])
		changeButtonToEnable()
	else
		changeButtonToDisable()
}

function getStorage(tabs) {
	var domainName = tabs[0].url.replace(/http.?:\/\//, '').split('/', 1)[0]
	browser.storage.local.get(domainName).then(initialize.bind(null, domainName), onError)
}

function addDisableListener() {
	document.getElementById('disable').onclick = function disable() {
		browser.tabs.query({currentWindow: true, active: true}).then(registerDomainName, onError)
	}
}

function addEnableListener() {
		document.getElementById('enable').onclick = function enable() {
		browser.tabs.query({currentWindow: true, active: true}).then(deleteDomainName, onError)
	}
}

browser.tabs.query({currentWindow: true, active: true}).then(getStorage, onError)