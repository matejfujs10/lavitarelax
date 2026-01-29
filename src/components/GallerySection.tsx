import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide5 from "@/assets/slide-5.jpg";
import slide6 from "@/assets/slide-6.jpg";
import slide7 from "@/assets/slide-7.jpg";
import slide8 from "@/assets/slide-8.jpg";
import slide9 from "@/assets/slide-9.jpg";
import slide10 from "@/assets/slide-10.jpg";
import slide11 from "@/assets/slide-11.jpg";
import kitchenDetail from "@/assets/kitchen-detail.jpg";

const images = [
  { src: slide8, alt: "Spalnica z LED lučkami", title: "Topel ambient z LED lučkami" },
  { src: kitchenDetail, alt: "Kuhinja z detajli", title: "Kuhinja z ljubkimi detajli" },
  { src: slide1, alt: "HI-FI sistem", title: "Kakovosten zvočni sistem" },
  { src: slide2, alt: "Otroške igrače", title: "Zabava za najmlajše" },
  { src: slide3, alt: "Kuhinja", title: "Opremljena kuhinja" },
  { src: slide4, alt: "Spalnica", title: "Udobna spalnica" },
  { src: slide5, alt: "Spalnice", title: "Prostorne spalnice" },
  { src: slide6, alt: "Kuhinja s kuhalnimi površinami", title: "Polno opremljena kuhinja" },
  { src: slide7, alt: "Vhodni prostor", title: "Urejen vhod" },
  { src: slide9, alt: "Jedilnica z LED osvetlitvijo", title: "Prijetna jedilnica" },
  { src: slide10, alt: "Spalnica z LED lučkami", title: "Spalnica z ambient osvetlitvijo" },
  { src: slide11, alt: "Dnevni prostor s kuhinjo", title: "Odprt bivalni prostor" },
];

export const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

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
            Pogled v Notranjost
          </h2>
          <p className="text-muted-foreground text-lg">
            Oglejte si udobje in toplino naše hiške
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-primary-foreground font-display text-lg font-semibold">
                  {image.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-foreground/95 border-none p-0">
            <div className="relative">
              {selectedImage !== null && (
                <img
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
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
