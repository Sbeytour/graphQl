import { getUserInfoQuery } from './queries.js';
import { logout } from './login.js';
import { fetchGraphQL, formatXP } from './utils.js';

export const displayProfilePage = async () => {
    const mainContainer = document.getElementById('app');

    try {
        const userData = await fetchGraphQL(getUserInfoQuery);

        const user = userData.user[0];
        const totalXP = user.transactions_aggregate.aggregate.sum.amount || 0;
        const currentLevel = user.transactions[0]?.amount || 0;

        const auditRatio = user.auditRatio ? (user.auditRatio).toFixed(1) : 'N/A';

        mainContainer.innerHTML = /*html*/`
            <div class="profile-container">
                <div class="profile-header">
                    <h1>Profile Dashboard</h1>
                    <button id="logout-button" class="logout-button">Logout</button>
                </div>
                
                <div class="profile-info-section">
                    <!-- User Identification Section -->
                    <div class="info-card user-card">
                        <div class="card-header">
                            <h2>User Information</h2>
                        </div>
                        <div class="card-content">
                            <div class="info-item">
                                <span class="info-label">Username:</span>
                                <span class="info-value">${user.login}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Full name:</span>
                                <span class="info-value">${user.firstName || ''} ${user.lastName || ''}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Audit Ratio:</span>
                                <span class="info-value">${auditRatio}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- XP Section -->
                    <div class="info-card xp-card">
                        <div class="card-header">
                            <h2>Total XP</h2>
                        </div>
                        <div class="card-content">
                            <div class="xp-display">
                                <span class="xp-amount">${formatXP(totalXP)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Level Section -->
                    <div class="info-card level-card">
                        <div class="card-header">
                            <h2>Current Level</h2>
                        </div>
                        <div class="card-content">
                            <div class="level-display">
                                <span class="level-amount">${currentLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="statistics-section">
                </div>
            </div>
        `;

        document.getElementById('logout-button').addEventListener('click', logout);

    } catch (error) {
        console.error('Failed to load profile:', error);
        mainContainer.innerHTML = `
            <div class="error-container">
                <h2>Error Loading Profile</h2>
                <p>${error.message}</p>
                <button id="retry-button" class="retry-button">Retry</button>
                <button id="logout-button" class="logout-button">Logout</button>
            </div>
        `;

        document.getElementById('retry-button').addEventListener('click', displayProfilePage);
        document.getElementById('logout-button').addEventListener('click', logout);
    }
};