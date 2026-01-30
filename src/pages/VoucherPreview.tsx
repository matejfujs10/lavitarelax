import { useEffect } from "react";

const VoucherPreview = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for print/save
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "s" || e.key === "P" || e.key === "S")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <embed
          src="/voucher-preview.pdf#toolbar=0&navpanes=0&scrollbar=0"
          type="application/pdf"
          width="100%"
          height="800px"
          className="rounded-lg"
          style={{ pointerEvents: "auto" }}
        />
      </div>
    </div>
  );
};

export default VoucherPreview;
