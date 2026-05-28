-- Batch 14 (verses 701-701)
INSERT INTO "Verse" (id,"chapterId",number,"globalNumber",slug,sanskrit,transliteration,"wordByWord",translation,"translationAuthor",commentary,"commentaryAuthor","createdAt","updatedAt")
VALUES
(gen_random_uuid(),'cmpl2c7up000hu7euasqrsdtf',78,701,'18-78','यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।

तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम।।18.78।','yatra yogeśhvaraḥ kṛiṣhṇo yatra pārtho dhanur-dharaḥ
tatra śhrīr vijayo bhūtir dhruvā nītir matir mama',to_json('yatra—wherever; yoga-īśhvaraḥ—Shree Krishna, the Lord of Yog; kṛiṣhṇaḥ—Shree Krishna; yatra—wherever; pārthaḥ—Arjun, the son of Pritha; dhanuḥ-dharaḥ—the supreme archer; tatra—there; śhrīḥ—opulence; vijayaḥ—victory; bhūtiḥ—prosperity; dhruvā—unending; nītiḥ—righteousness; matiḥ mama—my opinion'::text),'Wherever Krishna, the Lord of Yoga, is; and wherever Arjuna, the wielder of the bow, is; there is prosperity, victory, happiness, and a firm policy; this is my conviction.','Swami Sivananda','18.78 यत्र wherever? योगेश्वरः the Lord of Yoga? कृष्णः Krishna? यत्र wherever? पार्थः Arjuna? धनुर्धरः the archer? तत्र there? श्रीः prosperity? विजयः victory? भूतिः happiness? ध्रुवा firm? नीतिः policy? मतिः conviction? मम my.Commentary This verse is called the Ekasloki Gita? i.e.? Bhagavad Gita in one verse. Repetition of even this one verse bestows the benefits of reading the whole of the scripture.Wherever On that side on which.Yogesvarah The Lord of Yoga. Krishna is called the Lord of Yogas as the seed of all Yogas comes forth from Him.Dhanurdharah The wielder of the bow called the Gandiva. There On the side of the Pandavas.Thus in the Upanishads of the glorious Bhagavad Gita? the science of the Eternal? the scripture of Yoga? the dialogue between Sri Krishna and Arjuna? ends the eighteenth discourse entitledThe Yoga of Liberation by Renunciation.OM SHANTIH SHANTIH SHANTIH       ,,','Swami Sivananda',now(),now())
ON CONFLICT (slug) DO UPDATE SET
  sanskrit            = EXCLUDED.sanskrit,
  transliteration     = EXCLUDED.transliteration,
  "wordByWord"        = EXCLUDED."wordByWord",
  translation         = EXCLUDED.translation,
  "translationAuthor" = EXCLUDED."translationAuthor",
  commentary          = EXCLUDED.commentary,
  "commentaryAuthor"  = EXCLUDED."commentaryAuthor",
  "updatedAt"         = now();