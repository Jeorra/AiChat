// types.ts
export interface FAQItem {
    question: string;
    answer: string;
} // tek bir sss

export interface PageFAQs {
    [pageKey: string]: {
        ktype: "ogrenci" | "personel";
        faqs: FAQItem[];
    };
} // sayfadaki sss dizisi gibi

export interface Message { //chat ile olan mesajların yapısınının tanımladığımız özel tip
    role: "user" | "assistant";
    content: string;
    action?: {
        type: 'link';
        url: string;
        buttonText: string;
    };
};

export interface Option { //kullanıcıya sunulan seçenekler için özel tip belirledik
    text: string;
    payload: string;
};

export interface BotResponseData {
    message: {
        content: string;
    };
    type: 'normal' | 'reset_and_continue' | 'continuation_prompt' | 'resolution_prompt' | 'redirect' | 'end_chat';
    url?: string;
    options?: Option[];
};
