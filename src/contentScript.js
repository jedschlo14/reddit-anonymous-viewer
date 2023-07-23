const getToggleState = async (id) => {
    const state = await chrome.storage.local.get(id);
    if (state[id] == undefined) return false;
    return state[id];
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

const getUsername = () => {
    return document.querySelectorAll(
        "#email-collection-tooltip-id>span>span"
    )[0].textContent;
};

const getConfig = async () => {
    const isEnabled = await getToggleState("toggleExtension");
    const isAnonymous = await getToggleState("toggleAnonymous");
    const alias = await getInputValue("alias");
    return { isEnabled, isAnonymous, alias, username };
};

const findAndReplaceUsername = async () => {
    console.log(username);
    const { isEnabled, isAnonymous, alias } = await getConfig();
    if (isEnabled) {
        if (isAnonymous) findAndReplaceText(username, "[Anonymous]");
        else findAndReplaceText(username, alias);
    }
    if (document.URL == "https://www.reddit.com/user/" + username)
        if (isAnonymous) document.title = "[Anonymous]";
        else document.title = alias + " (u/" + alias + ") - Reddit";
};

const username = getUsername();
findAndReplaceUsername(username);

// when page updates, find and replace instances of username
const observer = new MutationObserver(findAndReplaceUsername);
observer.observe(document, { childList: true, subtree: true });
