$(document).ready(function() {
    // URL을 기반으로 기본 언어 설정
    const url = window.location.href;
    let defaultLanguage = 'english'; // 기본값을 영어로 설정

    if (url.includes('study_english.html')) {
        defaultLanguage = 'english';
    } else if (url.includes('study_chinese.html')) {
        defaultLanguage = 'chinese';
    } else if (url.includes('study_japanese.html')) {
        defaultLanguage = 'japanese';
    } else if (url.includes('study_spanish.html')) {
        defaultLanguage = 'spanish';
    }

    // 기본 언어 설정
    loadBoard(defaultLanguage);

    // 언어별 게시판 로드
    $('.dropdown-content a').click(function(e) {
        e.preventDefault();
        const language = $(this).data('lang');
        loadBoard(language);
    });

    // 게시판 로드 함수
    async function loadBoard(language) {
        $('#boardTitle').text(`${language.charAt(0).toUpperCase() + language.slice(1)} 게시판`);

        // 비동기로 게시판 데이터 로드 (서버와 연동 필요)
        const posts = await fetchPosts(language);
        
        const contentList = $('#contentList');
        contentList.empty();

        const fragment = $(document.createDocumentFragment());
        posts.forEach(post => {
            fragment.append(`
                <div class="content-box">
                    <div class="title"><a href="view.html?id=${post.id}">${post.title}</a></div>
                    <div class="author">${post.author}</div>
                </div>
            `);
        });
        contentList.append(fragment);
    }

    async function fetchPosts(language) {
        // 예제 데이터
        const posts = {
            english: [
                { id: 1, title: 'Hello, this is an English board.', author: 'User1', content: 'This is the content of the first English post.' },
                { id: 2, title: 'Welcome to the English board.', author: 'User2', content: 'This is the content of the second English post.' },
                { id: 3, title: 'How to learn English effectively.', author: 'User3', content: 'This is the content of the third English post.' },
                { id: 4, title: 'English board announcements.', author: 'Admin', content: 'This is the content of the fourth English post.' },
                { id: 5, title: 'Join our English study group.', author: 'User4', content: 'This is the content of the fifth English post.' }
            ],
            japanese: [
                { id: 1, title: 'こんにちは、日本語の掲示板です。', author: 'User1', content: 'これは最初の日本語の投稿の内容です。' },
                { id: 2, title: '日本語の掲示板へようこそ。', author: 'User2', content: 'これは2番目の日本語の投稿の内容です。' },
                { id: 3, title: '効果的に日本語を学ぶ方法。', author: 'User3', content: 'これは3番目の日本語の投稿の内容です。' },
                { id: 4, title: '日本語掲示板の通知。', author: 'Admin', content: 'これは4番目の日本語の投稿の内容です。' },
                { id: 5, title: '日本語の勉強会に参加しよう。', author: 'User4', content: 'これは5番目の日本語の投稿の内容です。' }
            ],
            chinese: [
                { id: 1, title: '你好，这是一个中文公告板。', author: 'User1', content: '这是第一篇中文帖子。' },
                { id: 2, title: '欢迎来到中文公告板。', author: 'User2', content: '这是第二篇中文帖子。' },
                { id: 3, title: '如何有效地学习中文。', author: 'User3', content: '这是第三篇中文帖子。' },
                { id: 4, title: '中文公告板公告。', author: 'Admin', content: '这是第四篇中文帖子。' },
                { id: 5, title: '加入我们的中文学习小组。', author: 'User4', content: '这是第五篇中文帖子。' }
            ],
            spanish: [
                { id: 1, title: 'Hola, este es un tablero de anuncios en español.', author: 'User1', content: 'Este es el contenido de la primera publicación en español.' },
                { id: 2, title: 'Bienvenido al tablero de anuncios en español.', author: 'User2', content: 'Este es el contenido de la segunda publicación en español.' },
                { id: 3, title: 'Cómo aprender español efectivamente.', author: 'User3', content: 'Este es el contenido de la tercera publicación en español.' },
                { id: 4, title: 'Anuncios del tablero de español.', author: 'Admin', content: 'Este es el contenido de la cuarta publicación en español.' },
                { id: 5, title: 'Únete a nuestro grupo de estudio de español.', author: 'User4', content: 'Este es el contenido de la quinta publicación en español.' }
            ]
        };
        return posts[language];
    }

    // 로그인 상태 확인
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
        $('.signin').replaceWith('<a href="mypage.html" class="mypage">My Page</a>');
    } else {
        $('.btn a').click(function(e) {
            e.preventDefault();
            alert('로그인 후 글 작성이 가능합니다.');
            window.location.href = 'login_sign.html';
        });
    }

    // 글 데이터 로딩
    async function loadPostData(postID, callback) {
        try {
            const response = await $.ajax({
                url: "/get-post",
                type: "GET",
                data: { id: postID },
                dataType: "json"
            });

            if (response.status) {
                if (callback) {
                    callback(response.data);
                } else {
                    $("#title").val(response.data.title);
                    $("#content").val(response.data.content);
                    displayForm("edit", postID);
                }
            } else {
                alert("Failed to load post data.");
            }
        } catch (error) {
            alert("Error loading post data.");
        }
    }

    // 글 작성 버튼 클릭 이벤트
    $("#newPostButton").click(function() {
        displayForm("new");
    });

    // 글 수정 버튼 클릭 이벤트
    $(document).on("click", ".editPostButton", function() {
        var postID = $(this).data("postid");
        loadPostData(postID);
    });

    // 글 삭제 버튼 클릭 이벤트
    $(document).on("click", ".deletePostButton", function() {
        var postID = $(this).data("postid");
        deletePost(postID);
    });

    // 글 등록 및 수정 폼 제출 처리
    $("#postForm").submit(function(e) {
        e.preventDefault();
        submitPostForm();
    });

    // 글 제출 처리 (생성 및 수정)
    async function submitPostForm() {
        const loggedInUser = localStorage.getItem('username'); // 사용자 이름 가져오기
        const postData = {
            id: $("#postID").val(),
            title: $("#title").val(),
            content: $("#content").val(),
            type: $("#formType").val(),
            author: loggedInUser // 작성자 이름 추가
        };

        try {
            const response = await $.ajax({
                url: postData.type === "new" ? "http://localhost:8000/create-post" : "http://localhost:8000/update-post",
                type: "POST",
                data: JSON.stringify(postData),
                contentType: "application/json"
            });

            if (response.status) {
                alert("Post has been " + (postData.type === "new" ? "created." : "updated."));
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to " + (postData.type === "new" ? "create" : "update") + " post.");
            }
        } catch (error) {
            alert("Error processing post.");
        }
    }

    // 글 삭제 처리
    async function deletePost(postID) {
        if (!confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            const response = await $.ajax({
                url: "http://localhost:8000/delete-post",
                type: "POST",
                data: JSON.stringify({ id: postID }),
                contentType: "application/json"
            });

            if (response.status) {
                alert("Post has been deleted.");
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to delete post.");
            }
        } catch (error) {
            alert("Error deleting post.");
        }
    }

    // 글 작성 폼 제출 이벤트 처리
    $("#writeForm").submit(function(e) {
        e.preventDefault();
    
        const loggedInUser = localStorage.getItem('username');
        const title = $("#title").val();
        const content = $("#content").val();
    
        if (!loggedInUser) {
            alert('로그인 후 글 작성이 가능합니다.');
            window.location.href = 'login_sign.html';
            return;
        }
    
        const postData = {
            title: title,
            content: content,
            author: loggedInUser
        };
    
        $.ajax({
            url: "http://localhost:8000/create-post",
            type: "POST",
            data: JSON.stringify(postData),
            contentType: "application/json",
            success: function(response) {
                if (response.status) {
                    alert("글이 성공적으로 작성되었습니다.");
                    window.location.href = document.referrer;
                } else {
                    alert("글 작성에 실패했습니다.");
                }
            },
            error: function() {
                alert("글 작성 중 오류가 발생했습니다.");
            }
        });
    });
});
