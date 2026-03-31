

export type AuthStackPramList = {
    WelcomePage: undefined,
    SignInScreen: undefined,
    SignUpScreen: undefined,
    OTPVerificationScreen: {
        isForgotPasswordPage: boolean;
        email: string
    },
    ForgotPasswordScreen: undefined,
    CreateNewPasswordScreen: {
        email: string,
        otp: string
    },
}

export type MainStackParamList = {
    WelcomeMyNestScreen: undefined,
    ScoreVisibilityScreen: undefined,
    NestFeedScreen: undefined,
    TeamDetailScreen: {
        entity_id: number,
        logo?: string
    },
    ProfileSettingsScreen: undefined,
    GoAdFreeScreen:undefined,
    EditProfileScreen: undefined,
    YourNestSummary: undefined,
    NotificationSettings: undefined,
    ChangePassword: undefined,
    EventDetailsScreen: undefined
}