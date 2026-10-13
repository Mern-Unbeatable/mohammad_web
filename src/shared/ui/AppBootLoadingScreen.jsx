/**
 * Full-viewport splash for initial app / browser reload.
 * Logo + animated dots only.
 */
const AppBootLoadingScreen = () => (
  <div className="app-boot-loading fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-[#F3F4F6] px-6">
    <div className="flex flex-col items-center gap-6">
      <img
        src="/logo-rm.png"
        alt="Lab Unity"
        className="app-boot-logo-img h-auto w-[140px] max-w-[70vw] object-contain sm:w-[168px]"
        draggable={false}
      />

      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="app-boot-dot" />
        <span className="app-boot-dot app-boot-dot-delay-1" />
        <span className="app-boot-dot app-boot-dot-delay-2" />
      </div>
    </div>
  </div>
);

export default AppBootLoadingScreen;
