const modalTriggers = document.querySelectorAll("[data-modal-open]");
const modals = new Map();
let activeModal = null;
let activeTrigger = null;

modalTriggers.forEach((trigger) => {
  const targetId = trigger.getAttribute("data-modal-open");
  if (!targetId) return;
  trigger.addEventListener("click", () => {
    const modal = document.getElementById(targetId);
    if (!modal) return;
    openModal(modal, trigger);
  });
});

const openModal = (modal, trigger) => {
  if (activeModal) closeModal(activeModal, activeTrigger, false);
  activeModal = modal;
  activeTrigger = trigger;
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
  const closeControl = modal.querySelector("[data-modal-close]");
  if (closeControl) closeControl.focus();
  bindModal(modal);
};

const closeModal = (modal, trigger, restoreFocus = true) => {
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
  if (restoreFocus && trigger) trigger.focus();
  activeModal = null;
  activeTrigger = null;
};

const bindModal = (modal) => {
  if (modals.has(modal)) return;
  const closeElements = modal.querySelectorAll("[data-modal-close]");
  closeElements.forEach((element) => {
    element.addEventListener("click", () => closeModal(modal, activeTrigger));
  });
  modals.set(modal, true);
};

document.addEventListener("click", (event) => {
  if (!activeModal) return;
  if (event.target.matches(".modal-backdrop")) {
    closeModal(activeModal, activeTrigger);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModal) {
    closeModal(activeModal, activeTrigger);
  }
});
