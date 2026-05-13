from urllib.parse import urlparse

def calculate_verification_score(url, text):

    score = 0
    checks = []

    # HTTPS Check
    if url.startswith("https"):
        score += 10
        checks.append("HTTPS Secure")

    # Domain Check
    domain = urlparse(url).netloc

    trusted_domains = [
        "who.int",
        "cdc.gov",
        "nih.gov"
    ]

    for d in trusted_domains:
        if d in domain:
            score += 20
            checks.append("Trusted Medical Domain")
            break

    # Suspicious Claims
    suspicious_words = [
        "100% cure",
        "miracle cure",
        "instant cure",
        "guaranteed treatment"
    ]

    for word in suspicious_words:
        if word in text.lower():
            score -= 30
            checks.append("Suspicious Medical Claims Found")
            break

    # Medical References
    trusted_refs = [
        "who",
        "cdc",
        "nih",
        "pubmed"
    ]

    for ref in trusted_refs:
        if ref in text.lower():
            score += 15
            checks.append("Trusted Medical References Found")
            break

    return score, checks