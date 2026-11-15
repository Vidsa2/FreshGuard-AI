import os
import sys
import time
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import precision_recall_fscore_support, accuracy_score, confusion_matrix

DATA_DIR = os.path.join('ml_model', 'dataset')
TRAIN_DIR = os.path.join(DATA_DIR, 'train')
VAL_DIR = os.path.join(DATA_DIR, 'val')
MODEL_SAVE_PATH = os.path.join('ml_model', 'freshguard_mobilenet_v3.pth')
CLASSES_SAVE_PATH = os.path.join('ml_model', 'class_indices.json')
METRICS_SAVE_PATH = os.path.join('ml_model', 'training_metrics.json')

BATCH_SIZE = 32
NUM_EPOCHS = 6
LEARNING_RATE = 0.001
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def train():
    print("=" * 65)
    print(" FreshGuard AI - Model Training Pipeline (CO3554)")
    print(f" Target Device: {DEVICE}")
    print("=" * 65)

    # 1. Transforms
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224, scale=(0.85, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    print("Loading image datasets from disk...")
    train_dataset = datasets.ImageFolder(TRAIN_DIR, data_transforms['train'])
    val_dataset = datasets.ImageFolder(VAL_DIR, data_transforms['val'])

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    class_names = train_dataset.classes
    num_classes = len(class_names)
    print(f"Classes ({num_classes}): {class_names}\n")
    print(f"Train samples: {len(train_dataset)} | Validation samples: {len(val_dataset)}")

    # Save class indices mapping
    class_metadata = {
        'classes': class_names,
        'class_to_idx': train_dataset.class_to_idx,
        'idx_to_class': {v: k for k, v in train_dataset.class_to_idx.items()},
        'class_info': {
            c: {
                'is_fresh': c.startswith('Fresh'),
                'condition': 'Fresh' if c.startswith('Fresh') else 'Rotten',
                'produce': c.replace('Fresh', '').replace('Rotten', '')
            } for c in class_names
        }
    }
    with open(CLASSES_SAVE_PATH, 'w') as f:
        json.dump(class_metadata, f, indent=2)

    # 2. Model Initialization (MobileNetV3-Small)
    print("\nInitializing Pretrained MobileNetV3-Small...")
    weights = models.MobileNet_V3_Small_Weights.DEFAULT
    model = models.mobilenet_v3_small(weights=weights)

    # Replace classifier head for 26 classes
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    model = model.to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=NUM_EPOCHS, eta_min=1e-5)

    history = {
        'epoch': [],
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': [],
        'binary_freshness_acc': [],
        'macro_f1': []
    }

    best_val_acc = 0.0
    start_total_time = time.time()

    for epoch in range(1, NUM_EPOCHS + 1):
        epoch_start = time.time()
        print(f"\n--- Epoch {epoch}/{NUM_EPOCHS} (LR: {optimizer.param_groups[0]['lr']:.6f}) ---")

        # --- Training Phase ---
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for batch_idx, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)

            if (batch_idx + 1) % 40 == 0 or (batch_idx + 1) == len(train_loader):
                batch_acc = 100.0 * correct_train / total_train
                print(f"  Batch {batch_idx+1:03d}/{len(train_loader)} | Loss: {loss.item():.4f} | Running Acc: {batch_acc:.2f}%", flush=True)

        epoch_train_loss = running_loss / total_train
        epoch_train_acc = 100.0 * correct_train / total_train

        # --- Validation Phase ---
        model.eval()
        running_val_loss = 0.0
        all_preds = []
        all_labels = []

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
                outputs = model(inputs)
                loss = criterion(outputs, labels)

                running_val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)

                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        epoch_val_loss = running_val_loss / len(val_dataset)
        epoch_val_acc = 100.0 * accuracy_score(all_labels, all_preds)

        # Macro metrics across all 26 classes
        p, r, f1, _ = precision_recall_fscore_support(all_labels, all_preds, average='macro', zero_division=0)

        # Also calculate binary Fresh vs Rotten accuracy
        binary_labels = [1 if class_names[l].startswith('Fresh') else 0 for l in all_labels]
        binary_preds = [1 if class_names[p_idx].startswith('Fresh') else 0 for p_idx in all_preds]
        binary_acc = 100.0 * accuracy_score(binary_labels, binary_preds)

        epoch_duration = time.time() - epoch_start
        scheduler.step()

        print(f"Epoch {epoch} Summary ({epoch_duration:.1f}s):")
        print(f"  Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:.2f}%")
        print(f"  Val Loss:   {epoch_val_loss:.4f} | Val Acc:   {epoch_val_acc:.2f}%")
        print(f"  Macro Precision: {p*100:.2f}% | Macro Recall: {r*100:.2f}% | Macro F1: {f1*100:.2f}%")
        print(f"  Binary Freshness Detection Accuracy: {binary_acc:.2f}%")

        history['epoch'].append(epoch)
        history['train_loss'].append(round(epoch_train_loss, 4))
        history['train_acc'].append(round(epoch_train_acc, 2))
        history['val_loss'].append(round(epoch_val_loss, 4))
        history['val_acc'].append(round(epoch_val_acc, 2))
        history['binary_freshness_acc'].append(round(binary_acc, 2))
        history['macro_f1'].append(round(f1 * 100, 2))

        # Checkpoint saving
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            print(f"  --> New best validation accuracy: {best_val_acc:.2f}%! Saving model weights...")
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_acc': best_val_acc,
                'binary_acc': binary_acc,
                'classes': class_names
            }, MODEL_SAVE_PATH)

    total_time = time.time() - start_total_time
    print("\n" + "=" * 65)
    print(f"Training Complete in {total_time/60:.2f} minutes!")
    print(f"Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"Model saved to: {MODEL_SAVE_PATH}")
    print("=" * 65)

    # Save final history and confusion matrix
    cm = confusion_matrix(all_labels, all_preds).tolist()
    final_report = {
        'total_training_minutes': round(total_time / 60, 2),
        'best_val_accuracy': round(best_val_acc, 2),
        'final_binary_freshness_accuracy': history['binary_freshness_acc'][-1],
        'history': history,
        'confusion_matrix': cm,
        'classes': class_names
    }
    with open(METRICS_SAVE_PATH, 'w') as f:
        json.dump(final_report, f, indent=2)
    print(f"Metrics & Confusion Matrix saved to: {METRICS_SAVE_PATH}")

if __name__ == '__main__':
    train()

