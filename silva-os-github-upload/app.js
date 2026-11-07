const installHint = document.querySelector("#install-hint");

document.querySelectorAll("[data-platform]").forEach((link) => {
  link.addEventListener("click", () => {
    const platform = link.dataset.platform;
    if (platform === "ios") {
      installHint.textContent = "On iPhone or iPad: open in Safari, tap Share, then choose “Add to Home Screen”.";
    } else if (platform === "macos") {
      installHint.textContent = "Download the macOS desktop app from GitHub Releases. The app opens in its own resizable window.";
    } else {
      installHint.textContent = "Download the Windows desktop app from GitHub Releases. The app opens in its own resizable window.";
    }
  });
});
