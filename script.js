// Sample train data - in a real application, this would come from an API
const trainData = {
    'london paddington': [
        { time: '08:15', destination: 'Reading', operator: 'GWR', platform: 'Platform 1', status: 'on-time', delay: 0 },
        { time: '08:25', destination: 'Oxford', operator: 'GWR', platform: 'Platform 3', status: 'delayed', delay: 15 },
        { time: '08:35', destination: 'Bath Spa', operator: 'GWR', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:45', destination: 'Bristol Temple Meads', operator: 'GWR', platform: 'Platform 4', status: 'delayed', delay: 8 },
        { time: '09:00', destination: 'Cardiff Central', operator: 'GWR', platform: 'Platform 1', status: 'cancelled', delay: 0 },
        { time: '09:10', destination: 'Heathrow Airport', operator: 'Heathrow Express', platform: 'Platform 6', status: 'on-time', delay: 0 },
        { time: '09:20', destination: 'Swansea', operator: 'GWR', platform: 'Platform 3', status: 'on-time', delay: 0 },
        { time: '09:30', destination: 'Plymouth', operator: 'GWR', platform: 'Platform 2', status: 'delayed', delay: 12 }
    ],
    'manchester piccadilly': [
        { time: '08:20', destination: 'London Euston', operator: 'Avanti West Coast', platform: 'Platform 5', status: 'on-time', delay: 0 },
        { time: '08:35', destination: 'Birmingham New Street', operator: 'CrossCountry', platform: 'Platform 2', status: 'delayed', delay: 5 },
        { time: '08:50', destination: 'Leeds', operator: 'Northern Rail', platform: 'Platform 7', status: 'on-time', delay: 0 },
        { time: '09:05', destination: 'Glasgow Central', operator: 'Avanti West Coast', platform: 'Platform 5', status: 'delayed', delay: 20 },
        { time: '09:15', destination: 'Liverpool Lime Street', operator: 'Northern Rail', platform: 'Platform 3', status: 'on-time', delay: 0 },
        { time: '09:25', destination: 'Sheffield', operator: 'Northern Rail', platform: 'Platform 8', status: 'cancelled', delay: 0 },
        { time: '09:40', destination: 'Preston', operator: 'Northern Rail', platform: 'Platform 4', status: 'on-time', delay: 0 }
    ],
    'birmingham new street': [
        { time: '08:10', destination: 'London Euston', operator: 'Avanti West Coast', platform: 'Platform 4', status: 'delayed', delay: 10 },
        { time: '08:25', destination: 'Manchester Piccadilly', operator: 'CrossCountry', platform: 'Platform 7', status: 'on-time', delay: 0 },
        { time: '08:40', destination: 'Bristol Temple Meads', operator: 'CrossCountry', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:55', destination: 'Wolverhampton', operator: 'West Midlands Railway', platform: 'Platform 6', status: 'delayed', delay: 3 },
        { time: '09:10', destination: 'Coventry', operator: 'West Midlands Railway', platform: 'Platform 1', status: 'on-time', delay: 0 },
        { time: '09:20', destination: 'Nottingham', operator: 'CrossCountry', platform: 'Platform 8', status: 'on-time', delay: 0 },
        { time: '09:35', destination: 'Edinburgh Waverley', operator: 'CrossCountry', platform: 'Platform 3', status: 'delayed', delay: 18 }
    ],
    'edinburgh waverley': [
        { time: '08:15', destination: 'Glasgow Queen Street', operator: 'ScotRail', platform: 'Platform 2', status: 'on-time', delay: 0 },
        { time: '08:30', destination: 'London King\'s Cross', operator: 'LNER', platform: 'Platform 8', status: 'delayed', delay: 7 },
        { time: '08:45', destination: 'Aberdeen', operator: 'ScotRail', platform: 'Platform 6', status: 'on-time', delay: 0 },
        { time: '09:00', destination: 'Inverness', operator: 'ScotRail', platform: 'Platform 4', status: 'on-time', delay: 0 },
        { time: '09:15', destination: 'Birmingham New Street', operator: 'CrossCountry', platform: 'Platform 3', status: 'delayed', delay: 25 },
        { time: '09:30', destination: 'Dundee', operator: 'ScotRail', platform: 'Platform 5', status: 'cancelled', delay: 0 },
        { time: '09:40', destination: 'Stirling', operator: 'ScotRail', platform: 'Platform 1', status: 'on-time', delay: 0 }
    ]
};

// DOM Elements
const stationSearchBox = document.querySelector('#station-search-box');
const searchButton = document.querySelector('#search-button');
const trainList = document.querySelector('#train-list');
const resultsSection = document.querySelector('#results-section');
const stationTitle = document.querySelector('#station-title');
const noResults = document.querySelector('#no-results');
const stationTags = document.querySelectorAll('.station-tag');
const filterButtons = document.querySelectorAll('.filter-btn');

// State management
let currentTrains = [];
let currentFilter = 'all';

// Event Listeners
searchButton.addEventListener('click', handleSearch);
stationSearchBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

stationSearchBox.addEventListener('input', function(e) {
    if (e.target.value.length > 2) {
        // In a real app, this could show autocomplete suggestions
        console.log('Searching for:', e.target.value);
    }
});

// Popular station tags
stationTags.forEach(tag => {
    tag.addEventListener('click', function() {
        const stationName = this.getAttribute('data-station');
        stationSearchBox.value = stationName;
        handleSearch();
    });
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        currentFilter = this.getAttribute('data-filter');
        filterTrains();
    });
});

