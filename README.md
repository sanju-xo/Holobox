# HoloBox — Interactive 3D LCD Display and AI Engagement Platform

https://github.com/sanju-xo/Holobox/blob/main/screenshots/unity%20.mp4

<p align="center">
  <img src="screenshots/admin login.png" width="45%" alt="Admin Login">
  <img src="screenshots/admin home.png" width="45%" alt="Admin Home">
  <img src="screenshots/admin products.png" width="45%" alt="Admin Products">
  <img src="screenshots/client app.jpg" width="12%" alt="Client app">
  <img src="screenshots/client app 2.jpg" width="12%" alt="Client app 2">
  <img src="screenshots/e app home.jpg" width="12%" alt="E app home">
  <img src="screenshots/e app products.jpg" width="12%" alt="E app products">
</p>

HoloBox is a next-generation **interactive 3D digital signage platform** that combines AI, edge computing, cloud services, and mobile applications to create a privacy-first, touchless advertising experience. It transforms conventional static displays into intelligent systems that can detect gestures, estimate audience demographics locally, and deliver personalized 3D content with real-time analytics.


## Overview

HoloBox is designed as a **cloud-edge-mobile ecosystem** with three major components:

- **AdBox Embedded Unit**: Handles local gesture recognition, facial analytics, and 3D playback.
- **Main Server**: Manages authentication, content approval, scheduling, and analytics.
- **Mobile Applications**: Provide campaign management, AR product preview, and customer engagement.

The system is built to support **low latency, offline resilience, secure synchronization, and privacy-preserving inference**.

## Features

- **3D interactive digital signage** with depth-enhanced visuals.
- **Gesture-based touchless navigation** using computer vision.
- **Face analytics** for age and gender estimation on-device.
- **2D to 3D conversion pipeline** for advertising creatives.
- **Real-time campaign management** through a web admin portal.
- **Mobile app support** for agents and customers.
- **Firebase integration** for authentication, storage, and analytics.
- **Offline caching and fallback playback** for reliable operation.
- **Privacy-first edge processing** with anonymized telemetry.

## Architecture

The project follows a modular tri-layer architecture:

1. **Edge Layer — AdBox**
   - AI inference using TensorFlow Lite and OpenCV
   - Gesture recognition and facial analytics
   - Local caching and playback control

2. **Cloud Layer — Main Server**
   - React.js and Python-based backend
   - Firebase database, authentication, and messaging
   - Ad approval, scheduling, and analytics dashboard

3. **Mobile Layer — Flutter Apps**
   - Agent app for campaign creation and tracking
   - Customer app for discovery, AR preview, and purchase

## Project Repositories

The HoloBox ecosystem is divided into multiple repositories, each responsible for a specific part of the platform.

| Repository         | Description                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Holobox-WebApp** | https://github.com/heisenburgerrr1/Holobox-WebApp — - Web application featuring user authentication, multi-image product uploads, 3D model (GLB/GLTF/OBJ) upload and preview, submission tracking, analytics dashboard, and seamless Firebase backend integration.                 |
| **Unity Project**  | https://drive.google.com/drive/folders/1rze3FmSktUh97HzdPJVaEXnNpAKP_EFA?usp=drive_link — Unity project for the interactive 3D display experience and content playback. |
|**Live Demo (Admin Software):** | https://admin-software-eight.vercel.app/ - Manage products, approve or reject submissions, send notifications, perform user management.  |
| **Holobox-E-commerce Mobile App**| https://github.com/Dwi8ty/Holobox-app - A feature-rich Flutter mobile app that enables users to browse products, place orders, track deliveries, manage profiles, and receive real-time notifications through Firebase. |

Additional repositories for the Flutter applications, AI modules, and backend services may be linked here as they become publicly available.


## Tech Stack

- **Frontend**: React.js, Flutter
- **Backend**: Python, Firebase
- **AI / CV**: TensorFlow Lite, OpenCV, MediaPipe
- **3D / AR**: WebXR, Unity, ARCore / ARKit
- **Database / Auth**: Firebase Firestore, Firebase Authentication
- **Deployment**: Vercel
- **Languages**: JavaScript, Python, C#, Dart, HTML, CSS

## Use Cases

HoloBox can be used in:

- Retail advertising
- Exhibitions and trade shows
- Educational displays
- Entertainment venues
- Smart public signage
- Interactive product promotion

## Advantages

- Immersive 3D visuals without special eyewear
- Touchless interaction for public environments
- Better engagement measurement than traditional signage
- Privacy-preserving AI inference on-device
- Scalable and maintainable architecture
- Secure communication and role-based access control

## Future Scope

- Richer gesture vocabulary and context-aware interaction
- Real-time creative scoring and A/B testing
- Better mobile commerce integration
- Multi-region scaling and device cohorts
- Stronger analytics, attribution, and predictive optimization
- Expanded compliance and consent management

## Project Report Summary

This project presents a complete system for **privacy-first, AI-driven, immersive advertising** that bridges physical attention and digital action. It combines edge intelligence, 3D visualization, and mobile commerce into a single measurable platform.

## Authors

- George Joseph
- Mohammed Ameen
- Sahal Salam K A
- Salih P Ashraf


## License

This project is shared for academic and educational purposes.


