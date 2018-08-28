$(document).ready(function () {
  //function to update comments
  function renderComments(articleID) {
    //first clear out comments section
    var $div = $(".commentsSection[data-id='" + articleID + "']");
    $div.empty();

    //make ajax call to get commetns for this article
    $.ajax({
      method: "GET",
      url: "/api/comments/" + articleID
    })
      .then(function (data) {
        //once complete, create and append new comments
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

  //clear all bookmarks when user clicks clear button
  $(".clear").on("click", function(){
    $.ajax({
      method: "PUT",
      url: "/api/clear_bookmarks"
    })
      .then(function (data) {
        //just reload the page to update
        window.location.reload(true);
      });
  });

  //when user clicks the unbookmark button
  $(document).on("click", ".bookmark", function () {
    var $this = $(this);
    var $id = $this.attr("data-id");
    var $bool = $this.attr("data-boolean");

    $.ajax({
      method: "PUT",
      url: "/api/bookmark/" + $id + "/" + $bool
    })
      .then(function (data) {
        //just reload the page to update
        window.location.reload(true);
      });
  });

  //when user posts a comment
  $(document).on("submit", "form", function (e) {
    //prevent form from submitting
    e.preventDefault();
    var $this = $(this);
    var $article_id = $this.attr("data-id");
    //name field element
    var $nameEl = $this.children().children("input");
    //get value
    var $name = $nameEl.val();
    //comment field element
    var $commentEl = $this.children().children("textarea");
    var $comment = $commentEl.val();
    //replace js line breaks with html elements 
    //so comments will render with line breaks
    $comment = $comment.replace(/\n\r?/g, '<br/>');
    //get field labels as well to reset them later
    var $inputLabel = $("label[for='name_" + $article_id + "']");
    var $commentLabel = $("label[for='comment_" + $article_id + "']");

    //ajax call to post comment
    $.ajax({
      method: "POST",
      url: "/api/comment/" + $article_id,
      data: {
        name: $name,
        comment: $comment
      }
    })
      .then(function (data) {
        //update the comments for user
        renderComments($article_id);
      });

    //clear field values, and remove valid (materialize) class
    //otherwise fields would still be green
    $nameEl.val("");
    $nameEl.removeClass("valid");
    $commentEl.val("");
    $commentEl.removeClass("valid");
    $commentEl.attr("style", "");
    $inputLabel.removeClass("active");
    $commentLabel.removeClass("active");
  });

  //when user clicks delete button, delete that comment
  $(document).on("click", ".deleteBtn", function () {
    var $this = $(this);
    var $article_id = $this.attr("data-article_id");
    var $comment_id = $this.attr("data-comment_id");

    $.ajax({
      method: "DELETE",
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