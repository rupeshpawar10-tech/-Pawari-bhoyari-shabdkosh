import re
import os

# Helper to clean word and origin
def parse_word_origin(word_str):
    origin = ""
    clean_word = word_str
    m = re.search(r'\(([^)]+)\)', word_str)
    if m:
        orig_code = m.group(1).strip()
        if orig_code in ['अ', 'अ.']:
            origin = "Arabic loanword"
        elif orig_code in ['फा', 'फारसी']:
            origin = "Persian loanword"
        elif orig_code in ['अं', 'अंग्रेजी']:
            origin = "English loanword"
        elif orig_code in ['तु', 'तुर्की']:
            origin = "Turkish loanword"
        elif orig_code in ['सं', 'सं.', 'संस्कृत']:
            origin = "Sanskrit cognate (Tatsama)"
        elif orig_code in ['म', 'मराठी']:
            origin = "Marathi cognate"
        else:
            origin = f"Borrowing ({orig_code})"
        clean_word = re.sub(r'\([^)]+\)', '', word_str).strip()
    return clean_word, origin

# Simple Devanagari to Unicode IPA rule-based converter
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
                # Inherited schwa unless word final or followed by space
                if i+1 == n or next_ch == ' ' or (i+2 == n and chars[i+1] in consonants):
                    res.append(base)
                else:
                    res.append(base + 'ə')
        elif ch == ' ':
            res.append(' ')
        i += 1
    ipa_str = "".join(res)
    return f"/{ipa_str}/"

print("Test conversion:", "अऊत", "->", devanagari_to_ipa("अऊत"))
print("Test conversion:", "अक्सेद", "->", devanagari_to_ipa("अक्सेद"))
