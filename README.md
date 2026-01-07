# Love Drop

A Tinder-style course matching app built with React Native and Expo. Swipe through courses, match with the ones you love, and manage your academic schedule.

## Screenshots

### Authentication & Onboarding
| Landing Page | Authentication |
|:---:|:---:|
| ![Landing](screenshots/landing%20page.png) | ![Auth](screenshots/authentication%20page.png) |

### Student Experience
| Home Screen | Filter Modal | Course Details |
|:---:|:---:|:---:|
| ![Home](screenshots/student%20homepage%20view.png) | ![Filter](screenshots/student%20home%20screen%20-%20filter%20modal.png) | ![Details](screenshots/detailed%20course%20information%20screen.png) |

| Match Screen | Matches & Chat | Profile |
|:---:|:---:|:---:|
| ![Match](screenshots/student%20match%20screen.png) | ![Chat](screenshots/matches%20and%20pending%20view%20-%20chat%20screen.png) | ![Profile](screenshots/student%20profile%20page.png) |

| Avatar Builder | Academic Info |
|:---:|:---:|
| ![Avatar](screenshots/avatar%20builder%20page.png) | ![Academic](screenshots/students%20academical%20information%20view.png) |

### Schedule Views
| Weekly | Monthly | Yearly |
|:---:|:---:|:---:|
| ![Weekly](screenshots/course%20schedule%20view%20weekly.png) | ![Monthly](screenshots/course%20schedule%20view%20monthly.png) | ![Yearly](screenshots/course%20schedule%20view%20yearly.png) |

### Teacher Portal
| Home Screen | Course Selection | Messaging | Settings |
|:---:|:---:|:---:|:---:|
| ![Teacher Home](screenshots/teacher%20homescreen%20view.png) | ![Courses](screenshots/teacher%20home%20screen%20-%20chose%20course%20profile%20modal.png) | ![Messages](screenshots/teacher%20messaging%20screen.png) | ![Logout](screenshots/teacher%20logout%20screen.png) |

### Real-time Chat
| Student & Teacher Messaging |
|:---:|
| ![Chat](screenshots/real%20life%20messaging%20screen-%20both%20student%20and%20teacher%20views.png) |

## Features

### For Students

#### Swipe to Match
- **Browse Courses**: Swipe through available courses like a dating app
- **Swipe Right**: Match with courses you're interested in
- **Swipe Left**: Skip courses that don't fit your schedule
- **Tap for Details**: Tap any card to see full course information including credits, schedule, and description

#### Two Types of Courses
| Type | Badge Color | Behavior |
|------|-------------|----------|
| **Required** | Orange | Instant match when you swipe right |
| **Elective** | Blue | Sends application to instructor for approval |

#### Credit Management
- Track your enrolled credits with the progress bar (max 21 credits/term)
- See credit count for each course before matching
- Prevents over-enrollment with credit limit warnings

#### Filter Courses
Tap the filter button to show:
- All Courses
- Elective Only
- Required Only

#### Course Details Modal
Tap any course card to view:
- Course image and code
- Match probability percentage
- Elective/Required status badge
- Credit hours
- Schedule (day and time)
- Course description
- Enrollment behavior explanation

#### Matches & Chat
- View all your matched courses in the Matches tab
- Real-time chat with course instructors
- Messages sync instantly across devices

#### Schedule Management
View your enrolled courses in multiple calendar formats:
- **Weekly View**: See your week at a glance
- **Monthly View**: Plan ahead with monthly overview
- **Yearly View**: Long-term academic planning

#### Custom Avatar Builder
Create your personalized avatar with DiceBear:
- **Face**: Choose eyes, eyebrows, and mouth styles
- **Hair**: Pick from 30+ hairstyles and 10 hair colors
- **Beard**: Add facial hair with custom colors
- **Accessories**: Add glasses and other accessories
- **Outfit**: Select clothing style and color
- **Colors**: Customize skin tone and background color
- **Randomize**: Generate random combinations instantly

### For Teachers

#### Course Management
- View all courses you teach
- See student application counts per course

#### Student Applications
- Review pending student applications
- Swipe right to approve students
- Swipe left to reject applications

#### Real-Time Chat
- Chat with approved students
- Filter conversations by course
- Instant message delivery

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd love-drop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser

### Test Accounts

The app includes test accounts for quick testing:

| Account Type | Email | Button |
|--------------|-------|--------|
| Student | tester@lovedrop.com | "Student Login (Test)" |
| Teacher | teacher@lovedrop.com | "Teacher Login (Test)" |

## Usage Guide

### Student Flow

1. **Login**: Use the test student button or create an account
2. **Browse**: Swipe through course cards on the Home tab
3. **Learn More**: Tap any card to see full details
4. **Match**: Swipe right on courses you want
   - Required courses: Instant match!
   - Elective courses: Wait for teacher approval
5. **Chat**: Message instructors from the Matches tab
6. **Schedule**: View your courses in the Schedule tab
7. **Profile**: Customize your avatar in the Profile tab

### Teacher Flow

1. **Login**: Use the test teacher button
2. **View Courses**: See your assigned courses
3. **Review Students**: Swipe through student applications
4. **Approve/Reject**: Swipe right to approve, left to reject
5. **Chat**: Communicate with approved students

### Swipe Gestures

| Gesture | Action |
|---------|--------|
| Swipe Right | Match/Apply to course |
| Swipe Left | Skip/Reject |
| Tap Card | View full details |

### Credit System

- Maximum 21 credits per term
- Each course shows its credit value
- Progress bar tracks your enrolled credits
- System prevents exceeding credit limit

## Tech Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (TailwindCSS)
- **Backend**: Supabase (Auth, Database, Realtime)
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler
- **Avatars**: DiceBear (@dicebear/core)
- **Icons**: Lucide React Native

## Project Structure

```
love-drop/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   │   ├── home.tsx       # Swipe screen
│   │   ├── matches.tsx    # Matched courses
│   │   ├── schedule.tsx   # Calendar views
│   │   └── profile.tsx    # User profile
│   ├── (teacher)/         # Teacher portal
│   └── chat.tsx           # Chat screen
├── components/            # Reusable components
│   ├── SwipeCard.tsx
│   ├── AvatarBuilder.tsx
│   ├── CourseDetailsModal.tsx
│   └── ...
├── context/               # React Context providers
├── lib/                   # Utilities (Supabase client)
└── types/                 # TypeScript definitions
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User accounts (students & teachers) |
| `courses` | Course information (30 courses: 15 required, 15 elective) |
| `matches` | Student-course relationships |
| `messages` | Chat messages |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with React Native, Expo, and Supabase
