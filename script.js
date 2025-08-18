document.addEventListener('DOMContentLoaded', () => {

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
    const metricDetailTitle = document.getElementById('metric-detail-title');
    const clickableMetrics = document.querySelectorAll('.clickable-metric');
    const periodTabs = document.querySelectorAll('.period-tab');
    const dateNavArrows = document.querySelectorAll('.date-navigation .nav-arrow');

    let currentScreen = 'home-screen'; // Keep track of the current screen
    let selectedPeriod = 'day'; // Track selected time period in sleep details
    let currentDate = new Date(2024, 6, 2); // Initialize with July 2, 2024 (month is 0-based) - for sleep details navigation
    let homepageDate = new Date(2024, 6, 30); // July 30, 2024 - fixed date for homepage "today"
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
            "score": 49, "startTime": "03:00", "endTime": "09:30", "duration": "6h30m",
            "heartRate": 74, "interruptions": 18, "timeToSleep": 110, "timeToWake": 65, "movementScore": 40,
            "stages": { "awake": 40, "rem": 10, "light": 40, "deep": 10 }
        },
        "2024-07-30": {
            "score": 82, "startTime": "23:00", "endTime": "07:10", "duration": "8h10m",
            "heartRate": 58, "interruptions": 3, "timeToSleep": 25, "timeToWake": 16, "movementScore": 81,
            "stages": { "awake": 10, "rem": 25, "light": 43, "deep": 22 }
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
            title: 'AI Sleep Assistant',
            text: 'Chat with your intelligent sleep assistant. Ask questions about your sleep patterns, get personalized tips for improvement, and understand your OZI data.'
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
        }
    };

    function showScreen(screenId) {
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

    // Clickable Cards Navigation
    const clickableCards = document.querySelectorAll('.clickable-card');
    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetScreenId = card.dataset.navigate;
            if (targetScreenId) {
                // Special handling for sleep summary card - navigate to today's date (July 30)
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


    // --- AI Chat Specific ---
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const chatContainer = document.querySelector('.chat-container');

    function addChatMessage(message, type = 'user') {
        if (!message.trim() || !chatContainer) return;

        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('chat-message', type);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble', type);
        messageBubble.innerHTML = `<p>${message}</p>`; // Use innerHTML to allow basic formatting if needed later

        if (type === 'ai') {
            const avatar = document.createElement('div');
            avatar.classList.add('ai-avatar');
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            messageWrapper.appendChild(avatar);
        }

        messageWrapper.appendChild(messageBubble);
        chatContainer.appendChild(messageWrapper);

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function handleSendChat() {
        const message = chatInput.value;
        addChatMessage(message, 'user');
        chatInput.value = ''; // Clear input

        // Simulate AI response (replace with actual logic)
        setTimeout(() => {
            addChatMessage("I'm processing your request...", 'ai');
        }, 1000);
    }

    if (sendChatButton && chatInput) {
        sendChatButton.addEventListener('click', handleSendChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendChat();
            }
        });
    }

    // Update home screen sleep summary with homepage date data (always July 30, 2024)
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
        
        if (sleepStageGraph) {
            sleepStageGraph.style.display = period === 'day' ? 'block' : 'none';
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

    // --- Color Slider Functionality ---
    const colorSliderContainer = document.querySelector('.color-slider-container');
    const colorSliderHandle = document.querySelector('.color-slider-handle');

    if (colorSliderContainer && colorSliderHandle) {
        let isDragging = false;

        function updateSliderPosition(clientX) {
            const rect = colorSliderContainer.getBoundingClientRect();
            const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const percentage = position * 100;

            colorSliderHandle.style.left = `${percentage}%`;
        }

        // Mouse events
        colorSliderHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            colorSliderHandle.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSliderPosition(e.clientX);
                e.preventDefault();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                colorSliderHandle.classList.remove('dragging');
            }
        });

        // Allow clicking on the bar to set the slider position
        colorSliderContainer.addEventListener('mousedown', (e) => {
            if (e.target !== colorSliderHandle) {
                updateSliderPosition(e.clientX);
            }
        });

        // Touch events
        colorSliderHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
            colorSliderHandle.classList.add('dragging');
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSliderPosition(e.touches[0].clientX);
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                colorSliderHandle.classList.remove('dragging');
            }
        });

        colorSliderContainer.addEventListener('touchstart', (e) => {
            if (e.target !== colorSliderHandle) {
                updateSliderPosition(e.touches[0].clientX);
            }
        }, { passive: true });

        // Initialize position
        colorSliderHandle.style.left = '50%';
    }

    // --- Initial State ---
    showScreen(currentScreen); // Show the initial screen ('home-screen')
    updateHomeSleepSummary(); // Update home screen with today's date (July 30, 2024)
    
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
        }
    });
    
    // Helper function to get score color class
    function getScoreColor(score) {
        if (score < 60) return 'score-red';
        if (score < 70) return 'score-yellow';
        return 'score-green';
    }

    // Add styles for clickable days and score colors
    const style = document.createElement('style');
    style.textContent = `
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

});