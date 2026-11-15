import os
import zipfile
import random
from PIL import Image
import io
from collections import defaultdict

ZIP_PATH = 'archive.zip'
OUTPUT_DIR = os.path.join('ml_model', 'dataset')
TRAIN_DIR = os.path.join(OUTPUT_DIR, 'train')
VAL_DIR = os.path.join(OUTPUT_DIR, 'val')

TRAIN_SAMPLES_PER_CLASS = 160
VAL_SAMPLES_PER_CLASS = 40
TARGET_SIZE = (224, 224)

# Map raw folder names to normalized standard class names
NORM_MAP = {
    'FreshOkara': 'FreshOkra',
    'FreshCapciscum': 'FreshCapsicum',
    'FreshBittergroud': 'FreshBittergourd',
    'RottenBittergroud': 'RottenBittergourd',
}

def normalize_class_name(raw_name: str) -> str:
    return NORM_MAP.get(raw_name, raw_name)

def extract_and_prepare_dataset():
    print(f"Reading {ZIP_PATH}...")
    random.seed(42)

    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        all_files = z.namelist()
        class_files = defaultdict(list)

        for filepath in all_files:
            parts = filepath.split('/')
            # Expected pattern: Dataset/Fresh/FreshApple/img.png
            if len(parts) >= 4 and parts[-1].lower().endswith(('.png', '.jpg', '.jpeg')):
                raw_class = parts[2]
                norm_class = normalize_class_name(raw_class)
                class_files[norm_class].append(filepath)

        classes = sorted(class_files.keys())
        print(f"Found {len(classes)} classes in archive:")
        for c in classes:
            print(f"  {c}: {len(class_files[c])} available images")

        os.makedirs(TRAIN_DIR, exist_ok=True)
        os.makedirs(VAL_DIR, exist_ok=True)

        total_train = 0
        total_val = 0

        for c in classes:
            files = class_files[c]
            random.shuffle(files)

            train_files = files[:TRAIN_SAMPLES_PER_CLASS]
            val_files = files[TRAIN_SAMPLES_PER_CLASS : TRAIN_SAMPLES_PER_CLASS + VAL_SAMPLES_PER_CLASS]

            c_train_dir = os.path.join(TRAIN_DIR, c)
            c_val_dir = os.path.join(VAL_DIR, c)
            os.makedirs(c_train_dir, exist_ok=True)
            os.makedirs(c_val_dir, exist_ok=True)

            # Extract & resize train images
            for idx, fpath in enumerate(train_files):
                try:
                    data = z.read(fpath)
                    img = Image.open(io.BytesIO(data)).convert('RGB')
                    img = img.resize(TARGET_SIZE, Image.Resampling.BILINEAR)
                    out_path = os.path.join(c_train_dir, f"{c}_{idx:04d}.jpg")
                    img.save(out_path, format='JPEG', quality=90)
                    total_train += 1
                except Exception as e:
                    print(f"Error reading {fpath}: {e}")

            # Extract & resize val images
            for idx, fpath in enumerate(val_files):
                try:
                    data = z.read(fpath)
                    img = Image.open(io.BytesIO(data)).convert('RGB')
                    img = img.resize(TARGET_SIZE, Image.Resampling.BILINEAR)
                    out_path = os.path.join(c_val_dir, f"{c}_{idx:04d}.jpg")
                    img.save(out_path, format='JPEG', quality=90)
                    total_val += 1
                except Exception as e:
                    print(f"Error reading {fpath}: {e}")

            print(f"  Processed {c} -> {len(train_files)} train, {len(val_files)} val")

        print(f"\nExtraction & Preprocessing Complete!")
        print(f"Total Train Images: {total_train}")
        print(f"Total Validation Images: {total_val}")
        print(f"Total Dataset Size: {total_train + total_val} images across {len(classes)} balanced classes.")

if __name__ == '__main__':
    extract_and_prepare_dataset()

