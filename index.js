// Supabase Configuration
const SUPABASE_URL = 'https://hklesdyucsdzllnbtzxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbGVzZHl1Y3NkemxsbmJ0enh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjM3NjksImV4cCI6MjA3MDgzOTc2OX0.WvHV4McEG2ohlqE6IqY33JtvXnJ0bq3bO3OvJR-hcVg';

// Initialize Supabase client
let supabase;

// Check if Supabase credentials are provided (fixed condition)
if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 50) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully');
} else {
    console.warn('Supabase not configured properly. Using mock data.');
}

// Mock data for demonstration (when Supabase is not configured)
let mockData = {
    cashiers: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            address: '123 Main St, City',
            cashier_id: 'CSH001',
            status: 'Active',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1987654321',
            address: '456 Oak Ave, Town',
            cashier_id: 'CSH002',
            status: 'Inactive',
            created_at: new Date().toISOString()
        }
    ],
    activities: [
        {
            id: 1,
            cashier_name: 'John Doe',
            activity: 'Login',
            timestamp: new Date().toISOString(),
            status: 'Success'
        },
        {
            id: 2,
            cashier_name: 'Jane Smith',
            activity: 'Logout',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'Success'
        }
    ],
    transactions: [
        {
            id: 'TXN001',
            cashier_name: 'John Doe',
            amount: 150.00,
            date: new Date().toISOString(),
            status: 'Completed'
        },
        {
            id: 'TXN002',
            cashier_name: 'Jane Smith',
            amount: 75.50,
            date: new Date(Date.now() - 1800000).toISOString(),
            status: 'Completed'
        }
    ]
};

