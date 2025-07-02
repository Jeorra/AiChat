export type Question = {
    q: string;
    a: string;
};

export type Category = {
    questions: Question[];
};

export const categories: { [key: string]: Category } = {
    "Kayıt İşlemleri": {
        questions: [
            {
                q: "YKS ile yerleştim. Kayıt tarihleri ve belgeler nelerdir?",
                a: "Üniversitemiz akademik birimlerine yerleştirilenlerin kayıt tarihleri, yerleri ve kayıt için istenen belge ve bilgiler ile işlem süreçleri Üniversitemiz internet sayfasındaki duyurulardan öğrenilebilir.",
            },
            {
                q: "e-Devletten kayıt yaptım. Evrak getirmem gerekir mi?",
                a: "e-Devletten kayıt yapan bir öğrencinin herhangi bir belge getirmesine gerek yoktur. (Tıp Fakültesi öğrencileri hariç) e-Devletten kayıt yapan öğrencinin kayıt yaptığına dair e-Devletten çıktı alması yararına olacaktır.",
            },
            {
                q: "Kayıt işlemlerini şahsen yapmak zorunda mıyım?",
                a: "Kesin kaydını e-Devlet üzerinden yapan öğrencilerin şahsen başvuru yapmaları gerekmemektedir. (Tıp Fakültesi hariç) e-Devletten kayıt yapamayan öğrencilerin, kayıt için istenen belgeler ile birlikte, belirlenen kayıt tarihlerini dikkate alıp, şahsen veya kanuni temsilcisi (vasi)/noter vasıtasıyla vekil tayin edilen kişi aracılığı ile başvuru yapmaları gerekmektedir.",
            },
        ],
    },
    "Ders Kayıt": {
        questions: [
            {
                q: "Kayıt yenileme (ders kayıt) ne demektir?",
                a: "Kayıt yenileme (ders kayıt), Üniversitemiz bünyesinde yürütülen önlisans, lisans ve lisansüstü programlara kayıtlı öğrencilerin, akademik takvimde belirtilen süreler içinde (katkı payı/öğrenim ücreti ödemesi gerekenlerin ödeme yapması şartıyla) ders alma işlemini tamamlaması suretiyle gerçekleşen işlemdir.",
            },
            {
                q: "Ders kayıt işlemlerini okula gelmeden yapabilir miyim?",
                a: "Evet, kayıt yenileme (ders kayıt) işlemlerini okula gelmeden Pusula Bilgi Sistemi>Öğrenci Bilgi Sistemi üzerinden kullanıcı adınız ve şifreniz ile yapabilirsiniz.",
            },
            {
                q: "Ders kayıt tarihlerini kaçırırsam ne olur?",
                a: "Akademik takvimde belirtilen tarihler içerisinde kayıt yenileme işlemini yapmayan öğrenci, o yarıyıldaki derslere devam edemez, sınavlara giremez, diğer öğrencilik haklarından yararlanamaz.",
            },
        ],
    },
    "Harç Ödemeleri": {
        questions: [
            {
                q: "Öğrenci katkı payı/öğrenim ücretini nasıl öğrenebilirim?",
                a: "Dönemlik öğrenci katkı payı/öğrenim ücreti güncel bilgileri kayıt yenileme (ders kayıt) işlemleri başlamadan önce Üniversitemiz internet sitesinde yayımlanmaktadır.",
            },
            {
                q: "Kimler katkı payı/öğrenim ücreti öder?",
                a: "Mühendislik, ilahiyat ve sağlık alanında lisans tamamlama birinci öğretim öğrencileri, yabancı uyruklu öğrenciler, işletmede mesleki eğitimi alan öğrenciler (normal öğrenim süresini aşması halinde), üç ders sınavına girecek öğrenciler ve denklik öğrencileri katkı payı/öğrenim ücreti öder.",
            },
            {
                q: "Hangi bankadan harç ücreti ödeyebilirim?",
                a: "Harç ücreti öderken hesap numarası belirtmenize gerek yoktur. Ödemeler yalnızca ÖĞRENCİ NUMARASI ile yapılmakta olup, ödemelerinizi Halk Bankası'nın Türkiye genelindeki herhangi bir şubesinden, ATM'lerde kartsız işlem seçeneğiyle veya Halk Bankası internet bankacılığı üzerinden gerçekleştirebilirsiniz.",
            },
        ],
    },
    "Harç İade": {
        questions: [
            {
                q: "Katkı payı/öğrenim ücreti iademi nasıl alabilirim?",
                a: "Harç ücreti iadesi talebinde bulunmak için Üniversitemiz Rektörlük Öğrenci İşleri Daire Başkanlığına şahsen veya oid@pau.edu.tr e-posta adresine gönderilecek dilekçe ile başvurmanız gerekmektedir. Harç iadeleri güz ve bahar dönemi olmak üzere iki defa yapılabilmektedir.",
            },
            {
                q: "Hangi durumlarda harç iadesi alabilir?",
                a: "Ücret ödedikten sonra ders kaydı yapmamış iseniz, tezsiz yüksek lisans programları kapatıldıysa, yaz okulunda derse kayıt yaptırmamış iseniz ücret iadeniz yapılır.",
            },
            {
                q: "Hangi durumlarda harç iadesi yapılmaz?",
                a: "Ders kaydı yaptıktan sonra kaydını sildiren, usulsüz kayıt yaptıran, kayıt donduran, disiplin nedeniyle ayrılan, azami öğrenim süresi dolan öğrencilerin ödemiş olduğu katkı payı/öğrenim ücreti iade edilmez.",
            },
        ],
    },
    "Burs İşlemleri": {
        questions: [
            {
                q: "Burslar hakkında bilgi nereden alabilirim?",
                a: "Öğrenci İşleri Daire Başkanlığı Burs Ofisi'nden bilgi alabilirsiniz.",
            },
            {
                q: "KYK Bursu almak istiyorum. Ne yapmam gerekiyor?",
                a: "Burs işlemlerini Kredi ve Yurtlar Kurumunun internet sayfasından takip edebilirsiniz.",
            },
        ],
    },
    "Geçiş İşlemleri": {
        questions: [
            {
                q: "Yatay geçiş hakkında bilgi verir misiniz?",
                a: "Yatay geçişler her eğitim-öğretim yılının başında (önlisans ve lisans programlarında) ve ortasında (sadece önlisans programlarında) yapılmaktadır. Bu kapsamdaki duyurular Üniversitemiz internet sayfasında yapılmaktadır.",
            },
            {
                q: "Dikey geçiş nasıl yapabilirim?",
                a: "Dikey geçiş yoluyla Üniversitemize kayıt yaptırabilmeniz için önlisans programından mezun olduktan sonra her yıl ÖSYM tarafından temmuz ayı içerisinde yapılan DGS'ye (Dikey Geçiş Sınavı) girerek Üniversitemizi tercih etmeniz ve yerleştirilmeniz gerekmektedir.",
            },
            {
                q: "Özel öğrencilik hakkında bilgi istiyorum?",
                a: "Özel öğrenci bir yükseköğretim kurumunda kayıtlı öğrenci olup, farklı bir yükseköğretim ortamı, kültürü, kazanımı edinmek isteyen veya özel durumu, sağlık ve benzeri nedenlerle kayıtları kendi üniversitelerinde kalmak şartıyla farklı bir yükseköğretim kurumunda eğitime devam etme imkânı tanınan öğrencidir.",
            },
        ],
    },
    "Ders ve Sınav": {
        questions: [
            {
                q: "En az kaç kredilik ders alabilirim?",
                a: "Öğrencilerimiz kayıtlı olduğu her yarıyılda en az 20 kredilik ders almak zorundadır. Mezuniyet durumunda ve değişim programlarına katılan öğrencilerde bu koşul aranmaz.",
            },
            {
                q: "En fazla kaç kredilik ders alabilirim?",
                a: "Akademik ortalaması 2,25 ve altında olan öğrenci en fazla 30 kredi; 2,26-2,99 aralığında olan öğrenci en fazla 36 kredi; 3,00 ve üzeri olan öğrenci ise en fazla 42 kredi alabilir.",
            },
            {
                q: "Derslere devam zorunluluğu var mı?",
                a: "Öğrenciler derslere ve ilgili öğretim elemanının gerekli gördüğü sınav ve diğer akademik çalışmalara katılmak zorundadır. Devam sınırları teorik derslerde %60-80, uygulamalı derslerde %70-90 aralığında belirlenir.",
            },
            {
                q: "Üç ders sınavı nedir?",
                a: "Mezuniyet için gerekli not ortalamasını sağladığı halde en fazla başarısız üç dersi bulunan veya tüm derslerden geçer not aldığı halde gerekli akademik ortalamayı sağlayamayan öğrenciler üç ders sınavına başvurabilir.",
            },
        ],
    },
    "Yaz Okulu": {
        questions: [
            {
                q: "Yaz okulunda kaç kredilik ders alabilirim?",
                a: "Yaz okulunda bir öğrenci haftada toplam otuz saati geçmemek koşuluyla en fazla dört derse kayıt yaptırabilir.",
            },
            {
                q: "Yaz okulunda devam zorunluluğu var mı?",
                a: "PAÜ Yaz Okulu Eğitim ve Öğretim Yönetmeliği gereğince yaz okulunda derslere devam zorunludur. Teorik derslerde %70, uygulama derslerinde %80 devam zorunluluğu aranır.",
            },
            {
                q: "Yaz okulunda farklı üniversiteden ders alabilir miyim?",
                a: "Evet, PAÜ Yaz Okulu Eğitim ve Öğretim Yönetmeliği'nin sınırlamaları dahilinde, diğer üniversitelerde yaz okulunda açılan dersleri de alabilirsiniz. Ancak bölüm başkanlığınızdan önce onay almanız gerekir.",
            },
        ],
    },
    "Belgeler": {
        questions: [
            {
                q: "Öğrenci belgesi nasıl alabilirim?",
                a: "E-Devlet üzerinden öğrenci belgenizi ve not durum çizelgenizi alabilirsiniz. E-Devletten alınan belgeler için ayrıca imza ve mühre gerek yoktur. Ayrıca akademik biriminizin öğrenci işleri birimine başvurarak da belgelerinizi alabilirsiniz.",
            },
            {
                q: "Öğrenci kimliğimi kaybettim ne yapmalıyım?",
                a: "Pusula Bilgi Sistemi üzerinden Öğrenci Kartı İstek Belgesi oluşturarak Üniversitemizin Halk Bankası hesabına 100 TL yatırmanız ve belgeler ile Öğrenci İşleri Daire Başkanlığına başvurmanız gerekmektedir.",
            },
            {
                q: "Diplomamı nasıl alabilirim?",
                a: "2017 yılının Haziran ayından sonra mezun olan öğrenciler, Pusula Bilgi Sistemi üzerinden mezuniyet işlemlerini tamamlayıp mezun anketini doldurduktan sonra ilgili akademik birime başvurarak diplomalarını alabilirler.",
            },
        ],
    },
    "Çift Ana Dal": {
        questions: [
            {
                q: "Çift ana dal programına ne zaman başvuru yapabilirim?",
                a: "Öğrenci ikinci ana dal diploma programına, ana dal lisans programında en erken üçüncü yarıyılın başında, en geç ise dört yıllık programlarda beşinci yarıyılın başında başvurabilir.",
            },
            {
                q: "Çift ana dal için akademik ortalamam kaç olmalı?",
                a: "Başvuru anında ana dal diploma programındaki genel not ortalaması en az 4 üzerinden 2,75 olan ve ana dal diploma programının ilgili sınıfında başarı sıralaması itibari ile en üst %20'sinde bulunan öğrenciler başvurabilir.",
            },
            {
                q: "Yan dal programına başvuru koşulları nelerdir?",
                a: "Öğrenci yan dal programına, ana dal lisans programının en erken üçüncü, en geç altıncı yarıyılının başında başvurabilir. Akademik not ortalamasının 4 üzerinden en az 2,75 olması gerekir.",
            },
        ],
    },
};