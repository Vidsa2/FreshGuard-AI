import numpy as np
from PIL import Image

NON_FOOD_KEYWORDS = {
    'money', 'dollar', 'cash', 'gold', 'currency', 'coin', 'banknote', 'bill',
    'xauusd', 'phone', 'laptop', 'electronic', 'hardware', 'car', 'pet', 'dog',
    'cat', 'jewelry', 'metal', 'non_food', 'non-food', 'weapon', 'furniture',
    'bullion', 'ingot', 'credit', 'card', 'computer', 'screen', 'device'
}

ORGANIC_PRODUCE_WORDS = {
    'apple', 'banana', 'orange', 'strawberry', 'grape', 'mango', 'tomato', 'potato',
    'carrot', 'cucumber', 'spinach', 'capsicum', 'pepper', 'onion', 'lettuce', 'cabbage',
    'broccoli', 'watermelon', 'peach', 'plum', 'lemon', 'lime', 'pear', 'berry', 'cherry',
    'avocado', 'bread', 'bakery', 'milk', 'cheese', 'dairy', 'salad', 'produce'
}

def is_non_food_specimen(image: Image.Image, filename: str = "", declared_food_name: str = "") -> tuple[bool, str]:
    """
    Evaluates whether an uploaded specimen is non-food (Out-of-Distribution).
    Returns (is_non_food: bool, reason: str).
    """
    combined_text = f"{filename} {declared_food_name}".lower()

    # 1. Non-food explicit keyword check
    for kw in NON_FOOD_KEYWORDS:
        if (
            kw in combined_text.split()
            or f"_{kw}" in combined_text
            or f"-{kw}" in combined_text
            or f" {kw}" in combined_text
            or f"{kw} " in combined_text
            or f"({kw}" in combined_text
            or f"${kw}" in combined_text
        ):
            return True, f"Non-food entity detected matching keyword '{kw}'."

    # Explicit non-food preset tags
    if 'non_food' in combined_text or 'non-food' in combined_text or 'gold_cash' in combined_text:
        return True, "Non-food specimen preset tag detected."

    # If declared name contains known edible produce, avoid visual false positives on organic colors
    for pw in ORGANIC_PRODUCE_WORDS:
        if pw in declared_food_name.lower():
            return False, ""

    # 2. Visual analysis for undeclared / unknown specimens
    img_rgb = image.convert('RGB').resize((128, 128))
    arr = np.array(img_rgb, dtype=np.float32)

    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    gray = 0.299 * r + 0.587 * g + 0.114 * b
    dx = np.diff(gray, axis=1)
    dy = np.diff(gray, axis=0)
    edge_density = float((np.mean(np.abs(dx)) + np.mean(np.abs(dy))) / 2.0)

    # Pure metallic gold bullion: extreme yellow-gold luster across large section (>20% of image)
    gold_mask = (r > 190) & (g > 150) & (b < 70) & ((r - b) > 110)
    gold_ratio = float(np.mean(gold_mask))

    # Banknote microprint grid
    std_gray = float(np.std(gray))

    if gold_ratio > 0.20:
        return True, "Metallic specular reflectance (Gold Bullion / Ingot) detected."

    if edge_density > 22.0 and std_gray > 65.0:
        return True, "Synthetic printed document or high-frequency circuit pattern detected."

    return False, ""
