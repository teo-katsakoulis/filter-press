function hideBlockedUsers(blockedUsers, lengthThreshold) {
  const comments = Array.from(document.querySelectorAll(".commento-card"));
  const userCommentsMap = {};
  const newlyBlockedUsers = new Set();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkCommento") {
      const hasCommento = !!document.querySelector(".commento-card");
      sendResponse({ hasCommento });
    }

    // Keep your existing listener here...
    if (request.action === "refreshFilter") {
      runFilter();
    }

    // Return true to indicate async response (if needed)
    return true;
  });

  comments.forEach((comment) => {
    const authorEl = comment.querySelector(".commento-name");
    const commentBody = comment.querySelector(".commento-body");

    if (!authorEl || !commentBody) return;

    const authorName = authorEl.textContent.trim();
    const commentText = commentBody.textContent.trim();

    // Check for long comments
    if (commentText.length > lengthThreshold) {
      commentBody.innerHTML = `<em>This comment by <strong>${authorName}</strong> was hidden for exceeding ${lengthThreshold} characters and the user was automatically blocked.</em>`;
      commentBody.style.fontStyle = "italic";
      commentBody.style.color = "#b00";
      newlyBlockedUsers.add(authorName);
      return;
    }

    // Group comments from blocked users
    if (blockedUsers.includes(authorName)) {
      if (!userCommentsMap[authorName]) userCommentsMap[authorName] = [];
      userCommentsMap[authorName].push(comment);
    }
  });

  // Display summary message once per blocked user
  for (const authorName in userCommentsMap) {
    const userComments = userCommentsMap[authorName];
    const count = userComments.length;

    userComments.forEach((comment, index) => {
      const commentBody = comment.querySelector(".commento-body");
      if (!commentBody) return;

      if (index === 0) {
        commentBody.innerHTML = `<em>${count} comment(s) hidden from <strong>${authorName}</strong> due to your blocklist.</em>`;
        commentBody.style.fontStyle = "italic";
        commentBody.style.color = "#888";
      } else {
        comment.style.display = "none";
      }
    });
  }

  // Persist new auto-blocked users if any
  if (newlyBlockedUsers.size > 0) {
    chrome.storage.local.get("blockedUsers", (data) => {
      const current = data.blockedUsers || [];
      const updated = Array.from(new Set([...current, ...newlyBlockedUsers]));
      chrome.storage.local.set({ blockedUsers: updated });
    });
  }
}

function runFilter() {
  chrome.storage.local.get(["blockedUsers", "lengthThreshold"], (data) => {
    const blockedUsers = data.blockedUsers || [];
    const lengthThreshold = data.lengthThreshold || 5000;
    hideBlockedUsers(blockedUsers, lengthThreshold);
  });
}

const observer = new MutationObserver(runFilter);
observer.observe(document.body, { childList: true, subtree: true });
runFilter();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refreshFilter") {
    runFilter();
  }
});
