document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");

    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("active");
    });
});

let allArticles = [];
let selectedTags = []; // 現在選択中のタグ

fetch('articles.json')
    .then(res => res.json())
    .then(articles => {
        allArticles = articles;
        displayArticles(articles);
        displayTags(articles);
        updateHitCount(articles.length);
    });

// 記事リスト表示
function displayArticles(articles) {
    const list = document.getElementById('latest-reports');
    list.innerHTML = '';

    articles.forEach(article => {
        const li = document.createElement('li');
        li.classList.add('article-item');

        const tagsHTML = article.tag.map(t => `<span class="tag">${t}</span>`).join(' ');

        li.innerHTML = `
            <img src="${article.img}" alt="${article.title}" class="article-img">
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-date">${article.date}</span>
                    <div class="article-tags">${tagsHTML}</div>
                </div>
                <a href="${article.url}" class="article-title">${article.title}</a>
            </div>
        `;
        list.appendChild(li);
    });

    updateHitCount(articles.length);
}

// タグ一覧表示
function displayTags(articles) {
    const tagSet = new Set();
    articles.forEach(a => a.tag.forEach(t => tagSet.add(t)));

    const tagList = document.getElementById('tag-list');
    tagList.innerHTML = '';

    tagSet.forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = tag;

        span.addEventListener('click', () => {
            toggleTag(tag, span);
        });

        tagList.appendChild(span);
    });
}

function toggleTag(tag, element) {
    const index = selectedTags.indexOf(tag);
    if (index === -1) {
        // 選択追加
        selectedTags.push(tag);
        element.classList.add('selected');
    } else {
        // 選択解除
        selectedTags.splice(index, 1);
        element.classList.remove('selected');
    }

    // 検索バーに表示（spanタグで追加）
    const searchDiv = document.getElementById('search-input');
    searchDiv.innerHTML = ''; // クリア

    selectedTags.forEach(t => {
        const span = document.createElement('span');
        span.classList.add('tag', 'selected');
        span.textContent = t;
        searchDiv.appendChild(span);
    });

    // 選択タグでAND検索
    filterBySelectedTags();
}

// OR検索
function filterBySelectedTags() {
    if (selectedTags.length === 0) {
        displayArticles(allArticles);
        return;
    }

    // どれか1つでもタグが含まれる記事を抽出
    const filtered = allArticles.filter(article => 
        article.tag.some(t => selectedTags.includes(t))
    );

    displayArticles(filtered);
}

// ヒット件数更新
function updateHitCount(count) {
    document.getElementById('hit-count').textContent = `ヒット件数: ${count}`;
}
