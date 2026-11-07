const installHint = document.querySelector("#install-hint");

document.querySelectorAll("[data-platform]").forEach((link) => {
  link.addEventListener("click", () => {
    const platform = link.dataset.platform;
    if (platform === "ios") {
      installHint.textContent = "On iPhone or iPad: open in Safari, tap Share, then choose “Add to Home Screen”.";
    } else if (platform === "macos") {
      installHint.textContent = "Opens Silva OS. In Chrome or Edge, choose Install app to add it to your Mac. A signed .dmg installer is not published yet.";
    } else {
      installHint.textContent = "Opens Silva OS. In Edge or Chrome, choose Install app to add it to Windows. A .msi/.exe installer is not published yet.";
    }
  });
});
