import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const About = () => {
  const { content: heroContent } = useSiteContent("about", "hero");
  const { content: storyContent } = useSiteContent("about", "story");

  const heroData = heroContent?.content_data as {
    title?: string;
    subtitle?: string;
  } | null;

  const storyData = storyContent?.content_data as {
    title?: string;
    content?: string;
  } | null;

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower businesses and creators with exceptional digital design solutions that drive success and inspire audiences.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be the leading creative agency recognized for innovation, quality, and transformative digital experiences.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue excellence in every project, delivering work that exceeds expectations and sets new standards.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnership, working closely with clients to achieve their goals and realize their vision.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {heroData?.title || "About DigiCreativio"}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {heroData?.subtitle || "We are a passionate team of designers, artists, and strategists dedicated to crafting digital experiences that make a lasting impact."}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="glass border-border/50">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-gradient">{storyData?.title || "Our Story"}</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {storyData?.content || "DigiCreativio was born from a simple belief: that great design has the power to transform businesses and connect with people on a deeper level. Since our founding, we've been committed to pushing the boundaries of creativity while delivering practical, results-driven solutions."}
                  </p>
                  <p>
                    Our journey began with a small team of passionate designers who shared a vision of creating a different kind of creative agency—one that combines artistic excellence with strategic thinking, technical expertise with human-centered design.
                  </p>
                  <p>
                    Today, we've grown into a full-service digital creative agency, but our core values remain unchanged. We still approach every project with the same enthusiasm and dedication, treating each client's vision as our own.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do and shape the way we work with our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Creative Team</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              A diverse group of talented individuals united by a passion for creativity and innovation. Our team brings together expertise in design, technology, and strategy to deliver exceptional results for our clients.
            </p>
            <Card className="glass border-border/50">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With years of combined experience across various industries, our team has the knowledge and skills to tackle any creative challenge. We stay at the forefront of design trends and technologies, ensuring that our clients always receive cutting-edge solutions that give them a competitive advantage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
