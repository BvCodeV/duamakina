export function byId(id) {
  return document.getElementById(id);
}

export function on(element, eventName, handler, options) {
  if (!element) return false;
  element.addEventListener(eventName, handler, options);
  return true;
}

export function setText(element, value) {
  if (element) element.textContent = value ?? "";
}

export function setVisible(element, visible, display = "block") {
  if (element) element.style.display = visible ? display : "none";
}
