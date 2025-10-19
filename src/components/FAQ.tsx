import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQProps {
  activeTab: 'founders' | 'cofounders' | 'investors' | 'all'
}

export function FAQ({ activeTab }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([0])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getFAQs = () => {
    const commonFAQs = [
      {
        question: "Is the platform free to use?",
        answer: "Yes, browsing profiles and submitting your own profile is completely free. We're building a community-first platform to help startup founders connect with the right cofounders and investors without barriers."
      },
      {
        question: "How are profiles verified?",
        answer: "All profiles are manually reviewed before approval. We verify LinkedIn profiles, check portfolio links, and ensure genuine startup involvement. Featured profiles undergo additional verification for enhanced credibility."
      }
    ]

    const foundersFAQs = [
      {
        question: "How do I find a technical cofounder for my startup?",
        answer: "Use our advanced search to filter by skills like React, Node.js, Python, or mobile development. You can also filter by experience level, availability (full-time, part-time, equity-only), and startup stage preferences. Our verified profiles include LinkedIn connections and portfolio links to help you evaluate potential technical partners."
      },
      {
        question: "What should I look for in a technical cofounder?",
        answer: "Look for complementary skills to yours, relevant experience in your industry, alignment with your vision, and availability that matches your timeline. Check their past projects, GitHub contributions, and technical expertise. Most importantly, ensure cultural fit and shared commitment levels."
      },
      {
        question: "How do I approach potential cofounders?",
        answer: "Start with a personalized message highlighting why you think they'd be a great fit. Share your startup vision, current progress, and what you're offering (equity, role, growth opportunity). Be clear about expectations and timeline. Always suggest a video call to discuss further."
      },
      {
        question: "What equity should I offer a cofounder?",
        answer: "Equity splits typically range from 10-50% depending on the cofounder's role, experience, and contribution timing. Early cofounders (pre-MVP) often receive 20-40%, while later additions might get 5-15%. Consider vesting schedules and cliff periods to protect both parties."
      },
      ...commonFAQs
    ]

    const cofoundersFAQs = [
      {
        question: "How do I find the right startup to join as a cofounder?",
        answer: "Look for startups in industries you're passionate about, with founders whose vision aligns with yours. Check the startup stage - early stage offers more equity but higher risk, while later stages offer more stability. Evaluate the founding team, market opportunity, and your potential impact."
      },
      {
        question: "What questions should I ask potential founders?",
        answer: "Ask about their vision, current traction, funding status, team dynamics, and equity structure. Understand the market opportunity, competition, and go-to-market strategy. Discuss work-life balance, decision-making processes, and long-term goals. Always clarify your role and responsibilities."
      },
      {
        question: "Should I join for equity only or ask for salary?",
        answer: "This depends on your financial situation and risk tolerance. Equity-only is common for early-stage startups and offers higher upside potential. Part-time or consulting arrangements can provide immediate income while you evaluate the opportunity. Many cofounders start part-time and transition to full-time."
      },
      {
        question: "How do I evaluate a startup's potential?",
        answer: "Look at the founding team's experience, market size and timing, early traction or validation, competitive landscape, and funding prospects. Check if they have a clear path to revenue and realistic growth projections. Trust your instincts about the team's execution ability."
      },
      ...commonFAQs
    ]

    const investorsFAQs = [
      {
        question: "How do I find the right startups to invest in?",
        answer: "Use our filters to find startups by industry, stage, and funding needs that match your investment criteria. Look for strong founding teams, large market opportunities, early traction, and clear paths to scale. Our platform shows verified founder profiles with detailed startup information."
      },
      {
        question: "What information do I need to evaluate startups?",
        answer: "Review the founding team's background, startup stage and traction, market size and competition, business model and revenue projections, and funding history. Our profiles include startup descriptions, founder experience, and current progress to help you make informed decisions."
      },
      {
        question: "How do I connect with founders seeking investment?",
        answer: "Browse founder profiles and use our contact features to reach out directly. Many founders include their pitch decks and traction metrics. Start with LinkedIn connections or direct email. Be clear about your investment criteria, check size, and decision timeline."
      },
      {
        question: "What stages do you recommend for angel investors?",
        answer: "Angel investors typically focus on pre-seed to seed stages ($10K-$500K range). Look for startups with strong founding teams, early product-market fit signals, and clear growth potential. Our platform helps you filter by stage, industry, and funding needs."
      },
      ...commonFAQs
    ]

    const allFAQs = [
      {
        question: "What's the difference between founders, cofounders, and investors on the platform?",
        answer: "Founders are entrepreneurs actively building startups and looking for cofounders or team members. Cofounders are skilled professionals (technical or business) seeking to join startups as founding team members. Investors include angel investors, VCs, and seed funds looking for investment opportunities in early-stage startups."
      },
      {
        question: "How do I get started on cofounderBase?",
        answer: "Browse our directory to see founders, cofounders, and investors. Use the search and filter tools to find relevant matches. Click on profiles to learn more, then connect via LinkedIn or email. You can also submit your own profile to get discovered by others."
      },
      {
        question: "Can I find remote partners or local connections?",
        answer: "Yes! Use our location filter to find local partners in your city or filter for remote-friendly opportunities. Many professionals are open to remote collaboration, especially in technical roles."
      },
      {
        question: "How do I create an effective profile?",
        answer: "Include a clear headshot, detailed bio highlighting your experience, specific skills or startup details, past projects with results, and what you're looking for. Link your LinkedIn, GitHub, and portfolio for credibility. Be specific about your availability and expectations."
      },
      ...commonFAQs
    ]

    switch (activeTab) {
      case 'founders':
        return foundersFAQs
      case 'cofounders':
        return cofoundersFAQs
      case 'investors':
        return investorsFAQs
      default:
        return allFAQs
    }
  }

  const faqs = getFAQs()

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about finding cofounders, technical partners, and investors.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card/30 backdrop-blur-sm border border-accent/20 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-accent transition-transform duration-200 flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-accent/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready to find your cofounder?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of founders, technical cofounders, and investors building the future.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  )
}