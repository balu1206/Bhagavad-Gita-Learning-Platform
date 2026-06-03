'use client';

import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

// A curated selection of 30 famous verses that rotate daily
const FEATURED_VERSES = [
  {
    chapter: 2, verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
    translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  },
  {
    chapter: 2, verse: 20,
    sanskrit: 'न जायते म्रियते वा कदाचि\nन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥',
    transliteration: 'na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śāśvato \'yaṁ purāṇo\nna hanyate hanyamāne śarīre',
    translation: 'The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing and primeval.',
  },
  {
    chapter: 4, verse: 7,
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham',
    translation: 'Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion — at that time I descend Myself.',
  },
  {
    chapter: 9, verse: 22,
    sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    transliteration: 'ananyāś cintayanto māṁ ye janāḥ paryupāsate\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham',
    translation: 'But those who always worship Me with exclusive devotion, meditating on My transcendental form — to them I carry what they lack, and I preserve what they have.',
  },
  {
    chapter: 18, verse: 66,
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ',
    translation: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
  },
  {
    chapter: 6, verse: 5,
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ',
    translation: 'One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.',
  },
  {
    chapter: 3, verse: 27,
    sanskrit: 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः।\nअहङ्कारविमूढात्मा कर्ताहमिति मन्यते॥',
    transliteration: 'prakṛteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśaḥ\nahaṅkāra-vimūḍhātmā kartāham iti manyate',
    translation: 'The spirit soul bewildered by the influence of false ego thinks himself the doer of activities that are in actuality carried out by the three modes of material nature.',
  },
  {
    chapter: 12, verse: 13,
    sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥',
    transliteration: 'adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī',
    translation: 'One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is forgiving.',
  },
  {
    chapter: 2, verse: 14,
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    transliteration: 'mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ\nāgamāpāyino \'nityās tāṁs titikṣasva bhārata',
    translation: 'O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, and one must learn to tolerate them without being disturbed.',
  },
  {
    chapter: 5, verse: 22,
    sanskrit: 'ये हि संस्पर्शजा भोगा दुःखयोनय एव ते।\nआद्यन्तवन्तः कौन्तेय न तेषु रमते बुधः॥',
    transliteration: 'ye hi saṁsparśa-jā bhogā duḥkha-yonaya eva te\nādy-antavantaḥ kaunteya na teṣu ramate budhaḥ',
    translation: 'An intelligent person does not take part in the sources of misery, which are due to contact with the material senses. Such pleasures have a beginning and an end, and so the wise man does not delight in them.',
  },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function VerseOfTheDay() {
  const verse = FEATURED_VERSES[getDayOfYear() % FEATURED_VERSES.length];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-dark-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-200 dark:border-saffron-800 bg-saffron-50 dark:bg-saffron-900/20 px-4 py-1.5 text-sm font-medium text-saffron-700 dark:text-saffron-300 mb-4">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Verse of the Day &middot; {today}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark-900 dark:text-dark-100">
            Today&rsquo;s Shloka
          </h2>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-warm-200 dark:border-dark-700 bg-gradient-to-br from-warm-50 via-white to-saffron-50/30 dark:from-dark-850 dark:via-dark-800 dark:to-saffron-900/10 overflow-hidden shadow-medium">
          {/* Decorative top strip */}
          <div className="h-1 w-full bg-gradient-to-r from-saffron-400 via-gold-400 to-saffron-500" />

          <div className="p-6 sm:p-10">
            {/* Verse reference */}
            <p className="text-xs font-semibold text-saffron-500 dark:text-saffron-400 uppercase tracking-widest mb-6 text-center">
              Bhagavad Gita {verse.chapter}.{verse.verse}
            </p>

            {/* Sanskrit */}
            <div className="bg-white/60 dark:bg-dark-900/40 rounded-2xl p-6 mb-6 border border-warm-100 dark:border-dark-700 text-center">
              <p className="font-sanskrit text-2xl sm:text-3xl text-dark-900 dark:text-white leading-loose whitespace-pre-line">
                {verse.sanskrit}
              </p>
              <p className="mt-4 text-sm text-dark-500 dark:text-dark-400 italic leading-relaxed whitespace-pre-line">
                {verse.transliteration}
              </p>
            </div>

            {/* Translation */}
            <blockquote className="border-l-4 border-saffron-400 dark:border-saffron-600 pl-6 py-1 mb-8">
              <p className="text-dark-800 dark:text-dark-100 text-lg leading-relaxed font-serif">
                &ldquo;{verse.translation}&rdquo;
              </p>
            </blockquote>

            {/* CTA */}
            <div className="text-center">
              <Link
                href={`/chapters/${verse.chapter}/${verse.verse}`}
                className="inline-flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Read Full Verse with Commentary
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
