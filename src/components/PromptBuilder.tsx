import Badge from './Badge';
import Card from './Card';

interface PromptBuilderProps {
  prompt: string;
  selectedSurface: string;
  onCopy: () => void;
}

const promptInputs = [
  'Brand voice',
  'Surface',
  'Product facts',
  'Content goal',
  'Allowed claims',
  'Avoided language',
  'Approval rules',
];

function PromptBuilder({ prompt, selectedSurface, onCopy }: PromptBuilderProps) {
  const copyPrompt = () => {
    void navigator.clipboard?.writeText(prompt).finally(onCopy);
    if (!navigator.clipboard) {
      onCopy();
    }
  };

  return (
    <div className="prompt-builder">
      <Card>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Prompt Builder Panel</p>
            <h2>Prompt structure created from the brief</h2>
          </div>
          <Badge tone="voice">AI-ready</Badge>
        </div>
        <div className="prompt-schema">
          <section>
            <h3>Task</h3>
            <p>Generate content for {selectedSurface}.</p>
          </section>
          <section>
            <h3>Inputs</h3>
            <ul>
              {promptInputs.map((input) => (
                <li key={input}>{input}</li>
              ))}
            </ul>
          </section>
        </div>
      </Card>

      <Card className="prompt-example">
        <div className="card-title-row">
          <h3>Prompt example</h3>
          <button type="button" className="primary-button" onClick={copyPrompt}>
            Copy Prompt
          </button>
        </div>
        <p>{prompt}</p>
      </Card>
    </div>
  );
}

export default PromptBuilder;
