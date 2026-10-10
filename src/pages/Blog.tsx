import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const { content: heroContent } = useSiteContent("blog", "hero");
  const heroData = (heroContent?.content_data as any) || {};

  const { content: newsletterContent } = useSiteContent("blog", "newsletter");
  const newsletterData = (newsletterContent?.content_data as any) || {};

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, cover_image_url, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section data-section-id="hero" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span 
              data-editable-field="badge"
              data-field-label="Hero Badge"
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              {heroData.badge || "Our Blog"}
            </span>
            <h1 
              data-editable-field="title"
              data-field-label="Page Title"
              className="text-5xl md:text-6xl font-heading font-bold mb-6"
            >
              {heroData.title || "Insights & Updates"}
            </h1>
            <p 
              data-editable-field="subtitle"
              data-field-label="Page Subtitle"
              data-field-type="textarea"
              className="text-xl text-muted-foreground"
            >
              {heroData.subtitle || "Insights, tutorials, and updates from our team"}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden bg-[#090909] border-[#111111]">
                  <Skeleton className="w-full h-48 bg-[#111111]" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-[#111111]" />
                    <Skeleton className="h-4 w-full mb-1 bg-[#111111]" />
                    <Skeleton className="h-4 w-2/3 bg-[#111111]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#858585] text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="overflow-hidden h-full bg-[#090909] border-[#111111] hover:border-[#D4AF37]/30 transition-all duration-300">
                    {post.cover_image_url ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-[#111111] flex items-center justify-center">
                        <span className="text-4xl font-heading font-bold text-[#D4AF37]/30">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-[#858585] mb-3">
                        {post.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{estimateReadTime(post.content)} min read</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-heading font-semibold mb-2 text-[#F5F5F5] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[#858585] text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-[#D4AF37] text-sm font-medium">
                        Read more
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section data-section-id="newsletter" className="py-24 bg-[#050505] border-t border-[#111111]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-[#090909] rounded-3xl p-10 md:p-14 border border-[#111111]">
            <span 
              data-editable-field="badge"
              data-field-label="Badge"
              className="inline-block px-4 py-2 rounded-full bg-[#111111] border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium mb-6"
            >
              {newsletterData.badge || "Newsletter"}
            </span>
            <h2 
              data-editable-field="title"
              data-field-label="Section Title"
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
            >
              {newsletterData.title || "Stay in the Loop"}
            </h2>
            <p 
              data-editable-field="subtitle"
              data-field-label="Section Subtitle"
              data-field-type="textarea"
              className="text-lg text-[#858585] mb-8 max-w-xl mx-auto leading-relaxed"
            >
              {newsletterData.subtitle || "Subscribe to our newsletter to receive the latest updates, design tips, and industry trends directly to your inbox."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#111111] border border-[#111111] focus:border-[#D4AF37] rounded-full px-5 py-3 text-sm text-[#F5F5F5] focus:outline-none flex-1"
              />
              <button 
                type="button"
                className="bg-[#D4AF37] hover:bg-[#F0C75E] text-[#050505] font-semibold px-6 py-3 rounded-full text-sm transition-colors"
              >
                <span data-editable-field="button_text" data-field-label="Button Text">
                  {newsletterData.button_text || "Subscribe"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
