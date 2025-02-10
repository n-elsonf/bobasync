# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

project-root/
├── client/ # React Native frontend
│ ├── src/
│ │ ├── api/ # API integration
│ │ │ ├── types.ts
│ │ │ ├── auth.ts # Auth-related API calls
│ │ │ └── index.ts # API client setup
│ │ ├── components/ # Reusable components
│ │ │ ├── common/
│ │ │ │ ├── Button.tsx
│ │ │ │ └── Input.tsx
│ │ │ └── auth/
│ │ │ └── GoogleSignInButton.tsx
│ │ ├── screens/ # Screen components
│ │ │ ├── auth/
│ │ │ │ ├── LoginScreen.tsx
│ │ │ │ └── RegisterScreen.tsx
│ │ │ └── home/
│ │ │ └── HomeScreen.tsx
│ │ ├── navigation/ # Navigation setup
│ │ │ ├── types.ts
│ │ │ ├── AppNavigator.tsx
│ │ │ └── AuthNavigator.tsx
│ │ ├── hooks/ # Custom hooks
│ │ │ └── useAuth.ts
│ │ ├── context/ # Context providers
│ │ │ └── AuthContext.tsx
│ │ ├── utils/ # Utility functions
│ │ │ └── validation.ts
│ │ ├── constants/ # Constants and config
│ │ │ └── config.ts
│ │ └── App.tsx # Root component
│ ├── app.json # Expo config
│ ├── package.json
│ └── tsconfig.json
│
├── server/ # Node.js/Express backend
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ │ ├── database.ts # Database configuration
│ │ │ └── environment.ts # Environment variables
│ │ ├── controllers/ # Route controllers
│ │ │ ├── auth.controller.ts
│ │ │ └── user.controller.ts
│ │ ├── middleware/ # Custom middleware
│ │ │ ├── auth.middleware.ts
│ │ │ └── error.middleware.ts
│ │ ├── models/ # Database models
│ │ │ ├── types.ts
│ │ │ └── User.ts
│ │ ├── routes/ # API routes
│ │ │ ├── auth.routes.ts
│ │ │ └── user.routes.ts
│ │ ├── services/ # Business logic
│ │ │ ├── auth.service.ts
│ │ │ └── user.service.ts
│ │ ├── utils/ # Utility functions
│ │ │ ├── logger.ts
│ │ │ └── errors.ts
│ │ ├── types/ # TypeScript type definitions
│ │ │ └── express.d.ts
│ │ ├── app.ts # Express app setup
│ │ └── server.ts # Server entry point
│ ├── package.json
│ └── tsconfig.json
│
├── shared/ # Shared code between client and server
│ ├── types/ # Shared TypeScript interfaces
│ │ └── auth.types.ts
│ └── constants/ # Shared constants
│ └── index.ts
│
├── .gitignore
├── package.json # Root package.json for workspaces
└── README.md

Example key files:
