import Card from './Card';
import { questionGroups } from '../data/caseStudy';

function DiscoveryQuestions() {
  return (
    <div className="question-groups">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Discovery Questions</p>
          <h2>Session prompts that turn vague preference into operational guidance</h2>
        </div>
        <span className="soft-pill">Session answers included</span>
      </div>

      {questionGroups.map((group) => (
        <section key={group.group} className="question-section">
          <h3>{group.group}</h3>
          <div className="question-grid">
            {group.questions.map((item) => (
              <Card key={item.question} className="question-card">
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default DiscoveryQuestions;
