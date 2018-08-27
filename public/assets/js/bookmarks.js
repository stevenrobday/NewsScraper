$(document).ready(function () {
  function renderComments(articleID) {
    var $div = $(".commentsSection[data-id='" + articleID + "']");
    $div.empty();
    $.ajax({
      method: "GET",
      url: "/api/comments/" + articleID
    })
      .then(function (data) {
        data.comments.forEach(function (el) {
          var commentEl = [
            '<li class="collection-item">',
            '<div class="row">',
            '<div class="col l10 m8 s12">',
            '<p><b>' + el.name + '</b></p>',
            '<p>' + el.comment + '</p>',
            '</div>',
            '<div class="col l2 m4 s12">',
            '<p class="center">',
            '<a class="deleteBtn waves-effect waves-light red btn-large hoverable" data-article_id="' + articleID + '" data-comment_id="' + el._id + '">DELETE</a>',
            '</p>',
            '</div>',
            '</div>',
            '</li>'
          ].join("");

          $div.append(commentEl);
        });
      });
  }

  $(".clear").on("click", function(){
    $.ajax({
      method: "POST",
      url: "/api/clear_bookmarks"
    })
      .then(function (data) {
        window.location.reload(true);
      });
  });

  $(document).on("click", ".bookmark", function () {
    var $this = $(this);
    var $id = $this.attr("data-id");
    var $bool = $this.attr("data-boolean");

    $.ajax({
      method: "POST",
      url: "/api/bookmark/" + $id + "/" + $bool
    })
      .then(function (data) {
        window.location.reload(true);
      });
  });

  $(document).on("submit", "form", function (e) {
    e.preventDefault();
    var $this = $(this);
    var $article_id = $this.attr("data-id");
    var $nameEl = $this.children().children("input");
    var $name = $nameEl.val();
    var $commentEl = $this.children().children("textarea");
    var $comment = $commentEl.val();
    var $inputLabel = $("label[for='name_" + $article_id + "']");
    var $commentLabel = $("label[for='comment_" + $article_id + "']");

    $.ajax({
      method: "POST",
      url: "/api/comment/" + $article_id,
      data: {
        name: $name,
        comment: $comment
      }
    })
      .then(function (data) {
        renderComments($article_id);
      });

    $nameEl.val("");
    $nameEl.removeClass("valid");
    $commentEl.val("");
    $commentEl.removeClass("valid");
    $commentEl.attr("style", "");
    $inputLabel.removeClass("active");
    $commentLabel.removeClass("active");
  });

  $(document).on("click", ".deleteBtn", function (e) {
    e.preventDefault();
    var $this = $(this);
    var $article_id = $this.attr("data-article_id");
    var $comment_id = $this.attr("data-comment_id");

    $.ajax({
      method: "POST",
      url: "/api/delete_comment/" + $article_id + "/" + $comment_id
    })
      .then(function (data) {
        renderComments($article_id);
      });
  });

  $('.sidenav').sidenav(
    {
      edge: "right"
    }
  );

  $('.collapsible').collapsible();
});