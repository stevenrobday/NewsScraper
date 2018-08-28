$(document).ready(function () {
  //when user clicks on scrape button
  $(".scrape").on("click", function () {
    //make ajax call to api
    $.ajax({
      method: "POST",
      url: "/api/scrape"
    })
      //passing in data prevents Firefox console log XML error
      .then(function (data) {
        //reload page when ajax call is completed
        window.location.reload(true);
      });
  });

  //when user clicks clear button
  $(".clear").on("click", function () {
    $.ajax({
      method: "DELETE",
      url: "/api/clear"
    })
      .then(function (data) {
        window.location.reload(true);
      });
  });

  //when user clicks on bookmark/unbookmark button
  $(document).on("click", ".bookmark", function () {
    var $this = $(this);
    //article id
    var $id = $this.attr("data-id");
    //bool representing whether article is bookmarked (true) or not
    var $bool = $this.attr("data-boolean");

    //ajax call with above vars as params
    $.ajax({
      method: "PUT",
      url: "/api/bookmark/" + $id + "/" + $bool
    })
      .then(function (data) {
        //once ajax call complete, update the button
        var newButton;

        if ($bool === "true") {
          newButton = '<a class="bookmark waves-effect waves-light red btn-large hoverable" data-id="' + $id + '" data-boolean="false">UNBOOKMARK</a>';
        }
        else {
          newButton = '<a class="bookmark waves-effect waves-light green btn-large hoverable" data-id="' + $id + '" data-boolean="true">BOOKMARK</a>';
        }

        $this.parent().html(newButton);
      });
  });

  //init materialize hamburger menu
  $('.sidenav').sidenav(
    {
      //make it slide out from the right
      edge: "right"
    }
  );

  //init materialize collapsible
  $('.collapsible').collapsible();
});