import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  useEffect(() => {
    document.title = "Blog | House La Vita Terme 3000 - Moravske Toplice";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Blog House La Vita - nasveti za oddih v Moravskih Toplicah, Termah 3000 in odkrivanje Prekmurja. Izleti, wellness in počitniške ideje."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-lavita-cream to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wider uppercase mb-4">
              Blog House La Vita
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Nasveti, navdih in zgodbe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Odkrijte najboljše izlete, wellness nasvete in skrivnosti Prekmurja
            </p>
            <div className="mt-6 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-lavita hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-accent/40 flex flex-col"
              >
                <Link to={`/blog/${post.id}`} className="block overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      width={1280}
                      height={768}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <Link to={`/blog/${post.id}`} className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground group/btn"
                    >
                      Preberi več
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
