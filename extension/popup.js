const fetchInputValue = (id) => {
    chrome.storage.local.get(id, (result) => {
        if (result[id] == undefined) {
            chrome.storage.local.set({ [id]: "u/" });
            document.getElementById(id).value = "u/";
        } else document.getElementById(id).value = result[id];
    });
};

const handleInputChange = (id) => {
    const input = document.getElementById(id);
    if (input.value == "") usernameInput.value = "u/";
    if (input.value.match(/^u\/[A-Za-z0-9_-]*$/g))
        chrome.storage.local.set(
            {
                [id]: input.value,
            },
            () => {
                reloadRedditTabs();
            }
        );
    else fetchInputValue(id);
};

const fetchToggleState = (id) => {
    chrome.storage.local.get(id, (result) => {
        const toggleState = result[id] == undefined ? true : result[id];
        chrome.storage.local.set({ [id]: toggleState });
        toggleButtonState(id, toggleState);
    });
};

const handleToggleChange = (id) => {
    const toggleButton = document.getElementById(id);
    const newToggleState = toggleButton.classList.contains("disabled");
    chrome.storage.local.set({ [id]: newToggleState }, () => {
        reloadRedditTabs();
    });
    toggleButtonState(id, newToggleState);
};

const reloadRedditTabs = () => {
    chrome.tabs.query(
        {
            url: "https://www.reddit.com/*",
        },
        (tabs) => {
            for (let tab of tabs) {
                chrome.tabs.reload(tab.id);
            }
        }
    );
};

const toggleButtonState = (id, newToggleState) => {
    const toggleButton = document.getElementById(id);
    if (newToggleState) {
        toggleButton.classList.remove("disabled");
        if (id == "toggleExtension")
            toggleButton.innerText = "Extension Enabled";
        else {
            document.getElementById("aliasContainer").classList.add("disabled");
            toggleButton.innerText = "Anonymous Mode";
        }
    } else {
        toggleButton.classList.add("disabled");
        if (id == "toggleExtension")
            toggleButton.innerText = "Extension Disabled";
        else {
            document
                .getElementById("aliasContainer")
                .classList.remove("disabled");
            toggleButton.innerText = "Alias Mode";
        }
    }
};

// when popup opens, set input values to stored values
document.body.onload = () => {
    fetchInputValue("username");
    fetchInputValue("alias");
    fetchToggleState("toggleExtension");
    fetchToggleState("toggleAnonymous");
};

// handle username changes
document
    .getElementById("username")
    .addEventListener("input", () => handleInputChange("username"));

// handle alias changes
document
    .getElementById("alias")
    .addEventListener("input", () => handleInputChange("alias"));

// handle extension toggle button click
document
    .getElementById("toggleExtension")
    .addEventListener("click", () => handleToggleChange("toggleExtension"));

// handle anonymous toggle button click
document
    .getElementById("toggleAnonymous")
    .addEventListener("click", () => handleToggleChange("toggleAnonymous"));
