// main.js
import GithubFinder from './github-finder.js';

const finder = new GithubFinder();
const searchInput = document.querySelector('.search-input');
const searchHistoryDropdown = document.getElementById('searchHistoryDropdown');

document.querySelector('.search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        finder.searchUser();
        finder.searchRepos();
        finder.searchHistoryManager.saveSearchHistory(finder.searchInput.value);
    }
});

document.querySelector('#header').addEventListener('click', () => {
    finder.reset();
});

// 검색 기록을 드롭다운 리스트에 보여주는 함수
function showSearchHistory(history) {
    searchHistoryDropdown.innerHTML = '';

    for (let username of history) {
        const div = document.createElement('div');
        div.textContent = username;
        div.addEventListener('click', () => {
            finder.searchInput.value = username;
            finder.searchUser();
            finder.searchRepos();

            searchHistoryDropdown.style.display = 'none';
        });

        searchHistoryDropdown.appendChild(div);
    }

    // 검색 기록이 있으면 드롭다운 리스트를 보여준다.
    if (history.length > 0 && finder.searchInput.value) {
        searchHistoryDropdown.style.display = 'block';
    } else {
        searchHistoryDropdown.style.display = 'none';
    }
}

// 웹 페이지를 로드할 때 검색 기록을 불러와서 보여줍니다.
window.addEventListener('DOMContentLoaded', () => {
    const history = finder.searchHistoryManager.loadSearchHistory();
    showSearchHistory(history);
});

// 검색창의 텍스트가 변경될 때 필터링된 검색 기록을 보여줍니다.
searchInput.addEventListener('input', () => {
    if (finder.searchInput.value) {
        const filteredHistory = finder.searchHistoryManager.filterSearchHistory(finder.searchInput.value);
        showSearchHistory(filteredHistory);
    } else {
        // 검색창에 텍스트가 입력되어 있지 않으면 드롭다운 리스트를 숨깁니다.
        searchHistoryDropdown.style.display = 'none';
    }
});