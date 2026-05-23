const testimonials = [
  {
    quote: "Reading the Gita daily has changed how I approach every challenge. This platform makes it so easy to build the habit.",
    name: "Priya S.", role: "Software Engineer", initials: "PS", size: 'large',
  },
  {
    quote: "The audio recitation is beautiful. I listen during my morning walk and it grounds my entire day.",
    name: "Arjun M.", role: "Teacher", initials: "AM", size: 'small',
  },
  {
    quote: "I had tried reading the Gita before but always got lost. The guided journey explained everything so clearly.",
    name: "Sarah K.", role: "Student", initials: "SK", size: 'small',
  },
  {
    quote: "The dark mode reading experience is gorgeous. I read a few verses every night before bed.",
    name: "Rahul V.", role: "Designer", initials: "RV", size: 'medium',
  },
  {
    quote: "Bookmarking verses and adding my own notes has made this a true study companion.",
    name: "Meera T.", role: "Writer", initials: "MT", size: 'medium',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 sm:px-6 bg-warm-50 dark:bg-dark-900 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-saffron-600 dark:text-saffron-400 mb-3">
            Student stories
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-dark-900 dark:text-dark-100">
            Seekers finding their path
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card */}
          <div className="md:col-span-1 md:row-span-2 rounded-2xl border border-warm-100 dark:border-dark-700 bg-gradient-primary p-6 text-white shadow-large flex flex-col justify-between">
            <blockquote>
              <p className="text-lg font-medium leading-relaxed italic">
                "{testimonials[0].quote}"
              </p>
            </blockquote>
            <div className="flex items-center gap-3 mt-6">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                {testimonials[0].initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{testimonials[0].name}</p>
                <p className="text-white/70 text-xs">{testimonials[0].role}</p>
              </div>
            </div>
          </div>

          {/* Small cards */}
          {testimonials.slice(1).map((t) => (
            <div key={t.name} className="rounded-2xl border border-warm-100 dark:border-dark-700 bg-white dark:bg-dark-850 p-5 shadow-soft">
              <blockquote>
                <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </blockquote>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-dark-900 dark:text-dark-100 text-sm">{t.name}</p>
                  <p className="text-dark-400 dark:text-dark-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
