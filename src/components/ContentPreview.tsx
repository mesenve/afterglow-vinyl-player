interface ContentPreviewProps {
  productName: string;
  defaultDescription: string;
  personalizedDescription: string;
  triggerName: string;
  isEditing: boolean;
  language?: 'tr' | 'en';
  onChangeDescription: (value: string) => void;
}

function ContentPreview({
  productName,
  defaultDescription,
  personalizedDescription,
  triggerName,
  isEditing,
  language = 'tr',
  onChangeDescription,
}: ContentPreviewProps) {
  const isTr = language === 'tr';
  return (
    <section className="panel">
      <div>
        <p className="section-kicker">{isTr ? 'İçerik varyantı' : 'Content variant'}</p>
        <h2>{productName}</h2>
      </div>

      <div className="preview-stack">
        <article className="preview-card">
          <span>{isTr ? 'Varsayılan ürün metni' : 'Default product copy'}</span>
          <p>{defaultDescription}</p>
        </article>
        <article className="preview-card personalized">
          <span>{isTr ? 'Seçilen kural' : 'Selected rule'}: {triggerName}</span>
          {isEditing ? (
            <textarea
              aria-label="Kişiselleştirilmiş açıklamayı düzenle"
              value={personalizedDescription}
              onChange={(event) => onChangeDescription(event.target.value)}
            />
          ) : (
            <p>{personalizedDescription}</p>
          )}
        </article>
      </div>
    </section>
  );
}

export default ContentPreview;
