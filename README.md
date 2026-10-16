Voice Secure 🛡️🎙️

"Aawaj ki karo jaanch, apno pe na aane do koi aanch."
Stop cloned-voice scam calls before the money moves.

Voice Secure is an AI-powered voice verification and anti-spoofing family protection prototype engineered for the IIIT Bhopal E-Cell "Strategy Blitz" Ideathon.

1. Executive Summary & Value Proposition

Voice-clone scams ("emergency relative" impersonations) exploit emotional panic: a fraudster clones a child's or relative's voice from seconds of social media audio, calls an elderly parent, fabricates an accident or police arrest, and demands an immediate ₹50,000+ UPI transfer.

The Voice Secure Difference

While enterprise audio security vendors (Hiya, OmniSpeech, Resemble AI) focus on enterprise telephony or pure synthetic voice detection, Voice Secure delivers the critical Family Protection Layer:

Detect: On-device 3-second sliding window acoustic anti-spoofing (spoof score 0.00 to 1.00).
Verify Family: Compares caller timbre against consent-enrolled family voiceprint vectors and cross-references trusted circle contacts.
Act Autonomously:
Challenges ambiguous callers with a confidential family safe word.
Triggers an automated UPI payment cooling-off lock on new payees.
Broadcasts real-time family emergency alerts.
Commands an immediate hang-up and redirects to the registered family phone line.
2. Quickstart & Commands
Prerequisites
Node.js (v18+ or v20 LTS)
npm (v9+)
Installation & Run
bash
# Clone or navigate to the workspace
cd voice-secure
# Install dependencies
npm install
# Run Vite development server (accessible at http://localhost:3000)
npm run dev
# Run TypeScript typecheck / lint
npm run lint
# Run Vitest unit test suite (decide engine & edge cases)
npm test
# Build production bundle (under 100 KB gzipped JS)
npm run build
# Run Playwright end-to-end smoke test
npx playwright test
3. Project Architecture
voice-secure/
├── index.html                 # PWA meta, Inter & JetBrains Mono typography, manifest link
├── tailwind.config.js         # Design tokens (--bg, --navy, --panel, --coral, --green, --amber)
├── vite.config.ts             # React plugin, Vitest jsdom test runner, server port 3000
├── playwright.config.ts       # Playwright E2E configuration with webServer integration
├── src/
│   ├── main.tsx               # Root DOM mounting
│   ├── App.tsx                # Client-side router, I18n provider, global shell
│   ├── engine/
│   │   ├── DetectionEngine.ts # WindowResult, Decision, and DetectionEngine interfaces
│   │   ├── ScriptedEngine.ts  # Deterministic 3-second window generator with clean timer teardown
│   │   ├── MicEngine.ts       # Web Audio API real-time microphone signal analyzer
│   │   ├── decide.ts          # Pure decision algorithm (MA-3 sliding average & voiceprint weighting)
│   │   └── decide.test.ts     # Vitest suite for pure thresholding and edge cases
│   ├── data/
│   │   ├── scenarios.ts       # Exact scripted pitch data (Mom, Rohan Clone, Unclear Call)
│   │   └── facts.ts           # Grounded, sourced cybersecurity statistics & citations
│   ├── i18n/
│   │   ├── en.json            # English translations
│   │   ├── hi.json            # Hindi (Devanagari) translations
│   │   └── index.tsx          # React i18n provider with localStorage persistence
│   ├── store/
│   │   ├── useDemoStore.ts    # Coordinates call stream, scenario lifecycle, safe-word verification
│   │   ├── useFamilyStore.ts  # Family circle registry & consent records
│   │   ├── useAlertsStore.ts  # Chronological security alerts audit log
│   │   └── useSettingsStore.ts# Safe word ('nimbu'), payment lock countdown, preferences
│   ├── components/            # Reusable UI primitives (Button, Card, Chip, Meter, Dialog, Navbar, Footer)
│   ├── features/
│   │   ├── demo/              # PhoneFrame, CallScreen, ScenarioPicker, UnderTheHood, RiskChart, UpiModal
│   │   ├── family/            # FamilyTab, EnrolFlow, DPDP consent notice, 3-phrase recorder
│   │   ├── alerts/            # AlertsList with severity filtering
│   │   ├── settings/          # SettingsTab with safe-word management and thresholds
│   │   └── mic/               # Live client-side microphone acoustic signal test
│   └── pages/
│       ├── Landing.tsx        # Hero, slogan, 3-step explainer, facts strip, competitor matrix
│       ├── Demo.tsx           # Dual-pane pitch screen (Phone mockup + UnderTheHood telemetry)
│       ├── HowItWorks.tsx     # Vertical pipeline diagram, thresholds, and ML production chips
│       ├── Privacy.tsx        # DPDP Act 2023 principles, zero-cloud processing, right to erasure
│       ├── About.tsx          # Mission, problem context, roadmap, founding team credits
│       └── Alerts.tsx         # Standalone security audit feed
└── tests/
    └── e2e/smoke.spec.ts      # Playwright E2E smoke test verifying clone scenario & payment lock
