import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        modules: 'Modules',
        forum: 'Forum',
        liveData: 'Live Data',
        feedback: 'Feedback',
        admin: 'Admin',
      },
      
      // Authentication
      auth: {
        login: 'Login',
        signup: 'Sign Up',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone Number',
        confirmPassword: 'Confirm Password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        orContinueWith: 'Or continue with',
        welcome: 'Welcome to Rural Minds',
        signupDescription: 'Create your account to access educational modules and community features',
        loginDescription: 'Sign in to your account to continue learning',
      },

      // Hero section
      hero: {
        title: 'Empowering Rural Minds',
        subtitle: 'Access government schemes, agricultural data, and digital literacy education',
        getStarted: 'Get Started',
        watchDemo: 'Watch Demo',
      },

      // Modules
      modules: {
        title: 'Educational Modules',
        subtitle: 'Learn essential skills through our comprehensive video library',
        allModules: 'All Modules',
        government: 'Government Schemes',
        banking: 'Banking',
        agriculture: 'Agriculture',
        health: 'Health',
        download: 'Download',
        watch: 'Watch Now',
        progress: {
          title: 'Your Learning Progress',
          completed: 'Modules Completed',
          certificates: 'Certificates Earned',
          retention: 'Knowledge Retention',
        },
      },

      // Forum
      forum: {
        title: 'Community Forum',
        subtitle: 'Connect with fellow learners and get help from mentors',
        newPost: 'Ask a Question',
        mentorSession: 'Live Mentor Session',
        popularTopics: 'Popular Topics',
        guidelines: 'Community Guidelines',
        joinMeet: 'Join Google Meet',
      },

      // Live Data
      liveData: {
        title: 'Live Government Data',
        subtitle: 'Real-time access to government schemes, market prices, and weather data',
        schemes: 'Government Schemes',
        agriculture: 'Agriculture',
        weather: 'Weather',
        banking: 'Banking',
        applyNow: 'Apply Now',
        checkEligibility: 'Check Eligibility',
        learnMore: 'Learn More',
      },

      // Feedback
      feedback: {
        title: 'Share Your Feedback',
        subtitle: 'Help us improve Rural Minds with your valuable suggestions',
        name: 'Name',
        email: 'Email',
        category: 'Category',
        rating: 'Rating',
        message: 'Message',
        submit: 'Submit Feedback',
      },

      // Footer
      footer: {
        quickLinks: 'Quick Links',
        resources: 'Resources',
        contact: 'Contact Info',
      },

      // Stats
      stats: {
        activeUsers: 'Active Users',
        modulesCompleted: 'Modules Completed',
        villages: 'Villages Reached',
        satisfaction: 'Satisfaction Rate',
      },

      // Common
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try again',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
      },
    },
  },
  ta: {
    translation: {
      // Navigation
      nav: {
        home: 'முகப்பு',
        modules: 'பாடங்கள்',
        forum: 'மன்றம்',
        liveData: 'நேரடி தரவு',
        feedback: 'கருத்து',
        admin: 'நிர்வாகம்',
      },

      // Authentication
      auth: {
        login: 'உள்நுழைய',
        signup: 'பதிவு செய்க',
        register: 'பதிவு',
        email: 'மின்னஞ்சல்',
        password: 'கடவுச்சொல்',
        firstName: 'முதல் பெயர்',
        lastName: 'கடைசி பெயர்',
        phone: 'தொலைபேசி எண்',
        confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
        remember: 'என்னை நினைவில் வைத்துக்கொள்',
        forgot: 'கடவுச்சொல் மறந்துவிட்டதா?',
        orContinueWith: 'அல்லது இதனுடன் தொடரவும்',
        welcome: 'Rural Minds இல் வரவேற்கிறோம்',
        signupDescription: 'கல்வி பாடங்கள் மற்றும் சமூக அம்சங்களை அணுக உங்கள் கணக்கை உருவாக்கவும்',
        loginDescription: 'கற்றல் தொடர உங்கள் கணக்கில் உள்நுழையவும்',
      },

      // Hero section
      hero: {
        title: 'கிராமிய மனங்களை வலுப்படுத்துதல்',
        subtitle: 'அரசாங்க திட்டங்கள், விவசாய தரவு மற்றும் டிஜிட்டல் கல்வியணுகல்',
        getStarted: 'தொடங்குங்கள்',
        watchDemo: 'டெமோ பார்க்கவும்',
      },

      // Modules
      modules: {
        title: 'கல்வி பாடங்கள்',
        subtitle: 'எங்கள் விரிவான வீடியோ நூலகத்தின் மூலம் அத்தியாவசிய திறன்களைக் கற்றுக்கொள்ளுங்கள்',
        allModules: 'அனைத்து பாடங்கள்',
        government: 'அரசாங்க திட்டங்கள்',
        banking: 'வங்கி',
        agriculture: 'வேளாண்மை',
        health: 'சுகாதாரம்',
        download: 'பதிவிறக்கம்',
        watch: 'இப்போது பார்க்கவும்',
        progress: {
          title: 'உங்கள் கற்றல் முன்னேற்றம்',
          completed: 'முடிக்கப்பட்ட பாடங்கள்',
          certificates: 'பெற்ற சான்றிதழ்கள்',
          retention: 'அறிவு தக்கவைப்பு',
        },
      },

      // Forum
      forum: {
        title: 'சமூக மன்றம்',
        subtitle: 'சக கற்றவர்களுடன் இணைந்து வழிகாட்டிகளிடமிருந்து உதவி பெறுங்கள்',
        newPost: 'கேள்வி கேளுங்கள்',
        mentorSession: 'நேரடி வழிகாட்டி அமர்வு',
        popularTopics: 'பிரபலமான தலைப்புகள்',
        guidelines: 'சமூக வழிகாட்டுதல்கள்',
        joinMeet: 'Google Meet இல் சேரவும்',
      },

      // Live Data
      liveData: {
        title: 'நேரடி அரசாங்க தரவு',
        subtitle: 'அரசாங்க திட்டங்கள், சந்தை விலைகள் மற்றும் வானிலை தரவுகளுக்கான நேரடி அணுகல்',
        schemes: 'அரசாங்க திட்டங்கள்',
        agriculture: 'வேளாண்மை',
        weather: 'வானிலை',
        banking: 'வங்கி',
        applyNow: 'இப்போது விண்ணப்பிக்கவும்',
        checkEligibility: 'தகுதியை சரிபார்க்கவும்',
        learnMore: 'மேலும் அறிக',
      },

      // Feedback
      feedback: {
        title: 'உங்கள் கருத்தைப் பகிரவும்',
        subtitle: 'உங்கள் மதிப்புமிக்க பரிந்துரைகளுடன் Rural Minds ஐ மேம்படுத்த எங்களுக்கு உதவுங்கள்',
        name: 'பெயர்',
        email: 'மின்னஞ்சல்',
        category: 'வகை',
        rating: 'மதிப்பீடு',
        message: 'செய்தி',
        submit: 'கருத்து சமர்பிக்கவும்',
      },

      // Footer
      footer: {
        quickLinks: 'விரைவு இணைப்புகள்',
        resources: 'வளங்கள்',
        contact: 'தொடர்பு தகவல்',
      },

      // Stats
      stats: {
        activeUsers: 'செயலில் உள்ள பயனர்கள்',
        modulesCompleted: 'முடிக்கப்பட்ட பாடங்கள்',
        villages: 'சென்றடைந்த கிராமங்கள்',
        satisfaction: 'திருப்தி விகிதம்',
      },

      // Common
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'ஏதோ தவறு நடந்தது',
        retry: 'மீண்டும் முயற்சிக்கவும்',
        save: 'சேமிக்கவும்',
        cancel: 'ரத்துசெய்',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        view: 'காண்க',
        close: 'மூடு',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
