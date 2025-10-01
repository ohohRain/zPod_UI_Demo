document.addEventListener('DOMContentLoaded', () => {

    // Stop any lingering TTS from previous session/refresh
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log('Stopped lingering TTS from previous session');
    }

    // Reset play button state on page load
    setTimeout(() => {
        const playButton = document.querySelector('.audio-play-btn');
        if (playButton) {
            const icon = playButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                playButton.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
                console.log('Reset play button state on page load');
            }
        }
    }, 100); // Small delay to ensure DOM is fully loaded

    const screens = document.querySelectorAll('.app-screen');
    const navItems = document.querySelectorAll('.phone-navigation .nav-item');
    const settingsNavIcon = document.getElementById('settings-nav-icon');
    const profileNavIcon = document.getElementById('profile-nav-icon');
    const settingsBackButton = document.getElementById('settings-back-button');
    const profileBackButton = document.getElementById('profile-back-button');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsTabContents = document.querySelectorAll('.settings-tab-content');
    const sliders = document.querySelectorAll('.slider');
    const toggles = document.querySelectorAll('.modern-toggle-container');
    const viewMusicLibraryButton = document.querySelector('.view-details-button[data-navigate="music-screen"]');
    const scanButton = document.getElementById('scan-devices-button');
    const darkModeToggleProfile = document.querySelector('.profile-setting-item [data-control="dark-mode"]');
    const descriptionTitleElement = document.getElementById('description-title'); // Get description title element
    const descriptionTextElement = document.getElementById('description-text'); // Get description text element
    const sleepDetailsBackBtn = document.getElementById('sleep-details-back-btn');
    const metricDetailBackBtn = document.getElementById('metric-detail-back-btn');
    const whiteNoiseBackBtn = document.getElementById('white-noise-back-btn');
    const natureSoundsBackBtn = document.getElementById('nature-sounds-back-btn');
    const ambientNoiseBackBtn = document.getElementById('ambient-noise-back-btn');
    const mechanicalSoundsBackBtn = document.getElementById('mechanical-sounds-back-btn');
    const urbanAmbienceBackBtn = document.getElementById('urban-ambience-back-btn');
    const metricDetailTitle = document.getElementById('metric-detail-title');
    const clickableMetrics = document.querySelectorAll('.clickable-metric');
    const periodTabs = document.querySelectorAll('.period-tab');
    const dateNavArrows = document.querySelectorAll('.date-navigation .nav-arrow');

    let currentScreen = 'home-screen'; // Keep track of the current screen
    let selectedPeriod = 'day'; // Track selected time period in sleep details
    let currentDate = new Date(2024, 6, 2); // Initialize with July 2, 2024 (month is 0-based) - for sleep details navigation
    let homepageDate = new Date(2024, 6, 29); // July 29, 2024 - fixed date for homepage "today"
    // Sleep data with realistic distribution: 10% red (<60), 20% yellow (60-70), 70% green (>70)
    const sleepDataFromFile = {
        "2024-06-30": {
            "score": 85, "startTime": "23:00", "endTime": "07:20", "duration": "8h20m",
            "heartRate": 57, "interruptions": 3, "timeToSleep": 23, "timeToWake": 14, "movementScore": 84,
            "stages": { "awake": 9, "rem": 26, "light": 42, "deep": 23 }
        },
        "2024-07-01": {
            "score": 85, "startTime": "23:30", "endTime": "07:48", "duration": "8h18m",
            "heartRate": 59, "interruptions": 6, "timeToSleep": 42, "timeToWake": 28, "movementScore": 78,
            "stages": { "awake": 12, "rem": 24, "light": 43, "deep": 21 }
        },
        "2024-07-02": {
            "score": 82, "startTime": "23:15", "endTime": "07:25", "duration": "8h10m",
            "heartRate": 58, "interruptions": 4, "timeToSleep": 30, "timeToWake": 20, "movementScore": 79,
            "stages": { "awake": 11, "rem": 25, "light": 44, "deep": 20 }
        },
        "2024-07-03": {
            "score": 76, "startTime": "00:05", "endTime": "07:40", "duration": "7h35m",
            "heartRate": 62, "interruptions": 6, "timeToSleep": 45, "timeToWake": 30, "movementScore": 71,
            "stages": { "awake": 17, "rem": 21, "light": 45, "deep": 17 }
        },
        "2024-07-04": null,
        "2024-07-05": {
            "score": 87, "startTime": "22:45", "endTime": "06:55", "duration": "8h10m",
            "heartRate": 56, "interruptions": 2, "timeToSleep": 19, "timeToWake": 12, "movementScore": 86,
            "stages": { "awake": 8, "rem": 27, "light": 42, "deep": 23 }
        },
        "2024-07-06": {
            "score": 73, "startTime": "01:20", "endTime": "08:30", "duration": "7h10m",
            "heartRate": 64, "interruptions": 7, "timeToSleep": 50, "timeToWake": 35, "movementScore": 67,
            "stages": { "awake": 19, "rem": 19, "light": 46, "deep": 16 }
        },
        "2024-07-07": {
            "score": 81, "startTime": "23:00", "endTime": "07:10", "duration": "8h10m",
            "heartRate": 58, "interruptions": 3, "timeToSleep": 26, "timeToWake": 17, "movementScore": 80,
            "stages": { "awake": 11, "rem": 24, "light": 44, "deep": 21 }
        },
        "2024-07-08": {
            "score": 78, "startTime": "23:35", "endTime": "07:20", "duration": "7h45m",
            "heartRate": 60, "interruptions": 5, "timeToSleep": 38, "timeToWake": 24, "movementScore": 74,
            "stages": { "awake": 15, "rem": 22, "light": 44, "deep": 19 }
        },
        "2024-07-09": {
            "score": 90, "startTime": "22:50", "endTime": "07:00", "duration": "8h10m",
            "heartRate": 55, "interruptions": 1, "timeToSleep": 16, "timeToWake": 10, "movementScore": 91,
            "stages": { "awake": 6, "rem": 28, "light": 41, "deep": 25 }
        },
        "2024-07-10": {
            "score": 74, "startTime": "00:10", "endTime": "07:35", "duration": "7h25m",
            "heartRate": 63, "interruptions": 6, "timeToSleep": 47, "timeToWake": 31, "movementScore": 68,
            "stages": { "awake": 18, "rem": 20, "light": 45, "deep": 17 }
        },
        "2024-07-11": {
            "score": 67, "startTime": "01:45", "endTime": "08:10", "duration": "6h25m",
            "heartRate": 68, "interruptions": 12, "timeToSleep": 75, "timeToWake": 45, "movementScore": 58,
            "stages": { "awake": 30, "rem": 15, "light": 45, "deep": 10 }
        },
        "2024-07-12": {
            "score": 83, "startTime": "23:10", "endTime": "07:15", "duration": "8h05m",
            "heartRate": 57, "interruptions": 3, "timeToSleep": 24, "timeToWake": 15, "movementScore": 82,
            "stages": { "awake": 10, "rem": 25, "light": 43, "deep": 22 }
        },
        "2024-07-13": {
            "score": 65, "startTime": "01:30", "endTime": "08:40", "duration": "7h10m",
            "heartRate": 66, "interruptions": 9, "timeToSleep": 56, "timeToWake": 42, "movementScore": 61,
            "stages": { "awake": 23, "rem": 17, "light": 46, "deep": 14 }
        },
        "2024-07-14": {
            "score": 86, "startTime": "22:55", "endTime": "07:05", "duration": "8h10m",
            "heartRate": 56, "interruptions": 2, "timeToSleep": 18, "timeToWake": 11, "movementScore": 87,
            "stages": { "awake": 8, "rem": 26, "light": 42, "deep": 24 }
        },
        "2024-07-15": {
            "score": 79, "startTime": "23:25", "endTime": "07:10", "duration": "7h45m",
            "heartRate": 59, "interruptions": 4, "timeToSleep": 34, "timeToWake": 21, "movementScore": 75,
            "stages": { "awake": 14, "rem": 23, "light": 44, "deep": 19 }
        },
        "2024-07-16": {
            "score": 84, "startTime": "23:00", "endTime": "07:00", "duration": "8h00m",
            "heartRate": 57, "interruptions": 3, "timeToSleep": 22, "timeToWake": 14, "movementScore": 83,
            "stages": { "awake": 10, "rem": 25, "light": 43, "deep": 22 }
        },
        "2024-07-17": {
            "score": 52, "startTime": "02:30", "endTime": "09:15", "duration": "6h45m",
            "heartRate": 72, "interruptions": 15, "timeToSleep": 95, "timeToWake": 55, "movementScore": 45,
            "stages": { "awake": 35, "rem": 12, "light": 43, "deep": 10 }
        },
        "2024-07-18": {
            "score": 75, "startTime": "23:50", "endTime": "07:25", "duration": "7h35m",
            "heartRate": 61, "interruptions": 5, "timeToSleep": 43, "timeToWake": 27, "movementScore": 70,
            "stages": { "awake": 17, "rem": 21, "light": 45, "deep": 17 }
        },
        "2024-07-19": {
            "score": 88, "startTime": "22:40", "endTime": "06:50", "duration": "8h10m",
            "heartRate": 55, "interruptions": 2, "timeToSleep": 17, "timeToWake": 11, "movementScore": 89,
            "stages": { "awake": 7, "rem": 27, "light": 41, "deep": 25 }
        },
        "2024-07-20": {
            "score": 71, "startTime": "01:05", "endTime": "08:20", "duration": "7h15m",
            "heartRate": 65, "interruptions": 8, "timeToSleep": 53, "timeToWake": 36, "movementScore": 64,
            "stages": { "awake": 21, "rem": 18, "light": 46, "deep": 15 }
        },
        "2024-07-21": {
            "score": 85, "startTime": "23:05", "endTime": "07:15", "duration": "8h10m",
            "heartRate": 57, "interruptions": 3, "timeToSleep": 21, "timeToWake": 13, "movementScore": 85,
            "stages": { "awake": 9, "rem": 26, "light": 42, "deep": 23 }
        },
        "2024-07-22": {
            "score": 80, "startTime": "23:20", "endTime": "07:05", "duration": "7h45m",
            "heartRate": 59, "interruptions": 4, "timeToSleep": 31, "timeToWake": 19, "movementScore": 77,
            "stages": { "awake": 13, "rem": 23, "light": 44, "deep": 20 }
        },
        "2024-07-23": {
            "score": 63, "startTime": "01:20", "endTime": "07:50", "duration": "6h30m",
            "heartRate": 69, "interruptions": 10, "timeToSleep": 68, "timeToWake": 40, "movementScore": 55,
            "stages": { "awake": 25, "rem": 16, "light": 46, "deep": 13 }
        },
        "2024-07-24": {
            "score": 77, "startTime": "23:15", "endTime": "07:00", "duration": "7h45m",
            "heartRate": 60, "interruptions": 5, "timeToSleep": 35, "timeToWake": 22, "movementScore": 73,
            "stages": { "awake": 15, "rem": 22, "light": 44, "deep": 19 }
        },
        "2024-07-25": {
            "score": 91, "startTime": "22:30", "endTime": "06:45", "duration": "8h15m",
            "heartRate": 54, "interruptions": 1, "timeToSleep": 15, "timeToWake": 10, "movementScore": 92,
            "stages": { "awake": 5, "rem": 28, "light": 41, "deep": 26 }
        },
        "2024-07-26": {
            "score": 68, "startTime": "00:45", "endTime": "08:00", "duration": "7h15m",
            "heartRate": 67, "interruptions": 8, "timeToSleep": 62, "timeToWake": 38, "movementScore": 60,
            "stages": { "awake": 22, "rem": 18, "light": 45, "deep": 15 }
        },
        "2024-07-27": {
            "score": 86, "startTime": "22:50", "endTime": "06:50", "duration": "8h00m",
            "heartRate": 56, "interruptions": 2, "timeToSleep": 20, "timeToWake": 12, "movementScore": 87,
            "stages": { "awake": 8, "rem": 26, "light": 42, "deep": 24 }
        },
        "2024-07-28": {
            "score": 74, "startTime": "23:40", "endTime": "07:30", "duration": "7h50m",
            "heartRate": 62, "interruptions": 6, "timeToSleep": 40, "timeToWake": 25, "movementScore": 71,
            "stages": { "awake": 16, "rem": 21, "light": 45, "deep": 18 }
        },
        "2024-07-29": {
            "score": 58, "startTime": "23:30", "endTime": "06:45", "duration": "7h15m",
            "heartRate": 68, "interruptions": 3, "timeToSleep": 45, "timeToWake": 30, "movementScore": 52,
            "stages": { "awake": 18, "rem": 20, "light": 48, "deep": 14 }
        }
    };
    
    console.log('Sleep data loaded:', Object.keys(sleepDataFromFile).length, 'days');
    console.log('Homepage date (today):', getDateKey(homepageDate));
    console.log('Sleep details navigation date:', getDateKey(currentDate));
    console.log('Homepage data:', sleepDataFromFile[getDateKey(homepageDate)]);

    // Helper function to format date string
    function formatDateString(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
    }

    // Get date key for data lookup (YYYY-MM-DD format)
    function getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Functions for sleep period views
    function getDateDisplay(period) {
        if (period === 'day') {
            return formatDateString(currentDate);
        } else if (period === 'week') {
            // Get the week containing the current date (Sunday to Saturday)
            const weekStart = new Date(currentDate);
            const daysFromSunday = currentDate.getDay();
            weekStart.setDate(currentDate.getDate() - daysFromSunday);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${weekEnd.getFullYear()}`;
        } else {
            return `${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        }
    }

    function getAverageScore(period) {
        if (period === 'day') {
            const dateKey = getDateKey(currentDate);
            const dayData = sleepDataFromFile[dateKey];
            return dayData ? dayData.score : 0;
        } else if (period === 'week') {
            // Get the week containing the current date (Sunday to Saturday)
            const weekStart = new Date(currentDate);
            const daysFromSunday = currentDate.getDay();
            weekStart.setDate(currentDate.getDate() - daysFromSunday);
            
            let scores = [];
            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(weekStart);
                checkDate.setDate(weekStart.getDate() + i);
                const dateKey = getDateKey(checkDate);
                if (sleepDataFromFile[dateKey]) {
                    scores.push(sleepDataFromFile[dateKey].score);
                }
            }
            return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        } else {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            let scores = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const checkDate = new Date(year, month, day);
                const dateKey = getDateKey(checkDate);
                if (sleepDataFromFile[dateKey]) {
                    scores.push(sleepDataFromFile[dateKey].score);
                }
            }
            return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        }
    }

    function generateCalendarDays() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = firstDay.getDay();
        const today = new Date();
        
        const calendarDays = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            calendarDays.push(null);
        }
        
        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(year, month, day);
            const dateKey = getDateKey(checkDate);
            const dayData = sleepDataFromFile[dateKey];
            const isToday = checkDate.toDateString() === today.toDateString();
            
            calendarDays.push({
                date: day,
                fullDate: checkDate,
                score: dayData?.score || null,
                hasData: dayData !== null && dayData !== undefined,
                scoreColor: dayData ? getScoreColor(dayData.score) : '',
                isToday: isToday
            });
        }
        
        return calendarDays;
    }

    // Descriptions for each screen
    const screenDescriptions = {
        'home-screen': {
            title: 'Home Dashboard',
            text: 'Your central hub. Check the status of your OZI in the header bar, get a quick AI sleep analysis from the last night, view key sleep metrics like duration and quality, and discover recommended sleep music.'
        },
        'ai-chat-screen': {
            title: 'AI Bedtime Stories',
            text: 'Let AI create magical bedtime stories for your children. Request a personalized tale and listen to the narrated version to help your little ones drift off to sleep peacefully.'
        },
        'music-screen': {
            title: 'Sleep Music Library',
            text: 'Explore a curated library of relaxing sounds, music, podcasts, and bedtime stories designed to help you unwind and fall asleep faster. Check out recommendations and browse categories.'
        },
        'shop-screen': {
            title: 'OZI Market Place',
            text: 'Discover and purchase premium OZI products and accessories to enhance your sleep environment, including bedding, electronics, and lifestyle items. You can also track your orders here.'
        },
        'settings-screen': {
            title: 'Device Settings',
            text: 'Manage your connected OZI. Adjust controls like fan speed, speaker volume, light brightness, and color. You can also manage device connections, scan for new devices, and toggle settings like backlight and parent controls.'
        },
        'profile-screen': {
            title: 'User Profile',
            text: 'Manage your account information. Edit your profile details, change your password, configure notification and language preferences, toggle dark mode, access privacy settings, find help, and sign out.'
        },
        'sleep-details-screen': {
            title: 'Sleep Quality Details',
            text: 'Detailed analysis of your sleep quality. View your sleep stages throughout the night, quality score, and key metrics including heart rate, duration, interruptions, movement score, and sleep timing.'
        },
        'metric-detail-screen': {
            title: 'Metric Analysis',
            text: 'In-depth analysis of your selected sleep metric. View trends, patterns, and insights to better understand and improve your sleep quality.'
        },
        'white-noise-screen': {
            title: 'White Noise Collection',
            text: 'Explore our curated collection of soothing white noise and ambient sounds. Choose from nature sounds, mechanical noise, urban ambience, and pure white noise to help you relax and sleep better.'
        },
        'nature-sounds-screen': {
            title: 'Nature Sounds',
            text: 'Immerse yourself in the soothing sounds of nature. From gentle rainfall to ocean waves, these natural soundscapes help you relax and drift into peaceful sleep.'
        },
        'ambient-noise-screen': {
            title: 'Ambient Noise',
            text: 'Pure tones and ambient frequencies designed to mask distractions and promote deep focus or relaxation. Choose from white, pink, brown noise and more.'
        },
        'mechanical-sounds-screen': {
            title: 'Mechanical Sounds',
            text: 'Consistent mechanical sounds that many find soothing for sleep. From fan noise to air conditioners, these steady sounds create a calming environment.'
        },
        'urban-ambience-screen': {
            title: 'Urban Ambience',
            text: 'The gentle hum of city life and cozy indoor environments. Perfect for those who find comfort in the sounds of coffee shops, libraries, and urban landscapes.'
        }
    };

    function showScreen(screenId) {
        // Stop TTS if leaving AI chat screen
        if (currentScreen === 'ai-chat-screen' && screenId !== 'ai-chat-screen') {
            if ('speechSynthesis' in window && speechSynthesis.speaking) {
                speechSynthesis.cancel();
                console.log('Stopped TTS when leaving AI chat screen');

                // Reset play button state if it exists
                const playButton = document.querySelector('.audio-play-btn');
                if (playButton) {
                    const icon = playButton.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-pause');
                        icon.classList.add('fa-play');
                        playButton.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
                    }
                }
            }
        }

        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            currentScreen = screenId; // Update current screen tracker

            // Update bottom nav active state
            navItems.forEach(item => {
                item.classList.toggle('active', item.dataset.target === screenId);
            });
        } else {
            console.error("Screen not found:", screenId);
            // Optionally show a default screen like home
            showScreen('home-screen');
        }
        // Scroll to top of the new screen
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.scrollTop = 0;
        }

        // Update description panel
        const description = screenDescriptions[screenId];
        if (description && descriptionTitleElement && descriptionTextElement) {
            descriptionTitleElement.textContent = description.title;
            descriptionTextElement.textContent = description.text;
        } else {
            // Fallback if description not found
            descriptionTitleElement.textContent = screenId.replace('-', ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase()); // Format ID as title
            descriptionTextElement.textContent = 'Detailed description coming soon.';
            console.warn(`Description not found for screen: ${screenId}`);
        }

        // Always refresh homepage data when returning to home screen
        if (screenId === 'home-screen') {
            updateHomeSleepSummary();
        }

        // Update sleep details view when navigating to sleep details screen
        if (screenId === 'sleep-details-screen') {
            updateSleepDetailsView(selectedPeriod);
        }
    }

    // --- Navigation Event Listeners ---

    // Bottom Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetScreenId = item.dataset.target;
            if (targetScreenId) {
                showScreen(targetScreenId);
            }
        });
    });

    // Header Icons
    if (settingsNavIcon) {
        settingsNavIcon.addEventListener('click', () => showScreen('settings-screen'));
    }
    if (profileNavIcon) {
        profileNavIcon.addEventListener('click', () => showScreen('profile-screen'));
    }

    // Back Buttons
    if (settingsBackButton) {
        settingsBackButton.addEventListener('click', () => showScreen('home-screen')); // Go back to home from settings
    }
    if (profileBackButton) {
        profileBackButton.addEventListener('click', () => showScreen('home-screen')); // Go back to home from profile
    }
    if (sleepDetailsBackBtn) {
        sleepDetailsBackBtn.addEventListener('click', () => showScreen('home-screen')); // Go back to home from sleep details
    }
    if (whiteNoiseBackBtn) {
        whiteNoiseBackBtn.addEventListener('click', () => showScreen('music-screen')); // Go back to music screen from white noise
    }
    if (natureSoundsBackBtn) {
        natureSoundsBackBtn.addEventListener('click', () => showScreen('white-noise-screen')); // Go back to white noise screen
    }
    if (ambientNoiseBackBtn) {
        ambientNoiseBackBtn.addEventListener('click', () => showScreen('white-noise-screen')); // Go back to white noise screen
    }
    if (mechanicalSoundsBackBtn) {
        mechanicalSoundsBackBtn.addEventListener('click', () => showScreen('white-noise-screen')); // Go back to white noise screen
    }
    if (urbanAmbienceBackBtn) {
        urbanAmbienceBackBtn.addEventListener('click', () => showScreen('white-noise-screen')); // Go back to white noise screen
    }

    // Clickable Cards Navigation
    const clickableCards = document.querySelectorAll('.clickable-card');
    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetScreenId = card.dataset.navigate;
            if (targetScreenId) {
                // Special handling for sleep summary card - navigate to today's date (July 29)
                if (card.classList.contains('sleep-summary-card') && targetScreenId === 'sleep-details-screen') {
                    currentDate = new Date(homepageDate); // Set to today's date
                    selectedPeriod = 'day'; // Reset to day view
                    
                    // Ensure day tab is active
                    periodTabs.forEach(t => t.classList.remove('active'));
                    const dayTab = document.querySelector('.period-tab[data-period="day"]');
                    if (dayTab) dayTab.classList.add('active');
                }
                showScreen(targetScreenId);
            }
        });
    });

    // View Music Library Button on Home Screen
    if (viewMusicLibraryButton) {
        viewMusicLibraryButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior if any
            const targetScreenId = viewMusicLibraryButton.dataset.navigate;
            if (targetScreenId) {
                showScreen(targetScreenId);
            }
        });
    }


    // --- Settings Screen Specific Logic ---

    // Settings Tabs
    if (settingsTabs.length > 0) {
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Update tab active state
                settingsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show corresponding content
                settingsTabContents.forEach(content => {
                    content.classList.toggle('active', content.id === `settings-${targetTab}-content`);
                });
            });
        });
    }

    // Scan Button Animation (Example)
    if (scanButton) {
        scanButton.addEventListener('click', () => {
            if (scanButton.classList.contains('scanning')) return; // Prevent multiple clicks

            scanButton.classList.add('scanning');
            scanButton.querySelector('span').textContent = 'Scanning...';

            // Simulate scanning duration
            setTimeout(() => {
                scanButton.classList.remove('scanning');
                scanButton.querySelector('span').textContent = 'Scan for Devices';
                // Add logic here to potentially update the device list
            }, 3000); // 3 seconds scan
        });
    }

    // --- Control Sliders & Toggles ---

    // Update slider values and device metrics in header
    sliders.forEach(slider => {
        slider.addEventListener('input', function () {
            const valueSpan = this.parentElement.querySelector('.slider-value');
            if (valueSpan) {
                valueSpan.textContent = this.value;
            }
            // Update the metric in the header device card
            const metric = this.dataset.metric;
            if (metric) {
                // Update device card values (new design)
                const controlValueSpans = document.querySelectorAll(`.control-value[data-metric="${metric}"]`);
                controlValueSpans.forEach(span => {
                    span.textContent = this.value;
                });

                // Check if Sleep Autopilot is ON, if so, turn it OFF when user manually adjusts settings
                const autopilotToggle = document.querySelector('.modern-toggle-container[data-control="sleep-autopilot"]');
                if (autopilotToggle && autopilotToggle.classList.contains('on')) {
                    // Turn off autopilot
                    autopilotToggle.classList.remove('on');
                    autopilotToggle.classList.add('off');
                    const stateLabel = autopilotToggle.querySelector('.toggle-state');
                    if (stateLabel) {
                        stateLabel.textContent = 'OFF';
                    }
                }
                
                // Handle brightness changes to enable/disable color selection
                if (metric === 'brightness') {
                    const brightnessValue = parseInt(this.value);
                    const colorButtonsCard = document.querySelector('.color-buttons-card');
                    const colorButtons = document.querySelectorAll('.color-button');
                    
                    if (brightnessValue === 0) {
                        // Disable color selection when brightness is 0
                        if (colorButtonsCard) {
                            colorButtonsCard.classList.add('disabled');
                        }
                        colorButtons.forEach(button => {
                            button.disabled = true;
                            button.classList.add('disabled');
                        });
                    } else {
                        // Enable color selection when brightness is above 0
                        if (colorButtonsCard) {
                            colorButtonsCard.classList.remove('disabled');
                        }
                        colorButtons.forEach(button => {
                            button.disabled = false;
                            button.classList.remove('disabled');
                        });
                    }
                }
            }
        });
    });

    // Function to update slider values programmatically
    function updateSliderValue(metric, value) {
        // Update slider position and displayed value
        const slider = document.querySelector(`.slider[data-metric="${metric}"]`);
        if (slider) {
            slider.value = value;
            const valueSpan = slider.parentElement.querySelector('.slider-value');
            if (valueSpan) {
                valueSpan.textContent = value;
            }
        }

        // Update metrics in the device card (new design)
        const controlValueSpans = document.querySelectorAll(`.control-value[data-metric="${metric}"]`);
        controlValueSpans.forEach(span => {
            span.textContent = value;
        });
        
        // Handle brightness changes for color button state
        if (metric === 'brightness') {
            const brightnessValue = parseInt(value);
            const colorButtonsCard = document.querySelector('.color-buttons-card');
            const colorButtons = document.querySelectorAll('.color-button');
            
            if (brightnessValue === 0) {
                // Disable color selection when brightness is 0
                if (colorButtonsCard) {
                    colorButtonsCard.classList.add('disabled');
                }
                colorButtons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('disabled');
                });
            } else {
                // Enable color selection when brightness is above 0
                if (colorButtonsCard) {
                    colorButtonsCard.classList.remove('disabled');
                }
                colorButtons.forEach(button => {
                    button.disabled = false;
                    button.classList.remove('disabled');
                });
            }
        }
    }

    // Modern Toggles
    toggles.forEach(toggleContainer => {
        const sliderWrapper = toggleContainer.querySelector('.modern-toggle-slider-wrapper');
        const stateLabel = toggleContainer.querySelector('.toggle-state');

        if (sliderWrapper && stateLabel) {
            sliderWrapper.addEventListener('click', () => {
                const isOn = toggleContainer.classList.toggle('on');
                toggleContainer.classList.toggle('off', !isOn);
                stateLabel.textContent = isOn ? 'ON' : 'OFF';

                // Special handling for Dark Mode toggle in Profile
                if (toggleContainer.dataset.control === 'dark-mode') {
                    document.body.classList.toggle('dark-theme', isOn); // Example: toggle a class on body
                    // You might need more comprehensive theme switching logic here
                }

                // Sleep Autopilot feature - sets all controls to 5
                if (toggleContainer.dataset.control === 'sleep-autopilot') {
                    if (isOn) {
                        // When turning ON, set fan and volume to 5, but light to 2
                        updateSliderValue('fan', 5);
                        updateSliderValue('volume', 5);
                        updateSliderValue('brightness', 2);
                    }
                    // Note: we don't reset values when turning OFF - they stay at their last set values
                }
            });
        }
    });

    // Initialize Dark Mode Toggle based on current state (example)
    if (darkModeToggleProfile) {
        const isDarkModeInitially = document.body.classList.contains('dark-theme');
        darkModeToggleProfile.classList.toggle('on', isDarkModeInitially);
        darkModeToggleProfile.classList.toggle('off', !isDarkModeInitially);
        darkModeToggleProfile.querySelector('.toggle-state').textContent = isDarkModeInitially ? 'ON' : 'OFF';
    }

    // --- Color Button Selection ---
    // Handle light color button selection
    const lightColorButtons = document.querySelectorAll('.color-button');
    lightColorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all color buttons
            lightColorButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Get the selected color
            const selectedColor = this.getAttribute('data-color');
            
            // Optional: You can add logic here to communicate with the OZI device
            // about the selected color, or update other UI elements
            console.log('Selected light color:', selectedColor);
            
            // Turn off Sleep Autopilot if it's currently ON (similar to sliders)
            const autopilotToggle = document.querySelector('.modern-toggle-container[data-control="sleep-autopilot"]');
            if (autopilotToggle && autopilotToggle.classList.contains('on')) {
                autopilotToggle.classList.remove('on');
                autopilotToggle.classList.add('off');
                const stateLabel = autopilotToggle.querySelector('.toggle-state');
                if (stateLabel) {
                    stateLabel.textContent = 'OFF';
                }
            }
        });
    });

    // --- AI Chat code removed - replaced with interactive story feature below ---

    // TTS Variables
    let currentUtterance = null;
    let isPaused = false;

    // Function to extract story text from the AI message bubble with the story
    function getStoryText() {
        console.log('Getting story text...');
        // Find the message bubble that contains the audio player (the story message)
        const audioPlayer = document.querySelector('.story-audio-player');
        console.log('Audio player found:', audioPlayer);
        if (audioPlayer) {
            const storyMessageBubble = audioPlayer.closest('.message-bubble.ai');
            console.log('Story message bubble found:', storyMessageBubble);
            if (storyMessageBubble) {
                const paragraphs = storyMessageBubble.querySelectorAll('p');
                console.log('Paragraphs found:', paragraphs.length);
                let fullText = '';
                paragraphs.forEach(p => {
                    fullText += p.textContent.trim() + ' ';
                });
                console.log('Full story text:', fullText.substring(0, 100) + '...');
                return fullText.trim();
            }
        }
        return null;
    }

    // Function to clean text for better TTS
    function cleanTextForSpeech(text) {
        // Remove emojis and special characters that don't speak well
        return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
                  .replace(/🐉|🌟|📖|✨/g, '') // Remove specific emojis
                  .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                  .trim();
    }

    // Function to get the best available voice
    function getBestVoice() {
        const voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);

        // Prefer English voices, then female voices, then any voice
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        const femaleVoices = englishVoices.filter(voice =>
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('karen')
        );

        if (femaleVoices.length > 0) {
            console.log('Using female voice:', femaleVoices[0].name);
            return femaleVoices[0];
        } else if (englishVoices.length > 0) {
            console.log('Using English voice:', englishVoices[0].name);
            return englishVoices[0];
        } else if (voices.length > 0) {
            console.log('Using first available voice:', voices[0].name);
            return voices[0];
        }

        console.log('No voices available, using default');
        return null;
    }

    // Function to play the story using TTS
    function playStory(text, btn, icon) {
        console.log('Playing story with text length:', text.length);
        console.log('Speech synthesis available:', 'speechSynthesis' in window);

        if ('speechSynthesis' in window) {
            // Cancel any existing utterance before starting new one
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }

            // Clean the text for better speech
            const cleanedText = cleanTextForSpeech(text);
            console.log('Cleaned text:', cleanedText.substring(0, 100) + '...');

            // Function to create and speak utterance
            function createAndSpeak() {
                currentUtterance = new SpeechSynthesisUtterance(cleanedText);

                // Set voice and speech properties
                const bestVoice = getBestVoice();
                if (bestVoice) {
                    currentUtterance.voice = bestVoice;
                }

                // Optimize speech settings
                currentUtterance.rate = 0.9; // Slightly slower for bedtime story
                currentUtterance.pitch = 1.0;
                currentUtterance.volume = 1.0;

                console.log('Created utterance with voice:', currentUtterance.voice?.name || 'default');

                currentUtterance.onstart = () => {
                    console.log('Speech started');
                };

                currentUtterance.onend = () => {
                    console.log('Speech ended');
                    resetPlayButton(btn, icon);
                    isPaused = false;
                };

                currentUtterance.onerror = (event) => {
                    console.error('Speech error:', event.error);
                    resetPlayButton(btn, icon);
                    isPaused = false;
                };

                console.log('Starting speech...');
                speechSynthesis.speak(currentUtterance);

                // Update UI to pause state
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            }

            // Chrome needs voices to be loaded first
            if (speechSynthesis.getVoices().length === 0) {
                console.log('Waiting for voices to load...');
                speechSynthesis.addEventListener('voiceschanged', function() {
                    console.log('Voices loaded, creating utterance');
                    createAndSpeak();
                }, { once: true });

                // Fallback timeout in case voiceschanged doesn't fire
                setTimeout(() => {
                    if (speechSynthesis.getVoices().length === 0) {
                        console.log('Timeout waiting for voices, proceeding anyway');
                    }
                    createAndSpeak();
                }, 100);
            } else {
                createAndSpeak();
            }
        } else {
            console.error('Speech synthesis not supported');
        }
    }

    // Function to pause the story
    function pauseStory(btn, icon) {
        console.log('Pausing story');
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            isPaused = true;
            // Update UI to play state
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
        }
    }

    // Function to reset the play button
    function resetPlayButton(btn, icon) {
        console.log('Resetting play button');
        currentUtterance = null;
        // Update UI to play state
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
    }

    // Audio play button for story demo with static audio file
    let storyAudio = null;
    let isAudioPlaying = false;

    document.addEventListener('click', (e) => {
        if (e.target.closest('.audio-play-btn')) {
            console.log('Audio play button clicked');
            const btn = e.target.closest('.audio-play-btn');
            const icon = btn.querySelector('i');

            // Initialize audio element if not already created
            if (!storyAudio) {
                storyAudio = new Audio('assets/story-audio.mp3');

                storyAudio.addEventListener('ended', () => {
                    console.log('Audio playback ended');
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
                    isAudioPlaying = false;
                });

                storyAudio.addEventListener('error', (err) => {
                    console.error('Audio error:', err);
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
                    isAudioPlaying = false;
                });
            }

            if (icon.classList.contains('fa-play')) {
                // Play or resume
                console.log('Starting/resuming audio playback');
                storyAudio.play();
                isAudioPlaying = true;
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            } else {
                // Pause
                console.log('Pausing audio playback');
                storyAudio.pause();
                isAudioPlaying = false;
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                btn.style.background = 'linear-gradient(135deg, var(--secondary), var(--info))';
            }
        }
    });

    // ===== AI Story Interactive Chat =====
    const storyData = {
        title: "🐉 The Little Dragon Who Loved the Stars",
        paragraphs: [
            "Once upon a time, in a cozy mountain cave, lived a small purple dragon named Luna. Unlike other dragons who loved to roar and breathe fire, Luna had a special dream—she wanted to touch the stars that sparkled in the night sky.",
            "Every evening, Luna would climb to the highest peak and reach up with her tiny claws, but the stars remained far away. One night, a wise old owl flew by and whispered a secret: \"The stars aren't meant to be touched, dear Luna. They're meant to be friends who watch over you.\"",
            "Luna smiled and realized the stars had been her friends all along, twinkling just for her each night. From that day on, she never felt alone. She would curl up under the starry blanket and dream the most wonderful dreams, knowing her sparkling friends were always there.",
            "And just like Luna, you too have friends in the stars, watching over you as you sleep. Sweet dreams, little one. 🌟"
        ]
    };

    const validStoryRequest = "Tell me a dragon story!";
    let storyShown = false;

    // Typing animation function with cool effect
    async function typeText(element, text, speed = 15) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        await new Promise(resolve => setTimeout(resolve, 50));
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        let displayText = '';
        for (let i = 0; i < text.length; i++) {
            displayText += text[i];
            element.textContent = displayText;

            // Add cursor effect
            element.classList.add('typing-cursor');

            // Variable speed for more natural typing
            let charSpeed = speed;
            if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
                charSpeed = speed * 10; // Pause at sentence end
            } else if (text[i] === ',' || text[i] === ':') {
                charSpeed = speed * 5; // Pause at comma
            } else if (text[i] === ' ') {
                charSpeed = speed * 0.3; // Faster for spaces
            }

            await new Promise(resolve => setTimeout(resolve, charSpeed));
        }

        // Remove cursor effect when done
        element.classList.remove('typing-cursor');
    }

    // Send button handler
    const sendChatButton = document.getElementById('send-chat-button');
    const chatInput = document.getElementById('chat-input');
    const storyChatContainer = document.getElementById('story-chat-container');

    sendChatButton?.addEventListener('click', async () => {
        const userMessage = chatInput.value.trim();

        if (!userMessage || storyShown) return;

        // Disable input while processing
        chatInput.disabled = true;
        sendChatButton.disabled = true;

        // Add user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'chat-message user';
        userMsgDiv.innerHTML = `
            <div class="message-bubble user">
                <p>${userMessage}</p>
            </div>
        `;
        storyChatContainer.appendChild(userMsgDiv);

        // Scroll to bottom
        storyChatContainer.scrollTop = storyChatContainer.scrollHeight;

        // Clear input
        chatInput.value = '';

        // Wait a bit before AI responds
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if it's the valid story request
        if (userMessage === validStoryRequest) {
            // Show the dragon story with typing animation
            await showDragonStory();
        } else {
            // Show demo mode message
            await showDemoMessage();
        }

        storyShown = true;
    });

    // Enter key support
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !storyShown) {
            sendChatButton.click();
        }
    });

    async function showDragonStory() {
        // Create AI message container
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'chat-message ai';
        aiMsgDiv.innerHTML = `
            <div class="ai-avatar"><i class="fas fa-book-open"></i></div>
            <div class="message-bubble ai">
                <p class="story-title" style="font-weight: 600; color: var(--primary); margin-bottom: var(--spacing-s);"></p>
                <p class="story-p1"></p>
                <p class="story-p2"></p>
                <p class="story-p3"></p>
                <p class="story-p4" style="margin-top: var(--spacing-m); font-style: italic; color: var(--text-secondary);"></p>
            </div>
        `;
        storyChatContainer.appendChild(aiMsgDiv);
        storyChatContainer.scrollTop = storyChatContainer.scrollHeight;

        // Type out title
        const titleEl = aiMsgDiv.querySelector('.story-title');
        await typeText(titleEl, storyData.title, 20);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Type out each paragraph
        for (let i = 0; i < storyData.paragraphs.length; i++) {
            const pEl = aiMsgDiv.querySelector(`.story-p${i + 1}`);
            await typeText(pEl, storyData.paragraphs[i], 12);
            await new Promise(resolve => setTimeout(resolve, 200));
            storyChatContainer.scrollTop = storyChatContainer.scrollHeight;
        }

        // Add audio player after story is complete
        await new Promise(resolve => setTimeout(resolve, 300));
        const audioPlayerHTML = `
            <div class="story-audio-player" style="margin-top: var(--spacing-m); background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1)); padding: var(--spacing-m); border-radius: 15px; display: flex; align-items: center; gap: var(--spacing-m); opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
                <button class="audio-play-btn" style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--secondary), var(--info)); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); transition: all 0.3s ease;">
                    <i class="fas fa-play" style="color: white; font-size: 18px; margin-left: 3px;"></i>
                </button>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Listen to Story Audio</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">Narrated version • 3:45 min</div>
                </div>
                <div style="color: var(--secondary); font-size: 24px;">
                    <i class="fas fa-headphones"></i>
                </div>
            </div>
        `;

        const bubble = aiMsgDiv.querySelector('.message-bubble');
        bubble.insertAdjacentHTML('beforeend', audioPlayerHTML);

        // Animate in the audio player
        setTimeout(() => {
            const player = bubble.querySelector('.story-audio-player');
            player.style.opacity = '1';
            player.style.transform = 'translateY(0)';
        }, 100);

        storyChatContainer.scrollTop = storyChatContainer.scrollHeight;
    }

    async function showDemoMessage() {
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'chat-message ai';
        aiMsgDiv.innerHTML = `
            <div class="ai-avatar"><i class="fas fa-book-open"></i></div>
            <div class="message-bubble ai">
                <p class="demo-message"></p>
            </div>
        `;
        storyChatContainer.appendChild(aiMsgDiv);
        storyChatContainer.scrollTop = storyChatContainer.scrollHeight;

        const messageEl = aiMsgDiv.querySelector('.demo-message');
        const demoText = "This is a demo! Try asking: \"Tell me a dragon story!\" to see the interactive story feature. 🎭✨";
        await typeText(messageEl, demoText, 15);

        storyChatContainer.scrollTop = storyChatContainer.scrollHeight;
    }

    // ===== SLEEP COACH CHAT MODAL =====
    const coachModal = document.getElementById('coach-chat-modal');
    const askCoachBtn = document.getElementById('ask-coach-btn');
    const coachCloseBtn = document.getElementById('coach-chat-close');
    const coachSendBtn = document.getElementById('coach-send-button');
    const coachChatInput = document.getElementById('coach-chat-input');
    const coachMessagesContainer = document.getElementById('coach-chat-messages');

    // Hardcoded Q&A pairs for sleep coach
    const coachQA = [
        {
            question: "How can I improve my deep sleep?",
            answer: "Your deep sleep was only 14% last night, which is below the ideal 20-25%. I recommend establishing a relaxing bedtime routine, avoiding screens 1 hour before bed, and keeping your room temperature around 65-68°F. Try using the white noise features in the Music tab! 🌙"
        },
        {
            question: "Why did I wake up during the night?",
            answer: "I noticed 3 interruptions last night. This could be due to environmental factors like noise, light, or temperature. Try using white noise from the Music tab and ensure your room is completely dark. Your OZI device can help create an ideal sleep environment! 😴"
        },
        {
            question: "Is my sleep score good?",
            answer: "Your sleep score was 58/100 last night, which indicates there's room for improvement. You got 7h 15min of sleep and took 45 minutes to fall asleep. Focus on going to bed earlier and establishing a consistent sleep schedule to improve your score. You've got this! 💪"
        }
    ];

    let currentQAIndex = 0;
    let coachChatActive = false;

    // Open modal
    askCoachBtn?.addEventListener('click', () => {
        coachModal.classList.add('visible');
        coachChatActive = true;
        currentQAIndex = 0;

        // Reset to first question
        coachChatInput.value = coachQA[0].question;

        // Reset messages to just welcome message
        const welcomeMsg = coachMessagesContainer.querySelector('.coach-message.ai');
        coachMessagesContainer.innerHTML = '';
        coachMessagesContainer.appendChild(welcomeMsg);
    });

    // Close modal
    coachCloseBtn?.addEventListener('click', () => {
        coachModal.classList.remove('visible');
        coachChatActive = false;
    });

    // Close on outside click
    coachModal?.addEventListener('click', (e) => {
        if (e.target === coachModal) {
            coachModal.classList.remove('visible');
            coachChatActive = false;
        }
    });

    // Send message
    coachSendBtn?.addEventListener('click', async () => {
        if (!coachChatActive || currentQAIndex >= coachQA.length) return;

        const userMessage = coachChatInput.value.trim();
        if (!userMessage) return;

        // Disable input while processing
        coachChatInput.disabled = true;
        coachSendBtn.disabled = true;

        // Add user message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'coach-message user';
        userMsgDiv.innerHTML = `
            <div class="coach-user-avatar"><i class="fas fa-user"></i></div>
            <div class="coach-message-bubble user">
                <p>${userMessage}</p>
            </div>
        `;
        coachMessagesContainer.appendChild(userMsgDiv);
        coachMessagesContainer.scrollTop = coachMessagesContainer.scrollHeight;

        // Clear input
        coachChatInput.value = '';

        // Wait before AI responds
        await new Promise(resolve => setTimeout(resolve, 600));

        // Add AI response
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'coach-message ai';
        aiMsgDiv.innerHTML = `
            <div class="coach-ai-avatar"><i class="fas fa-user-md"></i></div>
            <div class="coach-message-bubble ai">
                <p class="coach-response"></p>
            </div>
        `;
        coachMessagesContainer.appendChild(aiMsgDiv);
        coachMessagesContainer.scrollTop = coachMessagesContainer.scrollHeight;

        // Type out the response
        const responseEl = aiMsgDiv.querySelector('.coach-response');
        await typeText(responseEl, coachQA[currentQAIndex].answer, 15);

        coachMessagesContainer.scrollTop = coachMessagesContainer.scrollHeight;

        // Move to next question
        currentQAIndex++;

        // Set next question or disable if done
        if (currentQAIndex < coachQA.length) {
            coachChatInput.value = coachQA[currentQAIndex].question;
            coachChatInput.disabled = false;
            coachSendBtn.disabled = false;
        } else {
            coachChatInput.value = '';
            coachChatInput.placeholder = 'No more questions available in demo';
        }
    });

    // Enter key to send
    coachChatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && coachChatActive && currentQAIndex < coachQA.length) {
            coachSendBtn.click();
        }
    });

    // Update home screen sleep summary with homepage date data (always July 29, 2024)
    function updateHomeSleepSummary() {
        const dateKey = getDateKey(homepageDate);
        const dayData = sleepDataFromFile[dateKey];
        const homeDateElement = document.querySelector('.sleep-summary-card .date-text');
        const homeScoreElement = document.querySelector('.sleep-summary-card .score-number');
        const homeScoreFill = document.querySelector('.sleep-summary-card .score-fill');
        const homeScoreRating = document.querySelector('.sleep-summary-card .score-rating');
        
        if (homeDateElement) {
            homeDateElement.textContent = formatDateString(homepageDate);
        }
        
        if (dayData) {
            if (homeScoreElement) homeScoreElement.textContent = `${dayData.score}/100`;
            if (homeScoreFill) {
                homeScoreFill.style.width = `${dayData.score}%`;
                homeScoreFill.className = `score-fill ${getScoreColor(dayData.score)}`;
            }
            if (homeScoreRating) {
                if (dayData.score >= 85) {
                    homeScoreRating.textContent = 'Very Good';
                    homeScoreRating.className = 'score-rating excellent';
                } else if (dayData.score >= 70) {
                    homeScoreRating.textContent = 'Good';
                    homeScoreRating.className = 'score-rating good';
                } else if (dayData.score >= 60) {
                    homeScoreRating.textContent = 'Fair';
                    homeScoreRating.className = 'score-rating fair';
                } else {
                    homeScoreRating.textContent = 'Poor';
                    homeScoreRating.className = 'score-rating poor';
                }
            }
            
            // Update metrics
            const heartRateElement = document.querySelector('.metric-item .metric-value:first-child');
            const durationElement = document.querySelector('.metric-item:nth-child(2) .metric-value');
            const interruptionsElement = document.querySelector('.metric-item:nth-child(3) .metric-value');
            const timeToSleepElement = document.querySelector('.metric-item:nth-child(4) .metric-value');
            
            if (heartRateElement && heartRateElement.parentElement.parentElement.querySelector('.metric-label').textContent === 'Heart Rate') {
                heartRateElement.textContent = dayData.heartRate;
            }
            if (durationElement && durationElement.parentElement.parentElement.querySelector('.metric-label').textContent === 'Sleep Duration') {
                durationElement.textContent = dayData.duration.replace('m', '');
            }
            if (interruptionsElement && interruptionsElement.parentElement.parentElement.querySelector('.metric-label').textContent === 'Interruptions') {
                interruptionsElement.textContent = dayData.interruptions;
            }
            if (timeToSleepElement && timeToSleepElement.parentElement.parentElement.querySelector('.metric-label').textContent === 'Time to Sleep') {
                timeToSleepElement.textContent = dayData.timeToSleep;
            }
        }
    }

    // --- Sleep Period Tab Handlers ---
    function updateSleepDetailsView(period) {
        selectedPeriod = period;
        
        // Update date display
        const currentDateElement = document.querySelector('.current-date');
        if (currentDateElement) {
            currentDateElement.textContent = getDateDisplay(period);
        }

        // Hide/show content based on period
        const sleepStageGraph = document.querySelector('.sleep-stage-graph');
        const sleepQualityScore = document.querySelector('.sleep-quality-score');
        const detailedMetricsGrid = document.querySelector('.detailed-metrics-grid');
        const sleepCoachSection = document.querySelector('.sleep-coach-section');
        
        if (sleepStageGraph) {
            sleepStageGraph.style.display = period === 'day' ? 'block' : 'none';
        }

        // Show sleep coach for any date with sleep data in day view
        if (sleepCoachSection) {
            const dateKey = getDateKey(currentDate);
            const dayData = sleepDataFromFile[dateKey];
            sleepCoachSection.style.display = (period === 'day' && dayData) ? 'block' : 'none';
            
            // Update sleep coach content if data exists
            if (dayData && period === 'day') {
                updateSleepCoachContent(dayData);
            }
        }

        if (period === 'day') {
            const dateKey = getDateKey(currentDate);
            const dayData = sleepDataFromFile[dateKey];
            
            if (!dayData) {
                // Show no data message
                if (sleepStageGraph) {
                    sleepStageGraph.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                            <i class="fas fa-moon" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px;"></i>
                            <p style="font-size: 18px; font-weight: 500;">No sleep data available</p>
                            <p style="font-size: 14px; margin-top: 8px;">Sleep data for ${formatDateString(currentDate)} is not recorded</p>
                        </div>
                    `;
                }
                if (detailedMetricsGrid) {
                    detailedMetricsGrid.style.display = 'none';
                }
                if (sleepQualityScore) {
                    sleepQualityScore.style.display = 'none';
                }
            } else {
                // Restore the sleep stage graph if it was replaced with "no data" message
                if (sleepStageGraph && !sleepStageGraph.querySelector('.graph-timeline')) {
                    // Re-create the original graph structure instead of reloading the page
                    sleepStageGraph.innerHTML = `
                        <div class="graph-timeline">
                            <span class="time-label start">11:30 PM</span>
                            <span class="duration-label">8h 18m</span>
                            <span class="time-label end">7:48 AM</span>
                        </div>
                        <div class="graph-container">
                            <!-- Sleep histogram showing progression through the night -->
                            <div class="sleep-histogram">
                                <!-- Sleep stage bars will be updated with actual data -->
                                <div class="time-segment" data-stage="awake" style="height: 100%;" title="11:30 PM - 12:00 AM: Falling asleep"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="12:00 AM - 12:30 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="deep" style="height: 25%;" title="12:30 AM - 1:00 AM: Deep sleep"></div>
                                <div class="time-segment" data-stage="deep" style="height: 25%;" title="1:00 AM - 1:30 AM: Deep sleep peak"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="1:30 AM - 2:00 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="rem" style="height: 50%;" title="2:00 AM - 2:30 AM: REM sleep"></div>
                                <div class="time-segment" data-stage="awake" style="height: 100%;" title="2:30 AM - 3:00 AM: Brief awakening"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="3:00 AM - 3:30 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="deep" style="height: 25%;" title="3:30 AM - 4:00 AM: Deep sleep"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="4:00 AM - 4:30 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="rem" style="height: 50%;" title="4:30 AM - 5:00 AM: REM sleep"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="5:00 AM - 5:30 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="rem" style="height: 50%;" title="5:30 AM - 6:00 AM: REM sleep"></div>
                                <div class="time-segment" data-stage="light" style="height: 75%;" title="6:00 AM - 6:30 AM: Light sleep"></div>
                                <div class="time-segment" data-stage="rem" style="height: 50%;" title="6:30 AM - 7:00 AM: REM sleep"></div>
                                <div class="time-segment" data-stage="awake" style="height: 100%;" title="7:00 AM - 7:48 AM: Waking up"></div>
                            </div>
                        </div>
                        <div class="graph-legend">
                            <div class="legend-item">
                                <div class="legend-color awake"></div>
                                <span>Awake</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color rem"></div>
                                <span>REM</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color light"></div>
                                <span>Light</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color deep"></div>
                                <span>Deep</span>
                            </div>
                        </div>
                    `;
                }
                
                // Update quality score for day view
                if (sleepQualityScore) {
                    sleepQualityScore.style.display = 'block';
                    
                    const scoreLabel = sleepQualityScore.querySelector('.score-label');
                    const scoreRating = sleepQualityScore.querySelector('.score-rating');
                    const scoreFill = sleepQualityScore.querySelector('.score-fill');
                    const scoreNumber = sleepQualityScore.querySelector('.score-number');
                    
                    if (scoreLabel) scoreLabel.textContent = 'Sleep Quality Score';
                    if (scoreRating) {
                        if (dayData.score >= 85) {
                            scoreRating.textContent = 'Very Good';
                            scoreRating.className = 'score-rating excellent';
                        } else if (dayData.score >= 70) {
                            scoreRating.textContent = 'Good';
                            scoreRating.className = 'score-rating good';
                        } else if (dayData.score >= 60) {
                            scoreRating.textContent = 'Fair';
                            scoreRating.className = 'score-rating fair';
                        } else {
                            scoreRating.textContent = 'Poor';
                            scoreRating.className = 'score-rating poor';
                        }
                    }
                    if (scoreFill) {
                        scoreFill.style.width = `${dayData.score}%`;
                        scoreFill.className = `score-fill ${getScoreColor(dayData.score)}`;
                    }
                    if (scoreNumber) scoreNumber.textContent = `${dayData.score}/100`;
                }
                
                // Update detailed metrics
                if (detailedMetricsGrid) {
                    detailedMetricsGrid.style.display = 'grid';
                    
                    // Update each metric card
                    const metricCards = detailedMetricsGrid.querySelectorAll('.metric-card');
                    metricCards.forEach(card => {
                        const metricType = card.getAttribute('data-metric');
                        const valueElement = card.querySelector('.metric-value-large');
                        
                        if (valueElement) {
                            switch(metricType) {
                                case 'heart-rate':
                                    valueElement.textContent = `${dayData.heartRate} bpm`;
                                    break;
                                case 'sleep-duration':
                                    valueElement.textContent = dayData.duration.replace('m', '');
                                    break;
                                case 'interruptions':
                                    valueElement.textContent = `${dayData.interruptions} times`;
                                    break;
                                case 'movement-score':
                                    valueElement.textContent = `${dayData.movementScore}/100`;
                                    break;
                                case 'time-to-sleep':
                                    valueElement.textContent = `${dayData.timeToSleep} min`;
                                    break;
                                case 'time-to-wake':
                                    valueElement.textContent = `${dayData.timeToWake} min`;
                                    break;
                            }
                        }
                    });
                }
                
                // Update sleep stage graph times
                const graphTimeline = document.querySelector('.graph-timeline');
                if (graphTimeline && dayData.startTime && dayData.endTime) {
                    const startLabel = graphTimeline.querySelector('.time-label.start');
                    const endLabel = graphTimeline.querySelector('.time-label.end');
                    const durationLabel = graphTimeline.querySelector('.duration-label');
                    
                    if (startLabel) startLabel.textContent = dayData.startTime;
                    if (endLabel) endLabel.textContent = dayData.endTime;
                    if (durationLabel) durationLabel.textContent = dayData.duration;
                }
            }
        } else {
            // Update for week/month view
            if (sleepQualityScore) {
                sleepQualityScore.style.display = 'block';
                const avgScore = getAverageScore(period);
                
                const scoreLabel = sleepQualityScore.querySelector('.score-label');
                const scoreRating = sleepQualityScore.querySelector('.score-rating');
                const scoreFill = sleepQualityScore.querySelector('.score-fill');
                const scoreNumber = sleepQualityScore.querySelector('.score-number');
                
                if (scoreLabel) scoreLabel.textContent = 'Average score';
                if (scoreRating) {
                    if (avgScore >= 85) {
                        scoreRating.textContent = 'Very Good';
                        scoreRating.className = 'score-rating excellent';
                    } else if (avgScore >= 70) {
                        scoreRating.textContent = 'Good';
                        scoreRating.className = 'score-rating good';
                    } else if (avgScore >= 60) {
                        scoreRating.textContent = 'Fair';
                        scoreRating.className = 'score-rating fair';
                    } else if (avgScore > 0) {
                        scoreRating.textContent = 'Poor';
                        scoreRating.className = 'score-rating poor';
                    } else {
                        scoreRating.textContent = 'No Data';
                        scoreRating.className = 'score-rating';
                    }
                }
                if (scoreFill) {
                    scoreFill.style.width = `${avgScore}%`;
                    if (avgScore > 0) {
                        scoreFill.className = `score-fill ${getScoreColor(avgScore)}`;
                    }
                }
                if (scoreNumber) scoreNumber.textContent = avgScore > 0 ? avgScore : '--';
            }
        }

        // Remove existing week/month views
        const existingWeekView = document.querySelector('.week-view');
        const existingMonthView = document.querySelector('.month-view');
        if (existingWeekView) existingWeekView.remove();
        if (existingMonthView) existingMonthView.remove();

        // Add week or month view
        if (period === 'week') {
            createWeekView();
        } else if (period === 'month') {
            createMonthView();
        }

        // Hide detailed metrics grid for week and month views (already handled above)
        if (detailedMetricsGrid && period !== 'day') {
            detailedMetricsGrid.style.display = 'none';
        }
    }

    function createWeekView() {
        const sleepDetailsContainer = document.querySelector('.sleep-details-container');
        const detailedMetricsGrid = document.querySelector('.detailed-metrics-grid');
        
        if (sleepDetailsContainer && detailedMetricsGrid) {
            // Get the week containing the current date (Sunday to Saturday)
            const weekStart = new Date(currentDate);
            const daysFromSunday = currentDate.getDay();
            weekStart.setDate(currentDate.getDate() - daysFromSunday);
            
            const weekDays = [];
            const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            
            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(weekStart);
                checkDate.setDate(weekStart.getDate() + i);
                const dateKey = getDateKey(checkDate);
                const dayData = sleepDataFromFile[dateKey];
                
                console.log(`Week day ${i}: ${dateKey}, hasData: ${dayData ? 'yes' : 'no'}, score: ${dayData?.score || 'none'}`);
                
                weekDays.push({
                    day: dayLabels[i],
                    date: `${checkDate.getMonth() + 1}/${String(checkDate.getDate()).padStart(2, '0')}`,
                    fullDate: new Date(checkDate),
                    score: dayData?.score || null,
                    hasData: dayData !== null && dayData !== undefined,
                    scoreColor: dayData ? getScoreColor(dayData.score) : ''
                });
            }
            
            const weekViewHTML = `
                <div class="week-view">
                    <div class="week-view-header">
                        <div>
                            <div class="week-view-title">Weekly Sleep Scores</div>
                            <div class="week-view-subtitle">${getDateDisplay('week')}</div>
                        </div>
                    </div>
                    <div class="week-days-container">
                        ${weekDays.map((dayData) => `
                            <div class="week-day-item clickable-day" data-date="${dayData.fullDate.toISOString()}">
                                <div class="day-label">${dayData.day}</div>
                                <div class="score-circle ${dayData.hasData ? `has-data ${dayData.scoreColor}` : 'no-data'}">
                                    ${dayData.hasData ? dayData.score : ''}
                                </div>
                                <div class="day-date">${dayData.date}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            detailedMetricsGrid.insertAdjacentHTML('beforebegin', weekViewHTML);
            
            // Add click handlers for week days
            document.querySelectorAll('.week-day-item.clickable-day').forEach(item => {
                item.addEventListener('click', () => {
                    const dateStr = item.getAttribute('data-date');
                    currentDate = new Date(dateStr);
                    
                    // Switch to day view
                    periodTabs.forEach(t => t.classList.remove('active'));
                    document.querySelector('.period-tab[data-period="day"]').classList.add('active');
                    
                    updateSleepDetailsView('day');
                });
            });
        }
    }

    function createMonthView() {
        const sleepDetailsContainer = document.querySelector('.sleep-details-container');
        const detailedMetricsGrid = document.querySelector('.detailed-metrics-grid');
        
        if (sleepDetailsContainer && detailedMetricsGrid) {
            const calendarDays = generateCalendarDays();
            const monthViewHTML = `
                <div class="month-view">
                    <div class="calendar-header">
                        <div class="calendar-day-header">Sun</div>
                        <div class="calendar-day-header">Mon</div>
                        <div class="calendar-day-header">Tue</div>
                        <div class="calendar-day-header">Wed</div>
                        <div class="calendar-day-header">Thu</div>
                        <div class="calendar-day-header">Fri</div>
                        <div class="calendar-day-header">Sat</div>
                    </div>
                    <div class="month-calendar">
                        ${calendarDays.map(dayData => `
                            <div class="calendar-day">
                                ${dayData ? `
                                    <div class="calendar-date ${dayData.isToday ? 'today' : ''} ${dayData.hasData ? `has-data clickable-day ${dayData.scoreColor}` : 'no-data clickable-day'}" 
                                         ${dayData.fullDate ? `data-date="${dayData.fullDate.toISOString()}"` : ''}>
                                        <span class="date-number">${dayData.date}</span>
                                    </div>
                                ` : '<div class="calendar-empty"></div>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            detailedMetricsGrid.insertAdjacentHTML('beforebegin', monthViewHTML);
            
            // Add click handlers for calendar days
            document.querySelectorAll('.calendar-date.clickable-day').forEach(item => {
                item.addEventListener('click', () => {
                    const dateStr = item.getAttribute('data-date');
                    if (dateStr) {
                        currentDate = new Date(dateStr);
                        
                        // Switch to day view
                        periodTabs.forEach(t => t.classList.remove('active'));
                        document.querySelector('.period-tab[data-period="day"]').classList.add('active');
                        
                        updateSleepDetailsView('day');
                    }
                });
            });
        }
    }

    // Period tab event listeners
    periodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const period = tab.getAttribute('data-period');
            
            // Update active tab
            periodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update view
            updateSleepDetailsView(period);
        });
    });

    // Date navigation arrow handlers
    dateNavArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const isLeft = arrow.classList.contains('left');
            const activeTab = document.querySelector('.period-tab.active');
            const period = activeTab ? activeTab.getAttribute('data-period') : 'day';
            
            // Define reasonable boundary dates (allow navigation beyond data range)
            const earliestDate = new Date(2024, 0, 1);  // January 1, 2024 - reasonable past limit
            const latestDate = new Date(2024, 11, 31);  // December 31, 2024 - reasonable future limit
            
            if (period === 'day') {
                // Calculate new date
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + (isLeft ? -1 : 1));
                
                // Only block navigation if it goes beyond reasonable calendar limits
                if (newDate >= earliestDate && newDate <= latestDate) {
                    currentDate = newDate;
                } else {
                    // Don't navigate if it would go beyond reasonable calendar limits
                    console.log(`Navigation blocked: ${getDateKey(newDate)} is outside reasonable calendar range`);
                    return;
                }
            } else if (period === 'week') {
                // Navigate by week (move 7 days)
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + (isLeft ? -7 : 7));
                
                // Check reasonable calendar limits
                if (newDate >= earliestDate && newDate <= latestDate) {
                    currentDate = newDate;
                } else {
                    console.log(`Week navigation blocked: outside reasonable calendar range`);
                    return;
                }
            } else {
                // Navigate by month
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + (isLeft ? -1 : 1));
                
                // Check reasonable calendar limits
                if (newDate >= earliestDate && newDate <= latestDate) {
                    currentDate = newDate;
                } else {
                    console.log(`Month navigation blocked: outside reasonable calendar range`);
                    return;
                }
            }
            
            console.log(`Navigated to: ${getDateKey(currentDate)}, Period: ${period}`);
            updateSleepDetailsView(period);
        });
    });

    // --- Metric Card Click Handlers ---
    clickableMetrics.forEach(metric => {
        metric.addEventListener('click', () => {
            const metricType = metric.getAttribute('data-metric');
            const metricLabel = metric.querySelector('.metric-label').textContent;

            // Store the current screen as previous before navigating

            // Update the metric detail screen title
            if (metricDetailTitle) {
                metricDetailTitle.textContent = metricLabel.toUpperCase();
            }

            // Navigate to metric detail screen
            showScreen('metric-detail-screen');

            // You can add specific content for each metric type here later
            console.log(`Navigating to detail for: ${metricType}`);
        });
    });

    // --- Metric Detail Back Button ---
    if (metricDetailBackBtn) {
        metricDetailBackBtn.addEventListener('click', () => {
            // Go back to sleep details screen
            showScreen('sleep-details-screen');
        });
    }

    // --- Color Button Functionality ---
    const colorButtons = document.querySelectorAll('.color-button');
    
    if (colorButtons.length > 0) {
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons
                colorButtons.forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                this.classList.add('selected');
                
                // Get the selected color
                const selectedColor = this.dataset.color;
                
                // You can add additional functionality here to apply the color
                console.log('Selected color:', selectedColor);
                
                // Optional: Store the selected color in localStorage
                localStorage.setItem('selectedLightColor', selectedColor);
            });
        });
        
        // Initialize with saved color if exists
        const savedColor = localStorage.getItem('selectedLightColor');
        if (savedColor) {
            const savedButton = document.querySelector(`.color-button[data-color="${savedColor}"]`);
            if (savedButton) {
                colorButtons.forEach(btn => {
                    btn.classList.remove('selected');
                });
                savedButton.classList.add('selected');
            }
        }
    }

    // --- Sleep Coach Toggle Handler ---
    function initializeSleepCoach() {
        const toggleBtn = document.querySelector('.coach-toggle-btn');
        const coachDetails = document.querySelector('.coach-details');
        const coachHeader = document.querySelector('.coach-header');
        
        if (coachHeader && coachDetails) {
            coachHeader.addEventListener('click', function(e) {
                e.preventDefault();
                const isExpanded = toggleBtn.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    toggleBtn.classList.remove('expanded');
                    coachDetails.style.display = 'none';
                } else {
                    // Expand
                    toggleBtn.classList.add('expanded');
                    coachDetails.style.display = 'block';
                }
            });
        }
    }

    // --- Initial State ---
    showScreen(currentScreen); // Show the initial screen ('home-screen')
    updateHomeSleepSummary(); // Update home screen with today's date (July 29, 2024)
    initializeSleepCoach(); // Initialize sleep coach toggle
    
    // Initialize OZI card values to match slider defaults
    sliders.forEach(slider => {
        const metric = slider.dataset.metric;
        const value = slider.value;
        if (metric) {
            // Update device card values to match slider values on page load
            const controlValueSpans = document.querySelectorAll(`.control-value[data-metric="${metric}"]`);
            controlValueSpans.forEach(span => {
                span.textContent = value;
            });
            // Update slider value display
            const valueSpan = slider.parentElement.querySelector('.slider-value');
            if (valueSpan) {
                valueSpan.textContent = value;
            }
            
            // Check initial brightness value to set color buttons state
            if (metric === 'brightness') {
                const brightnessValue = parseInt(value);
                const colorButtonsCard = document.querySelector('.color-buttons-card');
                const colorButtons = document.querySelectorAll('.color-button');
                
                if (brightnessValue === 0) {
                    // Disable color selection on page load if brightness is 0
                    if (colorButtonsCard) {
                        colorButtonsCard.classList.add('disabled');
                    }
                    colorButtons.forEach(button => {
                        button.disabled = true;
                        button.classList.add('disabled');
                    });
                }
            }
        }
    });
    
    // Helper function to get score color class
    function getScoreColor(score) {
        if (score < 60) return 'score-red';
        if (score < 70) return 'score-yellow';
        return 'score-green';
    }

    // Generate personalized sleep coach suggestions based on metrics
    function generateSleepCoachSuggestions(dayData) {
        if (!dayData) return null;

        const suggestions = [];
        
        // Calculate sleep efficiency (approximation based on interruptions and times)
        const efficiency = 100 - (dayData.interruptions * 2) - (dayData.timeToSleep > 30 ? 5 : 0) - (dayData.timeToWake > 20 ? 3 : 0);
        
        // Create detailed sleep analysis summary first
        const sleepAnalysis = generateDetailedSleepAnalysis(dayData, efficiency);
        suggestions.push({
            title: 'Detailed Sleep Analysis',
            content: sleepAnalysis,
            isAnalysis: true
        });

        // Consolidated Suggestions Section
        const allTips = [];

        // Top 3: OZI Device-specific recommendations
        const oziTips = [];

        if (dayData.timeToSleep > 60) {
            oziTips.push('🎵 Play "Ocean Waves" or "Rain on Window" white noise to help you fall asleep faster');
        } else if (dayData.interruptions >= 10) {
            oziTips.push('🔊 Set OZI speaker volume at 5-7 with continuous white noise all night');
        } else if (dayData.stages && dayData.stages.deep < 15) {
            oziTips.push('🎵 Try "Brown Noise" or "Pink Noise" from OZI for deeper sleep stages');
        }

        if (dayData.heartRate > 70) {
            oziTips.push('💡 Use soft blue or light purple light on OZI for calming effect');
        } else if (dayData.timeToSleep > 60) {
            oziTips.push('💡 Set OZI light to warm orange or red color (promotes melatonin production)');
        } else if (dayData.stages && dayData.stages.deep < 15) {
            oziTips.push('💡 Dim OZI light to level 2-3 with deep purple color for relaxation');
        }

        if (dayData.interruptions >= 10) {
            oziTips.push('🌬️ Set OZI fan to consistent speed 6-8 to mask environmental noise');
        } else if (dayData.heartRate > 70) {
            oziTips.push('🌬️ Set fan to medium speed (4-6) to maintain cool, comfortable temperature');
        } else if (dayData.timeToSleep > 60) {
            oziTips.push('🌬️ Increase fan speed to 7-9 for better air circulation and cooling');
        }

        // Add top 3 OZI tips
        allTips.push(...oziTips.slice(0, 3));

        // General sleep hygiene tips (rest of recommendations)
        if (dayData.timeToSleep > 20) {
            allTips.push('Create a 60-90 minute wind-down routine before bed');
            allTips.push('Try the "4-7-8" breathing technique when you get in bed');
            allTips.push('Keep bedroom temperature between 60-67°F (15.5-19.5°C)');
        }

        if (dayData.stages && dayData.stages.deep < 25) {
            allTips.push('Exercise regularly but complete workouts 3+ hours before bedtime');
            allTips.push('Try pink or brown noise for deeper sleep');
            allTips.push('Ensure complete darkness with blackout curtains or eye mask');
        }

        if (dayData.stages && dayData.stages.rem < 23) {
            allTips.push('Maintain consistent sleep schedule for optimal REM cycles');
            allTips.push('Avoid alcohol completely - it severely reduces REM sleep');
            allTips.push('Get 7.5-9 hours total sleep for adequate REM time');
        }

        if (dayData.interruptions >= 3) {
            allTips.push('Use continuous background noise (fan or white noise machine)');
            allTips.push('Stop fluid intake 2-3 hours before bedtime');
            allTips.push('Evaluate mattress comfort and support');
        }

        if (dayData.heartRate > 55) {
            allTips.push('Practice 10-minute meditation or deep breathing before bed');
            allTips.push('Avoid large meals and spicy foods 3+ hours before sleep');
            allTips.push('Check bedroom temperature - overheating raises heart rate');
        }

        if (dayData.movementScore && dayData.movementScore < 85) {
            allTips.push('Try a body pillow or knee pillow for better alignment');
            allTips.push('Practice gentle stretching 1-2 hours before bed');
        }

        // Add general optimization tips
        allTips.push('Get bright light exposure within first hour of waking');
        allTips.push('Avoid screens 1-2 hours before bedtime');
        allTips.push('Set phone to "Do Not Disturb" mode at 9:30 PM');

        if (efficiency < 85) {
            allTips.push('No caffeine after 2 PM today');
        }

        // Limit to most relevant suggestions (8-10 tips)
        suggestions.push({
            title: 'Personalized Sleep Recommendations',
            tips: allTips.slice(0, 10),
            isCategory: true
        });

        return suggestions;
    }

    // Generate detailed sleep analysis for comprehensive insights
    function generateDetailedSleepAnalysis(dayData, efficiency) {
        if (!dayData) return 'No sleep data available for analysis.';
        
        let analysis = '';
        
        // Overall assessment
        const scoreCategory = dayData.score >= 85 ? 'excellent' : dayData.score >= 70 ? 'good' : dayData.score >= 60 ? 'fair' : 'poor';
        analysis += `<div class="analysis-section"><strong>Overall Assessment:</strong> Your sleep quality scored ${dayData.score}/100, which is ${scoreCategory}. `;
        
        // Sleep architecture analysis
        const stages = dayData.stages;
        if (stages) {
            analysis += `Your sleep architecture showed ${stages.deep}% deep sleep (optimal: 20-25%), ${stages.rem}% REM sleep (optimal: 20-25%), and ${stages.light}% light sleep. `;
            
            if (stages.deep >= 20 && stages.rem >= 20) {
                analysis += 'Both deep and REM sleep were in healthy ranges, indicating good restorative sleep. ';
            } else if (stages.deep < 20) {
                analysis += 'Deep sleep was below optimal levels, which may affect physical recovery and immune function. ';
            }
            if (stages.rem < 20) {
                analysis += 'REM sleep was below optimal levels, potentially impacting memory consolidation and mood regulation. ';
            }
        }
        analysis += '</div>';
        
        // Sleep timing analysis
        analysis += `<div class="analysis-section"><strong>Sleep Timing:</strong> You went to bed at ${dayData.startTime}, took ${dayData.timeToSleep} minutes to fall asleep `;
        analysis += dayData.timeToSleep <= 20 ? '(excellent)' : dayData.timeToSleep <= 30 ? '(good)' : '(room for improvement)';
        analysis += `, and woke up at ${dayData.endTime} after ${dayData.duration} of sleep. `;
        analysis += `You took ${dayData.timeToWake} minutes to fully wake up `;
        analysis += dayData.timeToWake <= 15 ? '(very good)' : dayData.timeToWake <= 25 ? '(normal)' : '(consider morning light exposure)';
        analysis += '.</div>';
        
        // Sleep continuity analysis
        analysis += `<div class="analysis-section"><strong>Sleep Continuity:</strong> You experienced ${dayData.interruptions} awakenings during the night `;
        if (dayData.interruptions <= 2) {
            analysis += '(excellent continuity). ';
        } else if (dayData.interruptions <= 4) {
            analysis += '(normal range, but room for improvement). ';
        } else {
            analysis += '(frequent awakenings that may be affecting sleep quality). ';
        }
        analysis += `Sleep efficiency was approximately ${Math.max(0, efficiency).toFixed(1)}%, `;
        analysis += efficiency >= 85 ? 'which is excellent.' : efficiency >= 80 ? 'which is good but could be optimized.' : 'which suggests room for improvement.';
        analysis += '</div>';
        
        // Physiological metrics
        analysis += `<div class="analysis-section"><strong>Physiological Markers:</strong> Your average heart rate during sleep was ${dayData.heartRate} bpm `;
        analysis += dayData.heartRate <= 60 ? '(excellent - indicates good cardiovascular relaxation)' : '(slightly elevated - may indicate stress or environmental factors)';
        if (dayData.movementScore) {
            analysis += `. Movement score was ${dayData.movementScore}/100 `;
            analysis += dayData.movementScore >= 85 ? '(very stable sleep)' : dayData.movementScore >= 75 ? '(moderately stable)' : '(restless sleep that may benefit from comfort adjustments)';
        }
        analysis += '.</div>';
        
        // Comparative context
        analysis += `<div class="analysis-section"><strong>Key Insights:</strong> `;
        const strengths = [];
        const improvements = [];
        
        if (dayData.timeToSleep <= 25) strengths.push('quick sleep onset');
        else improvements.push('sleep onset time');
        
        if (stages && stages.deep >= 22) strengths.push('adequate deep sleep');
        else if (stages) improvements.push('deep sleep duration');
        
        if (stages && stages.rem >= 23) strengths.push('healthy REM sleep');
        else if (stages) improvements.push('REM sleep quality');
        
        if (dayData.interruptions <= 3) strengths.push('good sleep continuity');
        else improvements.push('sleep continuity');
        
        if (dayData.heartRate <= 60) strengths.push('relaxed physiology');
        else improvements.push('sleep relaxation');
        
        if (strengths.length > 0) {
            analysis += `Your sleep strengths include: ${strengths.join(', ')}. `;
        }
        if (improvements.length > 0) {
            analysis += `Areas for potential improvement: ${improvements.join(', ')}.`;
        }
        analysis += '</div>';
        
        return analysis;
    }

    // Generate summary text for sleep coach
    function generateSleepCoachSummary(dayData) {
        if (!dayData) return 'No sleep data available for this date.';
        
        // Keep it short - around 30 words
        const scoreCategory = dayData.score >= 85 ? 'excellent' : dayData.score >= 70 ? 'good' : dayData.score >= 60 ? 'fair' : 'poor';
        
        // Identify top 1-2 focus areas
        const focusAreas = [];
        if (dayData.timeToSleep > 25) focusAreas.push('sleep onset');
        if (dayData.interruptions >= 3) focusAreas.push('continuity');
        if (dayData.stages && dayData.stages.deep < 22) focusAreas.push('deep sleep');
        if (dayData.stages && dayData.stages.rem < 23) focusAreas.push('REM sleep');
        if (dayData.heartRate > 60) focusAreas.push('relaxation');
        
        let summary = `${scoreCategory} sleep quality (${dayData.score}/100). `;
        
        if (focusAreas.length > 0) {
            summary += `Focus on: ${focusAreas.slice(0, 2).join(', ')}. `;
        } else {
            summary += `Strong performance - maintain consistency. `;
        }
        
        summary += 'Tap for detailed analysis.';
        
        return summary;
    }

    // Update sleep coach content dynamically
    function updateSleepCoachContent(dayData) {
        const summaryElement = document.querySelector('.coach-summary-text');
        const suggestionsContainer = document.querySelector('.coach-suggestions');
        
        if (summaryElement) {
            summaryElement.textContent = generateSleepCoachSummary(dayData);
        }
        
        if (suggestionsContainer) {
            const suggestions = generateSleepCoachSuggestions(dayData);
            if (suggestions) {
                let suggestionsHTML = '';
                
                suggestions.forEach(suggestion => {
                    const isActionItems = suggestion.isActionItems;
                    const isAnalysis = suggestion.isAnalysis;
                    
                    if (isAnalysis) {
                        // Special handling for detailed analysis section
                        suggestionsHTML += `
                            <div class="suggestion-category analysis-category">
                                <h5 class="category-title">${suggestion.title}</h5>
                                <div class="analysis-content">${suggestion.content}</div>
                            </div>
                        `;
                    } else {
                        // Regular suggestion categories
                        const ulClass = isActionItems ? 'action-items' : 'suggestion-list';
                        
                        suggestionsHTML += `
                            <div class="suggestion-category ${isActionItems ? 'action-items-category' : ''}">
                                <h5 class="category-title">${suggestion.title}</h5>
                                <ul class="${ulClass}">
                                    ${suggestion.tips.map(tip => `<li>${tip}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }
                });
                
                suggestionsContainer.innerHTML = suggestionsHTML;
            }
        }
    }

    // Add styles for clickable days and score colors
    const style = document.createElement('style');
    style.textContent = `
        /* Sleep Coach Analysis Styles */
        .analysis-category {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .analysis-content {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
        }
        
        .analysis-section {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .analysis-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .analysis-section strong {
            color: #1f2937;
            font-weight: 600;
        }
        
        .suggestion-category {
            margin-bottom: 32px;
            border-left: none !important;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }
        
        .suggestion-category:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary-gradient);
        }

        .category-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            padding: 16px 20px;
            background: var(--primary-gradient);
            color: white;
            border-radius: 12px 12px 0 0;
            margin: -20px -20px 20px -20px;
            text-align: center;
            position: relative;
        }

        .category-title:after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #BC9BF3;
        }
        
        .suggestion-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            gap: 12px;
        }
        
        .suggestion-list li {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            margin-bottom: 0;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.6;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            position: relative;
            transition: all 0.2s ease;
        }
        
        .suggestion-list li:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            border-color: #7A52E6;
        }
        
        .suggestion-list li:before {
            content: "💡";
            position: absolute;
            left: 16px;
            top: 16px;
            font-size: 16px;
        }
        
        .suggestion-list li {
            padding-left: 48px;
        }
        
        .action-items-category {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
            padding: 20px;
            border-left: none !important;
        }
        
        .action-items {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .action-items li {
            background: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.5;
        }
        
        .action-items li:before {
            content: "✓ ";
            color: #f59e0b;
            font-weight: bold;
            margin-right: 6px;
        }

        .clickable-day {
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .clickable-day:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 194, 197, 0.2);
        }
        .week-day-item.clickable-day {
            border-radius: 12px;
            padding: 8px;
        }
        .calendar-date.clickable-day {
            border-radius: 8px;
        }
        .date-navigation .nav-arrow {
            cursor: pointer;
            transition: all 0.2s;
        }
        .date-navigation .nav-arrow:hover {
            color: var(--primary);
            transform: scale(1.2);
        }
        .date-navigation .nav-arrow:active {
            transform: scale(0.95);
        }
        
        /* Week view circles - fixed dimensions for perfect circles */
        .week-view .score-circle {
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            margin: 6px auto !important;
            flex-shrink: 0 !important;
        }
        
        .week-view .score-circle.has-data.score-red {
            background: #EF4444 !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2) !important;
        }
        .week-view .score-circle.has-data.score-yellow {
            background: #F59E0B !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2) !important;
        }
        .week-view .score-circle.has-data.score-green {
            background: #10B981 !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2) !important;
        }
        .week-view .score-circle.no-data {
            background: #F8FAFC !important;
            border: 1px solid #E2E8F0 !important;
            color: #94A3B8 !important;
        }
        
        /* Calendar month view - proper calendar grid layout */
        .month-calendar {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            background: var(--card-background);
            border-radius: 8px;
            padding: 8px;
        }
        
        .calendar-day {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 4px;
        }
        
        /* Base calendar date styling - fixed size circles */
        .calendar-date {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            margin: 0 auto;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        /* Dates with sleep data - small colored indicator */
        .calendar-date.has-data .date-number {
            position: relative;
            z-index: 2;
        }
        
        .calendar-date.has-data::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            top: 6px;
            right: 6px;
            z-index: 1;
        }
        
        /* Circular backgrounds for sleep data - properly sized */
        .calendar-date.score-red {
            background-color: #EF4444 !important;
            color: white !important;
            border-radius: 50% !important;
        }
        
        .calendar-date.score-yellow {
            background-color: #F59E0B !important;
            color: white !important;
            border-radius: 50% !important;
        }
        
        .calendar-date.score-green {
            background-color: #10B981 !important;
            color: white !important;
            border-radius: 50% !important;
        }
        
        /* No data dates stay normal */
        .calendar-date.no-data {
            background-color: transparent !important;
            color: #9CA3AF !important;
            border-radius: 4px !important;
        }
        
        /* Hover states for calendar dates */
        .calendar-date.clickable-day:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            box-shadow: none;
        }
        
        .calendar-date.has-data.clickable-day:hover {
            background-color: rgba(0, 194, 197, 0.1);
        }
        
        /* Dates without data */
        .calendar-date.no-data {
            color: var(--text-secondary);
        }
        
        .calendar-date.no-data:hover {
            background-color: var(--gray100);
        }
        
        /* Today's date highlighting */
        .calendar-date.today {
            background-color: var(--primary);
            color: white;
        }
        
        .calendar-date.today::before {
            display: none;
        }
        
        /* Score bars - same colors */
        .score-fill.score-red {
            background: #EF4444 !important;
        }
        .score-fill.score-yellow {
            background: #F59E0B !important;
        }
        .score-fill.score-green {
            background: #10B981 !important;
        }
        
        /* Calendar header styling */
        .calendar-header {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-bottom: 8px;
            padding: 0 8px;
        }
        
        .calendar-day-header {
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            padding: 8px 4px;
        }
        
        /* Month view container */
        .month-view {
            background: var(--card-background);
            border-radius: 12px;
            padding: 16px;
            margin: 16px 0;
            border: 1px solid var(--border-color);
        }
        
        /* Empty calendar cells */
        .calendar-empty {
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);

    // === WHITE NOISE FUNCTIONALITY ===

    // Add click handlers for noise categories - navigate to category screens
    const noiseCategoryItems = document.querySelectorAll('.clickable-noise-category');
    noiseCategoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            // Map category to screen name
            const screenMapping = {
                'nature': 'nature-sounds-screen',
                'ambient': 'ambient-noise-screen',
                'mechanical': 'mechanical-sounds-screen',
                'urban': 'urban-ambience-screen'
            };
            const screenId = screenMapping[category];
            if (screenId) {
                showScreen(screenId);
            }
        });
    });

    // Handle track playing (using new music player)
    function playTrack(trackName, category) {
        console.log(`Playing: ${trackName} from ${category} category`);

        // Use the new music player instead of toast notification
        if (window.musicPlayer) {
            window.musicPlayer.playTrack(trackName, category);
        } else {
            // Fallback to old behavior if music player isn't loaded
            showTrackFeedback(trackName);
        }
    }

    // Show visual feedback when track is selected
    function showTrackFeedback(trackName) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00C2C5, #5c7cda);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1001;
            animation: slideUpFade 3s ease;
            box-shadow: 0 4px 20px rgba(0, 194, 197, 0.3);
        `;
        notification.textContent = `♪ Now Playing: ${trackName}`;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUpFade {
                0% { transform: translateX(-50%) translateY(20px); opacity: 0; }
                15% { transform: translateX(-50%) translateY(0); opacity: 1; }
                85% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 3000);
    }

    // Add click handlers for popular tracks in white noise screen
    const popularTracks = document.querySelectorAll('.clickable-track');
    popularTracks.forEach(track => {
        track.addEventListener('click', () => {
            const trackName = track.querySelector('h5').textContent;
            playTrack(trackName, 'popular');
        });
    });

    // Featured track functionality removed - no longer needed

    // === END WHITE NOISE FUNCTIONALITY ===

});

// Stop TTS when page is about to unload (refresh, navigation, close)
window.addEventListener('beforeunload', () => {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log('Stopped TTS on page unload');
    }
});