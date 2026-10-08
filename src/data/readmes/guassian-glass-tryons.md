# 3D Gaussian Splat Glasses Try-On

A **local virtual glasses try-on system** that automatically fits 3D glasses onto a Gaussian-splat head.

## Overview

This project uses **FaceLift, MediaPipe, and Three.js** to create an interactive 3D glasses try-on experience.

Facial landmarks are used to automatically position and fit glasses models onto the rendered head. A webcam can also control the head's pose in real time.

## Features

- Gaussian-splat head rendering
- Automatic face landmark detection
- Automatic glasses fitting
- Multiple 3D glasses models
- Interactive 3D camera controls
- Webcam-based head pose tracking
- Offline/local browser experience

## Tech stack

| Part | Tools |
| --- | --- |
| Language | JavaScript, Python |
| 3D Rendering | Three.js |
| Face Tracking | MediaPipe |
| Image Processing | OpenCV |
| 3D Representation | Gaussian Splatting |
| Head Generation | FaceLift |

## How it works

1. Generate a Gaussian-splat head using FaceLift
2. Detect facial landmarks using MediaPipe
3. Generate the face frame for glasses fitting
4. Load the head and glasses models in Three.js
5. Automatically position the glasses on the face
6. Use the webcam to track head movement

## Run it locally

```bash
git clone https://github.com/hyandri/gaussian-glass-tryons.git

cd your-repo-name

./run.sh
