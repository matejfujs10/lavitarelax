import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getBlogPostById, blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = id ? getBlogPostById(id) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog House La Vita`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.excerpt);
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-28">
        {/* Hero image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            width={1280}
            height={768}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
          <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Nazaj na blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-muted-foreground">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString("sl-SI", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-accent to-transparent mb-8" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-lg text-foreground/90 leading-relaxed mb-8">
                {post.intro}
              </p>

              {post.sections.map((section, idx) => (
                <div key={idx} className="mb-8">
                  {section.heading && (
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs?.map((p, i) => (
                    <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="space-y-4 mt-4">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="pl-6 border-l-4 border-accent/60 py-2"
                        >
                          <strong className="block font-display text-lg text-foreground mb-1">
                            {item.title}
                          </strong>
                          <span className="text-foreground/80 leading-relaxed">
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {post.outro && (
                <p className="text-foreground/90 leading-relaxed text-lg italic border-l-4 border-accent pl-6 my-8">
                  {post.outro}
                </p>
              )}
            </motion.div>

            {/* CTA */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/30 text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Pripravljeni na vaš oddih?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Rezervirajte House La Vita in si zagotovite popoln oddih v Termah 3000.
              </p>
              <Link to="/#rezervacija">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lavita"
                >
                  Rezerviraj zdaj
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="max-w-5xl mx-auto mt-20">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Sorodne objave
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.id}`}
                    className="group bg-card rounded-2xl overflow-hidden shadow-lavita hover:shadow-xl transition-all border border-border/50 hover:border-accent/40 flex"
                  >
                    <div className="w-1/3 aspect-square overflow-hidden flex-shrink-0">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                      <span className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
                        {p.category}
                      </span>
                      <h4 className="font-display font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {p.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="h-20" />
      <Footer />
    </div>
  );
};

export default BlogPost;
