$(function(){
  $('#namefilter').on("keyup",function(){
  let input = $(this).val().toLowerCase();
  $("#it-list div").filter(function(){
    $(this).toggle($(this).attr('id').toLowerCase().indexOf(input) > -1)
  })
  });
});
