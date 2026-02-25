/**
 * OmniCare AI — Embeddable Chat Widget
 *
 * Usage:
 *   <script
 *     src="https://widget.omnicare.ai/v1/embed.js"
 *     data-tenant="your-tenant-slug"
 *     data-color="#2563eb"
 *     data-position="right"
 *   ></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var tenant = script.getAttribute("data-tenant") || "demo";
  var color = script.getAttribute("data-color") || "#2563eb";
  var position = script.getAttribute("data-position") || "right";
  var baseUrl = script.getAttribute("data-base-url") || "https://widget.omnicare.ai";

  var isOpen = false;
  var bubble, iframe, container;

  function createBubble() {
    bubble = document.createElement("div");
    bubble.id = "omnicare-bubble";
    bubble.setAttribute("role", "button");
    bubble.setAttribute("aria-label", "Open chat");
    bubble.style.cssText =
      "position:fixed;bottom:24px;" +
      (position === "left" ? "left:24px;" : "right:24px;") +
      "width:56px;height:56px;border-radius:50%;cursor:pointer;z-index:999998;" +
      "display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.15);background:" + color + ";";

    bubble.innerHTML =
      '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>' +
      "</svg>";

    bubble.addEventListener("mouseenter", function () {
      bubble.style.transform = "scale(1.08)";
      bubble.style.boxShadow = "0 6px 20px rgba(0,0,0,.2)";
    });
    bubble.addEventListener("mouseleave", function () {
      bubble.style.transform = "scale(1)";
      bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,.15)";
    });
    bubble.addEventListener("click", toggle);

    document.body.appendChild(bubble);
  }

  function createContainer() {
    container = document.createElement("div");
    container.id = "omnicare-container";
    container.style.cssText =
      "position:fixed;bottom:92px;" +
      (position === "left" ? "left:24px;" : "right:24px;") +
      "width:400px;height:680px;z-index:999999;border-radius:16px;overflow:hidden;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.2);transition:opacity .25s,transform .25s;" +
      "opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;";

    iframe = document.createElement("iframe");
    iframe.src = baseUrl + "/chat/" + tenant;
    iframe.style.cssText = "width:100%;height:100%;border:none;border-radius:16px;";
    iframe.setAttribute("title", "OmniCare Chat");

    container.appendChild(iframe);
    document.body.appendChild(container);
  }

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      container.style.opacity = "1";
      container.style.transform = "translateY(0) scale(1)";
      container.style.pointerEvents = "auto";
      bubble.innerHTML =
        '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      container.style.opacity = "0";
      container.style.transform = "translateY(12px) scale(.96)";
      container.style.pointerEvents = "none";
      bubble.innerHTML =
        '<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>' +
        "</svg>";
    }
  }

  // Listen for messages from iframe
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data !== "string") return;
    if (e.data === "omnicare:close") toggle();
  });

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createBubble();
      createContainer();
    });
  } else {
    createBubble();
    createContainer();
  }
})();
