const userListEl = document.getElementById("user-list");
const inputEl = document.getElementById("new-user");
const addBtn = document.getElementById("add-user");
const lengthInput = document.getElementById("length-threshold");
const noCommentoMsg = document.getElementById("no-commento-msg");

chrome.storage.local.get("lengthThreshold", (data) => {
  lengthInput.value = data.lengthThreshold || 5000;
});

addBtn.addEventListener("click", () => {
  const newUser = inputEl.value.trim();
  if (!newUser) return;
  chrome.storage.local.get("blockedUsers", (data) => {
    const blocked = data.blockedUsers || [];
    if (!blocked.includes(newUser)) {
      blocked.push(newUser);
      chrome.storage.local.set({ blockedUsers: blocked }, () => {
        inputEl.value = "";
        refreshUserList();

        // Notify content script to re-filter comments
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "refreshFilter" });
        });
      });
    }
  });
});

lengthInput.addEventListener("change", () => {
  const val = parseInt(lengthInput.value, 10);
  if (!isNaN(val)) {
    chrome.storage.local.set({ lengthThreshold: val });
  }
});

function checkCommentoPresence() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "checkCommento" },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          // No response or error means content script not injected or no Commento
          noCommentoMsg.style.display = "block";
        } else {
          // If content script replies with hasCommento: true
          noCommentoMsg.style.display = response.hasCommento ? "none" : "block";
        }
      }
    );
  });
}

function refreshUserList() {
  chrome.storage.local.get("blockedUsers", (data) => {
    const blocked = data.blockedUsers || [];
    userListEl.innerHTML = "";

    blocked.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-user";
      removeBtn.addEventListener("click", () => {
        const updated = blocked.filter((u) => u !== user);
        chrome.storage.local.set({ blockedUsers: updated }, refreshUserList);
      });

      li.appendChild(removeBtn);
      userListEl.appendChild(li);
    });
  });
}

checkCommentoPresence();
refreshUserList();