// Main search function
function handleSearch() {
    const stationName = stationSearchBox.value.trim().toLowerCase();
    
    if (!stationName) {
        showError('Please enter a station name');
        return;
    }
    
    // Clear previous results
    trainList.innerHTML = '';
    
    // Find matching station data
    const trains = findTrainsByStation(stationName);
    
    if (trains.length === 0) {
        showNoResults();
        return;
    }
    
    currentTrains = trains;
    displayTrains(trains);
    showResults(stationName);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Find trains by station name (fuzzy matching)
function findTrainsByStation(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Direct match
    if (trainData[normalizedSearch]) {
        return trainData[normalizedSearch];
    }
    
    // Partial match
    for (const [stationKey, trains] of Object.entries(trainData)) {
        if (stationKey.includes(normalizedSearch) || normalizedSearch.includes(stationKey.split(' ')[0])) {
            return trains;
        }
    }
    
    return [];
}

// Display trains in the list
function displayTrains(trains) {
    trainList.innerHTML = '';
    
    trains.forEach((train, index) => {
        const li = document.createElement('li');
        li.className = 'train-item';
        
        // Add delayed class if train is delayed
        if (train.status === 'delayed') {
            li.classList.add('delayed');
        }
        
        const actualTime = train.delay > 0 ? 
            `${train.time} (+${train.delay}min)` : 
            train.time;
        
        li.innerHTML = `
            <div class="train-info">
                <div class="train-route">
                    <div class="train-destination">${train.destination}</div>
                    <div class="train-operator">${train.operator}</div>
                </div>
                <div class="train-time">${actualTime}</div>
                <div class="train-platform">${train.platform}</div>
                <div class="train-status status-${train.status}">
                    ${formatStatus(train.status)}
                </div>
            </div>
        `;
        
        // Add hover effect
        li.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        li.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Add click handler for more details
        li.addEventListener('click', function() {
            showTrainDetails(train);
        });
        
        trainList.appendChild(li);
        
        // Add staggered animation
        setTimeout(() => {
            li.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s both`;
        }, 50);
    });
}

// Filter trains based on current filter
function filterTrains() {
    if (!currentTrains.length) return;
    
    let filteredTrains = currentTrains;
    
    if (currentFilter !== 'all') {
        filteredTrains = currentTrains.filter(train => train.status === currentFilter.replace('-', '_'));
    }
    
    displayTrains(filteredTrains);
    
    if (filteredTrains.length === 0) {
        trainList.innerHTML = '<li class="train-item"><div style="text-align: center; padding: 20px; color: #64748b;">No trains match the selected filter.</div></li>';
    }
}

// Format status text
function formatStatus(status) {
    switch (status) {
        case 'on-time':
        case 'on_time':
            return 'On Time';
        case 'delayed':
            return 'Delayed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status;
    }
}

// Show results section
function showResults(stationName) {
    stationTitle.textContent = `Departures from ${capitalizeWords(stationName)}`;
    resultsSection.classList.add('show');
    noResults.style.display = 'none';
}

// Show no results
function showNoResults() {
    resultsSection.classList.add('show');
    trainList.innerHTML = '';
    noResults.style.display = 'block';
}

// Show error message
function showError(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Capitalize words for display
function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Show train details (could be expanded into a modal)
function showTrainDetails(train) {
    const details = `
        🚂 ${train.destination}
        🕐 Departure: ${train.time}${train.delay > 0 ? ` (+${train.delay} min delay)` : ''}
        🚉 ${train.platform}
        🚃 Operated by ${train.operator}
        📊 Status: ${formatStatus(train.status)}
    `;
    
    alert(details); // In a real app, this would be a proper modal
}

// Simulate live updates (in a real app, this would come from WebSocket or periodic API calls)
function simulateLiveUpdates() {
    if (currentTrains.length === 0) return;
    
    // Randomly update a train's status
    const randomIndex = Math.floor(Math.random() * currentTrains.length);
    const train = currentTrains[randomIndex];
    
    // Small chance to change status
    if (Math.random() < 0.1) {
        const statuses = ['on-time', 'delayed', 'cancelled'];
        const currentStatusIndex = statuses.indexOf(train.status);
        const newStatus = statuses[(currentStatusIndex + 1) % statuses.length];
        
        train.status = newStatus;
        if (newStatus === 'delayed' && train.delay === 0) {
            train.delay = Math.floor(Math.random() * 20) + 5;
        }
        
        // Refresh display
        filterTrains();
        
        console.log(`Updated ${train.destination} to ${newStatus}`);
    }
}

// Start live updates simulation
setInterval(simulateLiveUpdates, 10000); // Every 10 seconds

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Focus on search input
    stationSearchBox.focus();
    
    // Add some initial interactivity
    console.log('RailWay UK Train Schedule System Loaded');
    console.log('Available stations:', Object.keys(trainData));
});

 