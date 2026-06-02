interface ProductCardPreviewProps {
  productName: string;
  description: string;
  triggerName: string;
  language?: 'tr' | 'en';
}

function ProductCardPreview({ productName, description, triggerName, language = 'tr' }: ProductCardPreviewProps) {
  const isTr = language === 'tr';
  return (
    <section className="panel">
      <div>
        <p className="section-kicker">{isTr ? 'Ürün sayfası önizleme' : 'PDP surface preview'}</p>
        <h2>{isTr ? 'Ürün açıklaması alanı' : 'Product description slot'}</h2>
      </div>

      <article className="product-card">
        <div className="product-media" aria-hidden="true">
          <div className="shoe-mark">AeroRun</div>
        </div>
        <div className="product-body">
          <div className="product-topline">
            <span>{isTr ? 'Koşu / Günlük trainer' : 'Running / Daily trainer'}</span>
            <strong>2.490 TL</strong>
          </div>
          <h3>{productName}</h3>
          <p>{description}</p>
          <div className="product-meta">
            <span>{isTr ? 'Nefes alan file' : 'Breathable mesh'}</span>
            <span>{isTr ? 'Kauçuk taban' : 'Rubber outsole'}</span>
            <span>{isTr ? '30 gün iade' : '30-day returns'}</span>
          </div>
          <button type="button">{isTr ? 'Sepete ekle' : 'Add to cart'}</button>
          <small>
            {isTr ? 'Aktif kural' : 'Active rule'}: {triggerName}.{' '}
            {isTr ? 'Yalnızca açıklama alanı kişiselleştirilir.' : 'Only the description slot is personalized.'}
          </small>
        </div>
      </article>
    </section>
  );
}

export default ProductCardPreview;
