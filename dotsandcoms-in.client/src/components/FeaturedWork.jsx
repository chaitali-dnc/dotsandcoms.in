import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedWork() {
  const scrollContainerRef = useRef(null);
  const scrollWrapperRef = useRef(null);

  const projects = [
    {
      title: "Accutech Labels",
      industry: "Digital Transformation",
      image: "/case_study_accutech.webp",
      challenge: "Accutech Labels operated primarily on a traditional, offline-first model, leaving them vulnerable to digital-first competitors and missing valuable B2B search traffic.",
      result: "Shifted from an offline-first approach to a powerful digital lead engine, unlocking massive national B2B growth and consistent high-quality lead streams.",
      tech: ["React JS", "Tailwind CSS", "SEO Strategy", "Google Ads Network"],
      link: "/accutechlabels-case-study-traditional-to-web-business",
    },
    {
      title: "1Life",
      industry: "Brand Expansion",
      image: "/case_study_onelife.webp",
      challenge: "Expanding a regional health and wellness brand into a national footprint while maintaining unified branding, scaling digital operations, and driving regional adoption.",
      result: "Achieved rapid nationwide scaling, establishing a cohesive national identity and data-driven marketing systems that accelerated customer acquisition.",
      tech: ["Branding Suite", "React JS", "Node.js", "AWS Cloud Services", "CRM Solutions"],
      link: "/1life-case-study-of-regional-to-national-reach",
    },
    {
      title: "Kiiara Kreations",
      industry: "Startup Growth",
      image: "/case_study_kiiara.webp",
      challenge: "Evolving Kiiara Kreations from a creative passion project into a structured startup with high conversion rates, speed-optimized storefronts, and targeted digital reach.",
      result: "Transformed into a fast-growing consumer brand, leveraging custom-designed e-commerce platforms and social marketing to reach a wider audience and accelerate order volumes.",
      tech: ["Shopify Headless API", "React 19", "Tailwind CSS", "Meta Marketing Ads", "Google Analytics"],
      link: "/hobby-goes-global-case-study",
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const scrollWrapper = scrollWrapperRef.current;
    if (!scrollContainer || !scrollWrapper) return;

    // Check if large screen to apply horizontal pinning
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    let ctx;
    if (mediaQuery.matches) {
      ctx = gsap.context(() => {
        const horizontalLength = scrollWrapper.scrollWidth - window.innerWidth;
        gsap.to(scrollWrapper, {
          x: -horizontalLength,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainer,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${horizontalLength}`,
            invalidateOnRefresh: true,
          },
        });
      }, scrollContainerRef);
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={scrollContainerRef} id="work" className="relative bg-[#f8fafc]">
      {/* Glow mesh behind pinned section */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[300px] bg-[#dc2626]/3 rounded-full blur-[120px] -translate-y-1/2 -z-10 pointer-events-none" />

      {/* Outer section wrapper */}
      <div className="lg:h-screen lg:overflow-hidden flex flex-col justify-center pt-6 pb-6 md:py-20 lg:py-0">
        
        {/* Intro header block */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-12 flex flex-col md:flex-row md:items-end justify-between text-left">
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono tracking-widest text-[#ea580c] uppercase">
              // CASE STUDIES
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-800 tracking-tight leading-tight">
              Selected Digital Products
            </h2>
          </div>
          <span className="text-slate-400 text-xs font-mono tracking-widest uppercase hidden lg:block">
            SCROLL DOWN FOR SIDEWAYS MOTION →
          </span>
        </div>

        {/* Horizontal flex slide element */}
        <div
          ref={scrollWrapperRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-6 md:px-12 lg:pl-32 lg:pr-64 w-full"
        >
          {projects.map((project) => (
            <div
              key={project.title}
              className="w-full lg:w-[850px] shrink-0 rounded-2xl glass-panel border border-slate-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group hover:border-[#dc2626]/20 bg-white/95 shadow-xl transition-all duration-300"
            >
              {/* Slide Left: Info details */}
              <div className="md:col-span-5 flex flex-col text-left justify-between h-full space-y-6">
                <div>
                  <span className="text-xs font-bold font-mono text-[#dc2626] uppercase tracking-widest">
                    {project.industry}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-850 mt-2 group-hover:text-[#dc2626] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      The Challenge
                    </span>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      The Result
                    </span>
                    <p className="text-slate-700 font-semibold text-xs md:text-sm mt-1 leading-relaxed">
                      {project.result}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">
                    Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-100 bg-slate-50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={project.link || "/contact-webdesign-mobileapp-socialmedia-marketing-baroda"}
                    className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-slate-800 group-hover:text-[#ea580c] transition-colors duration-300"
                  >
                    <span>{project.link ? "Read Case Study" : "Request Audit Info"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Slide Right: Visual Mockup */}
              <div className="md:col-span-7 relative overflow-hidden rounded-xl h-[240px] md:h-[360px] w-full bg-slate-50 border border-slate-100">
                <img
                  src={project.image}
                  alt={project.alt || `${project.title} - ${project.category} Portfolio | Dots & Coms Web Design Company Vadodara`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
