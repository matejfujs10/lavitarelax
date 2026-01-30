import { useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-black/95 flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 bg-black">
        <h1 className="text-white font-display text-lg">Predogled darilnega bona</h1>
        <Link to="/gift-voucher">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </Button>
        </Link>
      </div>
      
      {/* Image container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <img
          src="/voucher-preview.jpg"
          alt="Predogled darilnega bona La Vita"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
      
      {/* Footer info */}
      <div className="p-4 text-center">
        <p className="text-white/60 text-sm">
          To je vzorec darilnega bona. Dejanski bon bo vseboval podatke prejemnika in unikatno kodo.
        </p>
      </div>
    </div>
  );
};

export default VoucherPreview;