4. How to Plug in Real Machine Learning Models

In this demonstration prototype, the engine runs in Simulation Mode using ScriptedEngine to guarantee a 100% deterministic, instant 2-click experience for judges.

To transition from prototype to production (planned for the April 2027 Bhopal pilot), implement the DetectionEngine interface with native ONNX WebAssembly runtimes:

ts
import * as ort from 'onnxruntime-web';
import { DetectionEngine, WindowResult, ScenarioId } from './DetectionEngine';
export class ProductionOnnxEngine implements DetectionEngine {
  private antiSpoofSession: ort.InferenceSession | null = null;
  private speakerEmbedSession: ort.InferenceSession | null = null;
  async init() {
    // 1. Load quantized AASIST or RawNet2 model (~12MB ONNX model)
    this.antiSpoofSession = await ort.InferenceSession.create('/models/aasist_quant.onnx', {
      executionProviders: ['wasm'],
    });
    // 2. Load ECAPA-TDNN speaker embedding model (~18MB ONNX model)
    this.speakerEmbedSession = await ort.InferenceSession.create('/models/ecapa_tdnn_quant.onnx', {
      executionProviders: ['wasm'],
    });
  }
  async processWindow(pcmBuffer: Float32Array): Promise<WindowResult> {
    // A. Run AASIST on raw 3-second (48,000 samples @ 16kHz) audio frame
    const inputTensor = new ort.Tensor('float32', pcmBuffer, [1, 48000]);
    const spoofOutput = await this.antiSpoofSession!.run({ input: inputTensor });
    const spoofProbability = spoofOutput.scores.data[1] as number; // 0..1
    // B. Run ECAPA-TDNN to extract 192-dimensional speaker embedding
    const embedOutput = await this.speakerEmbedSession!.run({ input: inputTensor });
    const callerEmbedding = embedOutput.embedding.data as Float32Array;
    // C. Compute Cosine Similarity against encrypted enrolled vector
    const familyMatchScore = cosineSimilarity(callerEmbedding, storedEnrolledVector);
    return {
      index: windowCount++,
      spoofScore: spoofProbability,
      familyMatch: familyMatchScore,
    };
  }
}
5. 90-Second Ideathon Pitch Demo Script (For Judges)

Open http://localhost:3000/demo on the projector/screen.

0:00 - 0:15 | The Hook & Problem:
"Judges, imagine your mother receiving a panicked call right now: 'Mummy, it's Rohan. I've had a terrible accident, police are taking my phone, send ₹50,000 to this UPI immediately.' It sounds 100% like her son. She panics and pays. Today, 47% of Indian adults have encountered voice scams. We built Voice Secure to stop the scam before the money moves."

0:15 - 0:40 | The Cloned Voice Attack (Click Scenario 2):
(Click button [2] or press key '2' on keyboard)
"Watch what happens in real time. As the scammer speaks, Voice Secure analyzes the audio on this phone in 3-second windows. On the right, see the live telemetry chart: raw spoof spikes past 0.70. Voice timbre matches only 28% of Rohan's registered voiceprint."

0:40 - 0:65 | The Autonomous Defense:
"The phone locks into RED threat state. If the panicked parent tries to pay: (Click 'Try to send ₹50,000') — BOOM. The payment lock intervenes. A 30-minute cooling-off period is enforced on unverified payees. The funds are safe. Now click 'Hang up and call Rohan back' — the phone connects to Rohan's real registered cellular number, confirming he is safe in the college library. Scam avoided in under 30 seconds."

0:65 - 0:80 | The Family Layer & Safe Word (Click Scenario 3):
(Press key '3')
"What if the connection is poor or audio is noisy? Voice Secure never guesses. In Scenario 3, score falls into the 0.30 - 0.70 uncertain buffer. The app instantly issues a challenge: 'Enter family safe word.' Enter 'nimbu' — verified, and call continues safely."

0:80 - 0:90 | Market, Privacy & Close:
"Every voiceprint is consent-first, encrypted, and DPDP 2023 compliant. We are targeting 17.7 million urban seniors in India across a ₹530 Cr market. Slogan: 'Aawaj ki karo jaanch, apno pe na aane do koi aanch.' Thank you!"

6. Honest Disclosures & Assumptions
Prototype Simulation: All acoustic risk scores, voiceprint match percentages, and caller scenarios are deterministic simulations. No production neural networks run in this browser bundle.
Pilot Target: Our statement is: "Target: up to 85% less exposure to voice-scam risk, to be measured in our Bhopal pilot (April 2027)."
Privacy Assurance: All data is strictly kept within browser localStorage. No audio is recorded, uploaded, or transmitted across networks.
Market Sizing: Demographic statistics reflect census and TRAI reports on smartphone-enabled senior citizens, representing an addressable market ceiling, not a revenue forecast.
7. Founding Team Credits
Ashish Kumar Mani · Founder · Product & Strategy
Raj Sharma · Co-founder · AI & Engineering
Akshat Tiwari · Co-founder · Growth & Partnerships

Built with ❤️ for IIIT Bhopal E-Cell Strategy Blitz 2026.