// DOM Elements
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const addCashierModal = document.getElementById('addCashierModal');
const activitiesModal = document.getElementById('activitiesModal');
const transactionsModal = document.getElementById('transactionsModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show login modal on load
    showLoginModal();
    
    // Set up event listeners
    setupEventListeners();
});
function cashierSignInBtn(){
    window.open('cashier.html', '_blank');
}
function showLoginModal() {
    loginModal.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

function hideDashboard() {
    dashboard.classList.add('hidden');
    loginModal.classList.remove('hidden');
}

function showDashboard() {
    loginModal.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadDashboardData();
}

function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Add cashier modal
    document.getElementById('addCashierBtn').addEventListener('click', () => {
        addCashierModal.classList.remove('hidden');
    });
    
    document.getElementById('closeAddCashierModal').addEventListener('click', () => {
        addCashierModal.classList.add('hidden');
    });
    
    document.getElementById('cancelAddCashier').addEventListener('click', () => {
        addCashierModal.classList.add('hidden');
    });
    
    // Add cashier form
    document.getElementById('addCashierForm').addEventListener('submit', handleAddCashier);
    
    // Activities modal
    document.getElementById('viewActivitiesBtn').addEventListener('click', () => {
        loadActivities();
        activitiesModal.classList.remove('hidden');
    });
    
    document.getElementById('closeActivitiesModal').addEventListener('click', () => {
        activitiesModal.classList.add('hidden');
    });
    
    // Transactions modal
    document.getElementById('viewTransactionsBtn').addEventListener('click', () => {
        loadTransactions();
        transactionsModal.classList.remove('hidden');
    });
    
    document.getElementById('closeTransactionsModal').addEventListener('click', () => {
        transactionsModal.classList.add('hidden');
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Show loading state
    loginBtnText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
    loginBtn.disabled = true;
    
    try {
        if (supabase) {
            // Use Supabase authentication
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                throw new Error(error.message);
            }
            
            console.log('Login successful:', data);
            showDashboard();
        } else {
            // Mock authentication for demo
            setTimeout(() => {
                if (email === 'admin@example.com' && password === 'password') {
                    showDashboard();
                } else {
                    alert('Invalid credentials. Use admin@example.com / password for demo');
                }
                
                // Reset button state
                loginBtnText.classList.remove('hidden');
                loginSpinner.classList.add('hidden');
                loginBtn.disabled = false;
            }, 1500);
            return;
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
    
    // Reset button state
    loginBtnText.classList.remove('hidden');
    loginSpinner.classList.add('hidden');
    loginBtn.disabled = false;
}

async function handleLogout() {
    if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
        }
    }
    hideDashboard();
}

async function handleAddCashier(e) {
    e.preventDefault();
    
    const name = document.getElementById('cashierName').value;
    const email = document.getElementById('cashierEmail').value;
    const phone = document.getElementById('cashierPhone').value;
    const address = document.getElementById('cashierAddress').value;
    const cashierID = document.getElementById('cashierID').value;
    
    const saveBtn = document.getElementById('saveCashierBtn');
    const saveBtnText = document.getElementById('saveCashierText');
    const saveSpinner = document.getElementById('saveCashierSpinner');
    
    // Show loading state
    saveBtnText.classList.add('hidden');
    saveSpinner.classList.remove('hidden');
    saveBtn.disabled = true;
    
    try {
        if (supabase) {
            // Insert into Supabase
            const { data, error } = await supabase
                .from('cashiers')
                .insert([{
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    cashier_id: cashierID,
                    status: 'Active'
                }]);
            
            if (error) {
                throw new Error(error.message);
            }
            
            console.log('Cashier added successfully:', data);
        } else {
            // Add to mock data
            const newCashier = {
                id: mockData.cashiers.length + 1,
                name: name,
                email: email,
                phone: phone,
                address: address,
                cashier_id: cashierID,
                status: 'Active',
                created_at: new Date().toISOString()
            };
            mockData.cashiers.push(newCashier);
        }
        
        // Reset form and close modal
        document.getElementById('addCashierForm').reset();
        addCashierModal.classList.add('hidden');
        
        // Refresh dashboard data
        loadDashboardData();
        
        // Show success animation
        showSuccessNotification('Cashier added successfully!');
        
    } catch (error) {
        alert('Error adding cashier: ' + error.message);
        console.error('Add cashier error:', error);
    }
    
    // Reset button state
    saveBtnText.classList.remove('hidden');
    saveSpinner.classList.add('hidden');
    saveBtn.disabled = false;
}

async function loadDashboardData() {
    try {
        let cashiers = [];
        
        if (supabase) {
            // Load from Supabase
            const { data, error } = await supabase
                .from('cashiers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                throw new Error(error.message);
            }
            
            cashiers = data || [];
            console.log('Loaded cashiers from Supabase:', cashiers);
        } else {
            // Use mock data
            cashiers = mockData.cashiers;
            console.log('Using mock cashier data');
        }
        
        // Update stats
        document.getElementById('totalCashiers').textContent = cashiers.length;
        document.getElementById('activeSessions').textContent = cashiers.filter(c => c.status === 'Active').length;
        document.getElementById('todayTransactions').textContent = mockData.transactions.length;
        document.getElementById('totalRevenue').textContent = mockData.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
        
        // Update cashiers table
        updateCashiersTable(cashiers);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Error loading dashboard data: ' + error.message);
    }
}

function updateCashiersTable(cashiers) {
    const tbody = document.getElementById('cashiersTableBody');
    tbody.innerHTML = '';
    
    cashiers.forEach((cashier, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors duration-200';
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('animate-fadeInUp');
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold text-sm">${cashier.name.charAt(0)}</span>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${cashier.name}</div>
                        <div class="text-sm text-gray-500">ID: ${cashier.cashier_id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${cashier.email}</div>
                <div class="text-sm text-gray-500">${cashier.phone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    cashier.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }">
                    ${cashier.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button class="text-red-600 hover:text-red-900 transition-colors duration-200" onclick="deleteCashier(${cashier.id})">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

async function loadActivities() {
    const tbody = document.getElementById('activitiesTableBody');
    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Loading activities...</td></tr>';
    
    try {
        let activities = [];
        
        if (supabase) {
            // Load from Supabase
            const { data, error } = await supabase
                .from('cashier_activities')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);
            
            if (error) {
                throw new Error(error.message);
            }
            
            activities = data || [];
            console.log('Loaded activities from Supabase:', activities);
        } else {
            // Use mock data
            activities = mockData.activities;
        }
        
        tbody.innerHTML = '';
        
        activities.forEach((activity, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            row.style.animationDelay = `${index * 0.05}s`;
            row.classList.add('animate-fadeInUp');
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${activity.cashier_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${activity.activity}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(activity.timestamp).toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === 'Success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }">
                        ${activity.status}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        if (activities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No activities found</td></tr>';
        }
        
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error loading activities</td></tr>';
        console.error('Error loading activities:', error);
    }
}

async function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading transactions...</td></tr>';
    
    try {
        let transactions = [];
        
        if (supabase) {
            // Load from Supabase
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false })
                .limit(50);
            
            if (error) {
                throw new Error(error.message);
            }
            
            transactions = data || [];
            console.log('Loaded transactions from Supabase:', transactions);
        } else {
            // Use mock data
            transactions = mockData.transactions;
        }
        
        tbody.innerHTML = '';
        
        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            row.style.animationDelay = `${index * 0.05}s`;
            row.classList.add('animate-fadeInUp');
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaction.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.cashier_name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    $${transaction.amount.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(transaction.date).toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }">
                        ${transaction.status}
                    </span>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No transactions found</td></tr>';
        }
        
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Error loading transactions</td></tr>';
        console.error('Error loading transactions:', error);
    }
}

async function deleteCashier(cashierId) {
    if (!confirm('Are you sure you want to delete this cashier?')) {
        return;
    }
    
    try {
        if (supabase) {
            const { error } = await supabase
                .from('cashiers')
                .delete()
                .eq('id', cashierId);
            
            if (error) {
                throw new Error(error.message);
            }
            
            console.log('Cashier deleted successfully');
        } else {
            // Remove from mock data
            mockData.cashiers = mockData.cashiers.filter(c => c.id !== cashierId);
        }
        
        // Refresh dashboard
        loadDashboardData();
        showSuccessNotification('Cashier deleted successfully!');
        
    } catch (error) {
        alert('Error deleting cashier: ' + error.message);
        console.error('Delete cashier error:', error);
    }
}

function showSuccessNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInUp';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target === addCashierModal) {
        addCashierModal.classList.add('hidden');
    }
    if (e.target === activitiesModal) {
        activitiesModal.classList.add('hidden');
    }
    if (e.target === transactionsModal) {
        transactionsModal.classList.add('hidden');
    }
});

// Add some demo data periodically for live effect
if (!supabase) {
    setInterval(() => {
        // Simulate random activity
        const activities = ['Login', 'Logout', 'Transaction', 'Break Start', 'Break End'];
        const cashiers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
        
        const newActivity = {
            id: mockData.activities.length + 1,
            cashier_name: cashiers[Math.floor(Math.random() * cashiers.length)],
            activity: activities[Math.floor(Math.random() * activities.length)],
            timestamp: new Date().toISOString(),
            status: 'Success'
        };
        
        mockData.activities.unshift(newActivity);
        
        // Keep only last 50 activities
        if (mockData.activities.length > 50) {
            mockData.activities = mockData.activities.slice(0, 50);
        }
        
        // Update stats if dashboard is visible
        if (!dashboard.classList.contains('hidden')) {
            document.getElementById('activeSessions').textContent = Math.floor(Math.random() * 5) + 1;
        }
    }, 30000); // Every 30 seconds
}