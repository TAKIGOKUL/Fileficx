export type GuideBlock =
  | string
  | { list: string[]; ordered?: boolean }
  | { tip: string };

export interface GuideSection {
  heading: string;
  blocks: GuideBlock[];
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  category: 'Fundamentals' | 'How-to' | 'Exams' | 'Visa & Passport' | 'Privacy';
  readMinutes: number;
  updated: string; // ISO date
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'why-portals-reject-photos',
    title: 'Why Application Portals Reject Your Photo (and How to Fix It)',
    summary:
      'Most rejections come down to three checks: pixel dimensions, file size in KB, and file format. Learn what each one means and how to pass all three on the first try.',
    category: 'Fundamentals',
    readMinutes: 6,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'The three automated checks',
        blocks: [
          'When you upload a photo to an exam, job or visa portal, nobody looks at it straight away. A validation script checks the file first, and if any rule fails you get a vague error such as "Invalid file" or "Image does not meet requirements". Nearly every one of these scripts checks the same three things.',
          {
            ordered: true,
            list: [
              'Pixel dimensions: the width and height of the image, e.g. 200 × 230 pixels. Some portals want an exact size; others give a minimum or a range.',
              'File size: how many kilobytes (KB) the file takes on disk, e.g. "between 20 KB and 50 KB". Too large and it is rejected; on many portals, too small is rejected as well.',
              'Format: usually JPG/JPEG for photos and signatures and PDF for documents. Renaming a .png file to .jpg does not convert it, and many validators read the real file header.',
            ],
          },
          'Some portals add a fourth rule, a DPI value such as 200 or 300 DPI. DPI is stored as metadata inside the file and does not change how the image looks on screen. It is covered in detail in our DPI guide.',
        ],
      },
      {
        heading: 'The most common mistakes',
        blocks: [
          {
            list: [
              'Uploading the phone photo directly. A modern phone camera produces images of 3–8 MB at 4000+ pixels wide, which is roughly a hundred times over a typical 50 KB limit.',
              'Squashing the photo to the target size. Resizing a tall portrait straight to 200 × 230 without cropping first stretches the face, and a manual review may reject it even if the automated checks pass.',
              'Compressing too far. A file that is far below the minimum (for example 8 KB when the minimum is 20 KB) usually means heavy JPEG artefacts, and it is rejected too.',
              'Screenshots of photos. A screenshot changes the dimensions and often saves as PNG, which fails the format check.',
              'Busy or dark backgrounds. Most portals ask for a plain white or light background. Shadows behind the head are a frequent reason for manual rejection.',
            ],
          },
        ],
      },
      {
        heading: 'A reliable workflow',
        blocks: [
          {
            ordered: true,
            list: [
              'Read the official notification and write down the exact numbers: dimensions, minimum and maximum KB, format and any DPI or background rule.',
              'Start from the best original you have, either a fresh photo against a plain wall in daylight or a clean scan.',
              'Crop to the right aspect ratio first (200 × 230 is slightly taller than square), keeping the face centred with a little space above the head.',
              'Resize to the exact pixel dimensions.',
              'Export as JPG and adjust the quality until the file falls inside the KB range. Aim slightly below the maximum, not right on it.',
              'Check the final file\'s properties (size in KB and dimensions) before you upload.',
            ],
          },
          'Fileficx does steps 3–6 in one pass. Paste the requirement text from the notification, drop your photo, and the tool crops, resizes, sets the DPI and searches for the JPEG quality that lands inside your KB range, all inside your browser.',
          { tip: 'Requirements change between recruitment cycles. Always check the numbers in the current official notification rather than relying on last year\'s values.' },
        ],
      },
    ],
  },
  {
    slug: 'dpi-vs-pixels-explained',
    title: 'DPI vs Pixels: What Application Forms Actually Mean',
    summary:
      'A 200 × 230 px photo "at 200 DPI" can confuse anyone. Here is what DPI really is, when it matters, and how to set it correctly.',
    category: 'Fundamentals',
    readMinutes: 5,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'Pixels are the image itself',
        blocks: [
          'A digital image is a grid of coloured dots called pixels. A 200 × 230 image has 200 columns and 230 rows, 46,000 pixels in total. This is the only thing that decides how much detail the image holds. When a form says "200 × 230 pixels", that is the rule that matters most.',
        ],
      },
      {
        heading: 'DPI is a printing instruction',
        blocks: [
          'DPI (dots per inch), more precisely PPI (pixels per inch) for digital images, is a number stored in the file\'s metadata. It tells a printer how many pixels to place in each inch of paper. It does not add or remove detail.',
          'Take the same 600 × 600 pixel image:',
          {
            list: [
              'At 300 DPI it prints as 2 × 2 inches (600 ÷ 300 = 2).',
              'At 100 DPI it prints as 6 × 6 inches, larger but blurrier on paper.',
              'On screen both versions look identical, because screens ignore the DPI tag.',
            ],
          },
          'This is why the US visa photo rule of "2 × 2 inches, 600 × 600 pixels" and "300 DPI" are the same requirement written two ways.',
        ],
      },
      {
        heading: 'Converting centimetres to pixels',
        blocks: [
          'Some forms give physical sizes such as 3.5 cm × 4.5 cm. To get pixels, convert to inches (1 inch = 2.54 cm) and multiply by the DPI:',
          {
            list: [
              '3.5 cm ÷ 2.54 × 300 DPI ≈ 413 pixels wide',
              '4.5 cm ÷ 2.54 × 300 DPI ≈ 531 pixels tall',
              'At 200 DPI the same photo would be about 276 × 354 pixels.',
            ],
          },
          'If a form gives centimetres and a DPI, calculate the pixel size this way. If it gives centimetres with no DPI, 300 DPI is the usual print standard.',
        ],
      },
      {
        heading: 'Why portals still check DPI',
        blocks: [
          'Some application systems print admit cards and ID documents from your upload, so they read the DPI tag to know the intended print size. A JPEG saved by a phone or screenshot tool is often tagged at 72 or 96 DPI, or has no tag at all, and strict validators reject it even when the pixels are correct.',
          'The fix is to rewrite the resolution field in the JPEG header (the JFIF density value) without re-encoding the image. Fileficx does this automatically whenever your requirement mentions a DPI value, so the pixels stay untouched and only the metadata changes.',
          { tip: 'Raising DPI in an image editor without changing pixel dimensions does not make a photo sharper. Only a better original does.' },
        ],
      },
    ],
  },
  {
    slug: 'compress-photo-to-exact-kb',
    title: 'How to Compress a Photo to an Exact KB Size Without Making It Blurry',
    summary:
      'Getting a photo between 20 KB and 50 KB, or a signature under 20 KB, is a balance of resolution, JPEG quality and background. Here is how to hit the target cleanly.',
    category: 'How-to',
    readMinutes: 6,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'What actually controls file size',
        blocks: [
          'Three things decide how many kilobytes a JPEG takes:',
          {
            ordered: true,
            list: [
              'Pixel count. Halving the width and height cuts the pixel count to a quarter. Resize to the required dimensions before you compress.',
              'JPEG quality. A setting from roughly 1 to 100. Lower quality throws away fine detail, and file size drops quickly between 95 and 75.',
              'Image content. Plain backgrounds compress very well; noise, grain, patterned clothing and busy backgrounds do not. A clean white background can save more KB than any quality setting.',
            ],
          },
        ],
      },
      {
        heading: 'Hitting a KB range, step by step',
        blocks: [
          {
            ordered: true,
            list: [
              'Crop and resize to the exact required pixel dimensions first.',
              'Export at quality 90 and check the size.',
              'If the file is too large, lower the quality in small steps (85, 80, 75…) until it fits. Most passport-style photos at 200 × 230 land well below 50 KB at quality 80–90.',
              'If it is too small (below the minimum), raise the quality. A file that cannot reach the minimum even at quality 100 is usually too small in pixels, so check the dimensions.',
              'Aim for a size comfortably inside the range, around 85–90% of the maximum, rather than exactly on the limit, because some portals count 1 KB as 1,000 bytes and others as 1,024.',
            ],
          },
          'Fileficx automates step 3. It starts at a high quality, checks the result and steps down only as far as needed to fit your KB target. If even low quality is too big, it reduces the pixel size slightly. This usually takes a fraction of a second.',
        ],
      },
      {
        heading: 'Keeping signatures sharp',
        blocks: [
          'Signatures have hard edges, and JPEG compression blurs edges first. To keep them crisp:',
          {
            list: [
              'Sign with a dark black or blue pen on plain white paper. Gel and felt pens scan better than ballpoints.',
              'Scan or photograph in even light, then crop tightly around the signature.',
              'Convert to grayscale. It removes colour noise and saves space.',
              'Increase contrast so the paper is pure white. A clean white background is the biggest single saving.',
            ],
          },
          { tip: 'If a portal accepts PNG for signatures, PNG keeps edges perfectly sharp and is often smaller than JPEG for black-on-white images.' },
        ],
      },
    ],
  },
  {
    slug: 'scan-signature-for-online-forms',
    title: 'How to Scan and Upload a Clean Signature for Online Forms',
    summary:
      'Exam and bank portals often ask for a signature image of around 140 × 60 pixels and 10–20 KB. Here is how to capture one that passes both automated and manual review.',
    category: 'Exams',
    readMinutes: 5,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'Prepare the signature on paper',
        blocks: [
          {
            list: [
              'Use plain white, unlined A4 paper.',
              'Sign with a black-ink pen (some portals also accept blue, so check the notice). Avoid pencil and light-coloured ink.',
              'Sign at your normal size and style. Your uploaded signature may be compared with the one you sign at the exam centre.',
              'Sign a few times and pick the cleanest one.',
              'Many notifications say signatures in CAPITAL LETTERS are not accepted. Use your usual running signature.',
            ],
          },
        ],
      },
      {
        heading: 'Capture it',
        blocks: [
          'A flatbed scanner gives the best results, but a phone works well if you follow a few rules:',
          {
            list: [
              'Photograph in daylight near a window, not under a single overhead bulb that casts the shadow of your phone.',
              'Hold the phone parallel to the paper so the signature is not skewed.',
              'Fill most of the frame with the signature area, without zooming in digitally.',
              'Turn off the flash. It creates a glare spot and uneven background.',
            ],
          },
        ],
      },
      {
        heading: 'Format it to the portal\'s rules',
        blocks: [
          {
            ordered: true,
            list: [
              'Crop tightly around the signature, leaving a small, even margin.',
              'Match the required aspect ratio. A 140 × 60 box is wide and short (about 2.3 : 1), so crop to that shape before resizing to avoid stretching.',
              'Convert to grayscale and raise contrast so the background becomes pure white.',
              'Resize to the exact pixel dimensions and save as JPG inside the KB range.',
            ],
          },
          'In Fileficx, choose a signature preset or paste the signature rule from your notification. Grayscale, background fill and KB targeting are applied together, and you can compare the result with the original side by side before downloading.',
          { tip: 'Keep the final signature file in a safe folder. You will need the identical file for later stages such as document verification and re-applications.' },
        ],
      },
    ],
  },
  {
    slug: 'reduce-pdf-size-for-uploads',
    title: 'How to Reduce PDF Size for Certificate and ID Uploads',
    summary:
      'Marksheets, caste certificates and ID proofs often have to be under 300 KB or 1 MB. Learn why scanned PDFs get so large and how to shrink them while keeping them readable.',
    category: 'How-to',
    readMinutes: 5,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'Why scanned PDFs are so large',
        blocks: [
          'A PDF made from a scan or phone photo is really a set of images wrapped in a PDF container. A single A4 page scanned at 600 DPI in full colour can easily be 3–5 MB. Typed text in a document exported from a word processor takes only a few kilobytes because it is stored as text, not pixels.',
        ],
      },
      {
        heading: 'Ways to shrink a PDF',
        blocks: [
          {
            list: [
              'Scan at a sensible resolution. 150–200 DPI is readable for almost every certificate. 300 DPI is only needed for very small print.',
              'Use grayscale for black-and-white documents. Colour roughly triples the data with no benefit for a typed marksheet.',
              'Remove pages you do not need. Many portals want only the relevant page of a multi-page document.',
              'Recompress the embedded images at a lower JPEG quality. This usually brings the biggest drop in size.',
              'Split, or merge in the right order. When a portal accepts one combined file, merge pages into a single PDF. When it has separate fields, split them.',
            ],
          },
        ],
      },
      {
        heading: 'Checking readability',
        blocks: [
          'After compressing, open the file and zoom to 100%. Make sure you can clearly read:',
          {
            list: [
              'Your name, roll number and registration numbers',
              'Dates, marks and grades',
              'Seals, stamps and signatures of the issuing authority',
            ],
          },
          'If any of these are smudged, go back to a higher quality. A rejected document during verification costs far more time than a slightly bigger file.',
          'The Fileficx PDF studio can preview, rotate, split and extract pages, merge files and compress the PDF, all locally in your browser. Certificates and ID cards hold sensitive personal data, and with local processing they never leave your device.',
        ],
      },
    ],
  },
  {
    slug: 'passport-visa-photo-checklist',
    title: 'Passport & Visa Photo Checklist: Getting the Digital Photo Right',
    summary:
      'Visa and passport photos follow international biometric standards. Use this checklist of common requirements for digital uploads before submitting your application.',
    category: 'Visa & Passport',
    readMinutes: 6,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'Rules most countries share',
        blocks: [
          'Most passport and visa photo rules are based on the ICAO standard for machine-readable travel documents. Whatever country you apply to, expect these rules:',
          {
            list: [
              'Recent photo, usually taken within the last six months.',
              'Plain white, off-white or light grey background with no shadows or patterns.',
              'Face looking straight at the camera, eyes open, neutral expression, mouth closed.',
              'Even lighting with no shadows on the face and no red-eye or glare on glasses (many countries now ask you to remove glasses entirely).',
              'Head centred, with the full face and top of the hair visible.',
              'No filters, beauty retouching or background replacement that changes your appearance.',
            ],
          },
        ],
      },
      {
        heading: 'Common digital size requirements',
        blocks: [
          'The numbers below are widely published values. They are for orientation only and change from time to time, so always confirm them on the official government website before you apply.',
          {
            list: [
              'United States (DS-160 / DV programme): square image, from 600 × 600 to 1200 × 1200 pixels, JPEG, at most 240 KB. Equivalent to a 2 × 2 inch print.',
              'Schengen visa: 35 × 45 mm print size, with the face taking up roughly 70–80% of the photo height.',
              'UK and many Commonwealth countries: 35 × 45 mm print size; digital applications usually have their own on-screen checker.',
              'India (Passport Seva and e-visa): requirements differ by service. e-Visa photos must be square JPEGs with a plain light background, so check the portal for current limits.',
            ],
          },
        ],
      },
      {
        heading: 'Taking the photo at home',
        blocks: [
          {
            ordered: true,
            list: [
              'Stand about half a metre in front of a plain light wall, facing a window for soft, even light.',
              'Ask someone else to take the photo from about 1.2–1.5 m away at eye level. Selfies distort facial proportions.',
              'Take several shots and choose the sharpest with the most neutral expression.',
              'Crop so the face is centred and sized according to the country\'s rules, then resize to the required pixels and KB.',
            ],
          },
          'Fileficx includes presets for common visa and passport formats. It crops to the right aspect ratio, fills the background and compresses to the KB limit locally, so your biometric photo is never uploaded to a third-party server.',
          { tip: 'Fileficx formats files to technical specifications. Only the issuing authority can decide whether a photo is accepted, so review the official guidance and examples before submitting.' },
        ],
      },
    ],
  },
  {
    slug: 'are-online-image-converters-safe',
    title: 'Are Online Image Converters Safe for ID Documents?',
    summary:
      'Many free converters upload your passport photo, signature and certificates to a remote server. Here is what that means for your privacy, and how in-browser tools avoid it.',
    category: 'Privacy',
    readMinutes: 4,
    updated: '2026-11-18',
    sections: [
      {
        heading: 'What happens when you upload',
        blocks: [
          'A typical online converter sends your file to its server, processes it there and sends a copy back. Even with good intentions, that copy may sit in temporary storage, backups or logs for an unknown time, under the laws of whatever country hosts the server.',
          'For a holiday photo this hardly matters. For your passport photo, signature, Aadhaar or national ID card and educational certificates, it can. Together these documents are exactly what someone needs to impersonate you or open accounts in your name.',
        ],
      },
      {
        heading: 'How in-browser processing is different',
        blocks: [
          'Modern browsers can decode, resize and re-encode images and PDFs on your own device using the HTML5 Canvas and Web APIs. A tool built this way downloads its code once and then works on your file in local memory. The file never leaves your device.',
          'You can check this yourself:',
          {
            ordered: true,
            list: [
              'Open the page, then open your browser\'s developer tools and go to the Network tab.',
              'Process a file.',
              'Check that no request carries your file. You will see only page assets and, on ad-supported sites, advertising scripts, never your image or PDF.',
            ],
          },
          'Some in-browser tools keep working with your connection switched off once the page has loaded, which is another good sign that nothing is being uploaded.',
        ],
      },
      {
        heading: 'Good habits for sensitive files',
        blocks: [
          {
            list: [
              'Prefer tools that state clearly, and verifiably, that they process files locally.',
              'Avoid converters that require an account or email address just to resize an image.',
              'Delete intermediate copies from your Downloads folder once you have submitted the application.',
              'Never send ID documents over chat apps to "agents" offering to resize them for you.',
            ],
          },
          { tip: 'Fileficx is built entirely on client-side processing. Your files stay in your browser tab and are discarded when you close or refresh it.' },
        ],
      },
    ],
  },
];

export const getGuide = (slug: string): Guide | undefined => GUIDES.find((g) => g.slug === slug);
