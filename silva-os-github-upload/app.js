const installHint = document.querySelector("#install-hint");
const releasesUrl = "https://api.github.com/repos/matviukuzmenko-cloud/silvaos/releases?per_page=20";

document.querySelectorAll("[data-platform]").forEach((link) => {
  link.addEventListener("click", async (event) => {
    const platform = link.dataset.platform;
    if (platform === "ios") {
      installHint.textContent = "On iPhone or iPad: open in Safari, tap Share, then choose “Add to Home Screen”.";
      return;
    }

    event.preventDefault();
    link.setAttribute("aria-busy", "true");
    installHint.textContent = "Checking for the latest Silva OS installer…";

    try {
      const response = await fetch(releasesUrl, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (response.status === 404) {
        throw new Error("No desktop installer release has been published yet.");
      }
      if (!response.ok) {
        throw new Error(`GitHub Releases returned HTTP ${response.status}.`);
      }
      const releases = await response.json();
      if (!Array.isArray(releases)) {
        throw new Error("GitHub Releases returned an invalid release list.");
      }

      const isInstaller = (name) => {
        if (typeof name !== "string") return false;
        if (platform === "macos") return /\.dmg$/i.test(name);
        return /\.(msi|exe)$/i.test(name);
      };
      const release = releases.find(({ assets, prerelease }) =>
        !prerelease && Array.isArray(assets) && assets.some(({ name }) => isInstaller(name))
      );
      const candidates = release?.assets.filter(({ name }) => isInstaller(name)) || [];
      candidates.sort((a, b) => {
        const priority = (name) => {
          const lower = name.toLowerCase();
          if (platform === "windows" && lower.endsWith(".msi")) return 0;
          if (platform === "windows" && lower.endsWith(".exe")) return 1;
          return 0;
        };
        return priority(a.name) - priority(b.name);
      });

      const installer = candidates[0];
      if (!installer || typeof installer.browser_download_url !== "string") {
        installHint.textContent = platform === "macos"
          ? "The latest release does not contain a macOS .dmg installer yet. Publish a desktop release to enable this download."
          : "The latest release does not contain a Windows .msi or .exe installer yet. Publish a desktop release to enable this download.";
        return;
      }

      installHint.textContent = `Starting download: ${installer.name}`;
      window.location.assign(installer.browser_download_url);
    } catch (error) {
      console.error("Could not find a Silva OS installer in GitHub Releases.", error);
      installHint.textContent = error.message === "No desktop installer release has been published yet."
        ? "No installers have been published yet. Upload the desktop source and create a versioned release; this button will then download the matching installer."
        : "Could not check the latest release. Please try again later.";
    } finally {
      link.removeAttribute("aria-busy");
    }
  });
});
