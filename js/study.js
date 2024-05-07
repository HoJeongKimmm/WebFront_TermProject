$(document).ready(function() {
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
});

// 글 데이터 로딩
function loadPostData(postID) {
    $.ajax({
        url: "/get-post",
        type: "GET",
        data: { id: postID },
        dataType: "json",
        success: function(response) {
            if (response.status) {
                $("#title").val(response.data.title);
                $("#content").val(response.data.content);
                displayForm("edit", postID);
            } else {
                alert("Failed to load post data.");
            }
        },
        error: function() {
            alert("Error loading post data.");
        }
    });
}

// 폼 표시 (새 글 작성 또는 수정)
function displayForm(type, postID = null) {
    $("#postID").val(postID);
    $("#formType").val(type);
    $("#newPostForm").show();
}

// 글 제출 처리 (생성 및 수정)
function submitPostForm() {
    var postData = {
        id: $("#postID").val(),
        title: $("#title").val(),
        content: $("#content").val(),
        type: $("#formType").val()
    };

    $.ajax({
        url: postData.type === "new" ? "/create-post" : "/update-post",
        type: "POST",
        data: postData,
        success: function(response) {
            if (response.status) {
                alert("Post has been " + (postData.type === "new" ? "created." : "updated."));
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to " + (postData.type === "new" ? "create" : "update") + " post.");
            }
        },
        error: function() {
            alert("Error processing post.");
        }
    });
}

// 글 삭제 처리
function deletePost(postID) {
    if (!confirm("Are you sure you want to delete this post?")) {
        return;
    }

    $.ajax({
        url: "/delete-post",
        type: "POST",
        data: { id: postID },
        success: function(response) {
            if (response.status) {
                alert("Post has been deleted.");
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to delete post.");
            }
        },
        error: function() {
            alert("Error deleting post.");
        }
    });
}
