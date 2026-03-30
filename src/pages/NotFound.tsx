import { Link } from "react-router-dom";
import { MoveLeft, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements - Subtler for light mode */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(17,208,0,0.03),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(12,83,2,0.05),transparent_40%)]" />

      {/* Floating Animated Circles - Softer for light mode */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-900/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 w-full max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Large Aesthetic 404 */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(17,208,0,0.08)_100%)] select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/40 backdrop-blur-xl border border-gray-100 p-6 md:p-10 rounded-[40px] shadow-2xl animate-bounce [animation-duration:3s]">
              <Compass
                size={64}
                className="text-green-600 md:w-24 md:h-24"
                strokeWidth={1}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold uppercase tracking-[0.3em] text-xs">
            <Sparkles size={14} />
            <span>Lost in the Grid</span>
            <Sparkles size={14} />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Page Not Found
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
            The page you're searching for seems to have vanished into another
            dimension. Let's get you back on the right track.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link to="/">
            <Button
              size="lg"
              className="h-16 px-10 rounded-2xl bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white font-bold text-lg shadow-[0_20px_40px_-15px_rgba(17,208,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(17,208,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:scale-95 group"
            >
              <MoveLeft
                size={20}
                className="mr-3 group-hover:-translate-x-1 transition-transform"
              />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Subtle Decorative Line */}
        <div className="pt-12">
          <div className="w-12 h-1 bg-[linear-gradient(90deg,transparent,#11D000,transparent)] mx-auto opacity-20" />
        </div>
      </div>

      {/* Background Texture Overlay - Subtler for white background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};

export default NotFound;
