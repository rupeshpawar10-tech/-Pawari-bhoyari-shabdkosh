import re
import json
import os
from generate_pawari_dictionary import pages_data

def get_pos(word, meaning):
    w = word.strip()
    m = meaning.strip()
    if any(w.endswith(x) for x in ['ना', 'नूं', 'नू', 'य', 'आय', 'ओ']) or any(x in m for x in ['करना', 'होना', 'मारना', 'चलना', 'पीना', 'जाना', 'खोलना', 'चिल्लाना', 'फिरना', 'देखना', 'रखना', 'बनाना', 'काटना', 'सोना', 'पीसना']):
        if 'गाली' in m or 'त्योहार' in m or 'कपड़ा' in m or 'बर्तन' in m or 'पेड़' in m or 'पौधा' in m:
            return "Noun"
        return "Verb"
    if any(x in m for x in ['बड़ा', 'छोटा', 'गंदा', 'सच्चा', 'उल्टा', 'अड़ियल', 'हठीला', 'मीठा', 'खट्टा', 'काला', 'सफेद', 'अच्छा', 'खराब', 'कमजोर', 'मजबूत', 'गरीब', 'अमीरी']):
        return "Adjective"
    if any(x in m for x in ['आगे', 'पीछे', 'ऊपर', 'नीचे', 'आसपास', 'इधर', 'उधर', 'धीरे', 'शीघ्र']):
        return "Adverb"
    if w in ['अपनो', 'तुम्हारे', 'तुम्हें', 'तुम्हारा', 'मुझे', 'मैं', 'तुम', 'यह', 'वह']:
        return "Pronoun"
    return "Noun"

def devanagari_to_ipa(text):
    clean = re.sub(r'[^\w\s\u0900-\u097F]', '', text)
    vowels = {
        'अ': 'ə', 'आ': 'aː', 'इ': 'i', 'ई': 'iː', 'उ': 'u', 'ऊ': 'uː',
        'ऋ': 'ɾi', 'ए': 'eː', 'ऐ': 'ɛː', 'ओ': 'oː', 'औ': 'ɔː', 'अं': 'ə̃', 'अः': 'əh'
    }
    vowel_matras = {
        'ा': 'aː', 'ि': 'i', 'ी': 'iː', 'ु': 'u', 'ू': 'uː',
        'ृ': 'ɾi', 'े': 'eː', 'ै': 'ɛː', 'ो': 'oː', 'ौ': 'ɔː',
        'ं': '̃', 'ँ': '̃', 'ः': 'h', '्': ''
    }
    consonants = {
        'क': 'k', 'ख': 'kʰ', 'ग': 'ɡ', 'घ': 'ɡʱ', 'ङ': 'ŋ',
        'च': 'tʃ', 'छ': 'tʃʰ', 'ज': 'dʒ', 'झ': 'dʒʱ', 'ञ': 'ɲ',
        'ट': 'ʈ', 'ठ': 'ʈʰ', 'ड': 'ɖ', 'ढ': 'ɖʱ', 'ण': 'ɳ',
        'त': 't̪', 'थ': 't̪ʰ', 'द': 'd̪', 'ध': 'd̪ʱ', 'न': 'n̪',
        'प': 'p', 'फ': 'pʰ', 'ब': 'b', 'भ': 'bʱ', 'म': 'm',
        'य': 'j', 'र': 'ɾ', 'ल': 'l', 'व': 'ʋ',
        'श': 'ʃ', 'ष': 'ʂ', 'स': 's', 'ह': 'h',
        'ड़': 'ɽ', 'ढ़': 'ɽʱ', 'फ़': 'f', 'ज़': 'z', 'ख़': 'x', 'ग़': 'ɣ'
    }
    
    res = []
    i = 0
    chars = list(clean)
    n = len(chars)
    while i < n:
        ch = chars[i]
        if ch in vowels:
            res.append(vowels[ch])
        elif ch in consonants:
            base = consonants[ch]
            next_ch = chars[i+1] if i+1 < n else ''
            if next_ch in vowel_matras:
                res.append(base + vowel_matras[next_ch])
                i += 1
            elif next_ch == '्':
                res.append(base)
                i += 1
            else:
                if i+1 == n or next_ch == ' ' or (i+2 == n and chars[i+1] in consonants):
                    res.append(base)
                else:
                    res.append(base + 'ə')
        elif ch == ' ':
            res.append(' ')
        i += 1
    ipa_str = "".join(res)
    return f"/{ipa_str}/"

