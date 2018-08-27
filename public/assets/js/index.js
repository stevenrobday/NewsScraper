$(document).ready(function () {
  $(".scrape").on("click", function(){
    $.ajax({
      method: "POST",
      url: "/api/scrape"
    })
      .then(function (data) {
        window.location.reload(true);
      });
  });

  $(".clear").on("click", function(){
    $.ajax({
      method: "POST",
      url: "/api/clear"
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

    var newButton;

    if ($bool === "true") {
      newButton = '<a class="bookmark waves-effect waves-light red btn-large hoverable" data-id="' + $id + '" data-boolean="false">UNBOOKMARK</a>';
    }
    else {
      newButton = '<a class="bookmark waves-effect waves-light green btn-large hoverable" data-id="' + $id + '" data-boolean="true">BOOKMARK</a>';
    }

    $this.parent().html(newButton);
  });

  $('.sidenav').sidenav(
    {
      edge: "right"
    }
  );

  $('.collapsible').collapsible();
});