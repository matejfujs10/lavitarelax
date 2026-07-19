import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import GiftVoucher from "./pages/GiftVoucher";
import GiftVoucherSuccess from "./pages/GiftVoucherSuccess";
import VoucherPreview from "./pages/VoucherPreview";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Diagnostika from "./pages/Diagnostika";
import { LocationLanding, LOCATIONS } from "./pages/LocationLanding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gift-voucher" element={<GiftVoucher />} />
            <Route path="/gift-voucher/success" element={<GiftVoucherSuccess />} />
            <Route path="/voucher-preview" element={<VoucherPreview />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/moravske-toplice" element={<LocationLanding meta={LOCATIONS["moravske-toplice"]} />} />
            <Route path="/murska-sobota" element={<LocationLanding meta={LOCATIONS["murska-sobota"]} />} />
            <Route path="/prekmurje" element={<LocationLanding meta={LOCATIONS["prekmurje"]} />} />
            <Route path="/diagnostika" element={<Diagnostika />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
