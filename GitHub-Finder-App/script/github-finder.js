// github-finder.js
import GithubUser from './github-user.js';

class GithubFinder {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.userProfileSection = document.querySelector('.user-profile-section');
        this.reposSection = document.querySelector('.latest-repos-section');
        this.searchHistoryManager = new SearchHistoryManager();
    }

    initializeProfileSection() {
        this.userProfileSection.innerHTML = '';
    }

    initializeReposSection() {
        this.reposSection.innerHTML = '';
    }

    reset() {
        this.initializeProfileSection();
        this.initializeReposSection();
        this.searchInput.value = '';
    }

    async searchUser() {
        this.initializeProfileSection();
        try {
            const username = this.searchInput.value;
            const user = new GithubUser(username);
            const data = await user.fetchProfile();

            const html =  `
            <div class="user-profile">
                <div class="user-profile-side">
                    <div class="user-profile-img">
                        <img src="${data.avatar_url}" alt="profile image"/>
                    </div>
                    <div class="user-profile-button">
                        <a href="${data.html_url}" target="_blank">
                            <button>Visit GitHub Profile</button>
                        </a>
                    </div>
                </div>
                <div class="user-profile-detail">
                    <div class="user-stats">
                        <div class="user-stats-repo">Public Repos: ${data.public_repos}</div>
                        <div class="user-stats-gist">Public Gists: ${data.public_gists}</div>
                        <div class="user-stats-follower">Followers: ${data.followers}</div>
                        <div class="user-stats-following">Following: ${data.following}</div>
                    </div>
                    <div class="user-info">
                        <div>Company: ${data.company || 'N/A'}</div>
                        <div>Website/Blog: ${data.blog || 'N/A'}</div>
                        <div>Location: ${data.location || 'N/A'}</div>
                        <div>Member Since: ${data.created_at || 'N/A'}</div>
                    </div>
                </div>
            </div>
            `;

            this.userProfileSection.innerHTML = html;
        } catch (error) {
            console.error(`An error occurred while fetching the profile: ${error.message}`);
        }
    }

    async searchRepos() {
        this.initializeReposSection();
        try {
            const username = this.searchInput.value;
            const user = new GithubUser(username);
            const repos = await user.fetchRepos();

            let html = '<h3>Latest Repos</h3>';
            for (let repo of repos) {
                html += `
                <div class="repo-card">
                    <div class="repo-name">${repo.name}</div>
                    <div class="repo-info">
                        <div class="repo-star">Stars: ${repo.stargazers_count}</div>
                        <div class="repo-watcher">Watchers: ${repo.watchers_count}</div>
                        <div class="repo-fork">Forks: ${repo.forks_count ? repo.forks_count : 'undefined'}</div>
                    </div>
                </div>
                `;
            }

            this.reposSection.innerHTML += html;
        } catch (error) {
            console.error(`An error occurred while fetching the repos: ${error.message}`);
        }
    }
}

class SearchHistoryManager {
    // 로컬 스토리지에서 검색 기록을 불러오는 메서드
    loadSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory')) || [];
    }

    // 검색한 사용자 이름을 로컬 스토리지에 저장하는 메서드
    saveSearchHistory(username) {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(username)) {
            searchHistory.push(username);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }

    // 검색창의 텍스트에 맞게 검색 기록을 필터링하는 메서드
    filterSearchHistory(query) {
        const searchHistory = this.loadSearchHistory();
        return searchHistory.filter(username => username.includes(query));
    }
}

export default GithubFinder;
export { SearchHistoryManager };