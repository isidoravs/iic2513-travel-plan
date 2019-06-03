$(function(){
  $('#namefilter').on("keyup",function(){
  let input = $(this).val().toLowerCase();
  let c = 0;
  $("#it-list div").filter(function(){
    c++;
    $(this).toggle($(this).attr('id').toLowerCase().indexOf(input) > -1)
  })
  $('#ejemplo').text(c);
  });
});
