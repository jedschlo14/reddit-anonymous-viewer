const getToggleValue = async (id) => {
    const value = await chrome.storage.local.get(id);
    if (value[id] == undefined) return false;
    return value[id];
};

const getInputValue = async (id) => {
    const value = await chrome.storage.local.get(id);
    if (value[id] == undefined) return "";
    return value[id].substring(2);
};

const getElementsByText = (str) =>
    Array.prototype.slice
        .call(document.querySelectorAll("span,a,h1"))
        .filter((el) => el.textContent.trim() === str.trim());

const findAndReplaceText = (find, replace) => {
    var elements = getElementsByText("u/" + find);
    if (replace == "[Anonymous]")
        for (let element of elements) element.innerText = replace;
    else for (let element of elements) element.innerText = "u/" + replace;
    elements = getElementsByText(find);
    for (let element of elements) element.innerText = replace;
};

const findAndReplaceUsername = async () => {
    const isEnabled = await getToggleValue("toggleExtension");
    const isAnonymous = await getToggleValue("toggleAnonymous");
    const username = await getInputValue("username");
    const alias = await getInputValue("alias");
    if (isEnabled && username != "") {
        if (isAnonymous) findAndReplaceText(username, "[Anonymous]");
        else findAndReplaceText(username, alias);
    }
    if (document.URL == "https://www.reddit.com/user/" + username)
        if (isAnonymous) document.title = "[Anonymous]";
        else document.title = alias + " (u/" + alias + ") - Reddit";
};

// when page updates, find and replace instances of username
const observer = new MutationObserver(findAndReplaceUsername);
observer.observe(document, { childList: true, subtree: true });
