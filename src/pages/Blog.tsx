import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from "lucide-react";

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
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Blog
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              Insights & Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tutorials, and updates from our team
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
                <Card key={i} className="overflow-hidden border-border/50">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="overflow-hidden h-full bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
                    {post.cover_image_url ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-secondary flex items-center justify-center">
                        <span className="text-4xl font-heading font-bold text-primary/30">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
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
                      <h2 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-primary text-sm font-medium">
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
    </div>
  );
}
