import type { BehaviorTrigger, OutputExample } from '../types';

export const defaultProductDescription =
  'Günlük koşular ve şehir içi kullanım için nefes alabilen file yüzeyli, hafif koşu ayakkabısı.';

export const productName = 'AeroRun Daily Shoe';

export const triggers: BehaviorTrigger[] = [
  {
    id: 'repeated-product-view',
    shortName: 'Tekrarlanan ürün görüntüleme',
    journeyStep: 'Product viewed 3+ times',
    behavior: 'AeroRun Daily Shoe ürün sayfası 48 saat içinde 3+ kez açıldı',
    inferredIntent: 'İlgili ama kararsız',
    contentAction: 'Daha açıklayıcı bir ürün açıklaması göster',
    safetyGuardrail: 'Sahte aciliyet, baskı veya abartılı iddia yok',
    personalizedOutput:
      'AeroRun Daily Shoe, günlük koşularda nefes alan konfor, dengeli tutuş ve hafif destek arayan kullanıcılar için tasarlandı.',
    status: 'Aktif',
    reviewMode: 'İlk 20 yayında insan incelemesi',
    riskLevel: 'Düşük',
    confidenceLevel: 86,
    review: {
      brandFit: 'Yüksek',
      clarity: 'Yüksek',
      risk: 'Düşük',
      surfaceFit: 'İyi',
      suggestedAction: 'Onayla',
    },
    guardrailChecks: [
      'Aciliyet veya stok baskısı bulunmadı',
      'Konfor ve destek iddiaları ürün özellikleriyle sınırlı',
      'Ton bilgilendirici ve sakin',
    ],
  },
  {
    id: 'price-filter-used',
    shortName: 'Fiyat filtresi kullanıldı',
    journeyStep: 'Price filter applied',
    behavior: 'Ürün listelemesinde fiyat aralığı filtresi uygulandıktan sonra AeroRun açıldı',
    inferredIntent: 'Fiyata duyarlı karşılaştırma',
    contentAction: 'Değeri ve dayanıklılığı vurgula',
    safetyGuardrail: 'Uydurma indirim veya yanıltıcı tasarruf iddiası yok',
    personalizedOutput:
      'AeroRun, düzenli kullanım için hafif konfor, dayanıklı taban ve pratik günlük performans sunar.',
    status: 'Onaylandı',
    reviewMode: 'Risk düşük kaldığında otomatik onay',
    riskLevel: 'Düşük',
    confidenceLevel: 91,
    review: {
      brandFit: 'Yüksek',
      clarity: 'Yüksek',
      risk: 'Düşük',
      surfaceFit: 'İyi',
      suggestedAction: 'Onayla',
    },
    guardrailChecks: [
      'İndirim veya tasarruf iddiası üretilmedi',
      'Değer vurgusu dayanıklılık ve kullanım bağlamında yapıldı',
      'Fiyat hassasiyeti manipüle edilmedi',
    ],
  },
  {
    id: 'reviews-opened',
    shortName: 'Yorumlar açıldı',
    journeyStep: 'Reviews tab opened',
    behavior: 'AeroRun ürün sayfasında yorumlar sekmesi açıldı ve detaylar incelendi',
    inferredIntent: 'Güven ve rahatlama ihtiyacı',
    contentAction: 'Güven destekleyen ürün detaylarını göster',
    safetyGuardrail: 'Sahte sosyal kanıt veya desteksiz popülerlik iddiası yok',
    personalizedOutput:
      'Karar vermeden önce temel detayları inceleyin: nefes alan file yapı, dengeli taban ve günlük konfor.',
    status: 'İnceleme Gerekli',
    reviewMode: 'Yayınlamadan önce manuel inceleme',
    riskLevel: 'Orta',
    confidenceLevel: 74,
    review: {
      brandFit: 'Orta',
      clarity: 'Yüksek',
      risk: 'Orta',
      surfaceFit: 'İnceleme gerekli',
      suggestedAction: 'Düzenle',
    },
    guardrailChecks: [
      'Sahte sosyal kanıt kullanılmadı',
      'Desteksiz popülerlik ifadesi yok',
      'Güven ihtiyacı ürün detaylarıyla karşılandı',
    ],
  },
  {
    id: 'similar-products-compared',
    shortName: 'Benzer ürünler karşılaştırıldı',
    journeyStep: 'Similar products compared',
    behavior: 'AeroRun benzer günlük koşu ayakkabılarıyla karşılaştırma görünümüne eklendi',
    inferredIntent: 'Alternatifleri değerlendiriyor',
    contentAction: 'Bu ürünü farklı kılan noktaları açıkla',
    safetyGuardrail: 'Rakiplere saldırma veya doğrulanamaz iddialar üretme',
    personalizedOutput:
      'AeroRun, günlük antrenman ayakkabıları arasında hafif yapı, nefes alan üst yüzey ve dengeli tutuşa odaklanır.',
    status: 'Aktif',
    reviewMode: 'Karşılaştırma dili için insan incelemesi',
    riskLevel: 'Orta',
    confidenceLevel: 79,
    review: {
      brandFit: 'Yüksek',
      clarity: 'Orta',
      risk: 'Orta',
      surfaceFit: 'İnceleme gerekli',
      suggestedAction: 'Düzenle',
    },
    guardrailChecks: [
      'Rakip marka hedef alınmadı',
      'Farklılaşma doğrulanabilir özelliklerle anlatıldı',
      'Karşılaştırma dili manuel incelemeye yönlendirildi',
    ],
  },
  {
    id: 'cart-abandoned',
    shortName: 'Sepet terk edildi',
    journeyStep: 'Checkout not completed',
    behavior: 'AeroRun sepete eklendi ancak checkout akışı tamamlanmadan oturum sonlandı',
    inferredIntent: 'Tereddüt içeren satın alma niyeti',
    contentAction: 'İade, teslimat veya garanti bilgilerini göster',
    safetyGuardrail: 'Baskı veya manipülatif aciliyet yok',
    personalizedOutput:
      'Seçtiğiniz AeroRun çifti hazır olduğunuzda sepetinizde duruyor.',
    status: 'Duraklatıldı',
    reviewMode: 'Yaşam döngüsü politikası incelemesi beklenirken duraklatıldı',
    riskLevel: 'Düşük',
    confidenceLevel: 82,
    review: {
      brandFit: 'Yüksek',
      clarity: 'Yüksek',
      risk: 'Düşük',
      surfaceFit: 'İyi',
      suggestedAction: 'Duraklat',
    },
    guardrailChecks: [
      'Baskı dili kullanılmadı',
      'Sahte kıtlık veya süre sınırı yok',
      'Kullanıcı kontrolünü koruyan yumuşak hatırlatma seçildi',
    ],
  },
];

export const outputExamples: OutputExample[] = [
  {
    bad: 'Tükenmeden hemen satın al!',
    reason: 'Baskı ve sahte aciliyet yaratır.',
    safe: 'Seçtiğiniz ürün hazır olduğunuzda sepetinizde duruyor.',
  },
  {
    bad: 'İnternetteki en ucuz kaliteli ayakkabı.',
    reason: 'Desteksiz ve yanıltıcı bir iddia.',
    safe: 'Günlük konfor ve düzenli kullanım için pratik bir seçenek.',
  },
  {
    bad: 'Herkes bu ürünü seviyor.',
    reason: 'Sahte sosyal kanıt üretir.',
    safe: 'Size uygun seçimi yapmadan önce temel detayları inceleyin.',
  },
];
