import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide6 from "@/assets/slide-6.jpg";
import slide7 from "@/assets/slide-7.jpg";
import slide8 from "@/assets/slide-8.jpg";
import slide9 from "@/assets/slide-9.jpg";
import slide10 from "@/assets/slide-10.jpg";
import slide11 from "@/assets/slide-11.jpg";
import kitchenDetail from "@/assets/kitchen-detail.jpg";
import galleryBedroom2 from "@/assets/gallery-bedroom-2.jpg";
import galleryTerraceTable from "@/assets/gallery-terrace-table.jpg";

type GalleryImage = {
  src: string;
  srcSet?: string;
  full: string;
  alt: string;
  title: string;
};

/** Local optimized photos (also work on custom domains / SPA rewrites). */
const local = (base: string, widths: number[]): Pick<GalleryImage, "src" | "srcSet" | "full"> => ({
  src: `/gallery/${base}-${widths[0]}.jpg`,
  srcSet: widths.map((w) => `/gallery/${base}-${w}.jpg ${w}w`).join(", "),
  full: `/gallery/${base}-${widths[widths.length - 1]}.jpg`,
});

const images: GalleryImage[] = [
  {
    ...local("new-house-exterior-side", [640, 1024]),
    alt: "Hiška La Vita Kamp Terme 3000 Moravske Toplice – zunanjost s stranske strani",
    title: "Zunanjost hiške La Vita",
  },
  {
    ...local("new-house-front", [640, 1024]),
    alt: "Počitniška hiška La Vita – čelni pogled z vhodom",
    title: "Vhod v hiško La Vita",
  },
  {
    ...local("new-terme-3000-slides", [640, 1024, 1600]),
    alt: "Terme 3000 Moravske Toplice – tobogani in bazenski kompleks",
    title: "Terme 3000 – tobogani",
  },
  {
    ...local("new-pools-aerial", [640]),
    alt: "Bazeni Terme 3000 – pogled iz višine na kopališki kompleks",
    title: "Bazeni Terme 3000",
  },
  {
    ...local("new-terrace-bikes", [640, 1024, 1600]),
    alt: "Terasa hiške La Vita s kolesi in klopmi – Kamp Terme 3000",
    title: "Terasa s kolesi",
  },
  {
    ...local("new-kitchen-green", [640, 1024, 1600]),
    alt: "Opremljena kuhinja z jedilnim kotičkom v hiški La Vita",
    title: "Opremljena kuhinja",
  },
  { src: slide8, full: slide8, alt: "Notranjost hiške Hiška La Vita Moravske Toplice – spalnica z LED osvetlitvijo", title: "Topel ambient z LED lučkami" },
  { src: kitchenDetail, full: kitchenDetail, alt: "Kuhinja v počitniški hiški Hiška La Vita – detajli opreme", title: "Kuhinja z ljubkimi detajli" },
  { src: slide6, full: slide6, alt: "Polno opremljena kuhinja Hiška La Vita Moravske Toplice", title: "Polno opremljena kuhinja" },
  { src: slide4, full: slide4, alt: "Udobna spalnica v počitniški hiški Hiška La Vita", title: "Udobna spalnica" },
  { src: galleryBedroom2, full: galleryBedroom2, alt: "Druga spalnica v počitniški hiški Hiška La Vita Kamp Terme 3000", title: "Dodatna spalnica" },
  { src: slide10, full: slide10, alt: "Spalnica z ambient osvetlitvijo Hiška La Vita Terme 3000", title: "Spalnica z ambient osvetlitvijo" },
  { src: galleryTerraceTable, full: galleryTerraceTable, alt: "Terasa z mizo in klopmi pred hiško La Vita", title: "Zunanji jedilni kotiček" },
  { src: slide9, full: slide9, alt: "Jedilnica z LED osvetlitvijo v hiški Hiška La Vita", title: "Prijetna jedilnica" },
  { src: slide11, full: slide11, alt: "Odprt bivalni prostor v počitniški hiški Hiška La Vita", title: "Odprt bivalni prostor" },
  { src: slide1, full: slide1, alt: "HI-FI sistem v hiški Hiška La Vita Kamp Terme 3000", title: "Kakovosten zvočni sistem" },
  { src: slide2, full: slide2, alt: "Otroške igrače v počitniški hiški Hiška La Vita", title: "Zabava za najmlajše" },
  { src: slide7, full: slide7, alt: "Vhodni prostor počitniške hiške Hiška La Vita", title: "Urejen vhod" },
];

const SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw";

export const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const handlePrev = useCallback(() => {
    setZoomed(false);
    setSelectedImage((i) => (i === null ? i : i === 0 ? images.length - 1 : i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setZoomed(false);
    setSelectedImage((i) => (i === null ? i : i === images.length - 1 ? 0 : i + 1));
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setZoomed((z) => !z);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage, handlePrev, handleNext]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
            📸 Galerija
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Udobje in oprema hiške
          </h2>
          <p className="text-muted-foreground text-lg">
            Oglejte si notranjost počitniške hiške Hiška La Vita v Kampu Terme 3000
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.button
              type="button"
              key={image.src}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: Math.min(index, 7) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => { setZoomed(false); setSelectedImage(index); }}
              aria-label={`Odpri fotografijo: ${image.title}`}
            >
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.srcSet ? SIZES : undefined}
                alt={image.alt}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-primary-foreground font-display text-lg font-semibold">
                  {image.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl bg-foreground/95 border-none p-0">
            <div className="relative">
              {selectedImage !== null && (
                <>
                  <div className={`w-full ${zoomed ? "overflow-auto max-h-[80vh]" : ""}`}>
                    <img
                      src={images[selectedImage].full}
                      alt={images[selectedImage].alt}
                      onClick={() => setZoomed((z) => !z)}
                      className={
                        zoomed
                          ? "w-auto max-w-none h-auto scale-100 origin-top-left cursor-zoom-out"
                          : "w-full h-auto max-h-[80vh] object-contain cursor-zoom-in"
                      }
                      style={zoomed ? { width: "180%" } : undefined}
                    />
                  </div>

                  <figcaption className="absolute bottom-0 left-0 right-0 bg-foreground/70 px-4 py-3 text-background text-sm md:text-base">
                    <span className="font-display font-semibold">{images[selectedImage].title}</span>
                    <span className="opacity-70"> · {selectedImage + 1} / {images.length}</span>
                  </figcaption>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setZoomed((z) => !z)}
                      aria-label={zoomed ? "Pomanjšaj" : "Povečaj"}
                      className="w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      aria-label="Zapri"
                      className="w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Prejšnja fotografija"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Naslednja fotografija"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
