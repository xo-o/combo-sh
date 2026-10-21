import { DocHeader, DocPanel } from "@/app/docs/doc-components";

export const metadata = {
  title: "Remotion React Video • COMBO Docs",
  description:
    "Automate programmatic React video production with voiceovers and SRT subtitles.",
};

const remotionExample = `import { execSync } from "child_process";
import { Composition, Sequence } from "remotion";

export const VideoGenerator = () => {
  // 1. Synthesize audio voiceover directly in pipeline
  const voiceOutput = execSync(
    'combo voice generate "Welcome to the release recap." --voice kit --json',
    { encoding: "utf-8" }
  );
  const { audioUrl } = JSON.parse(voiceOutput);

  // 2. Extract word-level SRT timestamps for Remotion captions
  const srtTrack = execSync(
    \`combo transcribe audio \${audioUrl} --format srt --words 3\`,
    { encoding: "utf-8" }
  );

  return (
    <Composition
      id="ReleaseRecap"
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ audioUrl, srtTrack }}
    />
  );
};`;

export default function RemotionIntegrationPage() {
  return (
    <div>
      <DocHeader
        category="Agent Integrations"
        title="Remotion & React Video"
        lead="Combine Combo CLI with Remotion to build fully automated video rendering pipelines from text prompts or continuous integration runs."
      />

      <h2>Programmatic Video Pipeline</h2>
      <p>
        Call Combo CLI with the <code>--json</code> flag inside your video
        rendering scripts to generate speech and subtitles in a single flow:
      </p>

      <DocPanel title="remotion-pipeline.ts" code={remotionExample} />

      <h2>Benefits</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Zero local ffmpeg complexity for audio timing calculations.</li>
        <li>
          Direct CDN URLs ready for Remotion <code>&lt;Audio /&gt;</code> tags.
        </li>
        <li>
          Chunked SRT subtitle cards align directly with React animation
          sequences.
        </li>
      </ul>
    </div>
  );
}
