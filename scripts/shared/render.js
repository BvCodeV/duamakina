export function text(value) {
  return value == null ? "" : String(value);
}

export function setTextContent(element, value) {
  if (element) element.textContent = text(value);
}

export function setSafeAttribute(element, name, value) {
  if (!element || value == null) return;
  element.setAttribute(name, String(value));
}
