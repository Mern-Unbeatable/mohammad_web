/**
 * Full-viewport splash for initial app / browser reload.
 * Logo + progress bar only.
 */
const AppBootLoadingScreen = () => (
  <div className="app-boot-loading fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-[#F3F4F6] px-6">
    <div className="flex flex-col items-center gap-6">
      <img
        src="/logo-rm.png"
        alt="Lab Unity"
        className="h-auto w-[80px] max-w-[70vw] object-contain sm:w-[130px]"
        draggable={false}
      />

      <div className="app-boot-loader text-primary" aria-hidden />
    </div>
  </div>
);

export default AppBootLoadingScreen;