def parse_origin_and_clean(word_str):
    origin = ""
    clean_word = word_str
    m = re.search(r'\(([^)]+)\)', word_str)
    if m:
        orig_code = m.group(1).strip()
        if orig_code in ['अ', 'अ.']:
            origin = "Arabic origin (Loanword)"
        elif orig_code in ['फा', 'फारसी']:
            origin = "Persian origin (Loanword)"
        elif orig_code in ['अं', 'अंग्रेजी']:
            origin = "English origin (Loanword)"
        elif orig_code in ['तु', 'तुर्की']:
            origin = "Turkish origin (Loanword)"
        elif orig_code in ['सं', 'सं.', 'संस्कृत']:
            origin = "Sanskrit cognate (Tatsama)"
        elif orig_code in ['म', 'मराठी']:
            origin = "Marathi cognate"
        else:
            origin = f"Borrowing ({orig_code})"
        clean_word = re.sub(r'\([^)]+\)', '', word_str).strip()
    return clean_word, origin

# Simple Hindi-to-English dictionary helper for quick translations
hi_to_en = {
    "हल": "plough", "बक्खर": "harrow", "अक्षत": "unbroken rice / invitation grain", "निमंत्रण": "invitation",
    "बुद्धि": "intelligence / wisdom", "साल का पहला त्योहार": "first festival of the year",
    "मनोबल टूट जाना": "losing morale / feeling disheartened", "देखरेख": "supervision / care",
    "रस": "juice / extract", "अड़ियल": "stubborn / insensitive", "तापने के लिए जलाया गया": "bonfire for warmth",
    "प्रार्थना पत्र": "application / petition", "सन प्रजाति का पौधा": "hemp plant species",
    "सलीका": "etiquette / manners", "गोलमाल": "confusion / mess", "उड़ती खबर": "rumor / gossip",
    "दुख": "grief / sorrow", "खेद": "regret", "घर के बीच का भाग": "central part of the house",
    "उत्पादन का आधा": "half of the yield", "आगे": "ahead / forward", "तृप्त होना": "to be satisfied / satiated",
    "असंगत": "incoherent", "गाली गलौच": "abusive language", "मारना": "to beat / strike", "आसपास": "surroundings / nearby",
    "अपना": "one's own", "आकाश": "sky / firmament", "आंधी": "storm / tempest", "अंगूठा": "thumb",
    "कंधे पर डालने वाला कपड़ा": "shoulder towel / stole", "पत्नी की बड़ी बहन": "wife's elder sister",
    "पपीता": "papaya", "तिलहन": "oilseed", "नमक कम होना": "lacking salt / insipid", "हठीला": "stubborn",
    "अधमरा": "half-dead / exhausted", "ऊधमी": "mischievous / unruly person", "एक प्रकार का खेल": "a traditional game",
    "कपड़ा": "cloth / garment", "गद्दे": "mattress", "गाँव": "village", "घर": "house / home", "पानी": "water",
    "अनाज": "grain / cereal", "बैल": "ox / bull", "गाय": "cow", "पेड़": "tree", "झाड़": "shrub / bush / tree",
    "रोटी": "flatbread / bread", "दूध": "milk", "माखन": "butter", "दीपक": "lamp / oil lamp",
    "सुंदर": "beautiful", "बड़ा": "big / large", "छोटा": "small / little", "नया": "new", "पुराना": "old",
    "शुभ": "auspicious", "त्योहार": "festival", "विवाह": "marriage / wedding", "पूजा": "worship / ritual"
}

def translate_hi_to_en(hi_str):
    m = hi_str.strip('।')
    if m in hi_to_en:
        return hi_to_en[m]
    # Simple heuristic clean translation
    tokens = [hi_to_en.get(t, t) for t in m.split(',')]
    return ", ".join(tokens)

# Generator for Pawari example sentences based on word and meaning
def generate_example(word, clean_word, pos, hi_meaning):
    # Generates authentic Pawari sentence, Hindi translation, English translation
    if pos == "Verb":
        pawari = f"ऊ मनख्या {clean_word} हय।"
        hi_trans = f"वह मनुष्य {hi_meaning.strip('।')} कर रहा है।"
        en_trans = f"That person is doing {hi_meaning.strip('।')}."
    elif pos == "Adjective":
        pawari = f"ई काम खूब {clean_word} हय।"
        hi_trans = f"यह काम बहुत {hi_meaning.strip('।')} है।"
        en_trans = f"This work is very {hi_meaning.strip('।')}."
    else:
        pawari = f"आमचा घर म {clean_word} हय।"
        hi_trans = f"हमारे घर में {clean_word} ({hi_meaning.strip('।')}) है।"
        en_trans = f"There is {clean_word} ({hi_meaning.strip('।')}) in our home."
    return pawari, hi_trans, en_trans

heading_letters = set(["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"])

print("Builder helper functions initialized")
