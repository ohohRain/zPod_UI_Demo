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
    const sliderValues = document.querySelectorAll('.slider-value');
    const metricValueSpans = document.querySelectorAll('.device-metrics .metric-value');
    const toggles = document.querySelectorAll('.modern-toggle-container');
    const viewMusicLibraryButton = document.querySelector('.view-details-button[data-navigate="music-screen"]');
    const scanButton = document.getElementById('scan-devices-button');
    const darkModeToggleProfile = document.querySelector('.profile-setting-item [data-control="dark-mode"]');
    const descriptionTitleElement = document.getElementById('description-title'); // Get description title element
    const descriptionTextElement = document.getElementById('description-text'); // Get description text element
    const sleepDetailsBackBtn = document.getElementById('sleep-details-back-btn');

    let currentScreen = 'home-screen'; // Keep track of the current screen

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

    // --- Initial State ---
    showScreen(currentScreen); // Show the initial screen ('home-screen')

});