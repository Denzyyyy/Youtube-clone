# YouTube Clone - Full Stack Video Platform

A production-grade YouTube clone demonstrating modern microservices architecture, video processing pipelines, and cloud-native deployment. Built with TypeScript, Node.js, React, and Google Cloud Platform.

![TypeScript](https://img.shields.io/badge/TypeScript-86.7%25-blue?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![GCP](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4?logo=google-cloud)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

This project replicates core YouTube functionality, focusing on backend architecture and video processing workflows. It demonstrates how large-scale video platforms handle uploads, transcoding, storage, and delivery at scale.

### Key Features

- ✅ **Microservices Architecture**: Decoupled services for scalability
- ✅ **Video Processing Pipeline**: FFmpeg transcoding with multiple quality options
- ✅ **Cloud Storage Integration**: Google Cloud Storage for video assets
- ✅ **Containerized Deployment**: Docker + Google Cloud Run
- ✅ **RESTful API**: Express.js backend with TypeScript
- ✅ **Modern Frontend**: React/Next.js web client
- ✅ **Authentication**: Firebase Auth integration
- ✅ **Pub/Sub Messaging**: Event-driven video processing

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────────────────────────────────────┐
│           Load Balancer / CDN               │
└──────┬──────────────────────────────────────┘
       │
       ├─────────────────┬────────────────────┐
       │                 │                    │
┌──────▼──────┐   ┌─────▼──────┐   ┌────────▼────────┐
│   API       │   │   Video    │   │   Cloud         │
│   Service   │   │ Processing │   │   Storage       │
│  (Express)  │   │  (FFmpeg)  │   │   (GCS)         │
└──────┬──────┘   └─────┬──────┘   └────────┬────────┘
       │                 │                    │
       │                 │                    │
       │          ┌──────▼────────┐          │
       │          │   Pub/Sub     │          │
       └──────────│   (Events)    │──────────┘
                  └───────────────┘
```

### Component Breakdown

| Service | Technology | Purpose |
|---------|-----------|---------|
| **yt-web-client** | React/Next.js | User interface, video playback |
| **yt-api-service** | Express + TypeScript | RESTful API, business logic |
| **video-processing-service** | Node.js + FFmpeg | Video transcoding and optimization |
| **Cloud Storage** | Google Cloud Storage | Raw and processed video storage |
| **Pub/Sub** | Google Cloud Pub/Sub | Asynchronous processing events |
| **Cloud Run** | GCP Serverless | Container deployment platform |

## 📋 Table of Contents

- [Features](#-features-in-depth)
- [Architecture](#-architecture-details)
- [Getting Started](#-getting-started)
- [Services](#-services)
- [Video Processing](#-video-processing-pipeline)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Production](#-production-considerations)

## ✨ Features In-Depth

### 1. Video Upload & Processing

- **Multi-format Support**: MP4, AVI, MOV, WebM
- **Automatic Transcoding**: Convert to web-optimized formats
- **Multiple Quality Levels**: 360p, 480p, 720p, 1080p
- **Thumbnail Generation**: Auto-generate video previews
- **Progress Tracking**: Real-time upload and processing status

### 2. Video Storage Strategy

```
Raw Videos (GCS Bucket 1)
    ↓
Processing Queue (Pub/Sub)
    ↓
FFmpeg Transcoding
    ↓
Processed Videos (GCS Bucket 2)
    ↓
CDN Distribution
```

**Storage Buckets:**
- `raw-videos-bucket`: Original user uploads
- `processed-videos-bucket`: Transcoded, optimized videos

### 3. Microservices Benefits

- **Independent Scaling**: Scale video processing separately from API
- **Fault Isolation**: Service failures don't cascade
- **Technology Flexibility**: Use best tool for each job
- **Easier Maintenance**: Update services independently

### 4. Authentication & Authorization

- **Firebase Authentication**: Secure user sign-in
- **JWT Tokens**: Stateless authentication
- **Role-Based Access**: Upload permissions, admin features
- **Session Management**: Persistent login sessions

## 🏛️ Architecture Details

### Microservices Communication

**Synchronous (HTTP/REST):**
```
Client → API Service: Upload video metadata
API Service → Processing Service: Trigger transcode
```

**Asynchronous (Pub/Sub):**
```
API Service → Pub/Sub → Processing Service: New video event
Processing Service → Pub/Sub → API Service: Processing complete
```

### Video Processing Flow

1. **Upload Initiated**
   - Client uploads video to API
   - API stores raw video in GCS
   - API publishes "new-video" event to Pub/Sub

2. **Processing Triggered**
   - Video Processing Service receives event
   - Downloads raw video from GCS
   - Transcodes using FFmpeg

3. **Multiple Quality Generation**
   ```bash
   ffmpeg -i input.mp4 \
     -vf scale=1920:1080 -c:v libx264 -crf 23 -preset medium output_1080p.mp4 \
     -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium output_720p.mp4 \
     -vf scale=854:480 -c:v libx264 -crf 23 -preset medium output_480p.mp4 \
     -vf scale=640:360 -c:v libx264 -crf 23 -preset medium output_360p.mp4
   ```

4. **Upload Processed Videos**
   - Uploads all quality versions to GCS
   - Generates thumbnails
   - Updates video status in database

5. **Notification**
   - Publishes "processing-complete" event
   - API updates video metadata
   - Client notified video is ready

### Database Schema

```typescript
// Video Metadata
interface Video {
  id: string;
  userId: string;
  title: string;
  description: string;
  uploadDate: Date;
  status: 'processing' | 'ready' | 'failed';
  rawVideoUrl: string;
  processedVideoUrls: {
    '360p': string;
    '480p': string;
    '720p': string;
    '1080p': string;
  };
  thumbnailUrl: string;
  duration: number;
  views: number;
}

// User Data
interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string;
  uploadedVideos: string[];
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Google Cloud Account
- FFmpeg (for local video processing)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Denzyyyy/Youtube-clone.git
cd Youtube-clone
```

2. **Install dependencies for all services**
```bash
# API Service
cd yt-api-service
npm install

# Video Processing Service
cd ../video-processing-service
npm install

# Web Client
cd ../yt-web-client
npm install
```

3. **Set up environment variables**

Create `.env` files in each service:

**yt-api-service/.env:**
```env
PORT=3000
GCS_RAW_BUCKET=your-raw-videos-bucket
GCS_PROCESSED_BUCKET=your-processed-videos-bucket
FIREBASE_PROJECT_ID=your-firebase-project
PUBSUB_TOPIC=video-processing-topic
```

**video-processing-service/.env:**
```env
PORT=3001
GCS_RAW_BUCKET=your-raw-videos-bucket
GCS_PROCESSED_BUCKET=your-processed-videos-bucket
PUBSUB_SUBSCRIPTION=video-processing-sub
```

**yt-web-client/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
```

4. **Run with Docker Compose**
```bash
docker-compose up --build
```

5. **Access the application**
- Web Client: http://localhost:3002
- API Service: http://localhost:3000
- Processing Service: http://localhost:3001

## 📂 Services

### 1. yt-web-client (Frontend)

**Tech Stack:**
- React 18
- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase SDK

**Features:**
- Video upload interface
- Video player with quality selection
- User authentication UI
- Browse and search videos
- Responsive design

**Directory Structure:**
```
yt-web-client/
├── components/
│   ├── VideoPlayer.tsx
│   ├── UploadButton.tsx
│   └── VideoCard.tsx
├── pages/
│   ├── index.tsx        # Home page
│   ├── watch.tsx        # Video player page
│   └── upload.tsx       # Upload page
├── lib/
│   ├── firebase.ts      # Firebase config
│   └── api.ts           # API client
└── styles/
    └── globals.css
```

### 2. yt-api-service (Backend API)

**Tech Stack:**
- Express.js
- TypeScript
- Firebase Admin SDK
- Google Cloud Storage Client
- Google Cloud Pub/Sub Client

**Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload video file |
| GET | `/videos` | List all videos |
| GET | `/videos/:id` | Get video details |
| POST | `/videos/:id/view` | Increment view count |
| DELETE | `/videos/:id` | Delete video |

**Directory Structure:**
```
yt-api-service/
├── src/
│   ├── controllers/
│   │   └── videoController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── upload.ts
│   ├── routes/
│   │   └── videoRoutes.ts
│   ├── services/
│   │   ├── storage.ts
│   │   └── pubsub.ts
│   └── index.ts
├── Dockerfile
└── package.json
```

### 3. video-processing-service (Video Processor)

**Tech Stack:**
- Node.js
- TypeScript
- FFmpeg
- Google Cloud Storage
- Google Cloud Pub/Sub

**Processing Steps:**
1. Listen for video upload events
2. Download raw video from GCS
3. Transcode to multiple qualities
4. Generate thumbnail
5. Upload processed files to GCS
6. Publish completion event

**Directory Structure:**
```
video-processing-service/
├── src/
│   ├── processors/
│   │   ├── videoProcessor.ts
│   │   └── thumbnailGenerator.ts
│   ├── services/
│   │   ├── storage.ts
│   │   └── pubsub.ts
│   └── index.ts
├── Dockerfile
└── package.json
```

## 🎬 Video Processing Pipeline

### FFmpeg Configuration

**Quality Presets:**
```typescript
const QUALITY_PRESETS = {
  '1080p': {
    resolution: '1920x1080',
    bitrate: '5000k',
    crf: 23,
  },
  '720p': {
    resolution: '1280x720',
    bitrate: '2500k',
    crf: 23,
  },
  '480p': {
    resolution: '854x480',
    bitrate: '1000k',
    crf: 23,
  },
  '360p': {
    resolution: '640x360',
    bitrate: '500k',
    crf: 23,
  },
};
```

**Transcoding Command:**
```bash
ffmpeg -i input.mp4 \
  -vf "scale=${width}:${height}" \
  -c:v libx264 \
  -crf ${crf} \
  -preset medium \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

**Thumbnail Generation:**
```bash
ffmpeg -i input.mp4 \
  -ss 00:00:01 \
  -vframes 1 \
  -vf "scale=320:180" \
  thumbnail.jpg
```

### Processing Optimization

- **Parallel Processing**: Process multiple qualities simultaneously
- **Chunked Upload**: Stream processed videos to GCS
- **Error Recovery**: Retry failed processing with exponential backoff
- **Resource Limits**: CPU and memory constraints for cost control

## 🚢 Deployment

### Google Cloud Platform Setup

1. **Create GCP Project**
```bash
gcloud projects create your-project-id
gcloud config set project your-project-id
```

2. **Enable APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable pubsub.googleapis.com
```

3. **Create Storage Buckets**
```bash
gsutil mb gs://your-raw-videos-bucket
gsutil mb gs://your-processed-videos-bucket
```

4. **Create Pub/Sub Topic and Subscription**
```bash
gcloud pubsub topics create video-processing-topic
gcloud pubsub subscriptions create video-processing-sub \
  --topic=video-processing-topic
```

### Docker Deployment

**Build Images:**
```bash
# API Service
cd yt-api-service
docker build -t gcr.io/your-project/yt-api-service .
docker push gcr.io/your-project/yt-api-service

# Processing Service
cd ../video-processing-service
docker build -t gcr.io/your-project/video-processing-service .
docker push gcr.io/your-project/video-processing-service

# Web Client
cd ../yt-web-client
docker build -t gcr.io/your-project/yt-web-client .
docker push gcr.io/your-project/yt-web-client
```

**Deploy to Cloud Run:**
```bash
# API Service
gcloud run deploy yt-api-service \
  --image gcr.io/your-project/yt-api-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi

# Processing Service
gcloud run deploy video-processing-service \
  --image gcr.io/your-project/video-processing-service \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600

# Web Client
gcloud run deploy yt-web-client \
  --image gcr.io/your-project/yt-web-client \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment Variables in Cloud Run

Set via console or CLI:
```bash
gcloud run services update yt-api-service \
  --set-env-vars="GCS_RAW_BUCKET=your-bucket,FIREBASE_PROJECT_ID=your-project"
```

## 📡 API Documentation

### Upload Video

**Endpoint:** `POST /upload`

**Headers:**
```
Authorization: Bearer <firebase-token>
Content-Type: multipart/form-data
```

**Request:**
```typescript
FormData {
  video: File,
  title: string,
  description: string,
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "abc123",
  "message": "Video uploaded successfully",
  "status": "processing"
}
```

### Get Video Details

**Endpoint:** `GET /videos/:id`

**Response:**
```json
{
  "id": "abc123",
  "title": "My Awesome Video",
  "description": "This is a great video",
  "userId": "user123",
  "uploadDate": "2026-01-06T10:00:00Z",
  "status": "ready",
  "urls": {
    "360p": "https://storage.googleapis.com/...",
    "480p": "https://storage.googleapis.com/...",
    "720p": "https://storage.googleapis.com/...",
    "1080p": "https://storage.googleapis.com/..."
  },
  "thumbnailUrl": "https://storage.googleapis.com/...",
  "duration": 180,
  "views": 1234
}
```

### List Videos

**Endpoint:** `GET /videos?page=1&limit=20`

**Response:**
```json
{
  "videos": [...],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

## 💻 Development

### Local Development

**Run individual services:**
```bash
# API Service
cd yt-api-service
npm run dev

# Processing Service (requires FFmpeg)
cd video-processing-service
npm run dev

# Web Client
cd yt-web-client
npm run dev
```

### Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## 🔧 Production Considerations

### Performance Optimization

- **CDN Integration**: CloudFlare/Fastly for video delivery
- **Adaptive Bitrate Streaming**: HLS or DASH for smooth playback
- **Lazy Loading**: Load videos on demand
- **Image Optimization**: WebP thumbnails with fallbacks
- **Caching Strategy**: Cache video metadata and thumbnails

### Security

- **Authentication**: Firebase Auth with JWT verification
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent abuse of upload API
- **CORS**: Restrict origins in production
- **Content Moderation**: Automated scanning for inappropriate content
- **Signed URLs**: Time-limited access to video files

### Monitoring & Logging

- **Google Cloud Logging**: Centralized logs
- **Google Cloud Monitoring**: Metrics and alerts
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Track video processing times
- **Cost Monitoring**: Track GCS and Cloud Run usage

### Scaling Considerations

**Current Bottlenecks:**
- Video processing is CPU-intensive
- FFmpeg processing time scales with video length

**Scaling Strategies:**
1. **Horizontal Scaling**: Multiple processing service instances
2. **Queue Management**: Prioritize short videos, batch long ones
3. **Cost Optimization**: Use preemptible VMs for processing
4. **Storage Lifecycle**: Move old videos to cheaper storage tiers
5. **CDN Caching**: Reduce bandwidth costs

## 🎓 Learning Outcomes

### Technologies Mastered

**Backend:**
- Microservices architecture
- RESTful API design
- Event-driven systems (Pub/Sub)
- Cloud storage (GCS)
- Container orchestration

**Frontend:**
- React/Next.js
- Client-side state management
- File upload handling
- Video player integration

**DevOps:**
- Docker containerization
- Google Cloud Platform
- CI/CD pipelines
- Infrastructure as Code

**Media Processing:**
- FFmpeg video transcoding
- Multiple quality generation
- Thumbnail extraction
- Adaptive streaming concepts

## 📚 References & Resources

### Similar Projects

- [YouTube Architecture](https://www.youtube.com/watch?v=w5WVu624fY8)
- [Netflix Video Processing Pipeline](https://netflixtechblog.com/high-quality-video-encoding-at-scale-d159db052746)
- [Cloudinary](https://cloudinary.com/) - Media management platform

### Documentation

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [Google Cloud Pub/Sub](https://cloud.google.com/pubsub/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Video Encoding Resources

- [Video Encoding Best Practices](https://trac.ffmpeg.org/wiki/Encode/H.264)
- [Adaptive Bitrate Streaming](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming)
- [HLS vs DASH](https://www.wowza.com/blog/hls-vs-dash)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Areas for Contribution

- [ ] Add HLS/DASH adaptive streaming
- [ ] Implement video recommendations algorithm
- [ ] Add comment system
- [ ] Implement likes/dislikes
- [ ] Add video playlists
- [ ] Improve search functionality
- [ ] Add subtitle support
- [ ] Implement live streaming

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- YouTube for the inspiration
- Google Cloud Platform for infrastructure
- FFmpeg community for video processing tools
- Open source community

## 📧 Contact

**Denzy** - [@Denzyyyy](https://github.com/Denzyyyy)

Project Link: [https://github.com/Denzyyyy/Youtube-clone](https://github.com/Denzyyyy/Youtube-clone)

---

**Built with ❤️ using TypeScript, React, Node.js, FFmpeg, and Google Cloud Platform**
