/**
 * Click handler for an in-page link: smooth-scrolls to `sectionId` and puts
 * `#sectionId` in the URL. Leaves the click alone when the section is missing.
 */
export const scrollToSection = (sectionId) => (event) => {
  const section = document.getElementById(sectionId);
  if (!section) return;
  event.preventDefault();
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${sectionId}`);
};
