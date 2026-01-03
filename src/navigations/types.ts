

export type AuthStackPramList = {
    WelcomePage: undefined,
    SignInScreen: undefined,
    SignUpScreen: undefined,
    OTPVerificationScreen: {
        isForgotPasswordPage: boolean;
    },
    ForgotPasswordScreen: undefined,
    CreateNewPasswordScreen: undefined
}

export type MainStackParamList = {
    WelcomeMyNestScreen: undefined,
    ScoreVisibilityScreen: undefined,
}