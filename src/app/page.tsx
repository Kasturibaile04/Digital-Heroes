"use client";

import Link from "next/link";
import { Heart, Activity, Trophy, ShieldCheck, PieChart, ArrowRight, Star, Plus, TrendingUp } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]; // Premium smooth ease curve

export default function HomePage() {
  const fadeUpHero = {
    hidden: { opacity: 0, y: 24 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay: customDelay, ease: smoothEase }
    })
  };

  const scaleUpHeroMockup = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, delay: 0.45, ease: smoothEase }
    }
  };

  return (
    <main className="flex-1 overflow-hidden bg-[#FAFAFC] text-[#171827]">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative pt-24 md:pt-32 pb-48 px-6 overflow-hidden flex flex-col items-center" style={{
        background: `radial-gradient(circle at 20% 20%, #BBE1FA 0%, transparent 35%),
        radial-gradient(circle at 80% 25%, #E6D4FB 0%, transparent 38%),
        linear-gradient(135deg, #6A8FE9 0%, #88A5EE 35%, #AABEF2 65%, #E6D4FB 100%)`
      }}>

        {/* Soft atmospheric blurred background blobs */}
        <motion.div
          animate={{ y: [0, -12, 15, 0], x: [0, 20, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-[#A9DDF2] rounded-full blur-[120px] opacity-30 pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -15, 12, 0], x: [0, -20, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[5%] w-[800px] h-[700px] bg-[#E9D8F5] rounded-full blur-[140px] opacity-[0.25] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 10, -15, 0], x: [0, -12, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-10%] right-[40%] w-[700px] h-[550px] bg-[#F4D9E8] rounded-full blur-[120px] opacity-[0.35] pointer-events-none"
        />

        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center">

          <div className="max-w-[760px] flex flex-col items-center mb-16">

            {/* Eyebrow */}
            <motion.div
              initial="hidden" animate="visible" custom={0} variants={fadeUpHero}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[#171827] bg-white/20 border border-white/40 rounded-full text-[12px] font-[700] tracking-[0.12em] uppercase shadow-[0_4px_12px_rgba(30,40,90,0.03)] backdrop-blur-md"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              GOLF · CHARITY · MONTHLY DRAWS
            </motion.div>

            {/* Headline */}
            <motion.div
              initial="hidden" animate="visible" custom={0.1} variants={fadeUpHero}
              className="mb-8 w-full flex flex-col text-[13vw] sm:text-[64px] md:text-[76px] font-[750] leading-[1.0] tracking-[-0.02em] text-[#171827]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <span className="block">Play Your Best.</span>
              <span className="block text-[#6F8FEF]">Create Real Impact.</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial="hidden" animate="visible" custom={0.2} variants={fadeUpHero}
              className="text-[17px] md:text-[19px] text-[#6F7182] max-w-[580px] mb-12 leading-[1.7] font-medium"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Turn every round into an opportunity to support the causes you care about, while automatically participating in high-value monthly draws.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden" animate="visible" custom={0.3} variants={fadeUpHero}
              className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
            >
              <Link href="/signup" className="w-full sm:w-auto bg-[#6F8FEF] hover:bg-[#5C7CE0] text-white px-8 py-4 rounded-[100px] font-[600] text-[16px] hover:-translate-y-[2px] transition-all duration-300 ease-out shadow-[0_8px_20px_rgba(111,143,239,0.25)] flex justify-center tracking-wide group" style={{ fontFamily: "var(--font-inter)" }}>
                Get Started
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto bg-[rgba(255,255,255,0.6)] backdrop-blur-md hover:bg-white text-[#171827] px-8 py-4 rounded-[100px] font-[600] text-[16px] hover:-translate-y-[2px] transition-all duration-300 ease-out group flex justify-center items-center shadow-sm" style={{ fontFamily: "var(--font-inter)" }}>
                Explore How It Works <ArrowRight className="inline-block w-4 h-4 ml-1.5 group-hover:translate-x-[4px] transition-transform duration-300 ease-out text-[#171827]/50 group-hover:text-[#171827]" />
              </Link>
            </motion.div>
          </div>

          {/* Floating Premium Product Preview */}
          <motion.div
            initial="hidden" animate="visible" variants={scaleUpHeroMockup}
            className="w-full relative max-w-[1020px] mx-auto z-20 group"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[rgba(255,255,255,0.92)] backdrop-blur-xl rounded-[28px] border border-[rgba(255,255,255,0.7)] shadow-[0_30px_80px_rgba(60,70,130,0.12)] overflow-hidden"
            >
              {/* Fake Dashboard Inner UI */}
              <div className="p-10 text-left">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-[24px] font-[750] text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>Overview Dashboard</h2>
                    <p className="text-[15px] text-[#6F7182] mt-1 font-medium" style={{ fontFamily: "var(--font-inter)" }}>Performance and charitable impact.</p>
                  </div>
                  <div className="hidden sm:flex px-5 py-3 bg-[#FAFAFC] border border-[rgba(30,30,50,0.06)] text-[#171827] rounded-full text-[14px] font-[600] items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4 opacity-50" /> Log Score
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Floating Performance Indicator */}
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="md:col-span-2 rounded-[24px] p-8 border border-[rgba(30,30,50,0.06)] bg-white/70 backdrop-blur-md shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(30,40,90,0.05)]">
                    <div className="text-[12px] font-[700] text-[#6F7182] mb-4 uppercase tracking-[0.08em]">Average Trajectory</div>
                    <div className="text-[56px] font-[750] tracking-[-0.03em] leading-none text-[#171827]" style={{ fontFamily: "var(--font-manrope)" }}>38.5 pts</div>
                    <div className="text-[15px] text-[#6F8FEF] font-[600] mt-3 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Top 15% player pool</div>
                  </motion.div>

                  {/* Impact Floating Card */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="rounded-[24px] p-8 bg-[rgba(217,164,65,0.04)] border border-[rgba(217,164,65,0.15)] shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(217,164,65,0.08)] flex flex-col justify-between">
                    <div className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Impact Tier</div>
                    <div className="text-[32px] font-[750] tracking-tight text-[#171827] mt-4" style={{ fontFamily: "var(--font-manrope)" }}>Gold</div>
                  </motion.div>

                  {/* Next Draw Floating Card */}
                  <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="rounded-[24px] p-8 bg-[rgba(67,169,130,0.04)] border border-[rgba(67,169,130,0.15)] shadow-[0_4px_24px_rgba(30,40,90,0.02)] transition-all duration-400 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(67,169,130,0.08)] flex flex-col justify-between">
                    <div className="text-[12px] font-[700] text-[#6F7182] uppercase tracking-[0.08em]">Next Draw</div>
                    <div className="text-[32px] font-[750] tracking-tight text-[#171827] mt-4" style={{ fontFamily: "var(--font-manrope)" }}>4 days</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Soft blend into the white section */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#FAFAFC] to-transparent pointer-events-none z-10" />
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <ScrollSection id="how-it-works" className="py-24 md:py-32 px-6 bg-[#FAFAFC]">
        <div className="max-w-[1240px] mx-auto">
          <div className="max-w-[640px] text-left mb-20 md:ml-4">
            <h2 className="text-[48px] md:text-[60px] font-[750] mb-5 text-[#171827] tracking-tight leading-[1.05]" style={{ fontFamily: "var(--font-manrope)" }}>
              Effortless Impact.
            </h2>
            <p className="text-[17px] md:text-[19px] text-[#6F7182] leading-[1.7] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
              The process is simple. We seamlessly bridge your active golf performance with real-world charitable giving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: "Record Scores", desc: "Easily submit your Stableford scores after each round. We handle the math and active rolling averages.", icon: Activity },
              { step: "02", title: "Choose a Cause", desc: "Select a charity you deeply care about. A percentage of your membership is allocated to them directly.", icon: Heart },
              { step: "03", title: "Monthly Draws", desc: "Your active scores automatically enter you into our secure, high-value monthly prize draws.", icon: Trophy }
            ].map((item, i) => (
              <StaggeredCard key={item.step} index={i} className="relative bg-[#FFFFFF] border border-[rgba(30,30,50,0.06)] rounded-[32px] p-10 hover:border-[rgba(30,30,50,0.1)] hover:shadow-[0_16px_48px_rgba(60,70,130,0.06)] hover:-translate-y-[4px] transition-all duration-400 ease-out group">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 rounded-[20px] bg-[#FAFAFC] border border-[rgba(30,30,50,0.04)] flex items-center justify-center group-hover:bg-[#F4D9E8]/30 transition-colors duration-400">
                    <item.icon className="w-7 h-7 text-[#171827] group-hover:text-[#6F8FEF] transition-colors duration-400" />
                  </div>
                  <div className="text-[16px] font-[700] text-[#6F7182]/40 tracking-wider" style={{ fontFamily: "var(--font-manrope)" }}>{item.step}</div>
                </div>
                <h3 className="text-[24px] font-[750] mb-3 text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>{item.title}</h3>
                <p className="text-[#6F7182] leading-[1.7] text-[16px] font-medium" style={{ fontFamily: "var(--font-inter)" }}>{item.desc}</p>
              </StaggeredCard>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ── IMPACT STORY ──────────────────────────────────────────────── */}
      <ScrollSection className="py-24 md:py-32 px-6">
        <div className="max-w-[1240px] mx-auto text-center">
          <h2 className="text-[48px] md:text-[60px] font-[750] mb-6 text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>
            Your Game. Multiplied.
          </h2>
          <p className="text-[17px] md:text-[19px] text-[#6F7182] mb-20 max-w-2xl mx-auto leading-[1.7] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
            Digital Heroes creates an elegant bridge between your passion for golf and a real desire to make a difference in the world.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            <motion.div whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(60,70,130,0.05)" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex flex-col items-center p-12 bg-[#FFFFFF] rounded-[36px] border border-[rgba(30,30,50,0.05)] w-full max-w-[340px]">
              <div className="w-20 h-20 rounded-[20px] bg-[#FAFAFC] shadow-sm border border-[rgba(30,30,50,0.04)] flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-[#171827]" />
              </div>
              <h4 className="font-[750] text-[22px] text-[#171827] mb-2" style={{ fontFamily: "var(--font-manrope)" }}>1. Play</h4>
              <p className="text-[16px] text-[#6F7182] font-medium">Submit your weekends</p>
            </motion.div>

            <ArrowRight className="w-6 h-6 text-[#6F7182]/30 hidden md:block" />

            <motion.div whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(111,143,239,0.15)" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex flex-col items-center p-12 bg-[#6F8FEF] rounded-[36px] border border-[#6F8FEF] w-full max-w-[340px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
              <div className="w-20 h-20 rounded-[20px] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-6 shadow-md z-10 relative group-hover:scale-105 transition-transform duration-500 ease-out">
                <Heart className="w-8 h-8 text-white fill-white/90" />
              </div>
              <h4 className="font-[750] text-[22px] text-white mb-2 relative z-10" style={{ fontFamily: "var(--font-manrope)" }}>2. Support</h4>
              <p className="text-[16px] text-white/80 relative z-10 font-medium">Direct financial flow</p>
            </motion.div>

            <ArrowRight className="w-6 h-6 text-[#6F7182]/30 hidden md:block" />

            <motion.div whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(60,70,130,0.05)" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex flex-col items-center p-12 bg-[#FFFFFF] border border-[rgba(30,30,50,0.05)] rounded-[36px] w-full max-w-[340px]">
              <div className="w-20 h-20 rounded-[20px] bg-[#FAFAFC] shadow-sm border border-[rgba(30,30,50,0.04)] flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#43A982]" />
              </div>
              <h4 className="font-[750] text-[22px] text-[#171827] mb-2" style={{ fontFamily: "var(--font-manrope)" }}>3. Impact</h4>
              <p className="text-[16px] text-[#6F7182] font-medium">Meaningful change</p>
            </motion.div>
          </div>
        </div>
      </ScrollSection>

      {/* ── CTA BOTTOM ────────────────────────────────────────────────── */}
      <ScrollSection className="py-32 px-6">
        <div className="max-w-[1000px] mx-auto text-center bg-white border border-[rgba(30,30,50,0.06)] rounded-[48px] p-20 md:p-32 relative overflow-hidden shadow-[0_32px_80px_rgba(60,70,130,0.06)]">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E9D8F5] rounded-full blur-[140px] opacity-[0.4] pointer-events-none" />

          <h2 className="text-[48px] md:text-[60px] font-[750] mb-6 text-[#171827] tracking-tight relative z-10 leading-[1.05]" style={{ fontFamily: "var(--font-manrope)" }}>
            Make it matter.
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#6F7182] mb-12 max-w-xl mx-auto relative z-10 leading-[1.7] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
            Join Digital Heroes today. Start tracking your scores, winning prizes, and supporting causes you care about.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-[#6F8FEF] hover:bg-[#5C7CE0] text-white px-10 py-5 rounded-[100px] font-[600] text-[16px] transition-all duration-400 ease-out shadow-[0_12px_24px_rgba(111,143,239,0.25)] hover:-translate-y-[2px] relative z-10 group tracking-wide">
            View Memberships <ArrowRight className="w-5 h-5 group-hover:translate-x-[4px] transition-transform duration-400 ease-out" />
          </Link>
        </div>
      </ScrollSection>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="bg-transparent pt-12 pb-16 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-[rgba(30,30,50,0.08)] pt-12 text-[14px] text-[#6F7182] font-medium" style={{ fontFamily: "var(--font-inter)" }}>
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <span className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#6F8FEF] shadow-sm">
                <Heart className="w-4 h-4 text-white fill-white" />
              </span>
              <span className="font-[750] text-[16px] text-[#171827] tracking-tight" style={{ fontFamily: "var(--font-manrope)" }}>Digital Heroes</span>
            </div>

            <div className="flex gap-8">
              <span className="hover:text-[#171827] cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-[#171827] cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Reusable animated Scroll Section for smooth block-level reveals
function ScrollSection({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Reusable card for grid staggering
function StaggeredCard({ children, className, index }: { children: React.ReactNode, className?: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: smoothEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
