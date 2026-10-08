# Image Captioning

A model that looks at a picture and **writes a sentence describing it**.

## How it works

The model has two parts:

- **Encoder (CNN):** looks at the image and turns it into a set of features
- **Decoder (Transformer):** reads those features and generates the caption, one word at a time

```
image → CNN encoder → image features → Transformer decoder → "a dog running on the grass"
```

## What I did

1. Prepared images and their captions
2. Built a vocabulary from the captions
3. Trained the encoder-decoder model
4. Generated captions for new images

<!-- ✏️ Add the dataset you used, your scores (e.g. BLEU) and a few example images with captions. -->

## Status

✅ Completed.
