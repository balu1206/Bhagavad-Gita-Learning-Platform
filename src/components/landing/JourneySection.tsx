const steps = [
  { num: 1, title: 'Introduction', desc: 'Meet Arjuna on the battlefield of Kurukshetra and understand the context of this eternal dialogue.' },
  { num: 2, title: 'Key Concepts', desc: 'Learn foundational ideas: dharma, karma, atman, and the nature of the eternal self.' },
  { num: 3, title: 'The Setting', desc: 'Explore the historical and philosophical background of the Mahabharata war.' },
  { num: 4, title: 'Core Teachings', desc: 'Dive into Krishna\'s essential message: act without attachment to fruits of action.' },
  { num: 5, title: 'Paths of Yoga', desc: 'Understand Jnana Yoga (knowledge), Bhakti Yoga (devotion), and Karma Yoga (action).' },
  { num: 6, title: 'The Divine', desc: 'Witness Krishna\'s cosmic form and understand the nature of the Supreme.' },
  { num: 7, title: 'Liberation', desc: 'Discover the path to moksha — freedom from the cycle of birth and death.' },
  { num: 8, title: 'Daily Practice', desc: 'Integrate Gita\'s wisdom into modern life with daily reading and contemplation habits.' },
];

export function JourneySection() {
  return (
    <section id="journey" className="py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-dark-900">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600 dark:text-saffron-400 mb-3">
              Structured learning
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-900 dark:text-dark-100 mb-6">
              Your 8-step
              <br />
              <span className="text-gradient">beginner journey</span>
            </h2>
            <p className="text-dark-500 dark:text-dark-400 text-lg leading-relaxed mb-8">
              Never studied the Gita before? Our guided path takes you from first principles
              to daily practice — one step at a time, with lessons, quizzes, and achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/register" className="btn-primary h-11 px-6 rounded-xl text-sm inline-flex items-center gap-2">
                Start the Journey
              </a>
            </div>
          </div>

          {/* Right: step list */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-saffron-500 to-gold-500 opacity-20" aria-hidden="true" />

            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={step.num} className="relative flex gap-4">
                  {/* Step indicator */}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    i === 0
                      ? 'border-saffron-500 bg-saffron-500 text-white shadow-glow'
                      : 'border-warm-100 dark:border-dark-700 bg-white dark:bg-dark-850 text-dark-400 dark:text-dark-500'
                  }`}>
                    {step.num}
                  </div>
                  <div className="pb-2">
                    <h3 className="font-semibold text-dark-900 dark:text-dark-100 text-sm">{step.title}</h3>
                    <p className="text-dark-500 dark:text-dark-400 text-xs leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
